import type { MenuProps } from '..'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Menu from '..'
import { mount } from '/@tests/utils'

async function flushMenu() {
  await Promise.resolve()
  await nextTick()
  await Promise.resolve()
  await nextTick()
}

describe('menu lazy render and single event dispatch', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  // https://github.com/antdv-next/antdv-next/issues/583
  it('does not render closed inline submenu content until first open', async () => {
    const items: NonNullable<MenuProps['items']> = [
      {
        key: 'sub1',
        label: 'Navigation One',
        children: Array.from({ length: 20 }, (_, index) => ({
          key: `item-${index}`,
          label: `Option ${index}`,
        })),
      },
      { key: 'top', label: 'Top Item' },
    ]

    const wrapper = mount(Menu, {
      props: { mode: 'inline', items, openKeys: [] },
    })
    await flushMenu()

    // Closed submenu keeps its content out of the DOM entirely
    expect(wrapper.find('.ant-menu-sub').exists()).toBe(false)
    expect(wrapper.findAll('.ant-menu-item')).toHaveLength(1)

    await wrapper.setProps({ openKeys: ['sub1'] })
    await flushMenu()
    expect(wrapper.findAll('.ant-menu-sub .ant-menu-item')).toHaveLength(20)
    expect(wrapper.find('.ant-menu-submenu').classes()).toContain('ant-menu-submenu-open')

    // After closing, the DOM is kept and only hidden (rc-menu `removeOnLeave: false`)
    await wrapper.setProps({ openKeys: [] })
    await flushMenu()
    expect(wrapper.find('.ant-menu-sub').exists()).toBe(true)
    expect(wrapper.find('.ant-menu-submenu').classes()).not.toContain('ant-menu-submenu-open')
  })

  it('still highlights parent submenu of a selected key while closed', async () => {
    const items: NonNullable<MenuProps['items']> = [
      {
        key: 'sub1',
        label: 'Navigation One',
        children: [{ key: 'leaf', label: 'Leaf' }],
      },
    ]

    const wrapper = mount(Menu, {
      props: { mode: 'inline', items, openKeys: [], selectedKeys: ['leaf'] },
    })
    await flushMenu()

    expect(wrapper.find('.ant-menu-sub').exists()).toBe(false)
    expect(wrapper.find('.ant-menu-submenu').classes()).toContain('ant-menu-submenu-selected')
  })

  // https://github.com/antdv-next/antdv-next/issues/588
  it('fires item onClick exactly once with info payload', async () => {
    const itemClick = vi.fn()
    const menuClick = vi.fn()
    const items: NonNullable<MenuProps['items']> = [
      { key: '1', label: 'Option 1', onClick: itemClick } as any,
    ]

    const wrapper = mount(Menu, {
      props: { items, onClick: menuClick },
    })
    await flushMenu()

    await wrapper.find('.ant-menu-item').trigger('click')

    expect(itemClick).toHaveBeenCalledTimes(1)
    expect(menuClick).toHaveBeenCalledTimes(1)
    // Callbacks receive the info object, not the raw DOM event
    expect(itemClick.mock.calls[0][0].key).toBe('1')
    expect(itemClick.mock.calls[0][0].domEvent).toBeInstanceOf(MouseEvent)
    expect(menuClick.mock.calls[0][0].key).toBe('1')
  })

  it('fires submenu child onClick exactly once in inline mode', async () => {
    const childClick = vi.fn()
    const titleClick = vi.fn()
    const items: NonNullable<MenuProps['items']> = [
      {
        key: 'sub1',
        label: 'Navigation One',
        onTitleClick: titleClick,
        children: [
          { key: 'child', label: 'Child', onClick: childClick } as any,
        ],
      } as any,
    ]

    const wrapper = mount(Menu, {
      props: { mode: 'inline', items, openKeys: ['sub1'] },
    })
    await flushMenu()

    await wrapper.find('.ant-menu-sub .ant-menu-item').trigger('click')
    expect(childClick).toHaveBeenCalledTimes(1)
    expect(titleClick).not.toHaveBeenCalled()

    await wrapper.find('.ant-menu-submenu-title').trigger('click')
    expect(titleClick).toHaveBeenCalledTimes(1)
  })
})
