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
  it('should support object classNames and styles', () => {
    const wrapper = mount(Cascader, {
      props: {
        options,
        value: ['zhejiang', 'hangzhou'],
        classes: {
          root: 'custom-root',
          suffix: 'custom-suffix',
          input: 'custom-input',
          content: 'custom-content',
        },
        styles: {
          root: { padding: '10px' },
          suffix: { width: '20px' },
          input: { lineHeight: '1.5' },
          content: { minHeight: '32px' },
        },
      },
    })

    // root
    const root = wrapper.find('.ant-select')
    expect(root.classes()).toContain('custom-root')
    expect(root.attributes('style')).toContain('padding: 10px')

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

  it('should support popup semantic classNames', async () => {
    const wrapper = mount(Cascader, {
      props: {
        options,
        open: true,
        classes: {
          popup: {
            root: 'custom-popup-root',
          },
        },
        styles: {
          popup: {
            root: { maxHeight: '200px' },
          },
        },
      },
      attachTo: document.body,
    })
    await nextTick()

    const popup = document.querySelector('.ant-cascader-dropdown')
    expect(popup).toBeTruthy()
    expect(popup?.classList.contains('custom-popup-root')).toBe(true)
    const popupStyle = (popup as HTMLElement)?.style
    expect(popupStyle?.maxHeight).toBe('200px')

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should support multiple mode semantic classNames', async () => {
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

  it('should support classNames as functions', async () => {
    const classNamesFn = vi.fn(() => ({
      root: 'fn-root',
      suffix: 'fn-suffix',
    }))

    const stylesFn = vi.fn(() => ({
      root: { padding: '5px' },
    }))

    const wrapper = mount(Cascader, {
      props: {
        options,
        classes: classNamesFn,
        styles: stylesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const root = wrapper.find('.ant-select')
    expect(root.classes()).toContain('fn-root')
    expect(root.attributes('style')).toContain('padding: 5px')

    const suffix = wrapper.find('.ant-select-suffix')
    expect(suffix.classes()).toContain('fn-suffix')
  })
})
