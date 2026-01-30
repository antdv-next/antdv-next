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

/**
 * 延迟移除信息
 * - timer: 延迟定时器
 * - pendingDecrements: 待执行的 decrement 次数
 *
 * 这个设计解决了两个问题：
 * 1. 组件快速重新挂载时，通过减少 pendingDecrements 来抵消，而不是简单取消定时器
 * 2. 多个共享样式的组件卸载时，累加 pendingDecrements，确保每个卸载都被正确计数
 */
interface DelayedRemoveInfo {
  timer: ReturnType<typeof setTimeout>
  pendingDecrements: number
}

const delayedRemoveInfo = new Map<string, DelayedRemoveInfo>()

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

    // 执行单次 decrement
    const doSingleDecrement = () => {
      globalCache().opUpdate(pathStr, (prevCache) => {
        const [times = 0, cache] = prevCache || []
        const nextCount = times - 1

        if (nextCount === 0) {
          // Last reference, remove cache
          onCacheRemove?.(cache, false)
          effectMap.delete(pathStr)
          return null
        }

        return [nextCount, cache]
      })
    }

    // 执行所有 pending 的 decrements
    const doAllPendingDecrements = (count: number) => {
      for (let i = 0; i < count; i++) {
        doSingleDecrement()
      }
    }

    if (immediate || !isClientSide) {
      // 立即清理：
      // 1. path 变化时清理旧缓存
      // 2. 服务端渲染时不需要延迟（没有 Transition 动画）
      doSingleDecrement()
    }
    else {
      // 延迟清理（用于客户端组件卸载时，等待可能的 Transition 动画完成）
      const existingInfo = delayedRemoveInfo.get(pathStr)

      if (existingInfo) {
        // 已有 pending info，增加 pendingDecrements 并重置定时器
        clearTimeout(existingInfo.timer)
        const newPendingDecrements = existingInfo.pendingDecrements + 1

        const timer = setTimeout(() => {
          delayedRemoveInfo.delete(pathStr)
          doAllPendingDecrements(newPendingDecrements)
        }, REMOVE_STYLE_DELAY)

        delayedRemoveInfo.set(pathStr, {
          timer,
          pendingDecrements: newPendingDecrements,
        })
      }
      else {
        // 创建新的 pending info
        const timer = setTimeout(() => {
          delayedRemoveInfo.delete(pathStr)
          doSingleDecrement()
        }, REMOVE_STYLE_DELAY)

        delayedRemoveInfo.set(pathStr, {
          timer,
          pendingDecrements: 1,
        })
      }
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

      // 检查是否有 pending 的延迟移除
      const existingInfo = delayedRemoveInfo.get(newPath)

      if (existingInfo) {
        // 存在 pending 的延迟移除，说明之前有组件卸载还在等待
        // 减少 pendingDecrements，因为这次挂载抵消了一次卸载
        const newPendingDecrements = existingInfo.pendingDecrements - 1

        if (newPendingDecrements <= 0) {
          // 所有 pending decrements 都被抵消了，取消定时器
          clearTimeout(existingInfo.timer)
          delayedRemoveInfo.delete(newPath)
          // 不需要增加引用计数，因为之前的 mount 已经增加过了
        }
        else {
          // 还有其他 pending decrements，更新计数但保持定时器
          // 重置定时器以延长等待时间
          clearTimeout(existingInfo.timer)
          const timer = setTimeout(() => {
            delayedRemoveInfo.delete(newPath)
            // 执行剩余的 decrements
            for (let i = 0; i < newPendingDecrements; i++) {
              globalCache().opUpdate(newPath, (prevCache) => {
                const [times = 0, cache] = prevCache || []
                const nextCount = times - 1
                if (nextCount === 0) {
                  onCacheRemove?.(cache, false)
                  effectMap.delete(newPath)
                  return null
                }
                return [nextCount, cache]
              })
            }
          }, REMOVE_STYLE_DELAY)

          delayedRemoveInfo.set(newPath, {
            timer,
            pendingDecrements: newPendingDecrements,
          })
          // 不需要增加引用计数，因为之前的 mount 已经增加过了
        }
      }
      else {
        // 没有 pending 的延迟移除，正常增加引用计数
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
