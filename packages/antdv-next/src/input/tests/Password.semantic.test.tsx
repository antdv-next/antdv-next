import { describe, expect, it, vi } from 'vitest'
import Input from '..'
import { mount } from '/@tests/utils'

const { Password } = Input as any

describe('password.Semantic', () => {
  it('should support classNames as functions', () => {
    const classNamesFn = vi.fn(() => ({
      root: 'custom-root',
      prefix: 'custom-prefix',
      suffix: 'custom-suffix',
      input: 'custom-input',
      count: 'custom-count',
    }))

    const wrapper = mount(Password, {
      props: {
        prefix: 'Icon',
        value: 'secret',
        showCount: true,
        maxlength: 20,
        classes: classNamesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()

    // root
    const rootElement = wrapper.find('.ant-input-affix-wrapper')
    expect(rootElement.exists()).toBe(true)
    expect(rootElement.classes()).toContain('custom-root')

    // prefix
    const prefixElement = wrapper.find('.ant-input-prefix')
    expect(prefixElement.exists()).toBe(true)
    expect(prefixElement.classes()).toContain('custom-prefix')

    // suffix
    const suffixElement = wrapper.find('.ant-input-suffix')
    expect(suffixElement.exists()).toBe(true)
    expect(suffixElement.classes()).toContain('custom-suffix')

    // input
    const inputElement = wrapper.find('.ant-input')
    expect(inputElement.exists()).toBe(true)
    expect(inputElement.classes()).toContain('custom-input')

    // count
    const countElement = wrapper.find('.ant-input-show-count-suffix')
    expect(countElement.exists()).toBe(true)
    expect(countElement.classes()).toContain('custom-count')
  })

  it('should support object classNames and styles', () => {
    const wrapper = mount(Password, {
      props: {
        prefix: 'Icon',
        value: 'secret',
        showCount: true,
        maxlength: 20,
        classes: {
          root: 'custom-root',
          prefix: 'custom-prefix',
          suffix: 'custom-suffix',
          input: 'custom-input',
          count: 'custom-count',
        },
        styles: {
          root: { padding: '10px' },
          prefix: { marginRight: '8px' },
          suffix: { marginLeft: '8px' },
          input: { lineHeight: '1.5' },
          count: { color: '#999' },
        },
      },
    })

    // root
    const rootElement = wrapper.find('.ant-input-affix-wrapper')
    expect(rootElement.exists()).toBe(true)
    expect(rootElement.classes()).toContain('custom-root')
    expect(rootElement.attributes('style')).toContain('padding: 10px')

    // prefix
    const prefixElement = wrapper.find('.ant-input-prefix')
    expect(prefixElement.exists()).toBe(true)
    expect(prefixElement.classes()).toContain('custom-prefix')
    expect(prefixElement.attributes('style')).toContain('margin-right: 8px')

    // suffix
    const suffixElement = wrapper.find('.ant-input-suffix')
    expect(suffixElement.exists()).toBe(true)
    expect(suffixElement.classes()).toContain('custom-suffix')
    expect(suffixElement.attributes('style')).toContain('margin-left: 8px')

    // input
    const inputElement = wrapper.find('.ant-input')
    expect(inputElement.exists()).toBe(true)
    expect(inputElement.classes()).toContain('custom-input')
    expect(inputElement.attributes('style')).toContain('line-height: 1.5')

    // count
    const countElement = wrapper.find('.ant-input-show-count-suffix')
    expect(countElement.exists()).toBe(true)
    expect(countElement.classes()).toContain('custom-count')
    expect(countElement.attributes('style')).toContain('color: rgb(153, 153, 153)')
  })
})
