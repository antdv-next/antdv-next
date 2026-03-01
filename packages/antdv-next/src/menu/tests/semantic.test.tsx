import type { MenuProps } from '..'
import { describe, expect, it, vi } from 'vitest'
import Menu from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

const baseItems: NonNullable<MenuProps['items']> = [
  {
    label: 'Navigation One',
    key: 'mail',
    icon: <span>icon</span>,
  },
  {
    key: 'SubMenu',
    label: 'Navigation Two',
    icon: <span>sub</span>,
    children: [
      {
        key: 'g1',
        label: 'Item 1',
        type: 'group',
        children: [
          { key: '1', label: 'Option 1', icon: <span>1</span> },
          { key: '2', label: 'Option 2' },
        ],
      },
    ],
  },
]

describe('menu.semantic', () => {
  it('supports classes and styles in object form', () => {
    const classes: MenuProps['classes'] = {
      root: 'semantic-root',
      item: 'semantic-item',
      itemIcon: 'semantic-item-icon',
      itemContent: 'semantic-item-content',
      subMenu: {
        list: 'semantic-sub-list',
        item: 'semantic-sub-item',
        itemIcon: 'semantic-sub-item-icon',
        itemContent: 'semantic-sub-item-content',
        itemTitle: 'semantic-sub-title',
      },
    }

    const styles: MenuProps['styles'] = {
      root: { fontSize: '12px' },
      item: { backgroundColor: 'rgb(240, 249, 255)' },
      itemIcon: { color: 'rgb(82, 196, 26)' },
      itemContent: { color: 'rgb(22, 119, 255)' },
      subMenu: {
        list: { color: 'rgb(250, 173, 20)' },
        item: { color: 'rgb(89, 89, 89)' },
        itemIcon: { color: 'rgb(250, 84, 28)' },
        itemContent: { color: 'rgb(83, 109, 254)' },
        itemTitle: { color: 'rgb(245, 34, 45)' },
      },
    }

    const wrapper = mount(Menu, {
      props: {
        mode: 'inline',
        selectedKeys: ['mail'],
        openKeys: ['SubMenu'],
        items: baseItems,
        classes,
        styles,
      },
    })

    const root = wrapper.find('.ant-menu')
    expect(root.classes()).toContain('semantic-root')
    expect(root.attributes('style')).toContain('font-size: 12px')

    const item = wrapper.find('.ant-menu-item')
    expect(item.classes()).toContain('semantic-item')
    expect(item.attributes('style')).toContain('background-color: rgb(240, 249, 255)')

    const itemIcon = wrapper.find('.ant-menu-item-icon')
    expect(itemIcon.classes()).toContain('semantic-item-icon')
    expect(itemIcon.attributes('style')).toContain('color: rgb(82, 196, 26)')

    const itemContent = wrapper.find('.ant-menu-title-content')
    expect(itemContent.classes()).toContain('semantic-item-content')
    expect(itemContent.attributes('style')).toContain('color: rgb(22, 119, 255)')

    const subMenuList = wrapper.find('.semantic-sub-list')
    expect(subMenuList.exists()).toBe(true)
    expect(subMenuList.attributes('style')).toContain('color: rgb(250, 173, 20)')

    const subMenuTitle = wrapper.find('.semantic-sub-title')
    expect(subMenuTitle.exists()).toBe(true)
    expect(subMenuTitle.attributes('style')).toContain('color: rgb(245, 34, 45)')

    const subMenuItem = wrapper.find('.semantic-sub-item')
    expect(subMenuItem.exists()).toBe(true)
    expect(subMenuItem.attributes('style')).toContain('color: rgb(89, 89, 89)')
  })

  it('supports classes and styles in function form', async () => {
    const classesFn = vi.fn((info: { props: MenuProps }) => {
      if (info.props.mode === 'inline') {
        return { root: 'fn-inline-root' }
      }
      return { root: 'fn-other-root' }
    })

    const stylesFn = vi.fn((info: { props: MenuProps }) => {
      if (info.props.mode === 'inline') {
        return { root: { backgroundColor: 'rgb(240, 249, 255)' } }
      }
      return { root: { backgroundColor: 'rgb(255, 255, 255)' } }
    })

    const wrapper = mount(Menu, {
      props: {
        mode: 'inline',
        items: baseItems,
        classes: classesFn,
        styles: stylesFn,
      },
    })

    expect(classesFn).toHaveBeenCalled()
    expect(stylesFn).toHaveBeenCalled()
    expect(wrapper.find('.ant-menu').classes()).toContain('fn-inline-root')
    expect(wrapper.find('.ant-menu').attributes('style')).toContain('background-color: rgb(240, 249, 255)')

    await wrapper.setProps({ mode: 'vertical' })

    expect(wrapper.find('.ant-menu').classes()).toContain('fn-other-root')
    expect(wrapper.find('.ant-menu').attributes('style')).toContain('background-color: rgb(255, 255, 255)')
  })

  it('merges ConfigProvider and component semantic classes/styles', () => {
    const wrapper = mount(ConfigProvider, {
      props: {
        menu: {
          classes: { root: 'ctx-root' },
          styles: { root: { margin: '12px' } },
        },
      },
      slots: {
        default: () => (
          <Menu
            mode="inline"
            items={baseItems}
            classes={{ root: 'comp-root' }}
            styles={{ root: { padding: '8px' } }}
          />
        ),
      },
    })

    const root = wrapper.find('.ant-menu')
    expect(root.classes()).toContain('ctx-root')
    expect(root.classes()).toContain('comp-root')
    const style = root.attributes('style') ?? ''
    expect(style).toContain('margin: 12px')
    expect(style).toContain('padding: 8px')
  })

  it('supports menu item style from items config', () => {
    const items: NonNullable<MenuProps['items']> = [
      { label: 'One', key: 'one', style: { color: 'red' } },
      {
        label: 'Two',
        key: 'two',
        children: [
          { label: 'Two-One', key: 'two-one', style: { color: 'green' } },
          { label: 'Two-Two', key: 'two-two', style: { color: 'blue' } },
        ],
      },
    ]

    const wrapper = mount(Menu, {
      props: {
        mode: 'inline',
        items,
        openKeys: ['two'],
      },
    })

    const expectedStyles: Record<string, string> = {
      One: 'color: red',
      'Two-One': 'color: green',
      'Two-Two': 'color: blue',
    }

    wrapper.findAll('.ant-menu-item').forEach((menuItem) => {
      const label = menuItem.find('.ant-menu-title-content').text().trim()
      if (expectedStyles[label]) {
        expect(menuItem.attributes('style')).toContain(expectedStyles[label])
      }
    })
  })
})
