import type { Ref } from 'vue'
import type { KeyType } from '../Cache'
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'
import { pathKey } from '../Cache'
import { useStyleContext } from '../StyleContext'
import { isClientSide } from '../util'

export type ExtractStyle<CacheValue> = (
  cache: CacheValue,
  effectStyles: Record<string, boolean>,
  options?: {
    plain?: boolean
    autoPrefix?: boolean
  },
) => [order: number, styleId: string, style: string] | null
const effectMap = new Map<string, boolean>()

/**
 * 延迟移除样式的时间（毫秒）
 * 用于解决 Vue Transition 动画期间样式被过早移除的问题
 */
const REMOVE_STYLE_DELAY = 500

// 用于存储延迟移除的定时器，以便在重新挂载时取消
const delayedRemoveTimers = new Map<string, ReturnType<typeof setTimeout>>()

/**
 * Global cache for CSS-in-JS styles
 *
 * This hook manages a reference-counted cache to ensure styles are properly
 * created, shared, and cleaned up across component instances.
 *
 * Key differences from React version:
 * - No useInsertionEffect needed - Vue's watchEffect handles timing naturally
 * - No StrictMode double-mounting issues - Vue doesn't double-mount
 * - HMR handling is simpler - can rely on Vue's reactivity system
 * - Uses onBeforeUnmount for cleanup instead of watch's onCleanup to have
 *   better control over cleanup timing (important for Transition animations)
 */
export function useGlobalCache<CacheType>(
  prefix: Ref<string>,
  keyPath: Ref<KeyType[]>,
  cacheFn: () => CacheType,
  onCacheRemove?: (cache: CacheType, fromHMR: boolean) => void,
  // Add additional effect trigger
  onCacheEffect?: (cachedValue: CacheType) => void,
): Ref<CacheType> {
  const styleContext = useStyleContext()
  const fullPath = computed(() => [prefix.value, ...keyPath.value])
  const fullPathStr = computed(() => pathKey(fullPath.value))

  // 记录当前的 path，用于在 onBeforeUnmount 中清理
  const currentPathRef = shallowRef(fullPathStr.value)

  const globalCache = () => styleContext.value.cache
  const isServerSide = () => styleContext.value.mock !== undefined
    ? styleContext.value.mock === 'server'
    : !isClientSide

  // 清理缓存的函数
  const clearCache = (pathStr: string, immediate = false) => {
    if (isServerSide()) {
      return
    }

    // 取消之前可能存在的延迟移除定时器
    const existingTimer = delayedRemoveTimers.get(pathStr)
    if (existingTimer) {
      clearTimeout(existingTimer)
      delayedRemoveTimers.delete(pathStr)
    }

    const doCleanup = () => {
      globalCache().opUpdate(pathStr, (prevCache) => {
        const [times = 0, cache] = prevCache || []
        const nextCount = times - 1

        if (nextCount === 0) {
          // Last reference, remove cache
          onCacheRemove?.(cache, false)
          effectMap.delete(pathStr)
          return null
        }

        return [times - 1, cache]
      })
    }

    if (immediate || !isClientSide) {
      // 立即清理：
      // 1. path 变化时清理旧缓存
      // 2. 服务端渲染时不需要延迟（没有 Transition 动画）
      doCleanup()
    }
    else {
      // 延迟清理（用于客户端组件卸载时，等待可能的 Transition 动画完成）
      const timer = setTimeout(() => {
        delayedRemoveTimers.delete(pathStr)
        doCleanup()
      }, REMOVE_STYLE_DELAY)
      delayedRemoveTimers.set(pathStr, timer)
    }
  }

  const cacheContent = computed(() => {
    let entity = globalCache().opGet(fullPathStr.value)

    // 在所有环境下检查 entity 是否存在，避免生产环境下主题切换时缓存为空导致的错误
    if (!entity) {
      globalCache().opUpdate(fullPathStr.value, (prevCache) => {
        const [times = 0, cache] = prevCache || [undefined, undefined]
        const mergedCache = cache || cacheFn()
        return [times, mergedCache]
      })
      entity = globalCache().opGet(fullPathStr.value)
    }

    return entity![1]!
  })

  // Watch for keyPath changes
  watch(
    fullPathStr,
    (newPath, oldPath) => {
      // 如果 path 变化了，先清理旧的缓存（立即清理，不需要延迟）
      if (oldPath) {
        clearCache(oldPath, true)
      }

      // 更新当前 path 引用
      currentPathRef.value = newPath

      // 如果存在延迟移除定时器，说明之前的组件刚卸载还在等待移除
      // 此时取消定时器，复用之前的缓存
      // 注意：此时不需要增加引用计数，因为定时器被取消意味着之前的 decrement 不会执行，
      // 而之前 mount 时的 increment 已经执行过了，所以引用计数已经是正确的
      const existingTimer = delayedRemoveTimers.get(newPath)
      if (existingTimer) {
        clearTimeout(existingTimer)
        delayedRemoveTimers.delete(newPath)
        // 跳过 increment，直接触发 effect
      }
      else {
        // 创建或增加新缓存的引用计数
        // 只有在没有 pending 的延迟移除时才增加计数
        globalCache().opUpdate(newPath, (prevCache) => {
          const [times = 0, cache] = prevCache || [undefined, undefined]
          const mergedCache = cache || cacheFn()
          return [times + 1, mergedCache]
        })
      }

      // 触发 effect
      if (!effectMap.has(newPath)) {
        onCacheEffect?.(cacheContent.value)
        effectMap.set(newPath, true)
        // 微任务清理缓存，可以认为是单次 batch render 中只触发一次 effect
        Promise.resolve().then(() => {
          effectMap.delete(newPath)
        })
      }
    },
    { immediate: true },
  )

  // 组件卸载时清理缓存
  // 使用 onBeforeUnmount 而不是 watch 的 onCleanup，
  // 这样可以更好地控制清理时机（对 Transition 动画很重要）
  onBeforeUnmount(() => {
    clearCache(currentPathRef.value)
  })

  return cacheContent
}
