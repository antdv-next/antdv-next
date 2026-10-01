import v8 from 'node:v8'
import { runInNewContext } from 'node:vm'
import { afterAll, describe, expect, it } from 'vitest'
import { createApp, defineComponent, h, nextTick, ref } from 'vue'
import { createCache, StyleProvider } from '../src'
import { useGlobalCache } from '../src/hooks/useGlobalCache'

// `--expose-gc` cannot be passed to the vitest worker from the config, so turn
// the flag on at runtime and grab `gc` from a fresh context.
v8.setFlagsFromString('--expose-gc')
const gc = runInNewContext('gc') as () => void

// 与 useGlobalCache.ts 中的 REMOVE_STYLE_DELAY 保持一致
const REMOVE_STYLE_DELAY = 500

let removeCalls = 0

/**
 * `onCacheRemove` 必须是模块级函数：如果它在组件作用域内创建，
 * 延迟清理的定时器就会通过它把整个组件作用域留在内存里。
 */
function onCacheRemove() {
  removeCalls += 1
}

/**
 * 挂载一个使用 useGlobalCache 的组件，并返回一个只指向组件作用域对象的 WeakRef。
 *
 * `marker` 只被 cacheFn / onCacheEffect 闭包捕获，模拟真实组件里
 * styleFn 捕获的 prefixCls / token 等 computed。
 * 它既不会进入缓存值，也不会进入渲染结果。
 */
function mountScenario(cache: ReturnType<typeof createCache>) {
  const marker = { tag: 'component-scope' }
  const markerRef = new WeakRef(marker)

  const Comp = defineComponent({
    setup() {
      const prefix = ref('style')
      const keyPath = ref(['retention'])
      const value = useGlobalCache(
        prefix,
        keyPath,
        () => {
          void marker
          return { style: '.retention { color: red; }' }
        },
        onCacheRemove,
        () => {
          void marker
        },
      )
      return () => h('div', value.value.style)
    },
  })

  const el = document.createElement('div')
  document.body.appendChild(el)
  const app = createApp({
    render: () => h(StyleProvider, { cache }, () => h(Comp)),
  })
  app.mount(el)

  return {
    markerRef,
    unmount() {
      app.unmount()
      el.remove()
    },
  }
}

async function leaveCurrentJob() {
  // WeakRef targets are kept alive until the end of the job that touched them,
  // so wait for a macrotask before collecting.
  await new Promise(resolve => setTimeout(resolve, 0))
}

describe('delayed style removal must not retain the component scope', () => {
  const cache = createCache()

  afterAll(async () => {
    // Let any pending delayed-removal timers fire so they do not leak into other files.
    await new Promise(resolve => setTimeout(resolve, REMOVE_STYLE_DELAY + 50))
  })

  it('releases the component scope right after unmount while the removal timer is still pending', async () => {
    let scenario: ReturnType<typeof mountScenario> | null = mountScenario(cache)
    const markerRef = scenario.markerRef
    await nextTick()

    expect(markerRef.deref()).toBeDefined()

    scenario.unmount()
    scenario = null

    await leaveCurrentJob()
    gc()
    gc()

    // The 500ms removal timer is still pending at this point. Before the fix the
    // timer closure captured the whole hook scope (cacheFn / onCacheEffect / ...),
    // which kept `marker` alive.
    expect(markerRef.deref()).toBeUndefined()
    expect(removeCalls).toBe(0)

    await new Promise(resolve => setTimeout(resolve, REMOVE_STYLE_DELAY + 50))

    // The delay itself must keep working: the style is only removed after the timer.
    expect(removeCalls).toBe(1)
    expect(cache.opGet('style%retention')).toBeNull()
  })
})
