import { describe, expect, it } from 'vitest'
import { InternalPanel } from '../Panel'
import { mount } from '/@tests/utils'

describe('splitter InternalPanel destroyOnHidden', () => {
  it('renders the slot content normally when not hidden', () => {
    const wrapper = mount(InternalPanel, {
      props: {
        prefixCls: 'ant-splitter',
        size: 200,
      },
      slots: {
        default: () => 'visible-content',
      },
    })
    expect(wrapper.text()).toContain('visible-content')
    expect(wrapper.find('.ant-splitter-panel-hidden').exists()).toBe(false)
  })

  it('keeps slot content rendered when size=0 if destroyOnHidden is false (default)', () => {
    const wrapper = mount(InternalPanel, {
      props: {
        prefixCls: 'ant-splitter',
        size: 0,
      },
      slots: {
        default: () => 'collapsed-content',
      },
    })
    expect(wrapper.find('.ant-splitter-panel-hidden').exists()).toBe(true)
    // Content is kept in the DOM by default so panel state survives across collapse.
    expect(wrapper.text()).toContain('collapsed-content')
  })

  it('drops slot content when size=0 AND destroyOnHidden is true', () => {
    const wrapper = mount(InternalPanel, {
      props: {
        prefixCls: 'ant-splitter',
        size: 0,
        destroyOnHidden: true,
      },
      slots: {
        default: () => 'will-be-dropped',
      },
    })
    expect(wrapper.find('.ant-splitter-panel-hidden').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('will-be-dropped')
  })

  it('keeps slot content when destroyOnHidden is true but size > 0', () => {
    const wrapper = mount(InternalPanel, {
      props: {
        prefixCls: 'ant-splitter',
        size: 100,
        destroyOnHidden: true,
      },
      slots: {
        default: () => 'still-visible',
      },
    })
    expect(wrapper.find('.ant-splitter-panel-hidden').exists()).toBe(false)
    expect(wrapper.text()).toContain('still-visible')
  })
})
