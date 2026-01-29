import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, Transition } from 'vue'
import { createCache, StyleProvider } from '../src'
import { useGlobalCache } from '../src/hooks/useGlobalCache'

// 延迟移除的时间，需要与 useGlobalCache.ts 中的 REMOVE_STYLE_DELAY 保持一致
const REMOVE_STYLE_DELAY = 500

/**
 * 测试 Transition 过渡动画期间样式延迟卸载的行为
 */
describe('transition unmount timing', () => {
  let cache: ReturnType<typeof createCache>

  beforeEach(() => {
    cache = createCache()
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  // 模拟一个使用 cssinjs 的组件
  const createStyledComponent = (name: string, onRemove: () => void) => {
    return defineComponent({
      name,
      setup() {
        const prefix = ref('style')
        const keyPath = ref([name])

        const cacheValue = useGlobalCache(
          prefix,
          keyPath,
          () => ({ style: `.${name} { color: red; }` }),
          onRemove,
          // 模拟样式注入
          (value) => {
            const style = document.createElement('style')
            style.setAttribute('data-test-style', name)
            style.textContent = value.style
            document.head.appendChild(style)
          },
        )

        return () => h('div', { class: name }, `Component ${name}: ${JSON.stringify(cacheValue.value)}`)
      },
    })
  }

  it('should NOT remove style immediately during transition (delayed removal)', async () => {
    const onRemoveA = vi.fn(() => {
      const style = document.querySelector(`style[data-test-style="ComponentA"]`)
      style?.remove()
    })

    const ComponentA = createStyledComponent('ComponentA', onRemoveA)
    const ComponentB = createStyledComponent('ComponentB', vi.fn())

    const showA = ref(true)

    const App = defineComponent({
      setup() {
        return () => h(
          StyleProvider,
          { cache },
          () => h(
            Transition,
            {
              name: 'fade',
              mode: 'out-in',
            },
            () => showA.value ? h(ComponentA) : h(ComponentB),
          ),
        )
      },
    })

    const wrapper = mount(App, { attachTo: document.body })
    await nextTick()

    // 验证 ComponentA 的样式已注入
    expect(document.querySelector('style[data-test-style="ComponentA"]')).toBeTruthy()
    expect(onRemoveA).not.toHaveBeenCalled()

    // 切换到 ComponentB，触发 Transition
    showA.value = false
    await nextTick()

    // 延迟策略生效：样式不会立即移除
    expect(onRemoveA).not.toHaveBeenCalled()
    expect(document.querySelector('style[data-test-style="ComponentA"]')).toBeTruthy()

    // 等待延迟时间后，样式才会被移除
    vi.advanceTimersByTime(REMOVE_STYLE_DELAY)
    await nextTick()

    expect(onRemoveA).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('should cancel delayed removal if component remounts', async () => {
    const onRemove = vi.fn()

    const ComponentA = defineComponent({
      name: 'RemountA',
      setup() {
        const prefix = ref('style')
        const keyPath = ref(['RemountA'])

        useGlobalCache(
          prefix,
          keyPath,
          () => ({ style: `.RemountA { color: green; }` }),
          onRemove,
        )

        return () => h('div', { class: 'RemountA' }, 'A')
      },
    })

    const show = ref(true)

    const App = defineComponent({
      setup() {
        return () => h(
          StyleProvider,
          { cache },
          () => show.value ? h(ComponentA) : null,
        )
      },
    })

    const wrapper = mount(App)
    await nextTick()

    // 卸载组件
    show.value = false
    await nextTick()

    // 样式还没被移除（在延迟中）
    expect(onRemove).not.toHaveBeenCalled()

    // 在延迟期间重新挂载组件
    vi.advanceTimersByTime(REMOVE_STYLE_DELAY / 2) // 只等一半时间
    show.value = true
    await nextTick()

    // 等待剩余时间
    vi.advanceTimersByTime(REMOVE_STYLE_DELAY)
    await nextTick()

    // 因为组件重新挂载了，样式不应该被移除
    expect(onRemove).not.toHaveBeenCalled()

    wrapper.unmount()
  })

  /**
   * 测试快速切换时引用计数正确性
   * Bug: 当组件卸载后快速重新挂载时，如果取消了延迟定时器但仍然执行 increment，
   * 会导致引用计数多 1，最终样式永远不会被移除
   */
  it('should maintain correct ref count during rapid toggle (fix ref count leak)', async () => {
    const onRemove = vi.fn()

    const ComponentA = defineComponent({
      name: 'RefCountTest',
      setup() {
        const prefix = ref('style')
        const keyPath = ref(['RefCountTest'])

        useGlobalCache(
          prefix,
          keyPath,
          () => ({ style: `.RefCountTest { color: blue; }` }),
          onRemove,
        )

        return () => h('div', { class: 'RefCountTest' }, 'RefCount Test')
      },
    })

    const show = ref(true)

    const App = defineComponent({
      setup() {
        return () => h(
          StyleProvider,
          { cache },
          () => show.value ? h(ComponentA) : null,
        )
      },
    })

    const wrapper = mount(App)
    await nextTick()

    // 初始状态：引用计数 = 1
    expect(onRemove).not.toHaveBeenCalled()

    // 快速切换多次（模拟 Transition 动画期间的快速切换）
    for (let i = 0; i < 5; i++) {
      // 卸载
      show.value = false
      await nextTick()

      // 在延迟期间快速重新挂载
      vi.advanceTimersByTime(REMOVE_STYLE_DELAY / 4)
      show.value = true
      await nextTick()
    }

    // 经过多次快速切换后，样式仍然不应该被移除
    expect(onRemove).not.toHaveBeenCalled()

    // 最终卸载
    show.value = false
    await nextTick()

    // 等待延迟时间
    vi.advanceTimersByTime(REMOVE_STYLE_DELAY)
    await nextTick()

    // 关键断言：引用计数应该正确归零，样式应该被移除
    // 如果存在 bug（引用计数多加了 1），onRemove 不会被调用
    expect(onRemove).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  /**
   * 测试连续快速切换后再完全卸载的场景
   */
  it('should correctly clean up after multiple rapid mount/unmount cycles', async () => {
    const onRemove = vi.fn()

    const TestComponent = defineComponent({
      name: 'RapidCycleTest',
      setup() {
        const prefix = ref('rapid')
        const keyPath = ref(['RapidCycleTest'])

        useGlobalCache(
          prefix,
          keyPath,
          () => ({ style: `.RapidCycleTest { color: purple; }` }),
          onRemove,
        )

        return () => h('div', 'Rapid Cycle Test')
      },
    })

    const show = ref(false)

    const App = defineComponent({
      setup() {
        return () => h(
          StyleProvider,
          { cache },
          () => show.value ? h(TestComponent) : null,
        )
      },
    })

    const wrapper = mount(App)
    await nextTick()

    // 进行 10 次快速挂载/卸载循环
    for (let i = 0; i < 10; i++) {
      show.value = true
      await nextTick()

      show.value = false
      await nextTick()

      // 只等一小段时间，不足以触发延迟移除
      vi.advanceTimersByTime(REMOVE_STYLE_DELAY / 10)
    }

    // 所有循环完成后，组件处于卸载状态
    expect(onRemove).not.toHaveBeenCalled()

    // 等待完整的延迟时间
    vi.advanceTimersByTime(REMOVE_STYLE_DELAY)
    await nextTick()

    // 样式应该被正确移除（引用计数应该是 0）
    expect(onRemove).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('should handle multiple components sharing same style', async () => {
    const onRemove = vi.fn()

    const SharedStyleComponent = defineComponent({
      name: 'SharedStyle',
      setup() {
        const prefix = ref('shared')
        const keyPath = ref(['common-style'])

        const cacheValue = useGlobalCache(
          prefix,
          keyPath,
          () => ({ style: `.shared { color: green; }` }),
          onRemove,
        )

        return () => h('div', { class: 'shared' }, JSON.stringify(cacheValue.value))
      },
    })

    const showFirst = ref(true)
    const showSecond = ref(true)

    const App = defineComponent({
      setup() {
        return () => h(
          StyleProvider,
          { cache },
          () => [
            showFirst.value ? h(SharedStyleComponent, { key: 'first' }) : null,
            showSecond.value ? h(SharedStyleComponent, { key: 'second' }) : null,
          ],
        )
      },
    })

    const wrapper = mount(App)
    await nextTick()

    // 两个组件共享同一个样式，引用计数为 2
    expect(onRemove).not.toHaveBeenCalled()

    // 卸载第一个
    showFirst.value = false
    await nextTick()

    // 等待延迟时间
    vi.advanceTimersByTime(REMOVE_STYLE_DELAY)
    await nextTick()

    // 引用计数变为 1，样式不应该被移除
    expect(onRemove).not.toHaveBeenCalled()

    // 卸载第二个
    showSecond.value = false
    await nextTick()

    // 引用计数变为 0，但还在延迟中
    expect(onRemove).not.toHaveBeenCalled()

    // 等待延迟时间
    vi.advanceTimersByTime(REMOVE_STYLE_DELAY)
    await nextTick()

    // 现在样式应该被移除
    expect(onRemove).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })
})
