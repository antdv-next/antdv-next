import type { TreeProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Tree from '..'
import { mount } from '/@tests/utils'

describe('tree.Semantic', () => {
  const treeData = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'leaf',
          key: '0-0-0',
        },
      ],
    },
  ]

  it('should support static classNames and styles', () => {
    const testClassNames: TreeProps['classes'] = {
      root: 'custom-tree-root',
      item: 'custom-tree-item',
      itemIcon: 'custom-tree-item-icon',
      itemTitle: 'custom-tree-item-title',
    }

    const testStyles: TreeProps['styles'] = {
      root: { color: 'rgb(255, 0, 0)' },
      item: { color: 'blue' },
      itemIcon: { fontSize: '16px' },
      itemTitle: { fontWeight: 'bold' },
    }

    const wrapper = mount(Tree, {
      props: {
        treeData,
        defaultExpandAll: true,
        showIcon: true,
        classes: testClassNames,
        styles: testStyles,
      },
    })

    const root = wrapper.find('.ant-tree')
    expect(root.classes()).toContain(testClassNames.root!)
    expect(root.element).toHaveStyle({ color: 'rgb(255, 0, 0)' })
  })

  it('should support function-based classNames and styles', async () => {
    const classNamesFn = vi.fn((info: { props: TreeProps }) => ({
      root: `dynamic-tree-root ${info.props.showIcon ? 'with-icon' : 'without-icon'}`,
      item: info.props.checkable ? 'checkable-item' : 'selectable-item',
      itemIcon: 'dynamic-icon',
      itemTitle: 'dynamic-title',
    }))

    const stylesFn = vi.fn((info: { props: TreeProps }) => ({
      root: {
        backgroundColor: info.props.disabled ? 'rgb(245, 245, 245)' : 'rgb(255, 255, 255)',
        border: info.props.disabled ? '1px solid rgb(217, 217, 217)' : '1px solid rgb(64, 169, 255)',
      },
      item: {
        padding: info.props.showIcon ? '4px' : '2px',
      },
      itemIcon: {
        color: info.props.disabled ? 'rgb(191, 191, 191)' : 'rgb(82, 196, 26)',
      },
      itemTitle: {
        color: info.props.disabled ? 'rgb(191, 191, 191)' : 'rgb(24, 144, 255)',
      },
    }))

    const wrapper = mount(Tree, {
      props: {
        treeData,
        defaultExpandAll: true,
        showIcon: true,
        checkable: true,
        classes: classNamesFn,
        styles: stylesFn,
      },
    })
    await nextTick()

    expect(classNamesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()

    let root = wrapper.find('.ant-tree')
    expect(root.classes()).toContain('dynamic-tree-root')
    expect(root.classes()).toContain('with-icon')
    expect(stylesFn.mock.calls[0]![0].props.disabled).toBeFalsy()

    await wrapper.setProps({
      disabled: true,
    })
    await nextTick()

    root = wrapper.find('.ant-tree')
    expect(root.classes()).toContain('dynamic-tree-root')
    const lastCall = stylesFn.mock.calls[stylesFn.mock.calls.length - 1]
    expect(lastCall?.[0].props.disabled).toBeTruthy()
  })
})
