import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref, Transition } from 'vue'
import { createCache, StyleProvider } from '../src'
import { useGlobalCache } from '../src/hooks/useGlobalCache'

/**
 * 测试 Transition 过渡动画期间样式卸载的行为
 */
describe('transition unmount timing', () => {
  let cache: ReturnType<typeof createCache>

  beforeEach(() => {
    cache = createCache()
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

  it('should test style removal timing during transition', async () => {
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

    // 使用 onBeforeUnmount 实现后，行为和之前一样：
    // onBeforeUnmount 在 Transition 动画开始时就被调用
    // 样式仍然会被立即移除
    console.log('onRemoveA called:', onRemoveA.mock.calls.length, 'times')

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

    // 引用计数变为 1，样式不应该被移除
    expect(onRemove).not.toHaveBeenCalled()

    // 卸载第二个
    showSecond.value = false
    await nextTick()

    // 引用计数变为 0，样式应该被移除
    expect(onRemove).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })
})
