import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Tree from '..'
import { mount, waitFakeTimer } from '/@tests/utils'

const { DirectoryTree } = Tree

const treeData = [
  { key: 'a', title: 'A', children: [{ key: 'a-1', title: 'A1' }] },
  { key: 'b', title: 'B', children: [{ key: 'b-1', title: 'B1' }] },
]

const initialCases = [
  { name: 'controlled empty keys before defaultExpandAll', props: { expandedKeys: [], defaultExpandAll: true }, expected: ['A', 'B'] },
  { name: 'controlled partial keys before defaultExpandAll', props: { expandedKeys: ['a'], defaultExpandAll: true }, expected: ['A', 'A1', 'B'] },
  { name: 'controlled empty keys before defaultExpandedKeys', props: { expandedKeys: [], defaultExpandedKeys: ['b'] }, expected: ['A', 'B'] },
  { name: 'controlled keys before defaultExpandedKeys', props: { expandedKeys: ['a'], defaultExpandedKeys: ['b'] }, expected: ['A', 'A1', 'B'] },
  { name: 'uncontrolled defaultExpandAll', props: { defaultExpandAll: true }, expected: ['A', 'A1', 'B', 'B1'] },
  { name: 'uncontrolled defaultExpandedKeys', props: { defaultExpandedKeys: ['b'] }, expected: ['A', 'B', 'B1'] },
]

const nestedData = [
  { key: 'parent', title: 'parent', children: [
    { key: 'child', title: 'child', children: [{ key: 'leaf', title: 'leaf' }] },
  ] },
]

const parentCases = [
  { autoExpandParent: false, defaultExpandParent: true, expected: ['parent', 'child', 'leaf'] },
  { autoExpandParent: true, defaultExpandParent: false, expected: ['parent', 'child', 'leaf'] },
  { autoExpandParent: false, defaultExpandParent: false, expected: ['parent'] },
]

describe('DirectoryTree initial expandedKeys precedence', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it.each(initialCases)('$name', async ({ props, expected }) => {
    const onExpand = vi.fn()
    const wrapper = mount(DirectoryTree, { props: { treeData, virtual: false, ...props, onExpand } })
    await waitFakeTimer(0, 1)

    expect(wrapper.findAll('.ant-tree-title').map(node => node.text())).toEqual(expected)
    expect(onExpand).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it.each(parentCases)(
    'applies autoExpandParent=$autoExpandParent and defaultExpandParent=$defaultExpandParent',
    async ({ autoExpandParent, defaultExpandParent, expected }) => {
      const wrapper = mount(DirectoryTree, {
        props: { treeData: nestedData, virtual: false, expandedKeys: ['child'], autoExpandParent, defaultExpandParent },
      })
      await waitFakeTimer(0, 1)

      expect(wrapper.findAll('.ant-tree-title').map(node => node.text())).toEqual(expected)
      wrapper.unmount()
    },
  )

  it('keeps controlled updates and remounts consistent with initial keys', async () => {
    const props = { treeData, virtual: false, expandedKeys: [] as string[], defaultExpandAll: true }
    const wrapper = mount(DirectoryTree, { props })
    await waitFakeTimer(0, 1)
    expect(wrapper.findAll('.ant-tree-title').map(node => node.text())).toEqual(['A', 'B'])

    await wrapper.setProps({ expandedKeys: ['a'] })
    await waitFakeTimer(1000, 1)
    expect(wrapper.findAll('.ant-tree-title').map(node => node.text())).toEqual(['A', 'A1', 'B'])

    await wrapper.setProps({ expandedKeys: [] })
    await waitFakeTimer(1000, 1)
    expect(wrapper.findAll('.ant-tree-title').map(node => node.text())).toEqual(['A', 'B'])
    wrapper.unmount()

    const remounted = mount(DirectoryTree, { props })
    await waitFakeTimer(0, 1)
    expect(remounted.findAll('.ant-tree-title').map(node => node.text())).toEqual(['A', 'B'])
    remounted.unmount()
  })
})
