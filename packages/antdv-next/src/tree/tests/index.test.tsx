import type { AntTreeNodeProps } from '..'
import { SmileOutlined } from '@antdv-next/icons'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Tree from '..'
import ConfigProvider from '../../config-provider'
import Form, { FormItem } from '../../form'
import { mountTest, rtlTest } from '/@tests/shared'
import { mount } from '/@tests/utils'

const { TreeNode } = Tree

describe('tree', () => {
  mountTest(Tree)
  rtlTest(Tree)

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('icon and switcherIcon of Tree with showLine should render correctly', async () => {
    const wrapper = mount({
      render: () => (
        <Tree showLine showIcon>
          <TreeNode icon="icon" switcherIcon="switcherIcon" key="0-0">
            <TreeNode icon="icon" switcherIcon="switcherIcon" key="0-0-0" />
            <TreeNode switcherIcon="switcherIcon" key="0-0-1" />
            <TreeNode icon="icon" key="0-0-2" />
            <TreeNode key="0-0-3" />
          </TreeNode>
          <TreeNode switcherIcon="switcherIcon" key="0-1">
            <TreeNode icon="icon" switcherIcon="switcherIcon" key="0-1-0" />
            <TreeNode switcherIcon="switcherIcon" key="0-1-1" />
            <TreeNode icon="icon" key="0-1-2" />
            <TreeNode key="0-1-3" />
          </TreeNode>
          <TreeNode key="0-2">
            <TreeNode icon="icon" switcherIcon="switcherIcon" key="0-2-0" />
            <TreeNode switcherIcon="switcherIcon" key="0-2-1" />
            <TreeNode icon="icon" key="0-2-2" />
            <TreeNode key="0-2-3" />
          </TreeNode>
        </Tree>
      ),
    })
    await nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('switcherIcon in Tree should not render at leaf nodes', () => {
    const treeData = [
      {
        title: 'parent',
        key: '0-0',
        children: [
          { title: 'node1', key: '0-0-0' },
          { title: 'node2', key: '0-0-1' },
        ],
      },
    ]
    const wrapper = mount(Tree, {
      props: {
        treeData,
        defaultExpandAll: true,
        switcherIcon: 'switcherIcon',
      },
    })
    const matches = wrapper.html().match(/switcherIcon/g) || []
    expect(matches).toHaveLength(1)
  })

  it('leaf nodes should render custom icons when provided', () => {
    const treeData = [
      {
        title: 'parent',
        key: '0-0',
        children: [
          { title: 'node1', key: '0-0-0' },
          { title: 'node2', key: '0-0-1' },
        ],
      },
    ]
    const wrapper = mount(Tree, {
      props: {
        treeData,
        defaultExpandAll: true,
        showLine: { showLeafIcon: <i class="customLeafIcon" /> },
      },
    })
    expect(wrapper.findAll('.ant-tree-switcher-line-custom-icon')).toHaveLength(2)
  })

  it('leaf nodes should render custom icons when provided as render function', () => {
    const treeData = [
      {
        title: 'parent',
        key: '0-0',
        children: [
          { title: 'node1', key: '0-0-0' },
          { title: 'node2', key: '0-0-1' },
        ],
      },
    ]
    const wrapper = mount(Tree, {
      props: {
        treeData,
        defaultExpandAll: true,
        showLine: { showLeafIcon: () => <i class="customLeafIcon" /> },
      },
    })

    expect(wrapper.findAll('.customLeafIcon')).toHaveLength(2)
  })

  it('leaf nodes should render custom icons when provided as string', () => {
    const treeData = [
      {
        title: 'parent',
        key: '0-0',
        children: [
          { title: 'node1', key: '0-0-0' },
          { title: 'node2', key: '0-0-1' },
        ],
      },
    ]
    const wrapper = mount(Tree, {
      props: {
        treeData,
        defaultExpandAll: true,
        showLine: { showLeafIcon: 'customLeafIcon' },
      },
    })

    const matches = wrapper.html().match(/customLeafIcon/g) || []
    expect(matches).toHaveLength(2)
  })

  it('switcherIcon in Tree could be string', async () => {
    const wrapper = mount({
      render: () => (
        <Tree switcherIcon="switcherIcon" defaultExpandAll>
          <TreeNode icon="icon" key="0-0" title="parent">
            <TreeNode title="node1" icon="icon" key="0-0-0" />
            <TreeNode title="node2" key="0-0-1" />
          </TreeNode>
        </Tree>
      ),
    })
    await nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('switcherIcon should be loading icon when loadData', async () => {
    const onLoadData = () => new Promise<void>(() => {})
    const wrapper = mount(Tree, {
      props: {
        treeData: [
          { title: 'node1', key: '0-0' },
          { title: 'node2', key: '0-1' },
        ],
        loadData: onLoadData,
        switcherIcon: 'switcherIcon',
      },
    })
    await nextTick()
    await wrapper.find('.ant-tree-switcher').trigger('click')
    await nextTick()

    expect(wrapper.findAll('.ant-tree-switcher-loading-icon').length).toBeGreaterThan(0)
  })

  it('support switcherLoadingIcon prop when loadData', async () => {
    const onLoadData = () => new Promise<void>(() => {})
    const wrapper = mount(Tree, {
      props: {
        treeData: [
          { title: 'node1', key: '0-0' },
          { title: 'node2', key: '0-1' },
        ],
        loadData: onLoadData,
        switcherIcon: 'switcherIcon',
        switcherLoadingIcon: <div class="custom-loading">loading...</div>,
      },
    })
    await nextTick()
    await wrapper.find('.ant-tree-switcher').trigger('click')
    await nextTick()
    expect(wrapper.find('.custom-loading').exists()).toBeTruthy()
  })

  it('switcherIcon in Tree could be render prop function', () => {
    const treeData = [
      {
        title: 'parent',
        key: '0-0',
        children: [
          { title: 'node1', key: '0-0-0' },
          { title: 'node2', key: '0-0-1' },
        ],
      },
    ]
    const wrapper = mount(Tree, {
      props: {
        treeData,
        defaultExpandAll: true,
        switcherIcon: ({ expanded }: AntTreeNodeProps) =>
          expanded ? <span class="open" /> : <span class="close" />,
      },
    })
    expect(wrapper.findAll('.open').length).toBeGreaterThan(0)
  })

  it('showLine is object type should render correctly', async () => {
    const wrapper = mount({
      render: () => (
        <Tree showLine={{ showLeafIcon: false }} defaultExpandedKeys={['0-0-0']}>
          <TreeNode title="parent 1" key="0-0">
            <TreeNode title="parent 1-0" key="0-0-0">
              <TreeNode title="leaf" key="0-0-0-0" />
              <TreeNode title="leaf" key="0-0-0-1" />
              <TreeNode title="leaf" key="0-0-0-2" />
            </TreeNode>
            <TreeNode title="parent 1-1" key="0-0-1">
              <TreeNode title="leaf" key="0-0-1-0" />
            </TreeNode>
            <TreeNode title="parent 1-2" key="0-0-2">
              <TreeNode title="leaf" key="0-0-2-0" />
              <TreeNode title="leaf" key="0-0-2-1" />
            </TreeNode>
          </TreeNode>
        </Tree>
      ),
    })
    await nextTick()
    expect(wrapper.html()).toMatchSnapshot()
  })

  describe('draggable', () => {
    const dragTreeData = [
      {
        title: 'bamboo',
        key: 'bamboo',
      },
    ]

    it('hide icon', () => {
      const wrapper = mount(Tree, {
        props: {
          treeData: dragTreeData,
          draggable: { icon: false },
        },
      })
      expect(wrapper.find('.anticon-holder').exists()).toBeFalsy()
    })

    it('customize icon', () => {
      const wrapper = mount(Tree, {
        props: {
          treeData: dragTreeData,
          draggable: { icon: <span class="little" /> },
        },
      })
      expect(wrapper.find('.little').exists()).toBeTruthy()
    })

    it('nodeDraggable', () => {
      const nodeDraggable = vi.fn(() => false)
      mount(Tree, {
        props: {
          treeData: dragTreeData,
          draggable: { nodeDraggable },
        },
      })
      expect(nodeDraggable).toHaveBeenCalled()
      expect((nodeDraggable.mock.calls as Array<Array<unknown>>)[0]![0]).toMatchObject(dragTreeData[0]!)
    })

    it('nodeDraggable func', () => {
      const nodeDraggable = vi.fn(() => false)
      mount(Tree, {
        props: {
          treeData: dragTreeData,
          draggable: nodeDraggable,
        },
      })
      expect(nodeDraggable).toHaveBeenCalled()

      expect((nodeDraggable.mock.calls as Array<Array<unknown>>)[0]![0]).toMatchObject(dragTreeData[0]!)
    })
  })

  describe('hidden switcherIcon', () => {
    it('use `switcherIcon={() => null}`', () => {
      const wrapper = mount({
        render: () => (
          <Tree defaultExpandAll switcherIcon={() => null}>
            <TreeNode icon="icon" key="0-0" title="parent">
              <TreeNode title="node1" icon="icon" key="0-0-2" />
              <TreeNode title="node2" key="0-0-3" />
            </TreeNode>
          </Tree>
        ),
      })
      wrapper.findAll('.ant-tree-switcher').forEach((node) => {
        expect(node.element.children.length).toBe(0)
      })
    })

    it('use `switcherIcon={null}`', () => {
      const wrapper = mount({
        render: () => (
          <Tree defaultExpandAll switcherIcon={null}>
            <TreeNode icon="icon" key="0-0" title="parent">
              <TreeNode title="node1" icon="icon" key="0-0-2" />
              <TreeNode title="node2" key="0-0-3" />
            </TreeNode>
          </Tree>
        ),
      })
      wrapper.findAll('.ant-tree-switcher').forEach((node) => {
        expect(node.element.children.length).toBe(0)
      })
    })
  })

  it('customize classNames and styles', () => {
    const data = [
      {
        title: 'parent 1',
        key: '0-0',
        icon: <SmileOutlined />,
        children: [
          {
            title: 'leaf',
            key: '0-0-0',
            icon: <SmileOutlined />,
          },
          {
            title: 'leaf',
            key: '0-0-1',
            icon: <SmileOutlined />,
          },
        ],
      },
    ]
    const testClassNames = {
      item: 'test-item',
      itemIcon: 'test-icon',
      itemTitle: 'test-title',
      root: 'test-root',
    }
    const testStyles = {
      item: { background: 'rgb(255, 0, 0)' },
      itemIcon: { color: 'rgb(0, 0, 255)' },
      itemTitle: { color: 'rgb(255, 255, 0)' },
      root: { color: 'rgb(0, 255, 0)' },
    }
    const wrapper = mount(Tree, {
      props: {
        treeData: data,
        showIcon: true,
        defaultExpandAll: true,
        styles: testStyles,
        classes: testClassNames,
      },
    })

    const root = wrapper.find('.ant-tree')
    const title = wrapper.find('.ant-tree-title')
    const item = wrapper.find(`.${testClassNames.item}`)
    const icon = wrapper.find('.ant-tree-iconEle')

    expect(root.element).toHaveStyle(testStyles.root)
    expect(root.classes()).toContain(testClassNames.root)
    expect(icon.element).toHaveStyle(testStyles.itemIcon)
    expect(icon.classes()).toContain(testClassNames.itemIcon)
    expect(title.element).toHaveStyle(testStyles.itemTitle)
    expect(title.classes()).toContain(testClassNames.itemTitle)
    expect(item.element).toHaveStyle(testStyles.item)
  })

  describe('form disabled', () => {
    it('should support Form disabled', () => {
      const wrapper = mount({
        render: () => (
          <Form disabled>
            <FormItem name="tree1" label="禁用">
              <Tree>
                <TreeNode title="parent 1" key="0-0">
                  <TreeNode title="child 1" key="0-0-0" />
                </TreeNode>
              </Tree>
            </FormItem>
          </Form>
        ),
      })

      expect(wrapper.find('.ant-tree.ant-tree-disabled').exists()).toBeTruthy()
    })

    it('set Tree enabled when ConfigProvider componentDisabled is false', () => {
      const wrapper = mount({
        render: () => (
          <Form disabled>
            <ConfigProvider componentDisabled={false}>
              <FormItem name="tree1" label="启用">
                <Tree>
                  <TreeNode title="parent 1" key="0-0">
                    <TreeNode title="child 1" key="0-0-0" />
                  </TreeNode>
                </Tree>
              </FormItem>
            </ConfigProvider>
            <FormItem name="tree2" label="禁用">
              <Tree>
                <TreeNode title="parent 2" key="1-0">
                  <TreeNode title="child 2" key="1-0-0" />
                </TreeNode>
              </Tree>
            </FormItem>
          </Form>
        ),
      })

      const trees = wrapper.findAll('.ant-tree')
      expect(trees[0]!.classes()).not.toContain('ant-tree-disabled')
      expect(trees[1]!.classes()).toContain('ant-tree-disabled')
    })
  })
})
