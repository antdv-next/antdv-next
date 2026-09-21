import { describe, expect, it } from 'vitest'
import PurePanel from '../PurePanel'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59153
describe('notification numeric zero content', () => {
  it('renders `icon={0}` instead of falling back to the type icon', () => {
    const wrapper = mount(PurePanel, {
      props: { title: 'Title', type: 'info', icon: 0 },
    })
    const icon = wrapper.find('.ant-notification-notice-icon')
    expect(icon.exists()).toBe(true)
    expect(icon.text()).toBe('0')
    // a custom icon must not inherit the type-specific color
    expect(wrapper.find('.ant-notification-notice-icon-info').exists()).toBe(false)
  })

  it('keeps the type icon when icon is an empty string', () => {
    const wrapper = mount(PurePanel, {
      props: { title: 'Title', type: 'info', icon: '' },
    })
    expect(wrapper.find('.ant-notification-notice-icon-info').exists()).toBe(true)
  })

  it('renders `title={0}`', () => {
    const wrapper = mount(PurePanel, {
      props: { title: 0 },
    })
    expect(wrapper.find('.ant-notification-notice-title').text()).toBe('0')
  })
})
