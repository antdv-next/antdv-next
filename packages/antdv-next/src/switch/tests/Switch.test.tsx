import { describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Switch from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

const prefixCls = 'ant-switch'

describe('switch', () => {
  mountTest(Switch)
  rtlTest(() => h(Switch))

  // ===================== Basic rendering =====================

  it('should render a button with role="switch"', () => {
    const wrapper = mount(Switch)
    const btn = wrapper.find('button')
    expect(btn.exists()).toBe(true)
    expect(btn.attributes('role')).toBe('switch')
    expect(btn.attributes('type')).toBe('button')
    expect(btn.classes()).toContain(prefixCls)
  })

  // ===================== checked prop (controlled) =====================

  it('should be controlled by checked prop', async () => {
    const wrapper = mount(Switch, {
      props: { checked: true },
    })
    expect(wrapper.find('button').attributes('aria-checked')).toBe('true')
    expect(wrapper.find('button').classes()).toContain(`${prefixCls}-checked`)

    await wrapper.setProps({ checked: false })
    expect(wrapper.find('button').attributes('aria-checked')).toBe('false')
    expect(wrapper.find('button').classes()).not.toContain(`${prefixCls}-checked`)
  })

  // ===================== value prop (alias for checked) =====================

  it('should accept value as alias for checked', () => {
    const wrapper = mount(Switch, {
      props: { value: true },
    })
    expect(wrapper.find('button').attributes('aria-checked')).toBe('true')
    expect(wrapper.find('button').classes()).toContain(`${prefixCls}-checked`)
  })

  // ===================== defaultChecked prop (uncontrolled) =====================

  it('should support defaultChecked', () => {
    const wrapper = mount(Switch, {
      props: { defaultChecked: true },
    })
    expect(wrapper.find('button').attributes('aria-checked')).toBe('true')
  })

  // ===================== defaultValue prop (alias for defaultChecked) =====================

  it('should support defaultValue as alias for defaultChecked', () => {
    const wrapper = mount(Switch, {
      props: { defaultValue: true },
    })
    expect(wrapper.find('button').attributes('aria-checked')).toBe('true')
  })

  // ===================== unchecked by default =====================

  it('should default to unchecked', () => {
    const wrapper = mount(Switch)
    expect(wrapper.find('button').attributes('aria-checked')).toBe('false')
    expect(wrapper.find('button').classes()).not.toContain(`${prefixCls}-checked`)
  })

  // ===================== checked takes priority over value =====================

  it('checked prop should take priority over value prop', () => {
    const wrapper = mount(Switch, {
      props: { checked: true, value: false },
    })
    expect(wrapper.find('button').attributes('aria-checked')).toBe('true')
  })

  // ===================== checkedValue / unCheckedValue =====================

  it('should support custom checkedValue and unCheckedValue', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(Switch, {
      props: {
        'checkedValue': 'on',
        'unCheckedValue': 'off',
        'checked': 'on',
        'onUpdate:checked': onUpdate,
      },
    })
    expect(wrapper.find('button').attributes('aria-checked')).toBe('true')

    // click to toggle
    await wrapper.find('button').trigger('click')
    expect(onUpdate).toHaveBeenCalledWith('off')
  })

  it('should emit custom unCheckedValue when toggling off', async () => {
    const onUpdateChecked = vi.fn()
    const onUpdateValue = vi.fn()
    const wrapper = mount(Switch, {
      props: {
        'checkedValue': 1,
        'unCheckedValue': 0,
        'defaultChecked': 1,
        'onUpdate:checked': onUpdateChecked,
        'onUpdate:value': onUpdateValue,
      },
    })
    await wrapper.find('button').trigger('click')
    expect(onUpdateChecked).toHaveBeenCalledWith(0)
    expect(onUpdateValue).toHaveBeenCalledWith(0)
  })

  it('should emit custom checkedValue when toggling on', async () => {
    const onUpdateChecked = vi.fn()
    const wrapper = mount(Switch, {
      props: {
        'checkedValue': 'yes',
        'unCheckedValue': 'no',
        'defaultChecked': 'no',
        'onUpdate:checked': onUpdateChecked,
      },
    })
    await wrapper.find('button').trigger('click')
    expect(onUpdateChecked).toHaveBeenCalledWith('yes')
  })

  // ===================== size prop =====================

  it('should apply small size class', () => {
    const wrapper = mount(Switch, {
      props: { size: 'small' },
    })
    expect(wrapper.find('button').classes()).toContain(`${prefixCls}-small`)
  })

  it('should not apply small class for default size', () => {
    const wrapper = mount(Switch, {
      props: { size: 'default' },
    })
    expect(wrapper.find('button').classes()).not.toContain(`${prefixCls}-small`)
  })

  // ===================== disabled prop =====================

  it('should support disabled prop', () => {
    const wrapper = mount(Switch, {
      props: { disabled: true },
    })
    const btn = wrapper.find('button')
    expect(btn.attributes('disabled')).toBeDefined()
    expect(btn.classes()).toContain(`${prefixCls}-disabled`)
  })

  // ===================== loading prop =====================

  it('should show loading icon when loading', () => {
    const wrapper = mount(Switch, {
      props: { loading: true },
    })
    expect(wrapper.find('button').classes()).toContain(`${prefixCls}-loading`)
    expect(wrapper.find(`.${prefixCls}-loading-icon`).exists()).toBe(true)
  })

  it('should not show loading icon when not loading', () => {
    const wrapper = mount(Switch)
    expect(wrapper.find('button').classes()).not.toContain(`${prefixCls}-loading`)
    expect(wrapper.find(`.${prefixCls}-loading-icon`).exists()).toBe(false)
  })

  it('loading should force disabled', () => {
    const wrapper = mount(Switch, {
      props: { loading: true },
    })
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    expect(wrapper.find('button').classes()).toContain(`${prefixCls}-disabled`)
  })

  // ===================== checkedChildren / unCheckedChildren props =====================

  it('should render checkedChildren and unCheckedChildren via props', () => {
    const wrapper = mount(Switch, {
      props: {
        checkedChildren: 'ON',
        unCheckedChildren: 'OFF',
        defaultChecked: true,
      },
    })
    expect(wrapper.find(`.${prefixCls}-inner-checked`).text()).toBe('ON')
    expect(wrapper.find(`.${prefixCls}-inner-unchecked`).text()).toBe('OFF')
  })

  // ===================== checkedChildren / unCheckedChildren slots =====================

  it('should render checkedChildren and unCheckedChildren via slots', () => {
    const wrapper = mount(Switch, {
      props: { defaultChecked: true },
      slots: {
        checkedChildren: () => h('span', { class: 'slot-check' }, 'Yes'),
        unCheckedChildren: () => h('span', { class: 'slot-uncheck' }, 'No'),
      },
    })
    expect(wrapper.find('.slot-check').exists()).toBe(true)
    expect(wrapper.find('.slot-uncheck').exists()).toBe(true)
  })

  it('slot should take priority over prop for checkedChildren', () => {
    const wrapper = mount(Switch, {
      props: {
        checkedChildren: 'PropText',
        defaultChecked: true,
      },
      slots: {
        checkedChildren: () => 'SlotText',
      },
    })
    expect(wrapper.find(`.${prefixCls}-inner-checked`).text()).toBe('SlotText')
  })

  // ===================== change event =====================

  it('should emit change event on click', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Switch, {
      props: { onChange },
    })
    await wrapper.find('button').trigger('click')
    expect(onChange).toHaveBeenCalledWith(true, expect.anything())
  })

  // ===================== click toggles switch =====================

  it('should toggle on button click', async () => {
    const wrapper = mount(Switch, {
      props: { defaultChecked: false },
    })
    expect(wrapper.find('button').attributes('aria-checked')).toBe('false')

    await wrapper.find('button').trigger('click')
    expect(wrapper.find('button').attributes('aria-checked')).toBe('true')
  })

  // ===================== update:checked / update:value events =====================

  it('should emit update:checked and update:value on toggle', async () => {
    const onUpdateChecked = vi.fn()
    const onUpdateValue = vi.fn()
    const wrapper = mount(Switch, {
      props: {
        'onUpdate:checked': onUpdateChecked,
        'onUpdate:value': onUpdateValue,
      },
    })
    await wrapper.find('button').trigger('click')
    expect(onUpdateChecked).toHaveBeenCalledWith(true)
    expect(onUpdateValue).toHaveBeenCalledWith(true)
  })

  // ===================== rootClass =====================

  it('should apply rootClass', () => {
    const wrapper = mount(Switch, {
      props: { rootClass: 'my-root' },
    })
    expect(wrapper.find('button').classes()).toContain('my-root')
  })

  // ===================== attrs passthrough =====================

  it('should pass through data-* attrs', () => {
    const wrapper = mount(Switch, {
      attrs: { 'data-testid': 'my-switch' },
    })
    expect(wrapper.find('button').attributes('data-testid')).toBe('my-switch')
  })

  it('should pass through title attribute', () => {
    const wrapper = mount(Switch, {
      props: { title: 'Toggle me' },
    })
    expect(wrapper.find('button').attributes('title')).toBe('Toggle me')
  })

  it('should pass through id attribute', () => {
    const wrapper = mount(Switch, {
      props: { id: 'sw-1' },
    })
    expect(wrapper.find('button').attributes('id')).toBe('sw-1')
  })

  // ===================== disabled from DisabledContext =====================

  it('should inherit disabled from ConfigProvider', () => {
    const wrapper = mount({
      render() {
        return h(ConfigProvider, { componentDisabled: true }, {
          default: () => h(Switch),
        })
      },
    })
    const btn = wrapper.find('button')
    expect(btn.attributes('disabled')).toBeDefined()
    expect(btn.classes()).toContain(`${prefixCls}-disabled`)
  })

  it('should override DisabledContext with own disabled=false', () => {
    const wrapper = mount({
      render() {
        return h(ConfigProvider, { componentDisabled: true }, {
          default: () => h(Switch, { disabled: false }),
        })
      },
    })
    const btn = wrapper.find('button')
    expect(btn.attributes('disabled')).toBeUndefined()
  })

  // ===================== size from ConfigProvider =====================

  it('should inherit size from ConfigProvider', () => {
    const wrapper = mount({
      render() {
        return h(ConfigProvider, { componentSize: 'small' }, {
          default: () => h(Switch),
        })
      },
    })
    expect(wrapper.find('button').classes()).toContain(`${prefixCls}-small`)
  })

  // ===================== rtl direction =====================

  it('should apply rtl class from ConfigProvider direction', () => {
    const wrapper = mount({
      render() {
        return h(ConfigProvider, { direction: 'rtl' }, {
          default: () => h(Switch),
        })
      },
    })
    expect(wrapper.find('button').classes()).toContain(`${prefixCls}-rtl`)
  })

  // ===================== controlled value update via watch =====================

  it('should update when controlled checked changes', async () => {
    const checked = ref(false)
    const wrapper = mount({
      render() {
        return h(Switch, { checked: checked.value })
      },
    })
    expect(wrapper.find('button').attributes('aria-checked')).toBe('false')

    checked.value = true
    await nextTick()
    expect(wrapper.find('button').attributes('aria-checked')).toBe('true')
  })

  it('should update when controlled value changes', async () => {
    const value = ref(false)
    const wrapper = mount({
      render() {
        return h(Switch, { value: value.value })
      },
    })
    expect(wrapper.find('button').attributes('aria-checked')).toBe('false')

    value.value = true
    await nextTick()
    expect(wrapper.find('button').attributes('aria-checked')).toBe('true')
  })

  // ===================== semantic classes/styles (basic) =====================

  it('should apply semantic classes and styles', () => {
    const wrapper = mount(Switch, {
      props: {
        'classes': { root: 'c-root', content: 'c-content', indicator: 'c-indicator' },
        'styles': {
          root: { color: 'rgb(255, 0, 0)' },
          content: { fontSize: '14px' },
          indicator: { background: 'rgb(0, 0, 255)' },
        },
        'checkedChildren': 'on',
        'unCheckedChildren': 'off',
        'defaultChecked': true,
      },
    })
    // root
    const root = wrapper.find('button')
    expect(root.classes()).toContain('c-root')
    expect(root.attributes('style')).toContain('color: rgb(255, 0, 0)')

    // content (applied to both checked and unchecked inner)
    const checkedContent = wrapper.find(`.${prefixCls}-inner-checked`)
    expect(checkedContent.classes()).toContain('c-content')
    expect(checkedContent.attributes('style')).toContain('font-size: 14px')

    const uncheckedContent = wrapper.find(`.${prefixCls}-inner-unchecked`)
    expect(uncheckedContent.classes()).toContain('c-content')
    expect(uncheckedContent.attributes('style')).toContain('font-size: 14px')

    // indicator (handle)
    const handle = wrapper.find(`.${prefixCls}-handle`)
    expect(handle.classes()).toContain('c-indicator')
    expect(handle.attributes('style')).toContain('background: rgb(0, 0, 255)')
  })

  // ===================== handle div always rendered =====================

  it('should always render handle div even without loading', () => {
    const wrapper = mount(Switch)
    expect(wrapper.find(`.${prefixCls}-handle`).exists()).toBe(true)
    expect(wrapper.find(`.${prefixCls}-loading-icon`).exists()).toBe(false)
  })

  // ===================== snapshot =====================

  it('should match snapshot', () => {
    const wrapper = mount(Switch, {
      props: {
        checkedChildren: 'ON',
        unCheckedChildren: 'OFF',
        defaultChecked: true,
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot with loading', () => {
    const wrapper = mount(Switch, {
      props: {
        loading: true,
        checkedChildren: 'ON',
        unCheckedChildren: 'OFF',
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot with small size', () => {
    const wrapper = mount(Switch, {
      props: {
        size: 'small',
        defaultChecked: true,
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
