import type { TreeSelectProps } from '..'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import TreeSelect from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

describe('treeSelect.Semantic', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should isolate root class and style from popup root', async () => {
    const rootStyle = { height: '40px', overflow: 'hidden' }
    const popupRootStyle = { color: 'rgb(255, 0, 0)' }
    const treeData = [{ value: 'node', title: 'Node' }]

    const wrapper = mount(
      () => (
        <TreeSelect
          open
          treeData={treeData}
          classes={{ root: 'custom-root', popup: { root: 'custom-popup-root' } }}
          styles={{ root: rootStyle, popup: { root: popupRootStyle } }}
        />
      ),
      { attachTo: document.body },
    )
    await nextTick()

    const root = wrapper.find('.ant-tree-select')
    const popup = document.querySelector<HTMLElement>('.ant-tree-select-dropdown')

    expect(root.classes()).toContain('custom-root')
    expect((root.element as HTMLElement).style.height).toBe('40px')
    expect((root.element as HTMLElement).style.overflow).toBe('hidden')
    expect(popup).toBeTruthy()
    expect(popup!.classList.contains('custom-popup-root')).toBe(true)
    expect(popup!.style.color).toBe('rgb(255, 0, 0)')
    expect(popup!.classList.contains('custom-root')).toBe(false)
    expect(popup!.style.height).toBe('')
    expect(popup!.style.overflow).toBe('')
    wrapper.unmount()
  })

  it('should consume ConfigProvider class and style', () => {
    const wrapper = mount(() => (
      <ConfigProvider
        treeSelect={{ class: 'cp-tree-select', style: { backgroundColor: 'rgb(255, 0, 0)' } }}
      >
        <TreeSelect treeData={[{ value: 'test-value', title: 'test-title' }]} />
      </ConfigProvider>
    ))

    const root = wrapper.find('.ant-tree-select')
    expect(root.classes()).toContain('cp-tree-select')
    expect((root.element as HTMLElement).style.backgroundColor).toBe('rgb(255, 0, 0)')
  })

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
