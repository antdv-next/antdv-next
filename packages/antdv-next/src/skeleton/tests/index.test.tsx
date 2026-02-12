import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Skeleton from '..'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('skeleton', () => {
  mountTest(Skeleton)
  rtlTest(() => h(Skeleton))

  it('skeleton.Node should render ant-skeleton-node by default', () => {
    const wrapper = mount(Skeleton.Node)
    expect(wrapper.find('.ant-skeleton-node').exists()).toBe(true)
    expect(wrapper.find('.ant-skeleton-image').exists()).toBe(false)
  })

  it('skeleton.Node should keep attrs.class on root only', () => {
    const wrapper = mount(() => <Skeleton.Node class="custom-node" />)
    expect(wrapper.find('.ant-skeleton').classes()).toContain('custom-node')
    expect(wrapper.find('.ant-skeleton-node').classes()).not.toContain('custom-node')
  })

  it('skeleton.Image should render ant-skeleton-image structure', () => {
    const wrapper = mount(Skeleton.Image)
    expect(wrapper.find('.ant-skeleton-image').exists()).toBe(true)
    expect(wrapper.find('.ant-skeleton-node').exists()).toBe(false)
    expect(wrapper.find('.ant-skeleton-image-svg').exists()).toBe(true)
  })

  it('skeleton.Image should keep attrs.class on root only', () => {
    const wrapper = mount(() => <Skeleton.Image class="custom-image" />)
    expect(wrapper.find('.ant-skeleton').classes()).toContain('custom-image')
    expect(wrapper.find('.ant-skeleton-image').classes()).not.toContain('custom-image')
  })

  it('skeleton.Button default size should match React default', () => {
    const wrapper = mount(Skeleton.Button)
    expect(wrapper.find('.ant-skeleton-button').exists()).toBe(true)
    expect(wrapper.find('.ant-skeleton-button-sm').exists()).toBe(false)
  })
})
