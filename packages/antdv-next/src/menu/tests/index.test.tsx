import type { MenuProps } from '..'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Menu, { MenuItem, SubMenu } from '..'
import { mountTest, rtlTest } from '/@tests/shared'
import { mount } from '/@tests/utils'

const items: NonNullable<MenuProps['items']> = [
  {
    key: 'sub1',
    label: 'Navigation One',
    children: [
      { key: '1', label: 'Option 1' },
      { key: '2', label: 'Option 2' },
    ],
  },
  {
    key: 'sub2',
    label: 'Navigation Two',
    children: [
      { key: '3', label: 'Option 3' },
      { key: '4', label: 'Option 4' },
    ],
  },
]

describe('menu', () => {
  mountTest(Menu)
  rtlTest(Menu)

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders with items', () => {
    const wrapper = mount(Menu, {
      props: {
        mode: 'inline',
        items,
      },
    })

    expect(wrapper.find('.ant-menu').exists()).toBe(true)
    expect(wrapper.text()).toContain('Navigation One')
    expect(wrapper.text()).toContain('Navigation Two')
  })

  it('exposes Item/SubMenu/Divider static members', () => {
    expect(Menu.Item).toBe(MenuItem)
    expect(Menu.SubMenu).toBe(SubMenu)
    expect(Menu.Divider).toBeDefined()
  })

  it('supports defaultOpenKeys in inline mode', () => {
    const wrapper = mount(Menu, {
      props: {
        mode: 'inline',
        defaultOpenKeys: ['sub1'],
        items,
      },
    })

    expect(wrapper.find('.ant-menu-submenu-open').exists()).toBe(true)
    expect(wrapper.text()).toContain('Option 1')
  })

  it('supports controlled openKeys in inline mode', async () => {
    const wrapper = mount(Menu, {
      props: {
        mode: 'inline',
        openKeys: [],
        items,
      },
    })

    expect(wrapper.find('.ant-menu-submenu-open').exists()).toBe(false)

    await wrapper.setProps({ openKeys: ['sub1'] })
    await nextTick()

    const openSubMenu = wrapper.find('.ant-menu-submenu-open')
    expect(openSubMenu.exists()).toBe(true)
    expect(openSubMenu.text()).toContain('Navigation One')
  })

  it('emits click/select and update:selectedKeys events', async () => {
    const onClick = vi.fn()
    const onSelect = vi.fn()
    const onUpdateSelectedKeys = vi.fn()

    const wrapper = mount(Menu, {
      props: {
        mode: 'inline',
        items: [
          { key: '1', label: 'Option 1' },
          { key: '2', label: 'Option 2' },
        ],
        onClick,
        onSelect,
        'onUpdate:selectedKeys': onUpdateSelectedKeys,
      },
    })

    await wrapper.find('.ant-menu-item').trigger('click')
    await nextTick()

    expect(onClick).toHaveBeenCalled()
    expect(onSelect).toHaveBeenCalled()
    expect(onUpdateSelectedKeys).toHaveBeenCalled()
  })

  it('supports attrs.class/style and rootClass', () => {
    const wrapper = mount(Menu, {
      attrs: {
        class: 'menu-attr-class',
        style: 'border: 1px solid red;',
      },
      props: {
        mode: 'inline',
        rootClass: 'menu-root-class',
        items: [{ key: '1', label: 'Option 1' }],
      },
    })

    const root = wrapper.find('.ant-menu')
    expect(root.classes()).toContain('menu-attr-class')
    expect(root.attributes('style')).toContain('border: 1px solid red')
    expect(wrapper.find('.menu-root-class').exists()).toBe(true)
  })

  it('supports labelRender/extraRender/iconRender props', () => {
    const labelRender: NonNullable<MenuProps['labelRender']> = item =>
      <span class="menu-prop-label">{item.label}</span>
    const extraRender: NonNullable<MenuProps['extraRender']> = item =>
      item?.key ? <span class="menu-prop-extra">{item.key}</span> : null
    const iconRender: NonNullable<MenuProps['iconRender']> = item =>
      item?.key ? <span class="menu-prop-icon">{item.key}</span> : null

    const wrapper = mount(Menu, {
      props: {
        mode: 'inline',
        defaultOpenKeys: ['sub1'],
        items,
        labelRender,
        extraRender,
        iconRender,
      },
    })

    expect(wrapper.find('.menu-prop-label').exists()).toBe(true)
    expect(wrapper.find('.menu-prop-extra').exists()).toBe(true)
    expect(wrapper.find('.menu-prop-icon').exists()).toBe(true)
    expect(wrapper.find('.ant-menu-item-extra').exists()).toBe(true)
    expect(wrapper.find('.ant-menu-item-icon').exists()).toBe(true)
  })
})
