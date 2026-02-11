import type { TreeSelectProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import TreeSelect from '..'
import { mount } from '/@tests/utils'

describe('treeSelect.Semantic', () => {
  it('should support classNames and styles as functions', () => {
    const treeData = [
      {
        value: 'parent 1',
        title: 'parent 1',
        children: [
          {
            value: 'leaf1',
            title: 'leaf1',
          },
        ],
      },
    ]

    const classNamesFn = vi.fn((info: { props: TreeSelectProps }) => ({
      root: info.props.disabled ? 'disabled-tree-select-root' : 'enabled-tree-select-root',
      input: `dynamic-input-${info.props.size}`,
      suffix: 'dynamic-suffix',
      popup: {
        root: 'dynamic-popup-root',
        item: info.props.disabled ? 'disabled-item' : 'enabled-item',
        itemTitle: 'dynamic-item-title',
      },
    }))

    const stylesFn = vi.fn((info: { props: TreeSelectProps }) => ({
      root: {
        opacity: info.props.disabled ? 0.5 : 1,
        backgroundColor: info.props.disabled ? 'gray' : 'white',
      },
      input: { fontSize: '14px' },
      suffix: { color: 'blue' },
      popup: {
        root: { zIndex: 1000 },
        item: { padding: '6px' },
        itemTitle: { color: 'black' },
      },
    }))

    const wrapper = mount(TreeSelect, {
      props: {
        treeData,
        placeholder: 'Please select',
        disabled: false,
        size: 'middle',
        classes: classNamesFn,
        styles: stylesFn,
      },
    })

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    const treeSelectElement = wrapper.find('.ant-select')
    expect(treeSelectElement.exists()).toBe(true)
    expect(treeSelectElement.classes()).toContain('enabled-tree-select-root')
    const style = treeSelectElement.attributes('style')
    expect(style).toContain('opacity: 1')
    expect(style).toMatch(/background-color:\s*(white|rgb\(255, 255, 255\))/)
  })
})
