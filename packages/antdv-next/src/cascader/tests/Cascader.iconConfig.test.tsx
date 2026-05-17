import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Cascader from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

const options = [
  {
    value: 'zj',
    label: 'Zhejiang',
    children: [
      { value: 'hz', label: 'Hangzhou' },
    ],
  },
]

describe('cascader ConfigProvider icons', () => {
  it('uses ConfigProvider.cascader.suffixIcon when no component-level suffixIcon is given', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        cascader: { suffixIcon: h('span', { class: 'cfg-suffix' }, 'S') },
      },
      slots: {
        default: () => h(Cascader, { options }),
      },
    })
    expect(wrapper.find('.cfg-suffix').exists()).toBe(true)
  })

  it('component-level suffixIcon wins over ConfigProvider', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        cascader: { suffixIcon: h('span', { class: 'cfg-suffix' }, 'S') },
      },
      slots: {
        default: () => h(Cascader, { options, suffixIcon: h('span', { class: 'inline-suffix' }, 'X') }),
      },
    })
    expect(wrapper.find('.inline-suffix').exists()).toBe(true)
    expect(wrapper.find('.cfg-suffix').exists()).toBe(false)
  })

  it('uses ConfigProvider.cascader.clearIcon as the clear button icon', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        cascader: { clearIcon: h('span', { class: 'cfg-clear' }, '×') },
      },
      slots: {
        default: () => h(Cascader, { options, value: ['zj', 'hz'], allowClear: true }),
      },
    })
    expect(wrapper.find('.cfg-clear').exists()).toBe(true)
  })

  it('uses ConfigProvider.cascader.removeIcon for multi-select tag remove buttons', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        cascader: { removeIcon: h('span', { class: 'cfg-remove' }, '×') },
      },
      slots: {
        default: () => h(Cascader, { options, multiple: true, value: [['zj', 'hz']] }),
      },
    })
    expect(wrapper.find('.cfg-remove').exists()).toBe(true)
  })
})
