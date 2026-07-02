import { describe, expect, it, vi } from 'vitest'
import Input from '..'
import ConfigProvider from '../../config-provider'
import { expectSemanticRootStylePriority, semanticRootStylePriority } from '/@tests/shared/semanticStylePriority'
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

  // https://github.com/ant-design/ant-design/pull/58474
  it('aligns root semantic style priority', () => {
    const wrapper = mount(() => (
      <ConfigProvider textArea={{ style: semanticRootStylePriority.contextStyle, styles: semanticRootStylePriority.contextStyles }}>
        <TextArea style={semanticRootStylePriority.style} styles={semanticRootStylePriority.styles} />
      </ConfigProvider>
    ), { attachTo: document.body })
    expectSemanticRootStylePriority(wrapper.find('.ant-input').element)
    wrapper.unmount()
  })
})
