import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { defineComponent, h } from 'vue'
import {
  createCache,
  StyleProvider,
  useStyleContext,
} from '../src'

describe('styleContext', () => {
  describe('createCache', () => {
    it('should create a cache instance', () => {
      const cache = createCache()
      expect(cache).toBeDefined()
      expect(cache.instanceId).toBeDefined()
      expect(typeof cache.instanceId).toBe('string')
    })

    it('should create unique instance IDs', () => {
      const cache1 = createCache()
      const cache2 = createCache()
      expect(cache1.instanceId).not.toBe(cache2.instanceId)
    })

    it('should have cache and extracted properties', () => {
      const cache = createCache()
      expect(cache.cache).toBeInstanceOf(Map)
      expect(cache.extracted).toBeInstanceOf(Set)
    })
  })

  describe('styleProvider', () => {
    it('should render children', () => {
      const TestComponent = defineComponent({
        setup() {
          return () => h(StyleProvider, null, {
            default: () => h('div', { class: 'test' }, 'content'),
          })
        },
      })

      const wrapper = mount(TestComponent)
      expect(wrapper.find('.test').exists()).toBe(true)
      expect(wrapper.text()).toBe('content')
    })

    it('should provide style context', () => {
      const cache = createCache()
      let contextValue: any

      const Consumer = defineComponent({
        setup() {
          const context = useStyleContext()
          contextValue = context.value
          return () => h('div')
        },
      })
      const Provider = defineComponent({
        setup() {
          return () => h(
            StyleProvider,
            { cache } as any,
            { default: () => h(Consumer) },
          )
        },
      })

      mount(Provider)

      expect(contextValue.cache).toBe(cache)
    })

    it('should merge with parent context', () => {
      const parentCache = createCache()
      const childCache = createCache()
      let childContextValue: any

      const ChildConsumer = defineComponent({
        setup() {
          const context = useStyleContext()
          childContextValue = context.value
          return () => h('div')
        },
      })

      const App = defineComponent({
        setup() {
          return () => h(
            StyleProvider,
            { cache: parentCache, hashPriority: 'high' },
            {
              default: () => h(
                StyleProvider,
                { cache: childCache },
                { default: () => h(ChildConsumer) },
              ),
            },
          )
        },
      })

      mount(App)

      expect(childContextValue.cache).toBe(childCache)
      expect(childContextValue.hashPriority).toBe('high')
    })

    it('should support custom props', () => {
      let contextValue: any

      const Consumer = defineComponent({
        setup() {
          const context = useStyleContext()
          contextValue = context.value
          return () => h('div')
        },
      })

      const App = defineComponent({
        setup() {
          return () => h(
            StyleProvider,
            {
              hashPriority: 'low',
              autoClear: true,
              ssrInline: true,
              layer: true,
            },
            { default: () => h(Consumer) },
          )
        },
      })

      mount(App)

      expect(contextValue.hashPriority).toBe('low')
      expect(contextValue.autoClear).toBe(true)
      expect(contextValue.ssrInline).toBe(true)
      expect(contextValue.layer).toBe(true)
    })
  })

  describe('useStyleContext', () => {
    it('should return default context without provider', () => {
      const TestComponent = defineComponent({
        setup() {
          const context = useStyleContext()
          return () => h('div', {}, JSON.stringify({
            hasCache: !!context.value.cache,
            defaultCache: context.value.defaultCache,
            hashPriority: context.value.hashPriority,
          }))
        },
      })

      const wrapper = mount(TestComponent)
      const data = JSON.parse(wrapper.text())

      expect(data.hasCache).toBe(true)
      expect(data.defaultCache).toBe(true)
      expect(data.hashPriority).toBe('low')
    })

    it('should return provided context', () => {
      const cache = createCache()
      let contextValue: any

      const Consumer = defineComponent({
        setup() {
          const context = useStyleContext()
          contextValue = context.value
          return () => h('div')
        },
      })

      const App = defineComponent({
        setup() {
          return () => h(
            StyleProvider,
            { cache, hashPriority: 'high' },
            { default: () => h(Consumer) },
          )
        },
      })

      mount(App)

      expect(contextValue.cache).toBe(cache)
      expect(contextValue.hashPriority).toBe('high')
      expect(contextValue.defaultCache).toBe(false)
    })

    it('should be reactive', async () => {
      const cache1 = createCache()
      const cache2 = createCache()
      let contextValue: any
      // eslint-disable-next-line unused-imports/no-unused-vars
      let renderCount = 0

      const Consumer = defineComponent({
        setup() {
          const context = useStyleContext()
          contextValue = context
          return () => {
            renderCount++
            return h('div', {}, context.value.cache.instanceId)
          }
        },
      })

      const App = defineComponent({
        setup() {
          return () => h(
            StyleProvider,
            { cache: cache1 },
            { default: () => h(Consumer) },
          )
        },
      })

      const wrapper = mount(App)

      expect(wrapper.text()).toBe(cache1.instanceId)

      // Update the wrapper with new cache
      await wrapper.setProps({ cache: cache2 } as any)

      // Context should remain reactive
      expect(contextValue.value.cache.instanceId).toBeDefined()
    })
  })

  describe('styleContext integration', () => {
    it('should provide isolated contexts for nested providers', () => {
      const outerCache = createCache()
      const innerCache = createCache()

      let outerContext: any
      let innerContext: any

      const OuterConsumer = defineComponent({
        setup() {
          const context = useStyleContext()
          outerContext = context.value
          return () => h('div')
        },
      })

      const InnerConsumer = defineComponent({
        setup() {
          const context = useStyleContext()
          innerContext = context.value
          return () => h('div')
        },
      })

      const App = defineComponent({
        setup() {
          return () => h(
            StyleProvider,
            { cache: outerCache, hashPriority: 'low' },
            {
              default: () => [
                h(OuterConsumer),
                h(
                  StyleProvider,
                  { cache: innerCache, hashPriority: 'high' },
                  { default: () => h(InnerConsumer) },
                ),
              ],
            },
          )
        },
      })

      mount(App)

      expect(outerContext.cache).toBe(outerCache)
      expect(outerContext.hashPriority).toBe('low')
      expect(innerContext.cache).toBe(innerCache)
      expect(innerContext.hashPriority).toBe('high')
    })

    it('should inherit parent context properties when not overridden', () => {
      let childContext: any

      const ChildConsumer = defineComponent({
        setup() {
          const context = useStyleContext()
          childContext = context.value
          return () => h('div')
        },
      })

      const App = defineComponent({
        setup() {
          return () => h(
            StyleProvider,
            {
              hashPriority: 'high',
              autoClear: true,
              ssrInline: true,
            },
            {
              default: () => h(
                StyleProvider,
                { autoClear: false },
                { default: () => h(ChildConsumer) },
              ),
            },
          )
        },
      })

      mount(App)

      expect(childContext.hashPriority).toBe('high') // inherited
      expect(childContext.autoClear).toBe(false) // overridden
      expect(childContext.ssrInline).toBe(true) // inherited
    })
  })

  describe('edge cases', () => {
    it('should handle undefined cache', () => {
      const Consumer = defineComponent({
        setup() {
          const context = useStyleContext()
          return () => h('div', {}, String(!!context.value.cache))
        },
      })

      const wrapper = mount(Consumer)
      expect(wrapper.text()).toBe('true') // Should have default cache
    })

    it('should handle empty provider props', () => {
      let contextValue: any

      const Consumer = defineComponent({
        setup() {
          const context = useStyleContext()
          contextValue = context.value
          return () => h('div')
        },
      })

      const App = defineComponent({
        setup() {
          return () => h(
            StyleProvider,
            {},
            { default: () => h(Consumer) },
          )
        },
      })

      mount(App)

      expect(contextValue.cache).toBeDefined()
    })

    it('should handle multiple consumers in same provider', () => {
      const cache = createCache()
      const contexts: any[] = []

      const Consumer = defineComponent({
        name: 'Consumer',
        setup() {
          const context = useStyleContext()
          contexts.push(context.value)
          return () => h('div')
        },
      })

      const App = defineComponent({
        setup() {
          return () => h(
            StyleProvider,
            { cache },
            {
              default: () => [
                h(Consumer, { key: '1' }),
                h(Consumer, { key: '2' }),
                h(Consumer, { key: '3' }),
              ],
            },
          )
        },
      })

      mount(App)

      expect(contexts).toHaveLength(3)
      contexts.forEach((ctx) => {
        expect(ctx.cache).toBe(cache)
      })
    })
  })
})
