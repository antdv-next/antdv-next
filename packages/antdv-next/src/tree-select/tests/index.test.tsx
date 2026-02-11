import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import TreeSelect from '..'
import { resetWarned } from '../../_util/warning'
import Button from '../../button'
import ConfigProvider from '../../config-provider'
import Input from '../../input'
import Compact from '../../space/Compact'
import { mountTest, rtlTest } from '/@tests/shared'

describe('tree-select', () => {
  // focusTest(TreeSelect, { refFocus: true })
  mountTest(TreeSelect)
  rtlTest(TreeSelect)

  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('treeSelect Custom Icons', () => {
    it('should support customized icons', () => {
      const treeData = [
        {
          value: 'parent 1',
          title: 'parent 1',
          key: '0-1',
          children: [
            {
              value: 'parent 1-0',
              title: 'parent 1-0',
              key: '0-1-1',
              children: [
                {
                  value: 'leaf1',
                  title: 'my leaf',
                  key: 'random',
                },
                {
                  value: 'leaf2',
                  title: 'your leaf',
                  key: 'random1',
                },
              ],
            },
          ],
        },

      ]
      const wrapper = mount({
        render: () => (
          <TreeSelect
            showSearch
            clearIcon={<span>clear</span>}
            removeIcon={<span>remove</span>}
            value={['leaf1', 'leaf2']}
            placeholder="Please select"
            multiple
            allowClear
            treeDefaultExpandAll
            treeData={treeData}
          >
          </TreeSelect>
        ),
      })

      expect(wrapper.html()).toMatchSnapshot()
    })

    it('should `treeIcon` work', async () => {
      const treeData = [
        {
          value: 'parent 1',
          title: 'parent 1',
          key: 'p1',
          icon: <span class="bamboo"></span>,
        },
      ]
      const open = ref(true)
      const wrapper = mount(
        {
          render: () => (
            <TreeSelect treeIcon open={open.value} treeData={treeData} />
          ),
        },
        { attachTo: document.body },
      )
      await nextTick()

      expect(
        document.querySelector('.ant-select-tree-treenode .bamboo'),
      ).toBeTruthy()

      open.value = false
      await nextTick()
      wrapper.unmount()
    })
  })

  it('should support notFoundContent', async () => {
    const open = ref(true)
    const wrapper = mount({
      render: () => <TreeSelect treeIcon open={open.value} notFoundContent="notFoundContent" />,
    }, { attachTo: document.body })

    await nextTick()
    expect(document.querySelector('.ant-select-empty')?.textContent).toBe('notFoundContent')

    open.value = false
    await nextTick()
    wrapper.unmount()
  })

  it('legacy popupClassName', async () => {
    resetWarned()

    const open = ref(true)
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount({
      render: () => <TreeSelect popupClassName="legacy" open={open.value} />,
    }, {
      attachTo: document.body,
    })
    await nextTick()
    expect(errSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Warning: [antd: TreeSelect] `popupClassName` is deprecated. Please use `classNames.popup.root` instead.',
      ),
    )
    expect(document.querySelector('.legacy')).toBeTruthy()

    errSpy.mockRestore()
    open.value = false
    await nextTick()
    wrapper.unmount()
  })

  it('legacy dropdownClassName', async () => {
    resetWarned()

    const open = ref(true)
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount({
      render: () => <TreeSelect dropdownClassName="legacy" open={open.value} />,
    }, {
      attachTo: document.body,
    })
    await nextTick()
    expect(errSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Warning: [antd: TreeSelect] `dropdownClassName` is deprecated. Please use `classNames.popup.root` instead.',
      ),
    )
    expect(document.querySelector('.legacy')).toBeTruthy()

    errSpy.mockRestore()
    open.value = false
    await nextTick()
    wrapper.unmount()
  })

  it('legacy dropdownMatchSelectWidth', async () => {
    resetWarned()

    const open = ref(true)
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount({
      render: () => <TreeSelect dropdownMatchSelectWidth open={open.value} />,
    })
    expect(errSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Warning: [antd: TreeSelect] `dropdownMatchSelectWidth` is deprecated. Please use `popupMatchSelectWidth` instead.',
      ),
    )

    errSpy.mockRestore()
    open.value = false
    await nextTick()

    wrapper.unmount()
  })

  it('legacy dropdownStyle', async () => {
    resetWarned()

    const open = ref(true)
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(
      {
        render: () => <TreeSelect dropdownStyle={{ color: 'red' }} open={open.value} />,
      },
      { attachTo: document.body },
    )
    await nextTick()
    expect(errSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Warning: [antd: TreeSelect] `dropdownStyle` is deprecated. Please use `styles.popup.root` instead.',
      ),
    )
    const dropdown = document.querySelector(
      '.ant-select-dropdown',
    ) as HTMLElement
    expect(dropdown).toBeTruthy()

    errSpy.mockRestore()
    open.value = false
    await nextTick()

    wrapper.unmount()
  })

  it('legacy dropdownRender', async () => {
    resetWarned()

    const open = ref(true)
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(
      {
        render: () => (
          <TreeSelect
            dropdownRender={(menu: any) => (
              <div class="custom-dropdown">{menu}</div>
            )}
            open={open.value}
          />
        ),
      },
      { attachTo: document.body },
    )
    await nextTick()
    expect(errSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Warning: [antd: TreeSelect] `dropdownRender` is deprecated. Please use `popupRender` instead.',
      ),
    )
    expect(document.querySelector('.custom-dropdown')).toBeTruthy()

    errSpy.mockRestore()

    open.value = false
    await nextTick()

    wrapper.unmount()
  })

  it('deprecate showArrow', () => {
    resetWarned()

    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(<TreeSelect showArrow />)
    expect(errSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Warning: [antd: TreeSelect] `showArrow` is deprecated which will be removed in next major version. It will be a default behavior, you can hide it by setting `suffixIcon` to null.',
      ),
    )
    expect(wrapper.find('.ant-select-show-arrow').exists()).toBeTruthy()

    errSpy.mockRestore()

    wrapper.unmount()
  })

  it('support classes and styles for basic elements (root, prefix, input, suffix, content)', () => {
    const treeData = [
      {
        value: 'parent 1',
        title: 'parent 1',
        children: [
          {
            value: 'leaf1',
            title: 'my leaf',
          },
        ],
      },
    ]
    const customClassNames = {
      root: 'test-root',
      prefix: 'test-prefix',
      input: 'test-input',
      suffix: 'test-suffix',
      content: 'test-content',
    }
    const customStyles = {
      root: { backgroundColor: 'rgb(255, 0, 0)' },
      prefix: { color: 'rgb(0, 255, 0)' },
      input: { color: 'rgb(0, 0, 255)' },
      suffix: { color: 'rgb(255, 255, 0)' },
      content: { color: 'rgb(255, 192, 203)' },
    }
    const wrapper = mount(
      <TreeSelect
        classes={customClassNames}
        styles={customStyles}
        showSearch
        prefix="P"
        suffixIcon={<span />}
        treeData={treeData}
      />,
    )

    const selectRoot = wrapper.find('.ant-tree-select')
    const prefix = wrapper.find('.ant-select-prefix')
    const content = wrapper.find('.ant-select-content')
    const suffix = wrapper.find('.ant-select-suffix')
    const input = wrapper.find('.ant-select-input')

    expect(selectRoot.classes()).toContain(customClassNames.root)
    expect(prefix.classes()).toContain(customClassNames.prefix)
    expect(content.classes()).toContain(customClassNames.content)
    expect(suffix.classes()).toContain(customClassNames.suffix)
    expect(input.classes()).toContain(customClassNames.input)

    expect((selectRoot.element as HTMLElement).style.backgroundColor).toBe(
      'rgb(255, 0, 0)',
    )
    expect((prefix.element as HTMLElement).style.color).toBe('rgb(0, 255, 0)')
    expect((content.element as HTMLElement).style.color).toBe(
      'rgb(255, 192, 203)',
    )
    expect((suffix.element as HTMLElement).style.color).toBe('rgb(255, 255, 0)')
    expect((input.element as HTMLElement).style.color).toBe('rgb(0, 0, 255)')
  })

  it('support classNames and styles for placeholder', () => {
    const treeData = [
      {
        value: 'leaf1',
        title: 'Leaf 1',
      },
    ]
    const customClassNames = {
      placeholder: 'test-placeholder',
    }
    const customStyles = {
      placeholder: { color: 'rgb(165, 42, 42)' },
    }
    const wrapper = mount(
      <TreeSelect
        classes={customClassNames}
        styles={customStyles}
        placeholder="Please select"
        treeData={treeData}
      />,
    )

    const placeholder = wrapper.find('.ant-select-placeholder')

    expect(placeholder.classes()).toContain(customClassNames.placeholder)
    expect((placeholder.element as HTMLElement).style.color).toBe(
      'rgb(165, 42, 42)',
    )
  })

  it('support classNames and styles for items (item, itemContent, itemRemove)', async () => {
    const treeData = [
      {
        value: 'parent 1',
        title: 'parent 1',
        children: [
          {
            value: 'parent 1-0',
            title: 'parent 1-0',
            children: [
              {
                value: 'leaf1',
                title: 'my leaf',
              },
              {
                value: 'leaf2',
                title: 'your leaf',
              },
            ],
          },
        ],
      },
    ]
    const customClassNames = {
      item: 'test-item',
      itemContent: 'test-item-content',
      itemRemove: 'test-item-remove',
      popup: {
        root: 'test-popup',
        item: 'test-popup-item',
        itemTitle: 'test-item-title',
      },
    }
    const customStyles = {
      item: { color: 'rgb(70, 130, 180)' },
      itemContent: { color: 'rgb(255, 20, 147)' },
      itemRemove: { color: 'rgb(34, 139, 34)' },
      popup: {
        root: { color: 'rgb(255, 165, 0)' },
        item: { color: 'rgb(0, 0, 0)' },
        itemTitle: { color: 'rgb(128, 0, 128)' },
      },
    }
    const open = ref(true)
    const wrapper = mount(
      <TreeSelect
        classes={customClassNames}
        styles={customStyles}
        multiple
        value={['leaf1']}
        open={open.value}
        treeDefaultExpandAll
        treeData={treeData}
      />,
      { attachTo: document.body },
    )
    await nextTick()

    const selectedItem = wrapper.find('.ant-select-selection-item')
    const itemContent = wrapper.find('.ant-select-selection-item-content')
    const itemRemove = wrapper.find('.ant-select-selection-item-remove')
    const popup = document.querySelector(
      '.ant-tree-select-dropdown',
    ) as HTMLElement

    expect(popup.classList.contains(customClassNames.popup.root)).toBeTruthy()
    expect(popup.style.color).toBe('rgb(255, 165, 0)')

    expect(selectedItem.classes()).toContain(customClassNames.item)
    expect(itemContent.classes()).toContain(customClassNames.itemContent)
    expect(itemRemove.classes()).toContain(customClassNames.itemRemove)

    expect((selectedItem.element as HTMLElement).style.color).toBe(
      'rgb(70, 130, 180)',
    )
    expect((itemContent.element as HTMLElement).style.color).toBe(
      'rgb(255, 20, 147)',
    )
    expect((itemRemove.element as HTMLElement).style.color).toBe(
      'rgb(34, 139, 34)',
    )

    const itemTitle = document.querySelector(
      '.ant-select-tree-title',
    ) as HTMLElement
    if (itemTitle) {
      expect(
        itemTitle.classList.contains(customClassNames.popup.itemTitle),
      ).toBeTruthy()
      expect(itemTitle.style.color).toBe('rgb(128, 0, 128)')
    }

    open.value = false
    await nextTick()

    wrapper.unmount()
  })

  it('treeSelect ContextIsolator', async () => {
    const open = ref(true)
    const wrapper = mount(
      {
        render: () => {
          return (
            <Compact>
              <TreeSelect
                open={open.value}
                defaultValue="lucy"
                style={{ width: '120px' }}
                popupRender={(menu: any) => {
                  return (
                    <div>
                      {menu}
                      <Button>123</Button>
                      <Input style={{ width: '50px' }} />
                    </div>
                  )
                }}
                treeData={[
                  {
                    value: 'jack',
                    title: 'Jack',
                    children: [{ value: 'Emily', title: 'Emily' }],
                  },
                  { value: 'lucy', title: 'Lucy' },
                ]}
              />
              <Button class="test-button">test</Button>
            </Compact>
          )
        },
      },
      { attachTo: document.body },
    )
    await nextTick()

    const compactButton = wrapper.find('.test-button')
    const popupElement = document.querySelector('.ant-select-dropdown')
    // selector should have compact
    expect(compactButton.exists()).toBeTruthy()
    expect(compactButton.classes().join(' ')).toContain('compact')

    // popupRender element haven't compact
    expect(popupElement).toBeInTheDocument()
    const button = popupElement!.querySelector('button')
    const input = popupElement!.querySelector('input')
    expect(button!.className.includes('compact')).toBeFalsy()
    expect(input!.className.includes('compact')).toBeFalsy()

    open.value = false
    await nextTick()

    wrapper.unmount()
  })

  it('should support switcherIcon from ConfigProvider', async () => {
    const open = ref(true)
    const treeData = [
      {
        value: 'parent 1',
        title: 'parent 1',
        key: '0-1',
        children: [
          {
            value: 'parent 1-0',
            title: 'parent 1-0',
            key: '0-1-1',
            children: [
              { value: 'leaf1', title: 'my leaf', key: 'random' },
              { value: 'leaf2', title: 'your leaf', key: 'random1' },
            ],
          },
        ],
      },
    ]
    const wrapper = mount(
      {
        render: () => {
          return (
            <ConfigProvider
              treeSelect={{
                switcherIcon: (props: any) => {
                  return props.expanded
                    ? (
                        <span data-testid="custom-expanded">▼</span>
                      )
                    : (
                        <span data-testid="custom-collapsed">▶</span>
                      )
                },
              }}
            >
              <TreeSelect open={open.value} treeDefaultExpandAll treeData={treeData} />
            </ConfigProvider>
          )
        },
      },
      { attachTo: document.body },
    )
    await nextTick()

    const customIcon
      = document.querySelector('[data-testid="custom-expanded"]')
        || document.querySelector('[data-testid="custom-collapsed"]')

    expect(customIcon).toBeTruthy()

    open.value = false
    await nextTick()

    wrapper.unmount()
  })
})
