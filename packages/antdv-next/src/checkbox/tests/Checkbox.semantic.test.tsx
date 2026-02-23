import { describe, expect, it, vi } from 'vitest'
import Checkbox from '..'
import { mount } from '/@tests/utils'

describe('checkbox semantic DOM', () => {
  it('should support object classNames and styles', () => {
    const wrapper = mount(Checkbox, {
      props: {
        checked: true,
        classes: {
          root: 'custom-root',
          icon: 'custom-icon',
          label: 'custom-label',
        },
        styles: {
          root: { padding: '10px' },
          icon: { width: '20px' },
          label: { fontSize: '14px' },
        },
      },
      slots: { default: () => 'Checkbox' },
    })

    // root
    const root = wrapper.find('.ant-checkbox-wrapper')
    expect(root.classes()).toContain('custom-root')
    expect(root.attributes('style')).toContain('padding: 10px')

    // icon
    const icon = wrapper.find('.ant-checkbox')
    expect(icon.classes()).toContain('custom-icon')
    expect(icon.attributes('style')).toContain('width: 20px')

    // label
    const label = wrapper.find('.ant-checkbox-label')
    expect(label.exists()).toBe(true)
    expect(label.classes()).toContain('custom-label')
    expect(label.attributes('style')).toContain('font-size: 14px')
  })

  it('should support classNames as functions', async () => {
    const classNamesFn = vi.fn(() => ({
      root: 'fn-root',
      icon: 'fn-icon',
      label: 'fn-label',
    }))

    const stylesFn = vi.fn(() => ({
      root: { padding: '5px' },
    }))

    const wrapper = mount(Checkbox, {
      props: {
        classes: classNamesFn,
        styles: stylesFn,
      },
      slots: { default: () => 'Checkbox' },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const root = wrapper.find('.ant-checkbox-wrapper')
    expect(root.classes()).toContain('fn-root')
    expect(root.attributes('style')).toContain('padding: 5px')

    const icon = wrapper.find('.ant-checkbox')
    expect(icon.classes()).toContain('fn-icon')

    const label = wrapper.find('.ant-checkbox-label')
    expect(label.classes()).toContain('fn-label')
  })

  it('should support classNames with disabled state', () => {
    const wrapper = mount(Checkbox, {
      props: {
        disabled: true,
        classes: {
          root: 'custom-disabled-root',
          icon: 'custom-disabled-icon',
        },
      },
      slots: { default: () => 'Checkbox' },
    })

    const root = wrapper.find('.ant-checkbox-wrapper')
    expect(root.classes()).toContain('custom-disabled-root')
    expect(root.classes()).toContain('ant-checkbox-wrapper-disabled')

    const icon = wrapper.find('.ant-checkbox')
    expect(icon.classes()).toContain('custom-disabled-icon')
  })
})
