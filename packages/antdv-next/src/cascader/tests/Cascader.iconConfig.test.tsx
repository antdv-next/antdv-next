import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Cascader, { CascaderPanel } from '..'
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

const asyncOptions = [
  { value: 'zj', label: 'Zhejiang', isLeaf: false },
]

// A pending promise keeps the clicked column in its loading state
const pendingLoadData = () => new Promise<void>(() => {})

async function openAndExpandFirstItem(props: Record<string, any>, slots?: Record<string, any>) {
  const wrapper = mount(Cascader, {
    props: { open: true, loadData: pendingLoadData, ...props },
    slots,
    attachTo: document.body,
  })
  await new Promise(resolve => setTimeout(resolve, 0))
  const firstItem = document.querySelector('.ant-cascader-menu-item') as HTMLElement
  firstItem.click()
  await new Promise(resolve => setTimeout(resolve, 0))
  return wrapper
}

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

describe('cascader loadingIcon', () => {
  it('renders the default loading icon while loadData is pending', async () => {
    const wrapper = await openAndExpandFirstItem({ options: asyncOptions })
    const loadingIcon = document.querySelector('.ant-cascader-menu-item-loading-icon')
    expect(loadingIcon).toBeTruthy()
    expect(loadingIcon!.querySelector('.anticon-loading')).toBeTruthy()
    wrapper.unmount()
  })

  it('renders the loadingIcon prop instead of the default icon while loading', async () => {
    const wrapper = await openAndExpandFirstItem({
      options: asyncOptions,
      loadingIcon: h('span', { class: 'custom-loading' }, 'L'),
    })
    const loadingIcon = document.querySelector('.ant-cascader-menu-item-loading-icon')
    expect(loadingIcon).toBeTruthy()
    expect(loadingIcon!.querySelector('.custom-loading')).toBeTruthy()
    expect(loadingIcon!.querySelector('.anticon-loading')).toBeFalsy()
    wrapper.unmount()
  })

  it('uses ConfigProvider.cascader.loadingIcon when no prop is given', async () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        cascader: { loadingIcon: h('span', { class: 'cfg-loading' }, 'L') },
      },
      slots: {
        default: () => h(Cascader, {
          options: asyncOptions,
          open: true,
          loadData: pendingLoadData,
        }),
      },
    })
    await new Promise(resolve => setTimeout(resolve, 0))
    const firstItem = document.querySelector('.ant-cascader-menu-item') as HTMLElement
    firstItem.click()
    await new Promise(resolve => setTimeout(resolve, 0))
    const loadingIcon = document.querySelector('.ant-cascader-menu-item-loading-icon')
    expect(loadingIcon).toBeTruthy()
    expect(loadingIcon!.querySelector('.cfg-loading')).toBeTruthy()
    wrapper.unmount()
  })

  it('renders the #loadingIcon slot while loadData is pending', async () => {
    const wrapper = await openAndExpandFirstItem(
      { options: asyncOptions },
      { loadingIcon: () => h('span', { class: 'slot-loading' }, 'S') },
    )
    const loadingIcon = document.querySelector('.ant-cascader-menu-item-loading-icon')
    expect(loadingIcon).toBeTruthy()
    expect(loadingIcon!.querySelector('.slot-loading')).toBeTruthy()
    wrapper.unmount()
  })

  it('#loadingIcon slot takes priority over loadingIcon prop', async () => {
    const wrapper = await openAndExpandFirstItem(
      { options: asyncOptions, loadingIcon: h('span', { class: 'prop-loading' }, 'P') },
      { loadingIcon: () => h('span', { class: 'slot-loading' }, 'S') },
    )
    const loadingIcon = document.querySelector('.ant-cascader-menu-item-loading-icon')
    expect(loadingIcon!.querySelector('.slot-loading')).toBeTruthy()
    expect(loadingIcon!.querySelector('.prop-loading')).toBeFalsy()
    wrapper.unmount()
  })

  it('renders the #loadingIcon slot in Panel while loadData is pending', async () => {
    const wrapper = mount(CascaderPanel, {
      props: { options: asyncOptions, loadData: pendingLoadData },
      slots: { loadingIcon: () => h('span', { class: 'slot-loading' }, 'S') },
      attachTo: document.body,
    })
    await new Promise(resolve => setTimeout(resolve, 0))
    const firstItem = document.querySelector('.ant-cascader-menu-item') as HTMLElement
    firstItem.click()
    await new Promise(resolve => setTimeout(resolve, 0))
    const loadingIcon = document.querySelector('.ant-cascader-menu-item-loading-icon')
    expect(loadingIcon).toBeTruthy()
    expect(loadingIcon!.querySelector('.slot-loading')).toBeTruthy()
    wrapper.unmount()
  })
})
