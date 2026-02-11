import type { AntdTreeNodeAttribute, AntTreeNodeProps, BasicDataNode, DataNode, DirectoryTreeProps, TreeProps } from '..'
import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Tree, { DirectoryTree } from '..'

describe('tree.TypeScript', () => {
  it('without generic', () => {
    const wrapper = mount(Tree, {
      props: {
        treeData: [
          {
            title: 'Bamboo',
            key: 'bamboo',
            children: [
              {
                title: 'Little',
                key: 'little',
              },
            ],
          },
        ],
      },
    })

    expect(wrapper.exists()).toBeTruthy()
  })

  it('support generic', () => {
    interface MyDataNode extends BasicDataNode {
      bamboo: string
      list?: MyDataNode[]
    }

    const props: TreeProps<MyDataNode> = {
      treeData: [
        {
          bamboo: 'good',
          list: [
            {
              bamboo: 'well',
            },
          ],
        },
      ],
    }

    // @ts-expect-error: Tree not support generic
    const wrapper = mount(Tree, { props })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('directoryTree support generic', () => {
    interface MyDataNode extends BasicDataNode {
      bamboo: string
      list?: MyDataNode[]
    }

    const props: DirectoryTreeProps<MyDataNode> = {
      treeData: [
        {
          bamboo: 'good',
          list: [
            {
              bamboo: 'well',
            },
          ],
        },
      ],
    }

    // @ts-expect-error: Tree not support generic
    const wrapper = mount(DirectoryTree, { props })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('draggable/icon/switcherIcon params type', () => {
    const props: TreeProps = {
      treeData: [
        {
          title: 'Bamboo',
          key: 'bamboo',
          children: [
            {
              title: 'Little',
              key: 'little',
            },
          ],
        },
      ],
      draggable: (node: DataNode) => node.title === 'Little',
      icon: (props: AntdTreeNodeAttribute) => (props.isLeaf ? 1 : 0),
      switcherIcon: (props: AntTreeNodeProps) => (props.isLeaf ? 1 : 0),
    }

    const wrapper = mount(Tree, { props })
    expect(wrapper.exists()).toBeTruthy()
  })
})
