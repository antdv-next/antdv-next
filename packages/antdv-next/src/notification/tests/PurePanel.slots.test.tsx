import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import PurePanel from '../PurePanel'
import { mount } from '/@tests/utils'

describe('notification PurePanel slot support', () => {
  it('renders title from slot when both slot and prop are provided', () => {
    const wrapper = mount(PurePanel, {
      props: { title: h('span', { class: 'from-prop' }, 'P') },
      slots: { title: () => h('span', { class: 'from-slot' }, 'S') },
    })
    expect(wrapper.find('.ant-notification-notice-title .from-slot').exists()).toBe(true)
    expect(wrapper.find('.ant-notification-notice-title .from-prop').exists()).toBe(false)
  })

  it('renders description from slot when both slot and prop are provided', () => {
    const wrapper = mount(PurePanel, {
      props: {
        title: 'Title',
        description: h('span', { class: 'from-prop' }, 'P'),
      },
      slots: { description: () => h('span', { class: 'from-slot' }, 'S') },
    })
    expect(wrapper.find('.ant-notification-notice-description .from-slot').exists()).toBe(true)
    expect(wrapper.find('.ant-notification-notice-description .from-prop').exists()).toBe(false)
  })

  it('renders icon from slot when both slot and prop are provided', () => {
    const wrapper = mount(PurePanel, {
      props: {
        title: 'Title',
        icon: h('span', { class: 'from-prop' }),
      },
      slots: { icon: () => h('span', { class: 'from-slot' }) },
    })
    expect(wrapper.find('.from-slot').exists()).toBe(true)
    expect(wrapper.find('.from-prop').exists()).toBe(false)
  })

  it('falls back to the title prop when no slot is provided', () => {
    const wrapper = mount(PurePanel, {
      props: { title: 'PropOnly' },
    })
    expect(wrapper.find('.ant-notification-notice-title').text()).toBe('PropOnly')
  })

  it('falls back to the description prop when no slot is provided', () => {
    const wrapper = mount(PurePanel, {
      props: { title: 'Title', description: 'DescPropOnly' },
    })
    expect(wrapper.find('.ant-notification-notice-description').text()).toBe('DescPropOnly')
  })
})
