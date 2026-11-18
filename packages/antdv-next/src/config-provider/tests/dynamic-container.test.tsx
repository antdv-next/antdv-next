import { describe, expect, it } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import ConfigProvider from '..'
import Select from '../../select'
import { useComponentBaseConfig } from '../context'
import { flushPromises, mount } from '/@tests/utils'

describe('config-provider dynamic containers', () => {
  it('honors a replaced getPopupContainer callback', async () => {
    const containerA = document.createElement('div')
    containerA.className = 'popup-container-a'
    const containerB = document.createElement('div')
    containerB.className = 'popup-container-b'
    document.body.append(containerA, containerB)

    const getPopupContainer = ref<() => HTMLElement>(() => containerA)
    const open = ref(false)

    const Host = defineComponent(() => {
      return () => h(ConfigProvider, {
        getPopupContainer: getPopupContainer.value,
      }, () => h(Select, {
        open: open.value,
        value: 'x',
        options: [{ value: 'x', label: 'X' }],
      }))
    })

    const wrapper = mount(Host, { attachTo: document.body })
    await nextTick()
    await nextTick()

    getPopupContainer.value = () => containerB
    await nextTick()
    await nextTick()

    open.value = true
    await nextTick()
    await flushPromises()
    await nextTick()

    const dropdown = document.querySelector('.ant-select-dropdown')
    expect(dropdown).toBeTruthy()
    expect(containerB.contains(dropdown)).toBe(true)
    expect(containerA.contains(dropdown)).toBe(false)

    wrapper.unmount()
    containerA.remove()
    containerB.remove()
  })

  it('honors a replaced getTargetContainer callback', async () => {
    const targetA = document.createElement('div')
    targetA.className = 'target-container-a'
    const targetB = document.createElement('div')
    targetB.className = 'target-container-b'

    const getTargetContainer = ref<() => HTMLElement>(() => targetA)

    const Probe = defineComponent(() => {
      const { getTargetContainer: getConfigTargetContainer } = useComponentBaseConfig('anchor')
      return () => h('span', {
        class: 'target-probe',
      }, getConfigTargetContainer?.()?.className ?? 'none')
    })

    const Host = defineComponent(() => {
      return () => h(ConfigProvider, {
        getTargetContainer: getTargetContainer.value,
      }, () => h(Probe))
    })

    const wrapper = mount(Host)
    await nextTick()
    expect(wrapper.find('.target-probe').text()).toBe('target-container-a')

    getTargetContainer.value = () => targetB
    await nextTick()
    expect(wrapper.find('.target-probe').text()).toBe('target-container-b')

    wrapper.unmount()
  })
})
