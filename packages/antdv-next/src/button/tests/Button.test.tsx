import { SearchOutlined } from '@antdv-next/icons'
import { describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Button from '..'
import rtlTest from '../../../../../tests/shared/rtlTest'
import { mount } from '../../../../../tests/utils'

describe('button', () => {
  rtlTest(() => h(Button, null, { default: () => 'test' }))

  it('should render default button', () => {
    const wrapper = mount(Button, {
      slots: {
        default: () => 'Button',
      },
    })
    expect(wrapper.find('.ant-btn').exists()).toBe(true)
    expect(wrapper.text()).toBe('Button')
  })

  it('should render all type variants with correct classes', () => {
    const typeMap: Record<string, string> = {
      primary: 'ant-btn-variant-solid',
      default: 'ant-btn-variant-outlined',
      dashed: 'ant-btn-variant-dashed',
      link: 'ant-btn-variant-link',
      text: 'ant-btn-variant-text',
    }
    Object.entries(typeMap).forEach(([type, expectedClass]) => {
      const wrapper = mount(Button, {
        props: { type: type as any },
        slots: { default: () => type },
      })
      expect(wrapper.find(`.${expectedClass}`).exists()).toBe(true)
    })
  })

  it('should render different sizes', () => {
    const sizes = ['large', 'middle', 'small'] as const
    sizes.forEach((size) => {
      const wrapper = mount(Button, {
        props: { size },
        slots: { default: () => size },
      })
      if (size === 'large') {
        expect(wrapper.find('.ant-btn-lg').exists()).toBe(true)
      }
      else if (size === 'small') {
        expect(wrapper.find('.ant-btn-sm').exists()).toBe(true)
      }
      else {
        expect(wrapper.find('.ant-btn-lg').exists()).toBe(false)
        expect(wrapper.find('.ant-btn-sm').exists()).toBe(false)
      }
    })
  })

  it('should render disabled button', () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, {
      props: { disabled: true, onClick },
      slots: { default: () => 'Disabled' },
    })
    expect(wrapper.find('.ant-btn').attributes('disabled')).toBeDefined()
    wrapper.find('.ant-btn').trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('should render loading button', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: { default: () => 'Loading' },
    })
    expect(wrapper.find('.ant-btn-loading').exists()).toBe(true)
  })

  it('should render custom loading icon via slot', () => {
    const wrapper = mount(Button, {
      props: { loading: true },
      slots: {
        loadingIcon: () => h('span', { class: 'custom-loading' }, 'Loading...'),
        default: () => 'Button',
      },
    })
    expect(wrapper.find('.custom-loading').exists()).toBe(true)
  })

  it('should handle icon placement end with loading state', () => {
    const wrapper = mount(Button, {
      props: {
        loading: true,
        iconPlacement: 'end',
      },
      slots: { default: () => 'Loading' },
    })
    expect(wrapper.find('.ant-btn-icon-end').exists()).toBe(true)
    expect(wrapper.find('.ant-btn-loading').exists()).toBe(true)
  })

  it('should not show loading immediately with delay', () => {
    const wrapper = mount(() => (
      <Button loading={{ delay: 200 }}>Loading</Button>
    ))
    // With delay, loading class should not appear immediately
    expect(wrapper.find('.ant-btn-loading').exists()).toBe(false)
  })

  it('should auto focus when autoFocus is true', () => {
    const wrapper = mount(Button, {
      props: { autoFocus: true },
      slots: { default: () => 'Focus' },
      attachTo: document.body,
    })
    expect(document.activeElement).toBe(wrapper.find('button').element)
    wrapper.unmount()
  })

  it('should render icon', () => {
    const wrapper = mount(Button, {
      props: {
        icon: h(SearchOutlined),
      },
      slots: { default: () => 'Search' },
    })
    expect(wrapper.find('.anticon-search').exists()).toBe(true)
  })

  it('should render icon slot', () => {
    const wrapper = mount(Button, {
      slots: {
        icon: () => h(SearchOutlined),
        default: () => 'Search',
      },
    })
    expect(wrapper.find('.anticon-search').exists()).toBe(true)
  })

  it('should support icon placement end', () => {
    const wrapper = mount(Button, {
      props: {
        icon: h(SearchOutlined),
        iconPlacement: 'end',
      },
      slots: { default: () => 'Search' },
    })
    expect(wrapper.find('.ant-btn-icon-end').exists()).toBe(true)
  })

  it('should render circle shape', () => {
    const wrapper = mount(Button, {
      props: {
        shape: 'circle',
        icon: h(SearchOutlined),
      },
    })
    expect(wrapper.find('.ant-btn-circle').exists()).toBe(true)
  })

  it('should render round shape', () => {
    const wrapper = mount(Button, {
      props: { shape: 'round' },
      slots: { default: () => 'Round' },
    })
    expect(wrapper.find('.ant-btn-round').exists()).toBe(true)
  })

  it('should render block button', () => {
    const wrapper = mount(Button, {
      props: { block: true },
      slots: { default: () => 'Block' },
    })
    expect(wrapper.find('.ant-btn-block').exists()).toBe(true)
  })

  it('should render ghost button', () => {
    const wrapper = mount(Button, {
      props: { ghost: true, type: 'primary' },
      slots: { default: () => 'Ghost' },
    })
    expect(wrapper.find('.ant-btn-background-ghost').exists()).toBe(true)
  })

  it('should render danger button', () => {
    const wrapper = mount(Button, {
      props: { danger: true },
      slots: { default: () => 'Danger' },
    })
    expect(wrapper.find('.ant-btn-dangerous').exists()).toBe(true)
  })

  it('should render as anchor when href is provided', () => {
    const wrapper = mount(Button, {
      props: { href: 'https://example.com', target: '_blank' },
      slots: { default: () => 'Link' },
    })
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('a').attributes('href')).toBe('https://example.com')
    expect(wrapper.find('a').attributes('target')).toBe('_blank')
  })

  it('should render with htmlType', () => {
    const wrapper = mount(Button, {
      props: { htmlType: 'submit' },
      slots: { default: () => 'Submit' },
    })
    expect(wrapper.find('button').attributes('type')).toBe('submit')
  })

  it('should trigger click event', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, {
      props: { onClick },
      slots: { default: () => 'Click' },
    })
    await wrapper.find('.ant-btn').trigger('click')
    expect(onClick).toHaveBeenCalled()
  })

  it('should not trigger click when loading', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Button, {
      props: { loading: true, onClick },
      slots: { default: () => 'Loading' },
    })
    await wrapper.find('.ant-btn').trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  it('should render color and variant', () => {
    const wrapper = mount(Button, {
      props: { color: 'danger', variant: 'solid' },
      slots: { default: () => 'Danger Solid' },
    })
    expect(wrapper.find('.ant-btn-color-dangerous').exists()).toBe(true)
    expect(wrapper.find('.ant-btn-variant-solid').exists()).toBe(true)
  })

  it('should support data attributes', () => {
    const wrapper = mount(() => (
      <Button data-test="btn-test">Test</Button>
    ))
    expect(wrapper.find('[data-test="btn-test"]').exists()).toBe(true)
  })

  it('should match primary snapshot', () => {
    const wrapper = mount(() => (
      <Button type="primary" size="large">Primary</Button>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match icon button snapshot', () => {
    const wrapper = mount(() => (
      <Button type="primary" shape="circle" icon={h(SearchOutlined)} />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match loading snapshot', () => {
    const wrapper = mount(() => (
      <Button type="primary" loading={true}>Loading</Button>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})
