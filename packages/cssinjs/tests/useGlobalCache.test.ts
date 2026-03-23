import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, h, nextTick, onBeforeMount, ref, unref } from 'vue'
import { createCache, StyleProvider } from '../src'
import { useGlobalCache } from '../src/hooks/useGlobalCache'

describe('useGlobalCache', () => {
  let cache: ReturnType<typeof createCache>

  beforeEach(() => {
    cache = createCache()
    vi.clearAllMocks()
  })

  const createWrapper = (setupFn: () => any) => {
    const TestComponent = defineComponent({
      setup() {
        const result = setupFn()

        return () => h('div', {}, JSON.stringify(unref(result)))
      },
    })

    return mount(() => h(StyleProvider, { cache }, () => h(TestComponent)))
  }

  it('should create and cache value', () => {
    const prefix = ref('test')
    const keyPath = ref(['key1', 'key2'])
    const cacheFn = vi.fn(() => ({ value: 'test-value' }))

    createWrapper(() => {
      const result = useGlobalCache(prefix, keyPath, cacheFn)
      expect(cacheFn).toHaveBeenCalled()
      return result
    })
  })

  it('should share cache between multiple calls with same key', () => {
    const prefix = ref('test')
    const keyPath = ref(['shared', 'key'])
    const cacheFn1 = vi.fn(() => ({ value: 'first' }))
    const cacheFn2 = vi.fn(() => ({ value: 'second' }))

    const Component = defineComponent({
      setup() {
        const result1 = useGlobalCache(prefix, keyPath, cacheFn1)
        const result2 = useGlobalCache(prefix, keyPath, cacheFn2)
        return () => h('div', {}, [
          h('span', { id: 'result1' }, JSON.stringify(result1.value)),
          h('span', { id: 'result2' }, JSON.stringify(result2.value)),
        ])
      },
    })

    mount(() => h(StyleProvider, { cache }, () => h(Component)))

    // First call creates cache
    expect(cacheFn1).toHaveBeenCalledTimes(1)
    // Second call reuses cache, so cacheFn2 should not be called
    expect(cacheFn2).toHaveBeenCalledTimes(0)
  })

  it('should call onCacheEffect when cache is ready', async () => {
    const prefix = ref('test')
    const keyPath = ref(['effect-test'])
    const cacheFn = () => ({ value: 'effect-value' })
    const onEffect = vi.fn()

    createWrapper(() => {
      return useGlobalCache(prefix, keyPath, cacheFn, undefined, onEffect)
    })

    // The effect should already have run on mount and remain observable after a microtask.
    await Promise.resolve()
    expect(onEffect).toHaveBeenCalled()
  })

  it('should call onCacheEffect synchronously on initial client mount', () => {
    const prefix = ref('test')
    const keyPath = ref(['sync-effect-test'])
    const cacheFn = () => ({ value: 'sync-effect-value' })
    const onEffect = vi.fn()

    createWrapper(() => {
      return useGlobalCache(prefix, keyPath, cacheFn, undefined, onEffect)
    })

    expect(onEffect).toHaveBeenCalledTimes(1)
  })

  it('should trigger onCacheEffect during mount instead of setup', () => {
    const prefix = ref('test')
    const keyPath = ref(['mount-phase-effect-test'])
    const cacheFn = () => ({ value: 'mount-phase-effect-value' })
    const effectPhases: string[] = []

    const Component = defineComponent({
      setup() {
        const phase = ref('setup')

        onBeforeMount(() => {
          phase.value = 'before-mount'
        })

        useGlobalCache(prefix, keyPath, cacheFn, undefined, () => {
          effectPhases.push(phase.value)
        })

        expect(effectPhases).toEqual([])

        return () => h('div', {}, 'phase-test')
      },
    })

    mount(() => h(StyleProvider, { cache }, () => h(Component)))

    expect(effectPhases).toEqual(['before-mount'])
  })

  it('should handle reactive key path changes', async () => {
    const prefix = ref('test')
    const keyPath = ref(['initial', 'key'])
    const cacheFn = vi.fn(() => ({ value: 'data' }))

    const Component = defineComponent({
      setup() {
        const result = useGlobalCache(prefix, keyPath, cacheFn)
        return () => h('div', {}, JSON.stringify(result.value))
      },
    })

    mount(() => h(StyleProvider, { cache }, () => h(Component)))

    const initialCalls = cacheFn.mock.calls.length

    // Change key path
    keyPath.value = ['new', 'key']
    await nextTick()

    // Should create new cache entry
    expect(cacheFn.mock.calls.length).toBeGreaterThan(initialCalls)
  })

  it('should return cached value on subsequent calls', () => {
    const prefix = ref('test')
    const keyPath = ref(['persistent'])
    let callCount = 0
    const cacheFn = () => {
      callCount++
      return { count: callCount }
    }

    const Component = defineComponent({
      setup() {
        const result1 = useGlobalCache(prefix, keyPath, cacheFn)
        const result2 = useGlobalCache(prefix, keyPath, cacheFn)
        return () => h('div', {}, [
          h('span', { id: 'r1' }, JSON.stringify(result1.value)),
          h('span', { id: 'r2' }, JSON.stringify(result2.value)),
        ])
      },
    })

    const wrapper = mount(() => h(StyleProvider, { cache }, () => h(Component)))

    expect(callCount).toBe(1) // Should only be called once
    const spans = wrapper.findAll('span')
    expect(JSON.parse(spans[0]!.text()).count).toBe(1)
    expect(JSON.parse(spans[1]!.text()).count).toBe(1)
  })

  it('should use different cache for different prefixes', () => {
    const prefix1 = ref('prefix1')
    const prefix2 = ref('prefix2')
    const keyPath = ref(['same-key'])

    const cacheFn1 = vi.fn(() => ({ value: 'first' }))
    const cacheFn2 = vi.fn(() => ({ value: 'second' }))

    const Component = defineComponent({
      setup() {
        const result1 = useGlobalCache(prefix1, keyPath, cacheFn1)
        const result2 = useGlobalCache(prefix2, keyPath, cacheFn2)
        return () => h('div', {}, [
          h('span', { id: 'r1' }, JSON.stringify(result1.value)),
          h('span', { id: 'r2' }, JSON.stringify(result2.value)),
        ])
      },
    })

    mount(() => h(StyleProvider, { cache }, () => h(Component)))

    expect(cacheFn1).toHaveBeenCalledTimes(1)
    expect(cacheFn2).toHaveBeenCalledTimes(1)
  })

  it('should handle computed refs for keys', () => {
    const base = ref('base')
    const prefix = computed(() => `${base.value}-prefix`)
    const keyPath = computed(() => [base.value, 'key'])

    const cacheFn = vi.fn(() => ({ computed: 'value' }))

    createWrapper(() => {
      return useGlobalCache(prefix, keyPath, cacheFn)
    })

    expect(cacheFn).toHaveBeenCalled()
  })

  it('should manage reference counting correctly', () => {
    const prefix = ref('test')
    const keyPath = ref(['ref-count'])
    const onRemove = vi.fn()
    const cacheFn = () => ({ data: 'test' })

    const Component = defineComponent({
      setup() {
        // Two instances sharing same key
        const cache1 = useGlobalCache(prefix, keyPath, cacheFn, onRemove)
        const cache2 = useGlobalCache(prefix, keyPath, cacheFn, onRemove)
        return () => h('div', {}, [
          h('span', {}, JSON.stringify(cache1.value)),
          h('span', {}, JSON.stringify(cache2.value)),
        ])
      },
    })

    const wrapper = mount(() => h(StyleProvider, { cache }, () => h(Component)))

    // Both instances exist, onRemove should not be called
    expect(onRemove).not.toHaveBeenCalled()

    // Unmount
    wrapper.unmount()

    // After unmount, cache should be cleaned
    // Note: This might need to wait for Vue's cleanup cycle
  })
})
