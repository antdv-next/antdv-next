import { describe, expect, it, vi } from 'vitest'
import Input from '..'
import { mount } from '/@tests/utils'

const { TextArea } = Input as any

describe('textArea.Semantic', () => {
  it('should support classNames as functions', () => {
    const classNamesFn = vi.fn(() => ({
      root: 'custom-root',
      textarea: 'custom-textarea',
      count: 'custom-count',
    }))

    const wrapper = mount(TextArea, {
      props: {
        value: 'test',
        showCount: true,
        maxlength: 100,
        classes: classNamesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()

    // root
    const rootElement = wrapper.find('.ant-input-textarea-affix-wrapper')
    expect(rootElement.exists()).toBe(true)
    expect(rootElement.classes()).toContain('custom-root')

    // textarea
    const textareaElement = wrapper.find('.ant-input')
    expect(textareaElement.exists()).toBe(true)
    expect(textareaElement.classes()).toContain('custom-textarea')
  })

  it('should support object classNames and styles', () => {
    const wrapper = mount(TextArea, {
      props: {
        value: 'test',
        showCount: true,
        maxlength: 100,
        classes: {
          root: 'custom-root',
          textarea: 'custom-textarea',
          count: 'custom-count',
        },
        styles: {
          root: { padding: '10px' },
          textarea: { lineHeight: '1.5' },
          count: { color: '#999' },
        },
      },
    })

    // root
    const rootElement = wrapper.find('.ant-input-textarea-affix-wrapper')
    expect(rootElement.exists()).toBe(true)
    expect(rootElement.classes()).toContain('custom-root')
    expect(rootElement.attributes('style')).toContain('padding: 10px')

    // textarea
    const textareaElement = wrapper.find('.ant-input')
    expect(textareaElement.exists()).toBe(true)
    expect(textareaElement.classes()).toContain('custom-textarea')
    expect(textareaElement.attributes('style')).toContain('line-height: 1.5')
  })
})
