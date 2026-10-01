import type { ComputedRef, Ref } from 'vue'
import type CacheEntity from '../Cache'
import type { KeyType } from '../Cache'
import type { StyleContextProps } from '../StyleContext'
import { computed, onBeforeMount, onBeforeUnmount, unref, watch } from 'vue'
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

/**
 * Called when the last reference of a cache entry is released.
 *
 * IMPORTANT: pass a module-level function here, never a closure created inside
 * a component / hook scope. The delayed removal timer keeps this callback alive
 * for `REMOVE_STYLE_DELAY` after unmount, and a closure would drag the whole
 * component scope (its computeds, DOM refs, ...) along with it.
 */
export type OnCacheRemove<CacheType> = (
  cache: CacheType,
  fromHMR: boolean,
  context: StyleContextProps,
) => void

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
 * - onCacheRemove / context: 定时器触发时执行清理所需的全部信息
 *
 * 这个设计解决了两个问题：
 * 1. 组件快速重新挂载时，通过减少 pendingDecrements 来抵消，而不是简单取消定时器
 * 2. 多个共享样式的组件卸载时，累加 pendingDecrements，确保每个卸载都被正确计数
 */
interface DelayedRemoveInfo {
  timer: ReturnType<typeof setTimeout>
  pendingDecrements: number
  onCacheRemove?: OnCacheRemove<any>
  context: StyleContextProps
}

/**
 * 按 cache 实例隔离的延迟移除表。
 *
 * 这里的所有函数都定义在模块顶层，只接收 cache / pathStr 等纯数据，
 * 因此 setTimeout 的闭包不会捕获任何组件或 hook 作用域。
 * 否则已卸载的整棵组件树会一直被定时器引用到 REMOVE_STYLE_DELAY 之后才能释放。
 */
const delayedRemoveMap = new WeakMap<CacheEntity, Map<string, DelayedRemoveInfo>>()

function getDelayedRemoveInfo(cache: CacheEntity, pathStr: string) {
  return delayedRemoveMap.get(cache)?.get(pathStr)
}

function applyDecrement(
  cache: CacheEntity,
  pathStr: string,
  decrementCount: number,
  onCacheRemove: OnCacheRemove<any> | undefined,
  context: StyleContextProps,
) {
  if (decrementCount <= 0) {
    return
  }

  cache.opUpdate(pathStr, (prevCache) => {
    if (!prevCache) {
      return null
    }

    const [times = 0, value] = prevCache
    const nextCount = times - decrementCount

    if (nextCount <= 0) {
      // Last reference, remove cache
      onCacheRemove?.(value, false, context)
      effectMap.delete(pathStr)
      return null
    }

    return [nextCount, value]
  })
}

function createDelayedRemoveTimer(cache: CacheEntity, pathStr: string) {
  return setTimeout(() => {
    const map = delayedRemoveMap.get(cache)
    const info = map?.get(pathStr)
    if (!map || !info) {
      return
    }
    map.delete(pathStr)
    applyDecrement(cache, pathStr, info.pendingDecrements, info.onCacheRemove, info.context)
  }, REMOVE_STYLE_DELAY)
}

function scheduleDelayedRemove(
  cache: CacheEntity,
  pathStr: string,
  onCacheRemove: OnCacheRemove<any> | undefined,
  context: StyleContextProps,
) {
  let map = delayedRemoveMap.get(cache)
  if (!map) {
    map = new Map()
    delayedRemoveMap.set(cache, map)
  }

  const existingInfo = map.get(pathStr)
  if (existingInfo) {
    // 已有 pending info，增加 pendingDecrements 并重置定时器
    clearTimeout(existingInfo.timer)
  }

  map.set(pathStr, {
    timer: createDelayedRemoveTimer(cache, pathStr),
    pendingDecrements: (existingInfo?.pendingDecrements ?? 0) + 1,
    onCacheRemove,
    context,
  })
}

/**
 * 组件（重新）挂载到一个正在等待延迟移除的路径时，
 * 抵消一次待执行的 decrement，而不是再增加引用计数。
 * @returns 是否抵消成功；false 表示该路径没有 pending 的延迟移除
 */
function consumeDelayedRemove(cache: CacheEntity, pathStr: string) {
  const map = delayedRemoveMap.get(cache)
  const info = map?.get(pathStr)
  if (!map || !info) {
    return false
  }

  const nextPendingDecrements = info.pendingDecrements - 1
  if (nextPendingDecrements <= 0) {
    clearTimeout(info.timer)
    map.delete(pathStr)
  }
  else {
    info.pendingDecrements = nextPendingDecrements
  }
  return true
}

/**
 * A reference-counted global cache entry.
 *
 * The entry itself is reactive state only (no lifecycle hooks), so one entry
 * can be shared by any number of component instances: each instance calls
 * `useGlobalCacheEntry(entry)` to register its own reference.
 */
export interface GlobalCacheEntry<CacheType> {
  /** Cached value for the current path. */
  value: ComputedRef<CacheType>
  /** Current full cache path. */
  pathStr: ComputedRef<string>
  /** Add one reference to `newPath` (and release `oldPath` immediately when given). */
  activate: (newPath: string, oldPath?: string) => void
  /** Release one reference to `pathStr` (delayed on the client to survive Transition). */
  release: (pathStr: string) => void
}

/**
 * Create a cache entry without binding it to the current component.
 *
 * Use this together with `useGlobalCacheEntry` when the same derived value
 * (for example the design token) should be computed once and shared across
 * many instances. `useGlobalCache` is the one-instance shortcut.
 */
export function createGlobalCache<CacheType>(
  styleContext: Ref<StyleContextProps>,
  prefix: Ref<string> | string,
  keyPath: Ref<KeyType[]>,
  cacheFn: () => CacheType,
  onCacheRemove?: OnCacheRemove<CacheType>,
  // Add additional effect trigger
  onCacheEffect?: (cachedValue: CacheType) => void,
): GlobalCacheEntry<CacheType> {
  const pathStr = computed(() => pathKey([unref(prefix), ...keyPath.value]))

  const globalCache = () => styleContext.value.cache
  const isServerSide = () => styleContext.value.mock !== undefined
    ? styleContext.value.mock === 'server'
    : !isClientSide

  // 清理缓存的函数
  const clearCache = (path: string, immediate = false) => {
    if (isServerSide()) {
      return
    }

    const cache = globalCache()
    const context = styleContext.value

    if (immediate || !isClientSide) {
      // 立即清理：
      // 1. path 变化时清理旧缓存
      // 2. 服务端渲染时不需要延迟（没有 Transition 动画）
      applyDecrement(cache, path, 1, onCacheRemove, context)
      return
    }

    // 延迟清理（用于客户端组件卸载时，等待可能的 Transition 动画完成）
    const currentRefCount = cache.opGet(path)?.[0] ?? 0

    // 仍有其他实例在使用同一路径时，不需要延迟移除，直接递减引用计数。
    // 这样可以避免虚拟滚动场景里高频 clear/setTimeout 抖动。
    if (!getDelayedRemoveInfo(cache, path) && currentRefCount > 1) {
      applyDecrement(cache, path, 1, onCacheRemove, context)
      return
    }

    scheduleDelayedRemove(cache, path, onCacheRemove, context)
  }

  const cacheContent = computed(() => {
    let entity = globalCache().opGet(pathStr.value)

    // 在所有环境下检查 entity 是否存在，避免生产环境下主题切换时缓存为空导致的错误
    if (!entity) {
      globalCache().opUpdate(pathStr.value, (prevCache) => {
        const [times = 0, cache] = prevCache || [undefined, undefined]
        const mergedCache = cache || cacheFn()
        return [times, mergedCache]
      })
      entity = globalCache().opGet(pathStr.value)
    }

    return entity![1]!
  })

  const triggerCacheEffect = (path: string) => {
    if (!onCacheEffect || effectMap.has(path)) {
      return
    }

    const cachedValue = cacheContent.value
    effectMap.set(path, true)
    onCacheEffect(cachedValue)
    Promise.resolve().then(() => {
      effectMap.delete(path)
    })
  }

  const activate = (newPath: string, oldPath?: string) => {
    if (oldPath && oldPath !== newPath) {
      clearCache(oldPath, true)
    }

    const cache = globalCache()
    if (!consumeDelayedRemove(cache, newPath)) {
      cache.opUpdate(newPath, (prevCache) => {
        const [times = 0, cacheValue] = prevCache || [undefined, undefined]
        const mergedCache = cacheValue || cacheFn()
        return [times + 1, mergedCache]
      })
    }

    // Align with React cssinjs `useInsertionEffect`: inject on mount/update,
    // but not during setup where hydration work can be noisier.
    triggerCacheEffect(newPath)
  }

  return {
    value: cacheContent,
    pathStr,
    activate,
    release: path => clearCache(path),
  }
}

/**
 * Hold one reference to a cache entry for the lifetime of the current component.
 */
export function useGlobalCacheEntry<CacheType>(entry: GlobalCacheEntry<CacheType>): Ref<CacheType> {
  // Align with React cssinjs `useMemo`: create the cache entry during setup/render,
  // then apply side effects in mount/update timing.
  // eslint-disable-next-line ts/no-unused-expressions
  entry.value.value

  // 记录当前的 path，用于在 onBeforeUnmount 中清理
  let currentPath = entry.pathStr.value
  let mounted = false

  watch(
    entry.pathStr,
    (newPath, oldPath) => {
      if (mounted) {
        entry.activate(newPath, oldPath)
      }
      currentPath = newPath
    },
    {
      flush: 'sync',
    },
  )

  onBeforeMount(() => {
    mounted = true
    entry.activate(currentPath)
  })

  // 组件卸载时清理缓存
  // 使用 onBeforeUnmount 而不是 watch 的 onCleanup，
  // 这样可以更好地控制清理时机（对 Transition 动画很重要）
  onBeforeUnmount(() => {
    mounted = false
    entry.release(currentPath)
  })

  return entry.value
}

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
  prefix: Ref<string> | string,
  keyPath: Ref<KeyType[]>,
  cacheFn: () => CacheType,
  onCacheRemove?: OnCacheRemove<CacheType>,
  // Add additional effect trigger
  onCacheEffect?: (cachedValue: CacheType) => void,
): Ref<CacheType> {
  const styleContext = useStyleContext()
  return useGlobalCacheEntry(
    createGlobalCache(styleContext, prefix, keyPath, cacheFn, onCacheRemove, onCacheEffect),
  )
}
