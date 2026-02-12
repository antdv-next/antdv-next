import { describe, expect, it, vi } from 'vitest'
import Input from '..'
import { mount } from '/@tests/utils'

const { Search } = Input as any

describe('search.Semantic', () => {
  it('should support classNames as functions', () => {
    const classNamesFn = vi.fn(() => ({
      root: 'custom-root',
      input: 'custom-input',
      prefix: 'custom-prefix',
      suffix: 'custom-suffix',
      count: 'custom-count',
    }))

    const wrapper = mount(Search, {
      props: {
        prefix: 'Icon',
        value: 'test',
        showCount: true,
        maxlength: 20,
        classes: classNamesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()

    // root
    const rootElement = wrapper.find('.ant-input-search')
    expect(rootElement.exists()).toBe(true)
    expect(rootElement.classes()).toContain('custom-root')

    // input
    const inputElement = wrapper.find('.ant-input')
    expect(inputElement.exists()).toBe(true)
    expect(inputElement.classes()).toContain('custom-input')

    // prefix
    const prefixElement = wrapper.find('.ant-input-prefix')
    expect(prefixElement.exists()).toBe(true)
    expect(prefixElement.classes()).toContain('custom-prefix')

    // suffix
    const suffixElement = wrapper.find('.ant-input-suffix')
    expect(suffixElement.exists()).toBe(true)
    expect(suffixElement.classes()).toContain('custom-suffix')

    // count
    const countElement = wrapper.find('.ant-input-show-count-suffix')
    expect(countElement.exists()).toBe(true)
    expect(countElement.classes()).toContain('custom-count')
  })

  it('should support object classNames and styles', () => {
    const wrapper = mount(Search, {
      props: {
        prefix: 'Icon',
        value: 'test',
        showCount: true,
        maxlength: 20,
        classes: {
          root: 'custom-root',
          input: 'custom-input',
          prefix: 'custom-prefix',
          suffix: 'custom-suffix',
          count: 'custom-count',
        },
        styles: {
          root: { padding: '10px' },
          input: { lineHeight: '1.5' },
          prefix: { marginRight: '8px' },
          suffix: { marginLeft: '8px' },
          count: { color: '#999' },
        },
      },
    })

    // root
    const rootElement = wrapper.find('.ant-input-search')
    expect(rootElement.exists()).toBe(true)
    expect(rootElement.classes()).toContain('custom-root')
    expect(rootElement.attributes('style')).toContain('padding: 10px')

    // input
    const inputElement = wrapper.find('.ant-input')
    expect(inputElement.exists()).toBe(true)
    expect(inputElement.classes()).toContain('custom-input')
    expect(inputElement.attributes('style')).toContain('line-height: 1.5')

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

    // count
    const countElement = wrapper.find('.ant-input-show-count-suffix')
    expect(countElement.exists()).toBe(true)
    expect(countElement.classes()).toContain('custom-count')
    expect(countElement.attributes('style')).toContain('color: rgb(153, 153, 153)')
  })

  it('should support button classNames and styles', () => {
    const wrapper = mount(Search, {
      props: {
        enterButton: true,
        classes: {
          button: {
            root: 'custom-button',
            icon: 'custom-icon',
          },
        },
        styles: {
          button: {
            root: { backgroundColor: 'red' },
            icon: { fontSize: '16px' },
          },
        },
      },
    })

    // button root
    const buttonElement = wrapper.find('.ant-btn')
    expect(buttonElement.exists()).toBe(true)
    expect(buttonElement.classes()).toContain('custom-button')
    expect(buttonElement.attributes('style')).toContain('background-color: red')

    // button icon
    const iconElement = wrapper.find('.ant-btn-icon')
    expect(iconElement.exists()).toBe(true)
    expect(iconElement.classes()).toContain('custom-icon')
    expect(iconElement.attributes('style')).toContain('font-size: 16px')
  })

  it('should support button content classNames and styles', () => {
    const wrapper = mount(Search, {
      props: {
        enterButton: 'Search',
        classes: {
          button: {
            root: 'custom-button',
            content: 'custom-content',
          },
        },
        styles: {
          button: {
            root: { backgroundColor: 'blue' },
            content: { fontWeight: 'bold' },
          },
        },
      },
    })

    // button root
    const buttonElement = wrapper.find('.ant-btn')
    expect(buttonElement.exists()).toBe(true)
    expect(buttonElement.classes()).toContain('custom-button')
    expect(buttonElement.attributes('style')).toContain('background-color: blue')

    // button content (class applied directly to span)
    const contentElement = wrapper.find('.custom-content')
    expect(contentElement.exists()).toBe(true)
    expect(contentElement.attributes('style')).toContain('font-weight: bold')
  })
})
