import type { Ref } from 'vue'
import type { KeyType } from '../Cache'
import { computed, onBeforeMount, onBeforeUnmount, shallowRef, watch } from 'vue'
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
  const isMountedRef = shallowRef(false)

  const globalCache = () => styleContext.value.cache
  const isServerSide = () => styleContext.value.mock !== undefined
    ? styleContext.value.mock === 'server'
    : !isClientSide

  const applyDecrement = (pathStr: string, decrementCount = 1) => {
    if (decrementCount <= 0) {
      return
    }

    globalCache().opUpdate(pathStr, (prevCache) => {
      if (!prevCache) {
        return null
      }

      const [times = 0, cache] = prevCache
      const nextCount = times - decrementCount

      if (nextCount <= 0) {
        // Last reference, remove cache
        onCacheRemove?.(cache, false)
        effectMap.delete(pathStr)
        return null
      }

      return [nextCount, cache]
    })
  }

  const createDelayedRemoveTimer = (pathStr: string) => setTimeout(() => {
    const info = delayedRemoveInfo.get(pathStr)
    if (!info) {
      return
    }
    delayedRemoveInfo.delete(pathStr)
    applyDecrement(pathStr, info.pendingDecrements)
  }, REMOVE_STYLE_DELAY)

  // 清理缓存的函数
  const clearCache = (pathStr: string, immediate = false) => {
    if (isServerSide()) {
      return
    }

    if (immediate || !isClientSide) {
      // 立即清理：
      // 1. path 变化时清理旧缓存
      // 2. 服务端渲染时不需要延迟（没有 Transition 动画）
      applyDecrement(pathStr)
    }
    else {
      // 延迟清理（用于客户端组件卸载时，等待可能的 Transition 动画完成）
      const existingInfo = delayedRemoveInfo.get(pathStr)
      const currentCache = globalCache().opGet(pathStr)
      const currentRefCount = currentCache?.[0] ?? 0

      // 仍有其他实例在使用同一路径时，不需要延迟移除，直接递减引用计数。
      // 这样可以避免虚拟滚动场景里高频 clear/setTimeout 抖动。
      if (!existingInfo && currentRefCount > 1) {
        applyDecrement(pathStr)
        return
      }

      if (existingInfo) {
        // 已有 pending info，增加 pendingDecrements 并重置定时器
        clearTimeout(existingInfo.timer)
        const newPendingDecrements = existingInfo.pendingDecrements + 1

        const timer = createDelayedRemoveTimer(pathStr)

        delayedRemoveInfo.set(pathStr, {
          timer,
          pendingDecrements: newPendingDecrements,
        })
      }
      else {
        // 创建新的 pending info
        const timer = createDelayedRemoveTimer(pathStr)

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
  // Align with React cssinjs `useMemo`: create the cache entry during setup/render,
  // then apply side effects in mount/update timing.
  // eslint-disable-next-line ts/no-unused-expressions
  cacheContent.value

  const triggerCacheEffect = (pathStr: string) => {
    if (!onCacheEffect || effectMap.has(pathStr)) {
      return
    }

    const cachedValue = cacheContent.value
    effectMap.set(pathStr, true)
    onCacheEffect(cachedValue)
    Promise.resolve().then(() => {
      effectMap.delete(pathStr)
    })
  }

  const activatePath = (newPath: string, oldPath?: string) => {
    if (oldPath && oldPath !== newPath) {
      clearCache(oldPath, true)
    }

    currentPathRef.value = newPath

    const existingInfo = delayedRemoveInfo.get(newPath)

    if (existingInfo) {
      const newPendingDecrements = existingInfo.pendingDecrements - 1

      if (newPendingDecrements <= 0) {
        clearTimeout(existingInfo.timer)
        delayedRemoveInfo.delete(newPath)
      }
      else {
        delayedRemoveInfo.set(newPath, {
          timer: existingInfo.timer,
          pendingDecrements: newPendingDecrements,
        })
      }
    }
    else {
      globalCache().opUpdate(newPath, (prevCache) => {
        const [times = 0, cache] = prevCache || [undefined, undefined]
        const mergedCache = cache || cacheFn()
        return [times + 1, mergedCache]
      })
    }

    // Align with React cssinjs `useInsertionEffect`: inject on mount/update,
    // but not during setup where hydration work can be noisier.
    triggerCacheEffect(newPath)
  }

  watch(
    fullPathStr,
    (newPath) => {
      if (!isMountedRef.value) {
        currentPathRef.value = newPath
      }
    },
    {
      flush: 'sync',
    },
  )

  watch(
    fullPathStr,
    (newPath, oldPath) => {
      if (!isMountedRef.value) {
        return
      }

      activatePath(newPath, oldPath)
    },
    {
      flush: 'sync',
    },
  )

  onBeforeMount(() => {
    isMountedRef.value = true
    activatePath(currentPathRef.value)
  })

  // 组件卸载时清理缓存
  // 使用 onBeforeUnmount 而不是 watch 的 onCleanup，
  // 这样可以更好地控制清理时机（对 Transition 动画很重要）
  onBeforeUnmount(() => {
    isMountedRef.value = false
    clearCache(currentPathRef.value)
  })

  return cacheContent
}
