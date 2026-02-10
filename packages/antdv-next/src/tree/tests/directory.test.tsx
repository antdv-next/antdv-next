import type { Key } from '@v-c/tree'
import type { DirectoryTreeProps } from '..'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, ref } from 'vue'
import Tree from '..'
import { mountTest, rtlTest } from '/@tests/shared'
import { mount, waitFakeTimer } from '/@tests/utils'

const { DirectoryTree, TreeNode } = Tree

function renderTreeNodes() {
  return (
    <>
      <TreeNode key="0-0" title="parent 0">
        <TreeNode key="0-0-0" title="child 0-0" />
        <TreeNode key="0-0-1" title="child 0-1" />
      </TreeNode>
      <TreeNode key="0-1" title="parent 1">
        <TreeNode key="0-1-0" title="child 1-0" />
        <TreeNode key="0-1-1" title="child 1-1" />
      </TreeNode>
    </>
  )
}

function mountDirectoryTree(props?: DirectoryTreeProps & { [prop: string]: unknown }) {
  return mount(DirectoryTree, {
    props,
    slots: {
      default: renderTreeNodes,
    },
    attachTo: document.body,
  })
}

describe('directory Tree', () => {
  mountTest(DirectoryTree)
  rtlTest(DirectoryTree)

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  describe('expand', () => {
    it('click', async () => {
      const onExpand = vi.fn()
      const wrapper = mountDirectoryTree({ onExpand })

      await wrapper.find('.ant-tree-node-content-wrapper').trigger('click')
      await waitFakeTimer(0, 1)
      expect(onExpand).toHaveBeenCalledWith(['0-0'], expect.anything())
      onExpand.mockReset()

      await wrapper.find('.ant-tree-node-content-wrapper').trigger('click')
      await waitFakeTimer(0, 1)
      expect(onExpand).toHaveBeenCalledWith([], expect.anything())
      wrapper.unmount()
    })

    it('double click', async () => {
      const onExpand = vi.fn()
      const wrapper = mountDirectoryTree({ expandAction: 'doubleClick', onExpand })

      await wrapper.find('.ant-tree-node-content-wrapper').trigger('dblclick')
      await waitFakeTimer(0, 1)
      expect(onExpand).toHaveBeenCalledWith(['0-0'], expect.anything())
      onExpand.mockReset()

      await wrapper.find('.ant-tree-node-content-wrapper').trigger('dblclick')
      await waitFakeTimer(0, 1)
      expect(onExpand).toHaveBeenCalledWith([], expect.anything())
      wrapper.unmount()
    })

    describe('with state control', () => {
      const StateDirTree = defineComponent({
        props: ['expandAction'],
        setup(props) {
          const expandedKeys = ref<Key[]>([])
          const onExpand = (keys: Key[]) => {
            expandedKeys.value = keys
          }

          return () => (
            <DirectoryTree expandedKeys={expandedKeys.value} onExpand={onExpand} expandAction={props.expandAction as DirectoryTreeProps['expandAction']}>
              <TreeNode key="0-0" title="parent">
                <TreeNode key="0-0-0" title="children" />
              </TreeNode>
            </DirectoryTree>
          )
        },
      })

      it('click', async () => {
        const wrapper = mount(StateDirTree, { props: { expandAction: 'click' } })

        await wrapper.find('.ant-tree-node-content-wrapper').trigger('click')
        await waitFakeTimer(0, 1)
        expect(wrapper.html()).toMatchSnapshot()
        wrapper.unmount()
      })

      it('doubleClick', async () => {
        const wrapper = mount(StateDirTree, { props: { expandAction: 'doubleClick' } })

        await wrapper.find('.ant-tree-node-content-wrapper').trigger('dblclick')
        await waitFakeTimer(0, 1)
        expect(wrapper.html()).toMatchSnapshot()
        wrapper.unmount()
      })
    })
  })

  it('defaultExpandAll', async () => {
    const wrapper = mountDirectoryTree({ defaultExpandAll: true })
    await waitFakeTimer(0, 1)
    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })

  it('select multi nodes when shift key down', async () => {
    const treeData = [
      { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
      { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
      { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
      { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
    ]
    const wrapper = mount(DirectoryTree, {
      props: {
        multiple: true,
        defaultExpandAll: false,
        treeData,
      },
    })
    await waitFakeTimer(0, 1)

    const nodes = wrapper.findAll('.ant-tree-node-content-wrapper')
    expect(nodes).toHaveLength(4)
    expect(wrapper.findAll('.ant-tree-node-selected')).toHaveLength(0)

    await nodes[2]!.trigger('click')
    await waitFakeTimer(0, 1)
    await nodes[0]!.trigger('click', { shiftKey: true })
    await waitFakeTimer(0, 1)

    expect(nodes[0]!.classes()).toContain('ant-tree-node-selected')
    expect(nodes[1]!.classes()).toContain('ant-tree-node-selected')
    expect(nodes[2]!.classes()).toContain('ant-tree-node-selected')
    expect(nodes[3]!.classes()).not.toContain('ant-tree-node-selected')
    wrapper.unmount()
  })

  it('directoryTree should expend all when use treeData and defaultExpandAll is true', async () => {
    const treeData = [
      {
        key: '0-0-0',
        title: 'Folder',
        children: [
          {
            title: 'Folder2',
            key: '0-0-1',
            children: [
              {
                title: 'File',
                key: '0-0-2',
                isLeaf: true,
              },
            ],
          },
        ],
      },
    ]
    const wrapper = mountDirectoryTree({ defaultExpandAll: true, treeData })
    await waitFakeTimer(0, 1)
    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })

  it('defaultExpandParent', async () => {
    const wrapper = mountDirectoryTree({ defaultExpandParent: true })
    await waitFakeTimer(0, 1)
    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })

  it('expandedKeys update', async () => {
    const wrapper = mountDirectoryTree()
    await waitFakeTimer(0, 1)
    await wrapper.setProps({ expandedKeys: ['0-1'] })
    await waitFakeTimer(0, 1)
    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })

  it('selectedKeys update', async () => {
    const wrapper = mountDirectoryTree({ defaultExpandAll: true })
    await waitFakeTimer(0, 1)
    await wrapper.setProps({ selectedKeys: ['0-1-0'] })
    await waitFakeTimer(0, 1)
    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })

  it('group select', async () => {
    const onSelect = vi.fn()
    const treeData = [
      {
        title: 'parent 0',
        key: '0-0',
        children: [
          { title: 'child 0-0', key: '0-0-0' },
          { title: 'child 0-1', key: '0-0-1' },
        ],
      },
      {
        title: 'parent 1',
        key: '0-1',
        children: [
          { title: 'child 1-0', key: '0-1-0' },
          { title: 'child 1-1', key: '0-1-1' },
        ],
      },
    ]
    const wrapper = mount(DirectoryTree, {
      props: {
        defaultExpandAll: true,
        expandAction: 'doubleClick',
        multiple: true,
        treeData,
        onSelect,
      },
    })
    await waitFakeTimer(0, 1)

    const nodes = wrapper.findAll('.ant-tree-node-content-wrapper')

    await nodes[0]!.trigger('click')
    await waitFakeTimer(0, 1)
    expect(onSelect.mock.calls[0]![1].selected).toBeTruthy()
    expect(onSelect.mock.calls[0]![1].selectedNodes.length).toBe(1)

    await nodes[0]!.trigger('click')
    await waitFakeTimer(0, 1)
    expect(onSelect.mock.calls[1]![1].selected).toBeTruthy()
    expect(onSelect.mock.calls[0]![0]).toEqual(onSelect.mock.calls[1]![0])
    expect(onSelect.mock.calls[1]![1].selectedNodes.length).toBe(1)

    await nodes[1]!.trigger('click', { ctrlKey: true })
    await waitFakeTimer(0, 1)
    expect(wrapper.html()).toMatchSnapshot()
    expect(onSelect.mock.calls[2]![0].length).toBe(2)
    expect(onSelect.mock.calls[2]![1].selected).toBeTruthy()
    expect(onSelect.mock.calls[2]![1].selectedNodes.length).toBe(2)

    await nodes[4]!.trigger('click', { shiftKey: true })
    await waitFakeTimer(0, 1)
    expect(wrapper.html()).toMatchSnapshot()
    expect(onSelect.mock.calls[3]![0].length).toBe(5)
    expect(onSelect.mock.calls[3]![1].selected).toBeTruthy()
    expect(onSelect.mock.calls[3]![1].selectedNodes.length).toBe(5)
    wrapper.unmount()
  })

  it('onDoubleClick', async () => {
    const onDoubleClick = vi.fn()
    const wrapper = mountDirectoryTree({ onDoubleClick })
    await wrapper.find('.ant-tree-node-content-wrapper').trigger('dblclick')
    await waitFakeTimer(0, 1)
    expect(onDoubleClick).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('should not expand tree now when pressing ctrl', async () => {
    const onExpand = vi.fn()
    const onSelect = vi.fn()
    const wrapper = mountDirectoryTree({ onExpand, onSelect })
    await wrapper.find('.ant-tree-node-content-wrapper').trigger('click', { ctrlKey: true })
    await waitFakeTimer(0, 1)
    expect(onExpand).not.toHaveBeenCalled()
    expect(onSelect).toHaveBeenCalledWith(
      ['0-0'],
      expect.objectContaining({ event: 'select', nativeEvent: expect.anything() }),
    )
    wrapper.unmount()
  })

  it('should not expand tree now when click leaf node', async () => {
    const onExpand = vi.fn()
    const onSelect = vi.fn()
    const wrapper = mountDirectoryTree({
      onExpand,
      onSelect,
      defaultExpandAll: true,
      treeData: [
        {
          key: '0-0-0',
          title: 'Folder',
          children: [
            {
              title: 'Folder2',
              key: '0-0-1',
              children: [
                {
                  title: 'File',
                  key: '0-0-2',
                  isLeaf: true,
                },
              ],
            },
          ],
        },
      ],
    })
    await waitFakeTimer(0, 1)

    const nodeList = wrapper.findAll('.ant-tree-node-content-wrapper')
    await nodeList[nodeList.length - 1]!.trigger('click')
    await waitFakeTimer(0, 1)
    expect(onExpand).not.toHaveBeenCalled()
    expect(onSelect).toHaveBeenCalledWith(
      ['0-0-2'],
      expect.objectContaining({ event: 'select', nativeEvent: expect.anything() }),
    )
    wrapper.unmount()
  })

  it('ref support', async () => {
    const treeRef = ref()
    mount(() => (
      <DirectoryTree ref={treeRef}>
        {renderTreeNodes()}
      </DirectoryTree>
    ))
    await waitFakeTimer(0, 1)
    expect(treeRef.value?.scrollTo).toBeTruthy()
  })

  it('fieldNames support', async () => {
    const treeData = [
      {
        id: '0-0-0',
        label: 'Folder',
        child: [
          {
            label: 'Folder2',
            id: '0-0-1',
            child: [
              {
                label: 'File',
                id: '0-0-2',
                isLeaf: true,
              },
            ],
          },
        ],
      },
    ]
    const onSelect = vi.fn()
    const wrapper = mount(DirectoryTree, {
      props: {
        defaultExpandAll: true,
        // @ts-expect-error test field names mapping
        treeData,
        onSelect,
        fieldNames: { key: 'id', title: 'label', children: 'child' },
      },
    })
    await waitFakeTimer(0, 1)

    expect(wrapper.findAll('.ant-tree-node-content-wrapper-open')).toHaveLength(2)

    await wrapper.findAll('.ant-tree-node-content-wrapper')[0]!.trigger('click')
    await waitFakeTimer(0, 1)
    expect(onSelect.mock.calls[0]![1].selectedNodes.length).toBe(1)
    wrapper.unmount()
  })
})
