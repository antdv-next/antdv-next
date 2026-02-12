import { describe, expect, it } from 'vitest'
import { calcRangeKeys } from '../utils/dictUtil'
import SwitcherIconCom from '../utils/iconUtil'
import { mount } from '/@tests/utils'

describe('tree util', () => {
  describe('calcRangeKeys', () => {
    const treeData = [
      { key: '0-0', children: [{ key: '0-0-0' }, { key: '0-0-1' }] },
      { key: '0-1', children: [{ key: '0-1-0' }, { key: '0-1-1' }] },
      {
        key: '0-2',
        children: [
          { key: '0-2-0', children: [{ key: '0-2-0-0' }, { key: '0-2-0-1' }, { key: '0-2-0-2' }] },
        ],
      },
    ]

    it('calc range keys', () => {
      const rangeKeys = calcRangeKeys({
        treeData,
        expandedKeys: ['0-0', '0-2', '0-2-0'],
        startKey: '0-2-0-1',
        endKey: '0-0-0',
      })
      const target = ['0-0-0', '0-0-1', '0-1', '0-2', '0-2-0', '0-2-0-0', '0-2-0-1']
      expect(rangeKeys.sort()).toEqual(target.sort())
    })

    it('return startKey when startKey === endKey', () => {
      const keys = calcRangeKeys({
        treeData,
        expandedKeys: ['0-0', '0-2', '0-2-0'],
        startKey: '0-0-0',
        endKey: '0-0-0',
      })
      expect(keys).toEqual(['0-0-0'])
    })

    it('return empty array without startKey and endKey', () => {
      const keys = calcRangeKeys({ treeData, expandedKeys: ['0-0', '0-2', '0-2-0'] })
      expect(keys).toEqual([])
    })
  })

  describe('switcherIconCom', () => {
    const prefixCls = 'tree'
    it('returns a loading icon when loading', () => {
      const wrapper = mount(SwitcherIconCom, {
        props: {
          prefixCls,
          treeNodeProps: { loading: true },
          showLine: true,
        },
      })
      expect(wrapper.find(`.${prefixCls}-switcher-loading-icon`).exists()).toBe(true)
    })

    it('returns nothing when node is a leaf without showLine', () => {
      const wrapper = mount(SwitcherIconCom, {
        props: {
          prefixCls,
          treeNodeProps: { loading: false, isLeaf: true },
          showLine: false,
        },
      })
      expect(wrapper.findAll('*')).toHaveLength(0)
    })

    it('returns a custom leaf icon when provided', () => {
      const testId = 'custom-icon'
      const customLeafIcon = <div data-testid={testId} />
      const wrapper = mount(SwitcherIconCom, {
        props: {
          prefixCls,
          treeNodeProps: { loading: false, isLeaf: true },
          showLine: { showLeafIcon: customLeafIcon },
        },
      })
      expect(wrapper.find(`[data-testid="${testId}"]`).exists()).toBe(true)
      expect(wrapper.find(`.${prefixCls}-switcher-line-custom-icon`).exists()).toBe(true)
    })

    it.each([
      [`${prefixCls}-switcher-line-icon`, true],
      [`${prefixCls}-switcher-leaf-line`, false],
    ])('returns %p element when showLeafIcon is %p', (expectedClassName, showLeafIcon) => {
      const wrapper = mount(SwitcherIconCom, {
        props: {
          prefixCls,
          treeNodeProps: { loading: false, isLeaf: true },
          showLine: { showLeafIcon },
        },
      })
      expect(wrapper.find(`.${expectedClassName}`).exists()).toBe(true)
    })
  })
})
