import { CustomerServiceOutlined, QuestionCircleOutlined } from '@antdv-next/icons'
import { describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import FloatButton, { BackTop, FloatButtonGroup } from '..'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('floatButton', () => {
  rtlTest(() => h(FloatButton))

  it('should render default float button', () => {
    const wrapper = mount(FloatButton)
    expect(wrapper.find('.ant-float-btn').exists()).toBe(true)
    expect(wrapper.find('.ant-float-btn-circle').exists()).toBe(true)
    expect(wrapper.find('.ant-float-btn-default').exists()).toBe(true)
  })

  it('should render default icon (FileTextOutlined) when no content', () => {
    const wrapper = mount(FloatButton)
    expect(wrapper.find('.anticon-file-text').exists()).toBe(true)
  })

  it('should render primary type', () => {
    const wrapper = mount(FloatButton, {
      props: { type: 'primary' },
    })
    expect(wrapper.find('.ant-float-btn-primary').exists()).toBe(true)
  })

  it('should render square shape', () => {
    const wrapper = mount(FloatButton, {
      props: { shape: 'square' },
    })
    expect(wrapper.find('.ant-float-btn-square').exists()).toBe(true)
  })

  it('should render custom icon', () => {
    const wrapper = mount(FloatButton, {
      props: { icon: h(QuestionCircleOutlined) },
    })
    expect(wrapper.find('.anticon-question-circle').exists()).toBe(true)
    // default icon should not exist
    expect(wrapper.find('.anticon-file-text').exists()).toBe(false)
  })

  it('should render icon via slot', () => {
    const wrapper = mount(FloatButton, {
      slots: {
        icon: () => h(CustomerServiceOutlined),
      },
    })
    expect(wrapper.find('.anticon-customer-service').exists()).toBe(true)
  })

  it('should render content via prop', () => {
    const wrapper = mount(FloatButton, {
      props: { content: 'Help' },
    })
    expect(wrapper.text()).toContain('Help')
    // has content, should not show icon-only class
    expect(wrapper.find('.ant-float-btn-icon-only').exists()).toBe(false)
  })

  it('should render content via default slot', () => {
    const wrapper = mount(FloatButton, {
      slots: { default: () => 'Slot Content' },
    })
    expect(wrapper.text()).toContain('Slot Content')
  })

  it('should render description (deprecated) as content', () => {
    const wrapper = mount(FloatButton, {
      props: { description: 'Desc' },
    })
    expect(wrapper.text()).toContain('Desc')
  })

  it('should show icon-only class when no content', () => {
    const wrapper = mount(FloatButton)
    expect(wrapper.find('.ant-float-btn-icon-only').exists()).toBe(true)
  })

  it('should render tooltip', () => {
    const wrapper = mount(FloatButton, {
      props: { tooltip: 'Help Info' },
      attachTo: document.body,
    })
    expect(wrapper.find('.ant-float-btn').exists()).toBe(true)
    wrapper.unmount()
  })

  it('should render tooltip via slot', () => {
    const wrapper = mount(FloatButton, {
      slots: {
        tooltip: () => 'Tooltip Slot',
      },
      attachTo: document.body,
    })
    expect(wrapper.find('.ant-float-btn').exists()).toBe(true)
    wrapper.unmount()
  })

  it('should render badge', () => {
    const wrapper = mount(FloatButton, {
      props: {
        badge: { count: 5 },
      },
    })
    expect(wrapper.find('.ant-float-btn-badge').exists()).toBe(true)
  })

  it('should render badge dot', () => {
    const wrapper = mount(FloatButton, {
      props: {
        badge: { dot: true },
      },
    })
    expect(wrapper.find('.ant-float-btn-badge-dot').exists()).toBe(true)
  })

  it('should render as anchor when href is provided', () => {
    const wrapper = mount(FloatButton, {
      props: {
        href: 'https://example.com',
        target: '_blank',
      },
    })
    expect(wrapper.find('a').exists()).toBe(true)
    expect(wrapper.find('a').attributes('href')).toBe('https://example.com')
    expect(wrapper.find('a').attributes('target')).toBe('_blank')
  })

  it('should trigger click event', async () => {
    const onClick = vi.fn()
    const wrapper = mount(FloatButton, {
      props: { onClick },
    })
    await wrapper.find('.ant-float-btn').trigger('click')
    expect(onClick).toHaveBeenCalled()
  })

  it('should trigger mouseenter and mouseleave events', async () => {
    const onMouseenter = vi.fn()
    const onMouseleave = vi.fn()
    const wrapper = mount(FloatButton, {
      props: { onMouseenter, onMouseleave },
    })
    await wrapper.find('.ant-float-btn').trigger('mouseenter')
    expect(onMouseenter).toHaveBeenCalled()
    await wrapper.find('.ant-float-btn').trigger('mouseleave')
    expect(onMouseleave).toHaveBeenCalled()
  })

  it('should trigger focus and blur events', async () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    const wrapper = mount(FloatButton, {
      props: { onFocus, onBlur },
    })
    await wrapper.find('.ant-float-btn').trigger('focus')
    expect(onFocus).toHaveBeenCalled()
    await wrapper.find('.ant-float-btn').trigger('blur')
    expect(onBlur).toHaveBeenCalled()
  })

  it('should render individual class by default', () => {
    const wrapper = mount(FloatButton)
    expect(wrapper.find('.ant-float-btn-individual').exists()).toBe(true)
  })

  it('should support htmlType', () => {
    const wrapper = mount(FloatButton, {
      props: { htmlType: 'submit' },
    })
    expect(wrapper.find('button').attributes('type')).toBe('submit')
  })

  it('should support aria-label', () => {
    const wrapper = mount(FloatButton, {
      props: { ariaLabel: 'Float Action' },
    })
    expect(wrapper.find('.ant-float-btn').attributes('aria-label')).toBe('Float Action')
  })

  it('should match snapshot', () => {
    const wrapper = mount(() => (
      <FloatButton icon={h(QuestionCircleOutlined)} type="primary" />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot with content', () => {
    const wrapper = mount(() => (
      <FloatButton icon={h(QuestionCircleOutlined)} content="Help" shape="square" />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})

describe('floatButtonGroup', () => {
  rtlTest(() => h(FloatButtonGroup, null, { default: () => h(FloatButton) }))

  it('should render group with children', () => {
    const wrapper = mount(FloatButtonGroup, {
      slots: {
        default: () => [
          h(FloatButton, { key: '1' }),
          h(FloatButton, { key: '2' }),
        ],
      },
    })
    expect(wrapper.find('.ant-float-btn-group').exists()).toBe(true)
    expect(wrapper.findAll('.ant-float-btn').length).toBe(2)
  })

  it('should render group with square shape (non-individual)', () => {
    const wrapper = mount(FloatButtonGroup, {
      props: { shape: 'square' },
      slots: {
        default: () => [
          h(FloatButton, { key: '1' }),
          h(FloatButton, { key: '2' }),
        ],
      },
    })
    expect(wrapper.find('.ant-float-btn-group').exists()).toBe(true)
    // square shape means non-individual, uses SpaceCompact
    expect(wrapper.find('.ant-float-btn-group-individual').exists()).toBe(false)
  })

  it('should render circle shape (individual)', () => {
    const wrapper = mount(FloatButtonGroup, {
      props: { shape: 'circle' },
      slots: {
        default: () => [
          h(FloatButton, { key: '1' }),
          h(FloatButton, { key: '2' }),
        ],
      },
    })
    expect(wrapper.find('.ant-float-btn-group-individual').exists()).toBe(true)
  })

  it('should pass shape to children via context', () => {
    const wrapper = mount(FloatButtonGroup, {
      props: { shape: 'square' },
      slots: {
        default: () => h(FloatButton),
      },
    })
    expect(wrapper.find('.ant-float-btn-square').exists()).toBe(true)
  })

  it('should render trigger button with click trigger', () => {
    const wrapper = mount(FloatButtonGroup, {
      props: { trigger: 'click' },
      slots: {
        default: () => h(FloatButton),
      },
    })
    expect(wrapper.find('.ant-float-btn-group-trigger').exists()).toBe(true)
    expect(wrapper.find('.ant-float-btn-group-menu-mode').exists()).toBe(true)
  })

  it('should render trigger button with hover trigger', () => {
    const wrapper = mount(FloatButtonGroup, {
      props: { trigger: 'hover' },
      slots: {
        default: () => h(FloatButton),
      },
    })
    expect(wrapper.find('.ant-float-btn-group-trigger').exists()).toBe(true)
  })

  it('should toggle open state on click trigger', async () => {
    const onOpenChange = vi.fn()
    const wrapper = mount(FloatButtonGroup, {
      props: { trigger: 'click', onOpenChange },
      slots: {
        default: () => h(FloatButton),
      },
    })
    // Initially closed
    expect(wrapper.findAll('.ant-float-btn').length).toBe(1) // only trigger button

    // Click trigger to open (rootClass is on the same element as ant-float-btn)
    await wrapper.find('.ant-float-btn-group-trigger').trigger('click')
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it('should toggle open state on hover trigger', async () => {
    const onOpenChange = vi.fn()
    const wrapper = mount(FloatButtonGroup, {
      props: { trigger: 'hover', onOpenChange },
      slots: {
        default: () => h(FloatButton),
      },
    })

    await wrapper.find('.ant-float-btn-group').trigger('mouseenter')
    expect(onOpenChange).toHaveBeenCalledWith(true)

    await wrapper.find('.ant-float-btn-group').trigger('mouseleave')
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('should support controlled open', async () => {
    const wrapper = mount(FloatButtonGroup, {
      props: { trigger: 'click', open: true },
      slots: {
        default: () => h(FloatButton),
      },
    })
    // Should be open, so list is visible + trigger
    expect(wrapper.findAll('.ant-float-btn').length).toBe(2)
  })

  it('should support defaultOpen', () => {
    const wrapper = mount(FloatButtonGroup, {
      props: { trigger: 'click', defaultOpen: true },
      slots: {
        default: () => h(FloatButton),
      },
    })
    expect(wrapper.findAll('.ant-float-btn').length).toBe(2)
  })

  it('should render custom close icon', () => {
    const wrapper = mount(FloatButtonGroup, {
      props: { trigger: 'click', open: true, closeIcon: h(QuestionCircleOutlined) },
      slots: {
        default: () => h(FloatButton),
      },
    })
    // When open, trigger shows close icon
    // rootClass is on the same element as ant-float-btn
    const triggerEl = wrapper.find('.ant-float-btn-group-trigger')
    expect(triggerEl.find('.anticon-question-circle').exists()).toBe(true)
  })

  it('should render close icon via slot', () => {
    const wrapper = mount(FloatButtonGroup, {
      props: { trigger: 'click', open: true },
      slots: {
        default: () => h(FloatButton),
        closeIcon: () => h('span', { class: 'custom-close' }, 'X'),
      },
    })
    const triggerEl = wrapper.find('.ant-float-btn-group-trigger')
    expect(triggerEl.find('.custom-close').exists()).toBe(true)
  })

  it('should support placement', () => {
    const placements = ['top', 'bottom', 'left', 'right'] as const
    placements.forEach((placement) => {
      const wrapper = mount(FloatButtonGroup, {
        props: { trigger: 'click', placement },
        slots: {
          default: () => h(FloatButton),
        },
      })
      expect(wrapper.find(`.ant-float-btn-group-${placement}`).exists()).toBe(true)
    })
  })

  it('should default placement to top for invalid value', () => {
    const wrapper = mount(FloatButtonGroup, {
      props: { trigger: 'click', placement: 'invalid' as any },
      slots: {
        default: () => h(FloatButton),
      },
    })
    expect(wrapper.find('.ant-float-btn-group-top').exists()).toBe(true)
  })

  it('should close on outside click for click trigger', async () => {
    const onOpenChange = vi.fn()
    const wrapper = mount(FloatButtonGroup, {
      props: { trigger: 'click', defaultOpen: true, onOpenChange },
      slots: {
        default: () => h(FloatButton),
      },
      attachTo: document.body,
    })

    // Click outside
    document.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await nextTick()
    expect(onOpenChange).toHaveBeenCalledWith(false)
    wrapper.unmount()
  })

  it('should emit update:open', async () => {
    const onUpdateOpen = vi.fn()
    const wrapper = mount(FloatButtonGroup, {
      props: { trigger: 'click', 'onUpdate:open': onUpdateOpen },
      slots: {
        default: () => h(FloatButton),
      },
    })

    await wrapper.find('.ant-float-btn-group-trigger').trigger('click')
    expect(onUpdateOpen).toHaveBeenCalledWith(true)
  })

  it('should match group snapshot', () => {
    const wrapper = mount(() => (
      <FloatButtonGroup>
        <FloatButton icon={h(QuestionCircleOutlined)} />
        <FloatButton icon={h(CustomerServiceOutlined)} />
      </FloatButtonGroup>
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})

describe('backTop', () => {
  rtlTest(() => h(BackTop, { visibilityHeight: 0 }))

  it('should render BackTop', () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 0 },
    })
    expect(wrapper.find('.ant-float-btn').exists()).toBe(true)
  })

  it('should render default back-top icon', () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 0 },
    })
    expect(wrapper.find('.anticon-vertical-align-top').exists()).toBe(true)
  })

  it('should render custom icon', () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 0, icon: h(QuestionCircleOutlined) },
    })
    expect(wrapper.find('.anticon-question-circle').exists()).toBe(true)
  })

  it('should render icon via slot', () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 0 },
      slots: {
        icon: () => h(CustomerServiceOutlined),
      },
    })
    expect(wrapper.find('.anticon-customer-service').exists()).toBe(true)
  })

  it('should be hidden by default (visibilityHeight=400)', () => {
    const wrapper = mount(BackTop)
    // Default visibilityHeight is 400, scroll is 0, should be hidden
    expect(wrapper.find('.ant-float-btn').exists()).toBe(false)
  })

  it('should show when visibilityHeight is 0', () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 0 },
    })
    expect(wrapper.find('.ant-float-btn').exists()).toBe(true)
  })

  it('should trigger click event', async () => {
    const onClick = vi.fn()
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 0, onClick },
    })
    await wrapper.find('.ant-float-btn').trigger('click')
    expect(onClick).toHaveBeenCalled()
  })

  it('should support content via default slot', () => {
    const wrapper = mount(BackTop, {
      props: { visibilityHeight: 0 },
      slots: {
        default: () => 'Back',
      },
    })
    expect(wrapper.text()).toContain('Back')
  })

  it('should match snapshot', () => {
    const wrapper = mount(() => (
      <BackTop visibilityHeight={0} />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})
