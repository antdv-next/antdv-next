import type { MenuItemProps, MenuProps } from '..'
import { describe, expect, it } from 'vitest'
import Menu from '..'

describe('menu.typescript', () => {
  it('supports mixed item types in items', () => {
    const items: NonNullable<MenuProps['items']> = [
      { key: 'item', title: 'Item', label: 'Item' },
      {
        key: 'submenu',
        theme: 'light',
        label: 'SubMenu',
        children: [
          { key: 'submenu-item', title: 'SubmenuItem', label: 'SubmenuItem' },
          { key: 'submenu-submenu', theme: 'light', label: 'Nested', children: [] },
          { key: 'submenu-divider', type: 'divider' },
          { key: 'submenu-group', type: 'group', label: 'Group', children: [] },
          null,
        ],
      },
      {
        key: 'group',
        type: 'group',
        label: 'Group',
        children: [
          { key: 'group-item', label: 'GroupItem' },
          { key: 'group-submenu', theme: 'light', label: 'GroupSubMenu', children: [] },
          { key: 'group-divider', type: 'divider' },
          { key: 'group-group', type: 'group', label: 'GroupGroup', children: [] },
          null,
        ],
      },
      { key: 'divider', type: 'divider' },
      null,
    ]

    const menu = <Menu items={items} />
    expect(menu).toBeTruthy()
  })

  it('supports custom item fields', () => {
    const items: NonNullable<MenuProps['items']> = [
      { key: 'item', title: 'Item', label: 'Item', 'data-x': 0 },
      {
        key: 'submenu',
        theme: 'light',
        label: 'SubMenu',
        children: [
          { key: 'submenu-item', title: 'SubmenuItem', label: 'SubmenuItem', 'data-x': 1 },
          { key: 'submenu-submenu', theme: 'light', label: 'Nested', children: [], 'data-x': 2 },
          { key: 'submenu-divider', type: 'divider' },
          { key: 'submenu-group', type: 'group', label: 'Group', children: [] },
          null,
        ],
      },
      { key: 'divider', type: 'divider' },
    ]

    const menu = <Menu items={items} />
    expect(menu).toBeTruthy()
  })

  it('supports Menu.Item with extended props', () => {
    interface CustomItemProps extends MenuItemProps {
      'data-x': number
    }

    const customProps: CustomItemProps = {
      title: 'Item',
      'data-x': 0,
    }

    const menu = (
      <Menu mode="inline">
        <Menu.Item key="item" {...customProps}>
          Item
        </Menu.Item>
      </Menu>
    )

    expect(menu).toBeTruthy()
  })
})
