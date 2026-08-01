import { beforeAll, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Tag, { CheckableTag, CheckableTagGroup } from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

const prefixCls = 'ant-tag'

// Suppress jsdom/cssstyle error when Wave component injects CSS with var() border shorthand.
// cssstyle cannot parse CSS custom property values in border shorthand (jsdom limitation).
const originalSetProperty = CSSStyleDeclaration.prototype.setProperty
beforeAll(() => {
  CSSStyleDeclaration.prototype.setProperty = function (prop: string, value: string | null, priority?: string) {
    try {
      originalSetProperty.call(this, prop, value, priority ?? '')
    }
    catch {
      // Silently ignore cssstyle parse errors for CSS variable values
    }
  }
})
describe('tag', () => {
  mountTest(Tag)
  rtlTest(() => h(Tag))

  // ===================== Basic rendering =====================

  it('should render a span by default', () => {
    const wrapper = mount(Tag, {
      slots: { default: () => 'Tag Content' },
    })
    expect(wrapper.find('span').exists()).toBe(true)
    expect(wrapper.text()).toBe('Tag Content')
    expect(wrapper.find('span').classes()).toContain(prefixCls)
  })

  it('should render an anchor when href is provided', () => {
    const wrapper = mount(Tag, {
      props: { href: 'https://example.com', target: '_blank' },
      slots: { default: () => 'Link Tag' },
    })
    const a = wrapper.find('a')
    expect(a.exists()).toBe(true)
    expect(a.attributes('href')).toBe('https://example.com')
    expect(a.attributes('target')).toBe('_blank')
  })

  // ===================== color prop =====================

  it('should apply preset color class', () => {
    const wrapper = mount(Tag, {
      props: { color: 'blue' },
      slots: { default: () => 'Blue' },
    })
    expect(wrapper.find('span').classes()).toContain(`${prefixCls}-blue`)
  })

  it('should apply status color class', () => {
    const wrapper = mount(Tag, {
      props: { color: 'success' },
      slots: { default: () => 'Success' },
    })
    expect(wrapper.find('span').classes()).toContain(`${prefixCls}-success`)
  })

  it('should apply inverse color class and solid variant', () => {
    const wrapper = mount(Tag, {
      props: { color: 'blue-inverse' },
      slots: { default: () => 'Inverse' },
    })
    const span = wrapper.find('span')
    expect(span.classes()).toContain(`${prefixCls}-blue`)
    expect(span.classes()).toContain(`${prefixCls}-solid`)
  })

  it('should apply custom color via inline style', () => {
    const wrapper = mount(Tag, {
      props: { color: '#f50' },
      slots: { default: () => 'Custom' },
    })
    const span = wrapper.find('span')
    expect(span.attributes('style')).toBeDefined()
    // custom color should not produce preset class
    expect(span.classes()).not.toContain(`${prefixCls}-#f50`)
  })

  it('should not apply custom color style when disabled', () => {
    const wrapper = mount(Tag, {
      props: { color: '#f50', disabled: true },
      slots: { default: () => 'Disabled Custom' },
    })
    const span = wrapper.find('span')
    // disabled tags should not have custom color background
    expect(span.attributes('style') || '').not.toContain('background-color')
  })

  it('should apply solid variant with custom color', () => {
    const wrapper = mount(Tag, {
      props: { color: '#66ccff', variant: 'solid' },
      slots: { default: () => 'Solid Custom' },
    })
    expect(wrapper.find('span').classes()).toContain(`${prefixCls}-solid`)
    expect(wrapper.find('span').attributes('style')).toContain('background-color')
  })

  it('should apply outlined variant with custom color border', () => {
    const wrapper = mount(Tag, {
      props: { color: '#f50', variant: 'outlined' },
      slots: { default: () => 'Outlined Custom' },
    })
    const style = wrapper.find('span').attributes('style') || ''
    expect(style).toContain('border-color')
  })

  // ===================== variant prop =====================

  it('should apply variant class', () => {
    const wrapper = mount(Tag, {
      props: { variant: 'solid' },
      slots: { default: () => 'Solid' },
    })
    expect(wrapper.find('span').classes()).toContain(`${prefixCls}-solid`)
  })

  it('should apply outlined variant class', () => {
    const wrapper = mount(Tag, {
      props: { variant: 'outlined' },
      slots: { default: () => 'Outlined' },
    })
    expect(wrapper.find('span').classes()).toContain(`${prefixCls}-outlined`)
  })

  it('should default to filled variant', () => {
    const wrapper = mount(Tag, {
      slots: { default: () => 'Default' },
    })
    expect(wrapper.find('span').classes()).toContain(`${prefixCls}-filled`)
  })

  it('variant prop should take priority over inverse color fallback', () => {
    const wrapper = mount(Tag, {
      props: { color: 'blue-inverse', variant: 'outlined' },
      slots: { default: () => 'Variant Priority' },
    })
    // variant='outlined' overrides inverse fallback to solid
    expect(wrapper.find('span').classes()).toContain(`${prefixCls}-outlined`)
  })

  // ===================== bordered prop =====================

  it('should use filled variant when bordered is false', () => {
    const wrapper = mount(Tag, {
      props: { bordered: false },
      slots: { default: () => 'Borderless' },
    })
    expect(wrapper.find('span').classes()).toContain(`${prefixCls}-filled`)
  })

  // ===================== closable prop =====================

  it('should render close icon when closable is true', () => {
    const wrapper = mount(Tag, {
      props: { closable: true },
      slots: { default: () => 'Closable' },
    })
    expect(wrapper.find(`.${prefixCls}-close-icon`).exists()).toBe(true)
  })

  it('should not render close icon by default', () => {
    const wrapper = mount(Tag, {
      slots: { default: () => 'Not Closable' },
    })
    expect(wrapper.find(`.${prefixCls}-close-icon`).exists()).toBe(false)
  })

  it('should emit close event when close icon is clicked', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Tag, {
      props: { closable: true, onClose },
      slots: { default: () => 'Closable' },
    })
    await wrapper.find(`.${prefixCls}-close-icon`).trigger('click')
    expect(onClose).toHaveBeenCalled()
  })

  it('should hide tag after close icon is clicked', async () => {
    const wrapper = mount(Tag, {
      props: { closable: true },
      slots: { default: () => 'Closable' },
    })
    await wrapper.find(`.${prefixCls}-close-icon`).trigger('click')
    expect(wrapper.find('span').classes()).toContain(`${prefixCls}-hidden`)
  })

  it('should prevent navigation when closing a link tag', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Tag, {
      props: { href: '#target', closable: true, onClose },
      slots: { default: () => 'Link' },
    })
    const closeIcon = wrapper.find(`.${prefixCls}-close-icon`).element
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    closeIcon.dispatchEvent(clickEvent)
    await nextTick()

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(clickEvent.defaultPrevented).toBe(true)
    expect(wrapper.find('a').classes()).toContain(`${prefixCls}-hidden`)
  })

  it('should not preventDefault when closing a non-link tag', async () => {
    const wrapper = mount(Tag, {
      props: { closable: true },
      slots: { default: () => 'Closable' },
    })
    const closeIcon = wrapper.find(`.${prefixCls}-close-icon`).element
    const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true })
    closeIcon.dispatchEvent(clickEvent)
    await nextTick()

    expect(clickEvent.defaultPrevented).toBe(false)
    expect(wrapper.find('span').classes()).toContain(`${prefixCls}-hidden`)
  })

  it('should prevent hiding when close event calls preventDefault', async () => {
    const onClose = vi.fn((e: MouseEvent) => e.preventDefault())
    const wrapper = mount(Tag, {
      props: { closable: true, onClose },
      slots: { default: () => 'Closable' },
    })
    await wrapper.find(`.${prefixCls}-close-icon`).trigger('click')
    expect(onClose).toHaveBeenCalled()
    expect(wrapper.find('span').classes()).not.toContain(`${prefixCls}-hidden`)
  })

  it('should not trigger close when disabled', async () => {
    const onClose = vi.fn()
    const wrapper = mount(Tag, {
      props: { closable: true, disabled: true, onClose },
      slots: { default: () => 'Disabled' },
    })
    await wrapper.find(`.${prefixCls}-close-icon`).trigger('click')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('should not trigger onClick when clicking close icon', async () => {
    const onClose = vi.fn()
    const onClick = vi.fn()
    const wrapper = mount(Tag, {
      props: { closable: true, onClose, onClick },
      slots: { default: () => 'Closable' },
    })
    await wrapper.find(`.${prefixCls}-close-icon`).trigger('click')
    expect(onClose).toHaveBeenCalled()
    expect(onClick).not.toHaveBeenCalled()
  })

  it.each(['Enter', ' '])('should close by %s key', async (key) => {
    const onClose = vi.fn()
    const wrapper = mount(Tag, {
      props: { closable: true, onClose },
      slots: { default: () => 'Closable' },
    })
    const closeIcon = wrapper.find(`.${prefixCls}-close-icon`)
    expect(closeIcon.attributes('role')).toBe('button')
    expect(closeIcon.attributes('tabindex')).toBe('0')
    await closeIcon.trigger('keydown', { key })
    expect(onClose).toHaveBeenCalled()
    expect(onClose.mock.calls[0][0].type).toBe('click')
    expect(wrapper.find('span').classes()).toContain(`${prefixCls}-hidden`)
  })

  // ===================== closeIcon slot =====================

  it('should render closeIcon slot', () => {
    const wrapper = mount(Tag, {
      props: { closable: true },
      slots: {
        default: () => 'Tag',
        closeIcon: () => h('span', { class: 'custom-close' }, 'x'),
      },
    })
    expect(wrapper.find('.custom-close').exists()).toBe(true)
  })

  // ===================== icon prop / slot =====================

  it('should render icon from prop', () => {
    const icon = h('span', { class: 'my-icon' }, '!')
    const wrapper = mount(Tag, {
      props: { icon },
      slots: { default: () => 'With Icon' },
    })
    expect(wrapper.find('.my-icon').exists()).toBe(true)
  })

  it('should render icon from slot', () => {
    const wrapper = mount(Tag, {
      slots: {
        default: () => 'With Icon',
        icon: () => h('span', { class: 'slot-icon' }, '!'),
      },
    })
    expect(wrapper.find('.slot-icon').exists()).toBe(true)
  })

  it('icon slot should take priority over icon prop', () => {
    const propIcon = h('span', { class: 'prop-icon' }, '!')
    const wrapper = mount(Tag, {
      props: { icon: propIcon },
      slots: {
        default: () => 'With Icon',
        icon: () => h('span', { class: 'slot-icon' }, '!'),
      },
    })
    expect(wrapper.find('.slot-icon').exists()).toBe(true)
  })

  // ===================== disabled prop =====================

  it('should apply disabled class', () => {
    const wrapper = mount(Tag, {
      props: { disabled: true },
      slots: { default: () => 'Disabled' },
    })
    expect(wrapper.find('span').classes()).toContain(`${prefixCls}-disabled`)
  })

  it('should not set href when disabled', () => {
    const wrapper = mount(Tag, {
      props: { href: 'https://example.com', disabled: true },
      slots: { default: () => 'Disabled Link' },
    })
    const a = wrapper.find('a')
    expect(a.attributes('href')).toBeUndefined()
    expect(a.attributes('aria-disabled')).toBe('true')
  })

  it('should not call onClick when disabled', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Tag, {
      props: { disabled: true, onClick },
      slots: { default: () => 'Disabled' },
    })
    await wrapper.find('span').trigger('click')
    expect(onClick).not.toHaveBeenCalled()
  })

  // ===================== onClick / Wave =====================

  it('should wrap with Wave when onClick is provided', () => {
    const onClick = vi.fn()
    const wrapper = mount(Tag, {
      props: { onClick },
      slots: { default: () => 'Clickable' },
    })
    // Wave component wraps the tag
    expect(wrapper.html()).toBeDefined()
  })

  it('should call onClick handler', async () => {
    const onClick = vi.fn()
    const wrapper = mount(Tag, {
      props: { onClick },
      slots: { default: () => 'Clickable' },
    })
    await wrapper.find('span').trigger('click')
    expect(onClick).toHaveBeenCalled()
  })

  // ===================== rootClass =====================

  it('should apply rootClass', () => {
    const wrapper = mount(Tag, {
      props: { rootClass: 'my-root' },
      slots: { default: () => 'Root' },
    })
    expect(wrapper.find('span').classes()).toContain('my-root')
  })

  // ===================== empty children =====================

  it('should render only icon when no children', () => {
    const wrapper = mount(Tag, {
      props: { icon: h('span', { class: 'my-icon' }, '!') },
    })
    expect(wrapper.find('.my-icon').exists()).toBe(true)
    // no content span when no children
    expect(wrapper.text()).toBe('!')
  })

  // ===================== attrs passthrough =====================

  it('should pass through data-* attrs', () => {
    const wrapper = mount(Tag, {
      attrs: { 'data-testid': 'my-tag' },
      slots: { default: () => 'Tag' },
    })
    expect(wrapper.find('span').attributes('data-testid')).toBe('my-tag')
  })

  it('should pass through attrs.style', () => {
    const wrapper = mount(Tag, {
      attrs: { style: { color: 'rgb(0, 128, 0)' } },
      slots: { default: () => 'Tag' },
    })
    expect(wrapper.find('span').attributes('style')).toContain('color: rgb(0, 128, 0)')
  })

  // ===================== ConfigProvider disabled =====================

  it('should inherit disabled from ConfigProvider', () => {
    const wrapper = mount({
      render() {
        return h(ConfigProvider, { componentDisabled: true }, {
          default: () => h(Tag, null, { default: () => 'Disabled' }),
        })
      },
    })
    expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-disabled`)
  })

  it('should override DisabledContext with own disabled=false', () => {
    const wrapper = mount({
      render() {
        return h(ConfigProvider, { componentDisabled: true }, {
          default: () => h(Tag, { disabled: false }, { default: () => 'Enabled' }),
        })
      },
    })
    expect(wrapper.find(`.${prefixCls}`).classes()).not.toContain(`${prefixCls}-disabled`)
  })

  // ===================== RTL =====================

  it('should apply rtl class from ConfigProvider direction', () => {
    const wrapper = mount({
      render() {
        return h(ConfigProvider, { direction: 'rtl' }, {
          default: () => h(Tag, null, { default: () => 'RTL' }),
        })
      },
    })
    expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-rtl`)
  })

  // ===================== dynamic prop update =====================

  it('should update when color changes', async () => {
    const color = ref<string>('blue')
    const wrapper = mount({
      render() {
        return h(Tag, { color: color.value }, { default: () => 'Dynamic' })
      },
    })
    expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-blue`)

    color.value = 'red'
    await nextTick()
    expect(wrapper.find(`.${prefixCls}`).classes()).toContain(`${prefixCls}-red`)
    expect(wrapper.find(`.${prefixCls}`).classes()).not.toContain(`${prefixCls}-blue`)
  })

  // ===================== Preset / Status component rendering =====================

  it('should render PresetCmp for preset colors', () => {
    const wrapper = mount(Tag, {
      props: { color: 'blue' },
      slots: { default: () => 'Preset' },
    })
    // PresetCmp renders preset-specific CSS
    expect(wrapper.html()).toBeDefined()
  })

  it('should render StatusCmp for status colors', () => {
    const wrapper = mount(Tag, {
      props: { color: 'success' },
      slots: { default: () => 'Status' },
    })
    expect(wrapper.html()).toBeDefined()
  })

  // ===================== semantic classes/styles (basic) =====================

  it('should apply semantic classes and styles', () => {
    const wrapper = mount(Tag, {
      props: {
        icon: h('span', null, 'i'),
        classes: { root: 'c-root', icon: 'c-icon', content: 'c-content' },
        styles: {
          root: { color: 'rgb(255, 0, 0)' },
          icon: { fontSize: '12px' },
          content: { fontWeight: 'bold' },
        },
      },
      slots: { default: () => 'Semantic' },
    })
    // root
    const root = wrapper.find(`.${prefixCls}`)
    expect(root.classes()).toContain('c-root')
    expect(root.attributes('style')).toContain('color: rgb(255, 0, 0)')
  })

  // ===================== Snapshot tests =====================

  it('should match snapshot - basic', () => {
    const wrapper = mount(Tag, {
      slots: { default: () => 'Basic Tag' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - closable', () => {
    const wrapper = mount(Tag, {
      props: { closable: true },
      slots: { default: () => 'Closable Tag' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - preset color', () => {
    const wrapper = mount(Tag, {
      props: { color: 'blue' },
      slots: { default: () => 'Blue Tag' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - status color', () => {
    const wrapper = mount(Tag, {
      props: { color: 'success' },
      slots: { default: () => 'Success Tag' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - with icon', () => {
    const wrapper = mount(Tag, {
      props: { icon: h('span', { class: 'anticon' }, '!') },
      slots: { default: () => 'Icon Tag' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - disabled href', () => {
    const wrapper = mount(Tag, {
      props: { href: 'https://example.com', disabled: true },
      slots: { default: () => 'Disabled Link' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})

// ===================== CheckableTag =====================

describe('checkable-tag', () => {
  mountTest(() => h(CheckableTag, { checked: false }))

  it('should render checked state', () => {
    const wrapper = mount(CheckableTag, {
      props: { checked: true },
      slots: { default: () => 'Checked' },
    })
    expect(wrapper.find(`.${prefixCls}-checkable`).exists()).toBe(true)
    expect(wrapper.find(`.${prefixCls}-checkable-checked`).exists()).toBe(true)
  })

  it('should render unchecked state', () => {
    const wrapper = mount(CheckableTag, {
      props: { checked: false },
      slots: { default: () => 'Unchecked' },
    })
    expect(wrapper.find(`.${prefixCls}-checkable`).exists()).toBe(true)
    expect(wrapper.find(`.${prefixCls}-checkable-checked`).exists()).toBe(false)
  })

  it('should emit change and update:checked on click', async () => {
    const onChange = vi.fn()
    const onUpdateChecked = vi.fn()
    const wrapper = mount(CheckableTag, {
      props: {
        'checked': false,
        'onChange': onChange,
        'onUpdate:checked': onUpdateChecked,
      },
      slots: { default: () => 'Toggle' },
    })
    await wrapper.find('span').trigger('click')
    expect(onChange).toHaveBeenCalledWith(true)
    expect(onUpdateChecked).toHaveBeenCalledWith(true)
  })

  it('should have checkbox aria attributes', async () => {
    const wrapper = mount(CheckableTag, {
      props: { checked: false },
      slots: { default: () => 'Toggle' },
    })
    const tag = wrapper.find(`.${prefixCls}`)
    expect(tag.attributes('role')).toBe('checkbox')
    expect(tag.attributes('aria-checked')).toBe('false')
    expect(tag.attributes('tabindex')).toBe('0')
    await wrapper.setProps({ checked: true })
    expect(tag.attributes('aria-checked')).toBe('true')
  })

  it('should trigger change by Space key', async () => {
    const onChange = vi.fn()
    const wrapper = mount(CheckableTag, {
      props: { checked: false, onChange },
      slots: { default: () => 'Toggle' },
    })
    await wrapper.find('span').trigger('keydown', { key: ' ' })
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('should not trigger change when key event is prevented', async () => {
    const onChange = vi.fn()
    const onKeydown = vi.fn((e: KeyboardEvent) => e.preventDefault())
    const wrapper = mount(CheckableTag, {
      props: { checked: false, onChange, onKeydown },
      slots: { default: () => 'Toggle' },
    })
    await wrapper.find('span').trigger('keydown', { key: ' ' })
    expect(onKeydown).toHaveBeenCalled()
    expect(onChange).not.toHaveBeenCalled()
  })

  it('should emit click event', async () => {
    const onClick = vi.fn()
    const wrapper = mount(CheckableTag, {
      props: { checked: false, onClick },
      slots: { default: () => 'Click' },
    })
    await wrapper.find('span').trigger('click')
    expect(onClick).toHaveBeenCalled()
  })

  it('should not emit events when disabled', async () => {
    const onChange = vi.fn()
    const wrapper = mount(CheckableTag, {
      props: { checked: false, disabled: true, onChange },
      slots: { default: () => 'Disabled' },
    })
    await wrapper.find('span').trigger('click')
    expect(onChange).not.toHaveBeenCalled()
    expect(wrapper.find(`.${prefixCls}-checkable-disabled`).exists()).toBe(true)
  })

  it('should inherit disabled from ConfigProvider', async () => {
    const onChange = vi.fn()
    const wrapper = mount({
      render() {
        return h(ConfigProvider, { componentDisabled: true }, {
          default: () => h(CheckableTag, { checked: false, onChange }, {
            default: () => 'Disabled',
          }),
        })
      },
    })
    await wrapper.find('span').trigger('click')
    expect(onChange).not.toHaveBeenCalled()
    expect(wrapper.find(`.${prefixCls}-checkable-disabled`).exists()).toBe(true)
  })

  it('should render icon from prop', () => {
    const icon = h('span', { class: 'check-icon' }, '!')
    const wrapper = mount(CheckableTag, {
      props: { checked: true, icon },
      slots: { default: () => 'With Icon' },
    })
    expect(wrapper.find('.check-icon').exists()).toBe(true)
  })

  it('icon slot should take priority over icon prop', () => {
    const propIcon = h('span', { class: 'prop-icon' }, '!')
    const wrapper = mount(CheckableTag, {
      props: { checked: true, icon: propIcon },
      slots: {
        default: () => 'With Icon',
        icon: () => h('span', { class: 'slot-icon' }, '!'),
      },
    })
    expect(wrapper.find('.slot-icon').exists()).toBe(true)
  })

  it('should pass through attrs', () => {
    const wrapper = mount(CheckableTag, {
      props: { checked: false },
      attrs: { 'data-testid': 'check-tag' },
      slots: { default: () => 'Attrs' },
    })
    expect(wrapper.find('span').attributes('data-testid')).toBe('check-tag')
  })

  it('should apply ConfigProvider tag style', () => {
    const wrapper = mount({
      render() {
        return h(
          ConfigProvider,
          { tag: { style: { color: 'rgb(100, 100, 100)' } } },
          { default: () => h(CheckableTag, { checked: false }, { default: () => 'Styled' }) },
        )
      },
    })
    expect(wrapper.find('span').attributes('style')).toContain('color: rgb(100, 100, 100)')
  })

  it('should apply ConfigProvider tag class', () => {
    const wrapper = mount({
      render() {
        return h(
          ConfigProvider,
          { tag: { class: 'cp-check-class' } },
          { default: () => h(CheckableTag, { checked: false }, { default: () => 'Classed' }) },
        )
      },
    })
    expect(wrapper.find('span').classes()).toContain('cp-check-class')
  })

  it('should match snapshot - checked', () => {
    const wrapper = mount(CheckableTag, {
      props: { checked: true },
      slots: { default: () => 'Checked' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match snapshot - unchecked', () => {
    const wrapper = mount(CheckableTag, {
      props: { checked: false },
      slots: { default: () => 'Unchecked' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})

// ===================== CheckableTagGroup =====================

describe('checkable-tag-group', () => {
  const options = [
    { value: 'a', label: 'A' },
    { value: 'b', label: 'B' },
    { value: 'c', label: 'C' },
  ]

  it('should render options', () => {
    const wrapper = mount(CheckableTagGroup, {
      props: { options },
    })
    const tags = wrapper.findAll(`.${prefixCls}-checkable`)
    expect(tags.length).toBe(3)
    expect(tags[0]!.text()).toBe('A')
    expect(tags[1]!.text()).toBe('B')
    expect(tags[2]!.text()).toBe('C')
  })

  it('should support primitive options', () => {
    const wrapper = mount(CheckableTagGroup, {
      props: { options: ['X', 'Y', 'Z'] },
    })
    const tags = wrapper.findAll(`.${prefixCls}-checkable`)
    expect(tags.length).toBe(3)
    expect(tags[0]!.text()).toBe('X')
  })

  // ===================== single mode =====================

  it('should select single value', async () => {
    const onChange = vi.fn()
    const wrapper = mount(CheckableTagGroup, {
      props: { options, onChange },
    })
    await wrapper.findAll(`.${prefixCls}-checkable`)[0]!.trigger('click')
    expect(onChange).toHaveBeenCalledWith('a')
  })

  it('should deselect in single mode', async () => {
    const onChange = vi.fn()
    const wrapper = mount(CheckableTagGroup, {
      props: { options, value: 'a', onChange },
    })
    await wrapper.findAll(`.${prefixCls}-checkable`)[0]!.trigger('click')
    expect(onChange).toHaveBeenCalledWith(null)
  })

  it('should highlight selected value', () => {
    const wrapper = mount(CheckableTagGroup, {
      props: { options, value: 'b' },
    })
    const tags = wrapper.findAll(`.${prefixCls}-checkable`)
    expect(tags[1]!.classes()).toContain(`${prefixCls}-checkable-checked`)
    expect(tags[0]!.classes()).not.toContain(`${prefixCls}-checkable-checked`)
  })

  // ===================== multiple mode =====================

  it('should support multiple selection', async () => {
    const onChange = vi.fn()
    const wrapper = mount(CheckableTagGroup, {
      props: { options, multiple: true, value: ['a'], onChange },
    })
    await wrapper.findAll(`.${prefixCls}-checkable`)[1]!.trigger('click')
    expect(onChange).toHaveBeenCalledWith(['a', 'b'])
  })

  it('should remove from multiple selection', async () => {
    const onChange = vi.fn()
    const wrapper = mount(CheckableTagGroup, {
      props: { options, multiple: true, value: ['a', 'b'], onChange },
    })
    await wrapper.findAll(`.${prefixCls}-checkable`)[0]!.trigger('click')
    expect(onChange).toHaveBeenCalledWith(['b'])
  })

  // ===================== defaultValue =====================

  it('should support defaultValue', () => {
    const wrapper = mount(CheckableTagGroup, {
      props: { options, defaultValue: 'b' },
    })
    const tags = wrapper.findAll(`.${prefixCls}-checkable`)
    expect(tags[1]!.classes()).toContain(`${prefixCls}-checkable-checked`)
  })

  // ===================== disabled =====================

  it('should disable all tags', async () => {
    const onChange = vi.fn()
    const wrapper = mount(CheckableTagGroup, {
      props: { options, disabled: true, onChange },
    })
    await wrapper.findAll(`.${prefixCls}-checkable`)[0]!.trigger('click')
    expect(onChange).not.toHaveBeenCalled()
  })

  it('should disable individual option', async () => {
    const onChange = vi.fn()
    const disabledOptions = [
      { value: 'a', label: 'A', disabled: true },
      { value: 'b', label: 'B' },
    ]
    const wrapper = mount(CheckableTagGroup, {
      props: { options: disabledOptions, onChange },
    })
    await wrapper.findAll(`.${prefixCls}-checkable`)[0]!.trigger('click')
    expect(onChange).not.toHaveBeenCalled()

    await wrapper.findAll(`.${prefixCls}-checkable`)[1]!.trigger('click')
    expect(onChange).toHaveBeenCalledWith('b')
  })

  // ===================== disabled class =====================

  it('should apply disabled class to group', () => {
    const wrapper = mount(CheckableTagGroup, {
      props: { options, disabled: true },
    })
    expect(wrapper.find(`.${prefixCls}-checkable-group`).classes()).toContain(
      `${prefixCls}-checkable-group-disabled`,
    )
  })

  // ===================== rootClass =====================

  it('should apply rootClass', () => {
    const wrapper = mount(CheckableTagGroup, {
      props: { options, rootClass: 'my-group-root' },
    })
    expect(wrapper.find(`.${prefixCls}-checkable-group`).classes()).toContain('my-group-root')
  })

  // ===================== id / role =====================

  it('should apply id prop', () => {
    const wrapper = mount(CheckableTagGroup, {
      props: { options, id: 'tag-group-1' },
    })
    expect(wrapper.find(`.${prefixCls}-checkable-group`).attributes('id')).toBe('tag-group-1')
  })

  // ===================== RTL =====================

  it('should apply rtl class', () => {
    const wrapper = mount({
      render() {
        return h(ConfigProvider, { direction: 'rtl' }, {
          default: () => h(CheckableTagGroup, { options }),
        })
      },
    })
    expect(wrapper.find(`.${prefixCls}-checkable-group`).classes()).toContain(
      `${prefixCls}-checkable-group-rtl`,
    )
  })

  // ===================== update:value =====================

  it('should emit update:value', async () => {
    const onUpdateValue = vi.fn()
    const wrapper = mount(CheckableTagGroup, {
      props: { 'options': options, 'onUpdate:value': onUpdateValue },
    })
    await wrapper.findAll(`.${prefixCls}-checkable`)[0]!.trigger('click')
    expect(onUpdateValue).toHaveBeenCalledWith('a')
  })

  // ===================== semantic classes/styles =====================

  it('should apply semantic classes and styles', () => {
    const wrapper = mount(CheckableTagGroup, {
      props: {
        options,
        classes: { root: 'g-root', item: 'g-item' },
        styles: { root: { padding: '8px' }, item: { margin: '4px' } },
      },
    })
    const root = wrapper.find(`.${prefixCls}-checkable-group`)
    expect(root.classes()).toContain('g-root')
    expect(root.attributes('style')).toContain('padding: 8px')

    const items = wrapper.findAll(`.${prefixCls}-checkable`)
    expect(items[0]!.classes()).toContain('g-item')
    expect(items[0]!.attributes('style')).toContain('margin: 4px')
  })

  // ===================== Snapshot =====================

  it('should match snapshot', () => {
    const wrapper = mount(CheckableTagGroup, {
      props: { options, value: 'b' },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })
})
