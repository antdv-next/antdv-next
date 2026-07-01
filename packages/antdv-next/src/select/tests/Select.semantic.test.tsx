import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Select from '..'
import ConfigProvider from '../../config-provider'
import { expectSemanticRootStylePriority, semanticRootStylePriority } from '/@tests/shared/semanticStylePriority'
import { mount } from '/@tests/utils'

describe('select.Semantic', () => {
  it('should support classNames as functions', async () => {
    const classNamesFn = vi.fn(() => ({
      root: 'custom-select',
      prefix: 'custom-prefix',
      input: 'custom-input',
      content: 'custom-content',
      clear: 'custom-clear',
      suffix: 'custom-suffix',
    }))

    const wrapper = mount(Select, {
      props: {
        prefix: 'Icon',
        value: 'test',
        options: [{ value: 'test', label: 'Test' }],
        allowClear: true,
        classes: classNamesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()

    // root
    const rootElement = wrapper.find('.ant-select')
    expect(rootElement.exists()).toBe(true)
    expect(rootElement.classes()).toContain('custom-select')

    // prefix
    const prefixElement = wrapper.find('.ant-select-prefix')
    expect(prefixElement.exists()).toBe(true)
    expect(prefixElement.classes()).toContain('custom-prefix')

    // input
    const inputElement = wrapper.find('.ant-select-input')
    expect(inputElement.exists()).toBe(true)
    expect(inputElement.classes()).toContain('custom-input')

    // content
    const contentElement = wrapper.find('.ant-select-content')
    expect(contentElement.exists()).toBe(true)
    expect(contentElement.classes()).toContain('custom-content')

    // clear
    const clearElement = wrapper.find('.ant-select-clear')
    expect(clearElement.exists()).toBe(true)
    expect(clearElement.classes()).toContain('custom-clear')

    // suffix
    const suffixElement = wrapper.find('.ant-select-suffix')
    expect(suffixElement.exists()).toBe(true)
    expect(suffixElement.classes()).toContain('custom-suffix')
  })

  it('should support object classNames and styles', () => {
    const wrapper = mount(Select, {
      props: {
        prefix: 'Icon',
        value: 'test',
        options: [{ value: 'test', label: 'Test' }],
        allowClear: true,
        classes: {
          root: 'custom-root',
          prefix: 'custom-prefix',
          input: 'custom-input',
          content: 'custom-content',
          clear: 'custom-clear',
          suffix: 'custom-suffix',
        },
        styles: {
          root: { padding: '10px' },
          prefix: { marginRight: '8px' },
          input: { lineHeight: '1.5' },
          content: { minHeight: '100px' },
          clear: { fontSize: '16px' },
          suffix: { width: '20px' },
        },
      },
    })

    // root
    const rootElement = wrapper.find('.ant-select')
    expect(rootElement.exists()).toBe(true)
    expect(rootElement.classes()).toContain('custom-root')
    expect(rootElement.attributes('style')).toContain('padding: 10px')

    // prefix
    const prefixElement = wrapper.find('.ant-select-prefix')
    expect(prefixElement.exists()).toBe(true)
    expect(prefixElement.classes()).toContain('custom-prefix')
    expect(prefixElement.attributes('style')).toContain('margin-right: 8px')

    // input
    const inputElement = wrapper.find('.ant-select-input')
    expect(inputElement.exists()).toBe(true)
    expect(inputElement.classes()).toContain('custom-input')
    expect(inputElement.attributes('style')).toContain('line-height: 1.5')

    // content
    const contentElement = wrapper.find('.ant-select-content')
    expect(contentElement.exists()).toBe(true)
    expect(contentElement.classes()).toContain('custom-content')
    expect(contentElement.attributes('style')).toContain('min-height: 100px')

    // clear
    const clearElement = wrapper.find('.ant-select-clear')
    expect(clearElement.exists()).toBe(true)
    expect(clearElement.classes()).toContain('custom-clear')
    expect(clearElement.attributes('style')).toContain('font-size: 16px')

    // suffix
    const suffixElement = wrapper.find('.ant-select-suffix')
    expect(suffixElement.exists()).toBe(true)
    expect(suffixElement.classes()).toContain('custom-suffix')
    expect(suffixElement.attributes('style')).toContain('width: 20px')
  })

  it('should support placeholder classNames and styles', () => {
    const wrapper = mount(Select, {
      props: {
        placeholder: 'Please select',
        classes: {
          placeholder: 'custom-placeholder',
        },
        styles: {
          placeholder: { color: '#999' },
        },
      },
    })

    const placeholderElement = wrapper.find('.ant-select-placeholder')
    expect(placeholderElement.exists()).toBe(true)
    expect(placeholderElement.classes()).toContain('custom-placeholder')
    expect(placeholderElement.attributes('style')).toContain('color: rgb(153, 153, 153)')
  })

  it('should support popup semantic classNames and styles', async () => {
    const wrapper = mount(Select, {
      props: {
        open: true,
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' },
        ],
        classes: {
          popup: {
            root: 'custom-popup-root',
            listItem: 'custom-popup-listItem',
          },
        },
        styles: {
          popup: {
            root: { maxHeight: '200px' },
            listItem: { margin: '4px' },
          },
        },
      },
      attachTo: document.body,
    })

    await nextTick()

    // popup.root
    const popupElement = document.querySelector('.ant-select-dropdown')
    expect(popupElement).toBeTruthy()
    expect(popupElement?.classList.contains('custom-popup-root')).toBe(true)
    const popupStyle = (popupElement as HTMLElement)?.style
    expect(popupStyle?.maxHeight).toBe('200px')

    // popup.listItem
    const listItems = document.querySelectorAll('.ant-select-item-option')
    expect(listItems.length).toBe(2)
    listItems.forEach((item) => {
      expect(item.classList.contains('custom-popup-listItem')).toBe(true)
      const itemStyle = (item as HTMLElement).style
      expect(itemStyle.margin).toBe('4px')
    })

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should support multiple mode semantic classNames and styles', async () => {
    const wrapper = mount(Select, {
      props: {
        mode: 'multiple',
        value: ['jack'],
        options: [
          { value: 'jack', label: 'Jack' },
          { value: 'lucy', label: 'Lucy' },
        ],
        classes: {
          item: 'custom-item',
          itemContent: 'custom-item-content',
          itemRemove: 'custom-item-remove',
        },
        styles: {
          item: { backgroundColor: '#f0f0f0' },
          itemContent: { fontWeight: 'bold' },
          itemRemove: { color: 'red' },
        },
      },
    })

    await nextTick()

    // item
    const itemElement = wrapper.find('.ant-select-selection-item')
    expect(itemElement.exists()).toBe(true)
    expect(itemElement.classes()).toContain('custom-item')
    expect(itemElement.attributes('style')).toContain('background-color: rgb(240, 240, 240)')

    // itemContent
    const itemContentElement = wrapper.find('.ant-select-selection-item-content')
    expect(itemContentElement.exists()).toBe(true)
    expect(itemContentElement.classes()).toContain('custom-item-content')
    expect(itemContentElement.attributes('style')).toContain('font-weight: bold')

    // itemRemove
    const itemRemoveElement = wrapper.find('.ant-select-selection-item-remove')
    expect(itemRemoveElement.exists()).toBe(true)
    expect(itemRemoveElement.classes()).toContain('custom-item-remove')
    expect(itemRemoveElement.attributes('style')).toContain('color: red')
  })

  // https://github.com/ant-design/ant-design/pull/58474
  it('aligns root semantic style priority', () => {
    const wrapper = mount(() => (
      <ConfigProvider select={{ style: semanticRootStylePriority.contextStyle, styles: semanticRootStylePriority.contextStyles }}>
        <Select style={semanticRootStylePriority.style} styles={semanticRootStylePriority.styles} />
      </ConfigProvider>
    ), { attachTo: document.body })

    expectSemanticRootStylePriority(wrapper.find('.ant-select').element)
    wrapper.unmount()
  })
})
