import { ClockCircleOutlined, NotificationOutlined } from '@antdv-next/icons'
import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Badge from '..'
import rtlTest from '../../../../../tests/shared/rtlTest'
import { mount } from '../../../../../tests/utils'
import Avatar from '../../avatar'

describe('badge', () => {
  rtlTest(() => h(Badge, { count: 5 }, { default: () => h('span', 'test') }))

  it('should render basic count', () => {
    const wrapper = mount(Badge, {
      props: { count: 5 },
      slots: {
        default: () => h(Avatar, { shape: 'square', size: 'large' }),
      },
    })
    expect(wrapper.find('.ant-badge').exists()).toBe(true)
    expect(wrapper.find('.ant-badge-count').exists()).toBe(true)
  })

  it('should hide count when count is 0', () => {
    const wrapper = mount(Badge, {
      props: { count: 0 },
      slots: {
        default: () => h('span', 'test'),
      },
    })
    expect(wrapper.find('.ant-badge-count').exists()).toBe(false)
  })

  it('should show count when count is 0 and showZero is true', () => {
    const wrapper = mount(Badge, {
      props: { count: 0, showZero: true },
      slots: {
        default: () => h('span', 'test'),
      },
    })
    expect(wrapper.find('.ant-badge-count').exists()).toBe(true)
  })

  it('should render overflow count', () => {
    const wrapper = mount(Badge, {
      props: { count: 100 },
      slots: {
        default: () => h('span', 'test'),
      },
    })
    expect(wrapper.find('.ant-badge-count').text()).toContain('99+')
  })

  it('should render custom overflowCount', () => {
    const wrapper = mount(Badge, {
      props: { count: 1000, overflowCount: 999 },
      slots: {
        default: () => h('span', 'test'),
      },
    })
    expect(wrapper.find('.ant-badge-count').text()).toContain('999+')
  })

  it('should show count when count is less than overflowCount', () => {
    const wrapper = mount(Badge, {
      props: { count: 50, overflowCount: 99 },
      slots: {
        default: () => h('span', 'test'),
      },
    })
    // Should not show overflow indicator
    expect(wrapper.find('.ant-badge-count').text()).not.toContain('+')
  })

  it('should render dot', () => {
    const wrapper = mount(Badge, {
      props: { dot: true },
      slots: {
        default: () => h(NotificationOutlined),
      },
    })
    expect(wrapper.find('.ant-badge-dot').exists()).toBe(true)
  })

  it('should render status badges', () => {
    const statuses = ['success', 'error', 'default', 'processing', 'warning'] as const
    statuses.forEach((status) => {
      const wrapper = mount(Badge, {
        props: { status, text: status },
      })
      expect(wrapper.find(`.ant-badge-status-${status}`).exists()).toBe(true)
    })
  })

  it('should render status text', () => {
    const wrapper = mount(Badge, {
      props: { status: 'success', text: 'Success' },
    })
    expect(wrapper.find('.ant-badge-status-text').text()).toBe('Success')
  })

  it('should render preset colors', () => {
    const colors = ['pink', 'red', 'yellow', 'orange', 'cyan', 'green', 'blue', 'purple'] as const
    colors.forEach((color) => {
      const wrapper = mount(Badge, {
        props: { color, text: color },
      })
      expect(wrapper.find('.ant-badge-status-dot').exists()).toBe(true)
    })
  })

  it('should render custom color', () => {
    const wrapper = mount(Badge, {
      props: { color: '#f50', text: 'custom' },
    })
    const dot = wrapper.find('.ant-badge-status-dot')
    expect(dot.exists()).toBe(true)
    expect(dot.attributes('style')).toContain('background')
  })

  it('should render small size', () => {
    const wrapper = mount(Badge, {
      props: { count: 5, size: 'small' },
      slots: {
        default: () => h(Avatar, { shape: 'square' }),
      },
    })
    expect(wrapper.find('.ant-badge-count-sm').exists()).toBe(true)
  })

  it('should render with title', () => {
    const wrapper = mount(Badge, {
      props: { count: 5, title: 'Custom Title' },
      slots: {
        default: () => h('span', 'test'),
      },
    })
    expect(wrapper.find('.ant-badge-count').attributes('title')).toBe('Custom Title')
  })

  it('should render with offset', () => {
    const wrapper = mount(Badge, {
      props: { count: 5, offset: [10, 10] },
      slots: {
        default: () => h('span', 'test'),
      },
    })
    const count = wrapper.find('.ant-badge-count')
    const style = count.attributes('style')
    expect(style).toContain('inset-inline-end: -10px')
    expect(style).toContain('margin-top: 10px')
  })

  it('should render custom count with slot', () => {
    const wrapper = mount(Badge, {
      slots: {
        default: () => h(Avatar, { shape: 'square', size: 'large' }),
        count: () => h(ClockCircleOutlined, { style: { color: '#f5222d' } }),
      },
    })
    expect(wrapper.find('.anticon-clock-circle').exists()).toBe(true)
  })

  it('should render as standalone without wrapper', () => {
    const wrapper = mount(Badge, {
      props: { count: 25 },
    })
    expect(wrapper.find('.ant-badge-not-a-wrapper').exists()).toBe(true)
  })

  it('should support data attributes', () => {
    const wrapper = mount(() => (
      <Badge count={5} data-test="badge-test">
        <span>test</span>
      </Badge>
    ))
    expect(wrapper.find('[data-test="badge-test"]').exists()).toBe(true)
  })

  it('should match snapshot', () => {
    const wrapper = mount(() => (
      <Badge count={5}>
        <Avatar shape="square" size="large" />
      </Badge>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match dot snapshot', () => {
    const wrapper = mount(() => (
      <Badge dot={true}>
        <Avatar shape="square" size="large" />
      </Badge>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match status snapshot', () => {
    const wrapper = mount(() => (
      <div>
        <Badge status="success" text="Success" />
        <Badge status="error" text="Error" />
        <Badge status="processing" text="Processing" />
        <Badge status="warning" text="Warning" />
        <Badge status="default" text="Default" />
      </div>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})
