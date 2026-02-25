import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Cascader from '..'
import { mount } from '/@tests/utils'

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      { value: 'hangzhou', label: 'Hangzhou' },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      { value: 'nanjing', label: 'Nanjing' },
    ],
  },
]

describe('cascader semantic DOM', () => {
  it('should support classNames as functions', async () => {
    const classNamesFn = vi.fn(() => ({
      root: 'custom-cascader',
      prefix: 'custom-prefix',
      input: 'custom-input',
      content: 'custom-content',
      clear: 'custom-clear',
      suffix: 'custom-suffix',
    }))

    const wrapper = mount(Cascader, {
      props: {
        prefix: 'Icon',
        value: ['zhejiang', 'hangzhou'],
        options,
        allowClear: true,
        classes: classNamesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()

    // root
    const rootElement = wrapper.find('.ant-select')
    expect(rootElement.exists()).toBe(true)
    expect(rootElement.classes()).toContain('custom-cascader')

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
    const wrapper = mount(Cascader, {
      props: {
        prefix: 'Icon',
        options,
        value: ['zhejiang', 'hangzhou'],
        allowClear: true,
        classes: {
          root: 'custom-root',
          prefix: 'custom-prefix',
          suffix: 'custom-suffix',
          input: 'custom-input',
          content: 'custom-content',
          clear: 'custom-clear',
        },
        styles: {
          root: { padding: '10px' },
          prefix: { marginRight: '8px' },
          suffix: { width: '20px' },
          input: { lineHeight: '1.5' },
          content: { minHeight: '32px' },
          clear: { fontSize: '16px' },
        },
      },
    })

    // root
    const root = wrapper.find('.ant-select')
    expect(root.classes()).toContain('custom-root')
    expect(root.attributes('style')).toContain('padding: 10px')

    // prefix
    const prefix = wrapper.find('.ant-select-prefix')
    expect(prefix.exists()).toBe(true)
    expect(prefix.classes()).toContain('custom-prefix')
    expect(prefix.attributes('style')).toContain('margin-right: 8px')

    // suffix
    const suffix = wrapper.find('.ant-select-suffix')
    expect(suffix.exists()).toBe(true)
    expect(suffix.classes()).toContain('custom-suffix')
    expect(suffix.attributes('style')).toContain('width: 20px')

    // input
    const input = wrapper.find('.ant-select-input')
    expect(input.exists()).toBe(true)
    expect(input.classes()).toContain('custom-input')
    expect(input.attributes('style')).toContain('line-height: 1.5')

    // content
    const content = wrapper.find('.ant-select-content')
    expect(content.exists()).toBe(true)
    expect(content.classes()).toContain('custom-content')
    expect(content.attributes('style')).toContain('min-height: 32px')

    // clear
    const clear = wrapper.find('.ant-select-clear')
    expect(clear.exists()).toBe(true)
    expect(clear.classes()).toContain('custom-clear')
    expect(clear.attributes('style')).toContain('font-size: 16px')
  })

  it('should support placeholder classNames and styles', () => {
    const wrapper = mount(Cascader, {
      props: {
        options,
        placeholder: 'Please select',
        classes: {
          placeholder: 'custom-placeholder',
        },
        styles: {
          placeholder: { color: '#999' },
        },
      },
    })

    const placeholder = wrapper.find('.ant-select-placeholder')
    expect(placeholder.exists()).toBe(true)
    expect(placeholder.classes()).toContain('custom-placeholder')
    expect(placeholder.attributes('style')).toContain('color: rgb(153, 153, 153)')
  })

  it('should support popup semantic classNames and styles', async () => {
    const wrapper = mount(Cascader, {
      props: {
        options,
        open: true,
        classes: {
          popup: {
            root: 'custom-popup-root',
            list: 'custom-popup-list',
            listItem: 'custom-popup-listItem',
          },
        },
        styles: {
          popup: {
            root: { maxHeight: '200px' },
            list: { padding: '8px' },
            listItem: { margin: '4px' },
          },
        },
      },
      attachTo: document.body,
    })
    await nextTick()

    // popup.root
    const popup = document.querySelector('.ant-cascader-dropdown')
    expect(popup).toBeTruthy()
    expect(popup?.classList.contains('custom-popup-root')).toBe(true)
    const popupStyle = (popup as HTMLElement)?.style
    expect(popupStyle?.maxHeight).toBe('200px')

    // popup.list
    const list = document.querySelector('.ant-cascader-menu')
    expect(list).toBeTruthy()
    expect(list?.classList.contains('custom-popup-list')).toBe(true)
    const listStyle = (list as HTMLElement)?.style
    expect(listStyle?.padding).toBe('8px')

    // popup.listItem
    const listItems = document.querySelectorAll('.ant-cascader-menu-item')
    expect(listItems.length).toBeGreaterThan(0)
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
    const wrapper = mount(Cascader, {
      props: {
        options,
        multiple: true,
        value: [['zhejiang', 'hangzhou']],
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
    const item = wrapper.find('.ant-select-selection-item')
    expect(item.exists()).toBe(true)
    expect(item.classes()).toContain('custom-item')
    expect(item.attributes('style')).toContain('background-color: rgb(240, 240, 240)')

    // itemContent
    const itemContent = wrapper.find('.ant-select-selection-item-content')
    expect(itemContent.exists()).toBe(true)
    expect(itemContent.classes()).toContain('custom-item-content')
    expect(itemContent.attributes('style')).toContain('font-weight: bold')

    // itemRemove
    const itemRemove = wrapper.find('.ant-select-selection-item-remove')
    expect(itemRemove.exists()).toBe(true)
    expect(itemRemove.classes()).toContain('custom-item-remove')
    expect(itemRemove.attributes('style')).toContain('color: red')
  })
})
