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

    const wrapper = mount(DirectoryTree, { props })
    expect(wrapper.exists()).toBeTruthy()
  })

  it('generic data node flows into callbacks', () => {
    interface MyDataNode extends BasicDataNode {
      bamboo: string
      list?: MyDataNode[]
    }

    const treeData: MyDataNode[] = [{ bamboo: 'good', list: [{ bamboo: 'well' }] }]
    // `BasicDataNode` has an index signature, so assert the field type instead of its presence.
    const isString = (value: string) => value.length > 0

    const wrapper = mount(() => (
      <div>
        <Tree<MyDataNode>
          treeData={treeData}
          loadData={async node => void isString(node.bamboo)}
          allowDrop={({ dragNode }) => isString(dragNode.bamboo)}
          onSelect={(_keys, info) => isString(info.node.bamboo)}
        />
        {/* @ts-expect-error `bamboo` is required by MyDataNode */}
        <Tree<MyDataNode> treeData={[{ list: [] }]} />
        {/* @ts-expect-error `bamboo` is inferred from treeData as a string */}
        <DirectoryTree treeData={treeData} titleRender={(node): number => node.bamboo} />
      </div>
    ))
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
