import { describe, expect, it, vi } from 'vitest'
import InputNumber from '..'
import { mount } from '/@tests/utils'

describe('inputNumber.Semantic', () => {
  it('should support classNames as functions', () => {
    const classNamesFn = vi.fn(() => ({
      root: 'custom-root',
      prefix: 'custom-prefix',
      suffix: 'custom-suffix',
      input: 'custom-input',
      actions: 'custom-actions',
      action: 'custom-action',
    }))

    const wrapper = mount(InputNumber, {
      props: {
        prefix: '$',
        suffix: 'RMB',
        controls: true,
        classes: classNamesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()

    // root
    const rootElement = wrapper.find('.ant-input-number')
    expect(rootElement.exists()).toBe(true)
    expect(rootElement.classes()).toContain('custom-root')

    // prefix
    const prefixElement = wrapper.find('.ant-input-number-prefix')
    expect(prefixElement.exists()).toBe(true)
    expect(prefixElement.classes()).toContain('custom-prefix')

    // suffix
    const suffixElement = wrapper.find('.ant-input-number-suffix')
    expect(suffixElement.exists()).toBe(true)
    expect(suffixElement.classes()).toContain('custom-suffix')

    // input
    const inputElement = wrapper.find('.ant-input-number-input')
    expect(inputElement.exists()).toBe(true)
    expect(inputElement.classes()).toContain('custom-input')

    // actions
    const actionsElement = wrapper.find('.ant-input-number-actions')
    expect(actionsElement.exists()).toBe(true)
    expect(actionsElement.classes()).toContain('custom-actions')

    // action (handler buttons)
    const actionElements = wrapper.findAll('.ant-input-number-action')
    expect(actionElements.length).toBeGreaterThan(0)
    actionElements.forEach((el) => {
      expect(el.classes()).toContain('custom-action')
    })
  })

  it('should support object classNames and styles', () => {
    const wrapper = mount(InputNumber, {
      props: {
        prefix: '$',
        suffix: 'RMB',
        controls: true,
        classes: {
          root: 'custom-root',
          prefix: 'custom-prefix',
          suffix: 'custom-suffix',
          input: 'custom-input',
          actions: 'custom-actions',
          action: 'custom-action',
        },
        styles: {
          root: { padding: '10px' },
          prefix: { marginRight: '8px' },
          suffix: { marginLeft: '8px' },
          input: { lineHeight: '1.5' },
          actions: { width: '24px' },
          action: { height: '12px' },
        },
      },
    })

    // root
    const rootElement = wrapper.find('.ant-input-number')
    expect(rootElement.exists()).toBe(true)
    expect(rootElement.classes()).toContain('custom-root')
    expect(rootElement.attributes('style')).toContain('padding: 10px')

    // prefix
    const prefixElement = wrapper.find('.ant-input-number-prefix')
    expect(prefixElement.exists()).toBe(true)
    expect(prefixElement.classes()).toContain('custom-prefix')
    expect(prefixElement.attributes('style')).toContain('margin-right: 8px')

    // suffix
    const suffixElement = wrapper.find('.ant-input-number-suffix')
    expect(suffixElement.exists()).toBe(true)
    expect(suffixElement.classes()).toContain('custom-suffix')
    expect(suffixElement.attributes('style')).toContain('margin-left: 8px')

    // input
    const inputElement = wrapper.find('.ant-input-number-input')
    expect(inputElement.exists()).toBe(true)
    expect(inputElement.classes()).toContain('custom-input')
    expect(inputElement.attributes('style')).toContain('line-height: 1.5')

    // actions
    const actionsElement = wrapper.find('.ant-input-number-actions')
    expect(actionsElement.exists()).toBe(true)
    expect(actionsElement.classes()).toContain('custom-actions')
    expect(actionsElement.attributes('style')).toContain('width: 24px')

    // action (handler buttons)
    const actionElements = wrapper.findAll('.ant-input-number-action')
    expect(actionElements.length).toBeGreaterThan(0)
    actionElements.forEach((el) => {
      expect(el.classes()).toContain('custom-action')
      expect(el.attributes('style')).toContain('height: 12px')
    })
  })

  it('should support classNames and styles as functions with props', () => {
    const classNamesFn = vi.fn((info: { props: any }) => {
      if (info.props.size === 'large') {
        return { root: 'large-input-number' }
      }
      return { root: 'default-input-number' }
    })

    const wrapper = mount(InputNumber, {
      props: {
        size: 'large',
        classes: classNamesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    const rootElement = wrapper.find('.ant-input-number')
    expect(rootElement.classes()).toContain('large-input-number')
  })
})
