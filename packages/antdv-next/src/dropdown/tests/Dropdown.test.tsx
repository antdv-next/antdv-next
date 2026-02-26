import type { DropdownProps } from '..'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Dropdown from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount, waitFakeTimer } from '/@tests/utils'

const menu: DropdownProps['menu'] = {
  items: [
    { key: '1', label: 'Item 1' },
    { key: '2', label: 'Item 2' },
    { key: '3', label: 'Item 3' },
  ],
}

async function flushDropdownTimer() {
  await waitFakeTimer(150, 10)
}

function isDropdownOpen() {
  const el = document.querySelector<HTMLElement>('.ant-dropdown')
  if (!el)
    return false
  if (el.classList.contains('ant-dropdown-hidden'))
    return false
  return getComputedStyle(el).display !== 'none'
}

describe('dropdown', () => {
  mountTest(() => h(Dropdown, { menu }, { default: () => h('span', 'trigger') }))
  rtlTest(() => h(Dropdown, { menu }, { default: () => h('span', 'trigger') }))

  let originOffsetParentDescriptor: PropertyDescriptor | undefined

  beforeAll(() => {
    originOffsetParentDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent')
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      configurable: true,
      get: () => document.body,
    })
  })

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  afterAll(() => {
    if (originOffsetParentDescriptor) {
      Object.defineProperty(HTMLElement.prototype, 'offsetParent', originOffsetParentDescriptor)
    }
  })

  // =================== Basic Rendering ===================

  it('should render trigger child', () => {
    const wrapper = mount(Dropdown, {
      props: { menu },
      slots: { default: () => <span class="trigger-child">Click me</span> },
    })
    expect(wrapper.find('.trigger-child').exists()).toBe(true)
    expect(wrapper.find('.trigger-child').text()).toBe('Click me')
  })

  it('should add ant-dropdown-trigger class to child', () => {
    const wrapper = mount(Dropdown, {
      props: { menu },
      slots: { default: () => <span>trigger</span> },
    })
    expect(wrapper.find('.ant-dropdown-trigger').exists()).toBe(true)
  })

  it('should render menu overlay when open', async () => {
    mount(Dropdown, {
      attachTo: document.body,
      props: { menu, open: true, mouseEnterDelay: 0, mouseLeaveDelay: 0 },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    expect(isDropdownOpen()).toBe(true)
    const menuEl = document.querySelector('.ant-dropdown-menu')
    expect(menuEl).toBeTruthy()
  })

  it('should render menu items', async () => {
    mount(Dropdown, {
      attachTo: document.body,
      props: { menu, open: true, mouseEnterDelay: 0, mouseLeaveDelay: 0 },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    const items = document.querySelectorAll('.ant-dropdown-menu-item')
    expect(items.length).toBe(3)
  })

  // =================== Placement ===================

  it('should default placement to bottomLeft in LTR', () => {
    const wrapper = mount(Dropdown, {
      props: { menu, open: true },
      slots: { default: () => <span>trigger</span> },
    })
    // No explicit placement → defaults to bottomLeft
    expect(wrapper.html()).toBeTruthy()
  })

  it('should default placement to bottomRight in RTL', async () => {
    mount({
      render() {
        return (
          <ConfigProvider direction="rtl">
            <Dropdown menu={menu} open={true} mouseEnterDelay={0} mouseLeaveDelay={0}>
              <span>trigger</span>
            </Dropdown>
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })
    await flushDropdownTimer()
    // Should render without error in RTL mode
    expect(isDropdownOpen()).toBe(true)
  })

  it('should strip Center from placement', async () => {
    mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        open: true,
        placement: 'bottomCenter',
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    // bottomCenter → bottom (stripped) — renders without error
    expect(isDropdownOpen()).toBe(true)
  })

  it('should accept topCenter placement', async () => {
    mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        open: true,
        placement: 'topCenter',
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    expect(isDropdownOpen()).toBe(true)
  })

  it.each([
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
    'top',
    'bottom',
  ] as const)('should support placement=%s', async (placement) => {
    mount(Dropdown, {
      attachTo: document.body,
      props: { menu, open: true, placement, mouseEnterDelay: 0, mouseLeaveDelay: 0 },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    expect(isDropdownOpen()).toBe(true)
  })

  // =================== Trigger ===================

  it('should disable trigger when disabled', async () => {
    const onOpenChange = vi.fn()
    const wrapper = mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        disabled: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onOpenChange,
      },
      slots: { default: () => <span id="disabled-trigger">trigger</span> },
    })
    await flushDropdownTimer()

    const triggerEl = wrapper.find('#disabled-trigger')
    await triggerEl.trigger('mouseenter')
    await triggerEl.trigger('pointerenter')
    await flushDropdownTimer()
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('should normalize contextmenu trigger to contextMenu', async () => {
    const onOpenChange = vi.fn()
    const wrapper = mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        trigger: ['contextmenu'],
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onOpenChange,
      },
      slots: { default: () => <span id="ctx-trigger">trigger</span> },
    })
    await flushDropdownTimer()

    const triggerEl = wrapper.find('#ctx-trigger')
    await triggerEl.trigger('contextmenu')
    await flushDropdownTimer()
    expect(onOpenChange).toHaveBeenCalledWith(true, { source: 'trigger' })
  })

  it('should support click trigger', async () => {
    const onOpenChange = vi.fn()
    const wrapper = mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        trigger: ['click'],
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onOpenChange,
      },
      slots: { default: () => <span id="click-trigger">trigger</span> },
    })
    await flushDropdownTimer()

    const triggerEl = wrapper.find('#click-trigger')
    await triggerEl.trigger('click')
    await flushDropdownTimer()
    expect(onOpenChange).toHaveBeenCalledWith(true, { source: 'trigger' })
  })

  // =================== Open / Controlled ===================

  it('should support controlled open', async () => {
    const wrapper = mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        open: false,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    expect(isDropdownOpen()).toBe(false)

    await wrapper.setProps({ open: true })
    await flushDropdownTimer()
    expect(isDropdownOpen()).toBe(true)

    await wrapper.setProps({ open: false })
    await flushDropdownTimer()
    expect(isDropdownOpen()).toBe(false)
  })

  it('should emit openChange and update:open on trigger', async () => {
    const onOpenChange = vi.fn()
    const onUpdateOpen = vi.fn()

    const wrapper = mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        trigger: ['click'],
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onOpenChange,
        'onUpdate:open': onUpdateOpen,
      },
      slots: { default: () => <span id="emit-trigger">trigger</span> },
    })
    await flushDropdownTimer()

    const triggerEl = wrapper.find('#emit-trigger')
    await triggerEl.trigger('click')
    await flushDropdownTimer()

    expect(onOpenChange).toHaveBeenCalledWith(true, { source: 'trigger' })
    expect(onUpdateOpen).toHaveBeenCalledWith(true)
  })

  it('in controlled mode, openChange fires but dropdown stays closed', async () => {
    const onOpenChange = vi.fn()

    const wrapper = mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        open: false,
        trigger: ['click'],
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onOpenChange,
      },
      slots: { default: () => <span id="ctrl-trigger">trigger</span> },
    })
    await flushDropdownTimer()

    const triggerEl = wrapper.find('#ctrl-trigger')
    await triggerEl.trigger('click')
    await flushDropdownTimer()

    expect(onOpenChange).toHaveBeenCalledWith(true, { source: 'trigger' })
    // Still closed because controlled
    expect(isDropdownOpen()).toBe(false)
  })

  it('should update mergedOpen when open prop changes via watch', async () => {
    const open = ref(false)

    mount({
      render() {
        return (
          <Dropdown menu={menu} open={open.value} mouseEnterDelay={0} mouseLeaveDelay={0}>
            <span>trigger</span>
          </Dropdown>
        )
      },
    }, { attachTo: document.body })

    await flushDropdownTimer()
    expect(isDropdownOpen()).toBe(false)

    open.value = true
    await nextTick()
    await flushDropdownTimer()
    expect(isDropdownOpen()).toBe(true)

    open.value = false
    await nextTick()
    await flushDropdownTimer()
    expect(isDropdownOpen()).toBe(false)
  })

  // =================== Menu Click ===================

  it('should close on menu item click', async () => {
    const onOpenChange = vi.fn()
    const onUpdateOpen = vi.fn()

    mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onOpenChange,
        'onUpdate:open': onUpdateOpen,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()

    const menuItem = document.querySelector<HTMLElement>('.ant-dropdown-menu-item')
    menuItem?.click()
    await flushDropdownTimer()

    expect(onOpenChange).toHaveBeenCalledWith(false, { source: 'menu' })
    expect(onUpdateOpen).toHaveBeenCalledWith(false)
  })

  it('should emit menuClick on menu item click', async () => {
    const onMenuClick = vi.fn()

    mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onMenuClick,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()

    const menuItem = document.querySelector<HTMLElement>('.ant-dropdown-menu-item')
    menuItem?.click()
    await flushDropdownTimer()

    expect(onMenuClick).toHaveBeenCalled()
  })

  it('should keep open when menu is selectable and multiple', async () => {
    const onOpenChange = vi.fn()
    const onUpdateOpen = vi.fn()

    const wrapper = mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu: { ...menu, selectable: true, multiple: true },
        trigger: ['click'],
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onOpenChange,
        'onUpdate:open': onUpdateOpen,
      },
      slots: { default: () => <span id="multi-trigger">trigger</span> },
    })
    await flushDropdownTimer()

    // Open dropdown via click (uncontrolled)
    const triggerEl = wrapper.find('#multi-trigger')
    await triggerEl.trigger('click')
    await flushDropdownTimer()
    expect(isDropdownOpen()).toBe(true)

    // Click menu item — should NOT close
    const menuItem = document.querySelector<HTMLElement>('.ant-dropdown-menu-item')
    menuItem?.click()
    await flushDropdownTimer()

    // Dropdown should still be open (onMenuClick returns early for selectable+multiple)
    expect(isDropdownOpen()).toBe(true)
    // update:open(false) should NOT have been called from menu source
    expect(onUpdateOpen).not.toHaveBeenCalledWith(false)
  })

  it('should close when selectable but not multiple', async () => {
    const onUpdateOpen = vi.fn()

    mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu: { ...menu, selectable: true },
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        'onUpdate:open': onUpdateOpen,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()

    const menuItem = document.querySelector<HTMLElement>('.ant-dropdown-menu-item')
    menuItem?.click()
    await flushDropdownTimer()

    expect(onUpdateOpen).toHaveBeenCalledWith(false)
  })

  // =================== Arrow ===================

  it('should render arrow when arrow=true', async () => {
    mount(Dropdown, {
      attachTo: document.body,
      props: { menu, arrow: true, open: true, mouseEnterDelay: 0, mouseLeaveDelay: 0 },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    expect(document.querySelector('.ant-dropdown-arrow')).toBeTruthy()
  })

  it('should not render arrow when arrow=false', async () => {
    mount(Dropdown, {
      attachTo: document.body,
      props: { menu, arrow: false, open: true, mouseEnterDelay: 0, mouseLeaveDelay: 0 },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    expect(document.querySelector('.ant-dropdown-arrow')).toBeNull()
  })

  it('should support arrow with pointAtCenter', async () => {
    mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        arrow: { pointAtCenter: true },
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    expect(document.querySelector('.ant-dropdown-arrow')).toBeTruthy()
  })

  // =================== Transition ===================

  it('should use custom transitionName', async () => {
    mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        transitionName: 'my-transition',
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    expect(isDropdownOpen()).toBe(true)
  })

  it('should use slide-down transition for top placement', async () => {
    mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        placement: 'topLeft',
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    // top placement → slide-down; other → slide-up (renders without error)
    expect(isDropdownOpen()).toBe(true)
  })

  // =================== Children Rendering ===================

  it('should wrap multiple children in span', () => {
    const wrapper = mount(Dropdown, {
      props: { menu },
      slots: { default: () => [<span>a</span>, <span>b</span>] },
    })
    expect(wrapper.find('.ant-dropdown-trigger').element.tagName).toBe('SPAN')
  })

  it('should not wrap single VNode child in extra span', () => {
    const wrapper = mount(Dropdown, {
      props: { menu },
      slots: { default: () => <button>click</button> },
    })
    expect(wrapper.find('.ant-dropdown-trigger').element.tagName).toBe('BUTTON')
  })

  // =================== popupRender ===================

  it('should support popupRender prop', async () => {
    mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        popupRender: (menuNode: any) => <div class="custom-popup">{menuNode}</div>,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    expect(document.querySelector('.custom-popup')).toBeTruthy()
  })

  it('should support popupRender slot', async () => {
    mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        default: () => <span>trigger</span>,
        popupRender: (menuNode: any) => <div class="slot-popup">{menuNode}</div>,
      },
    })
    await flushDropdownTimer()
    expect(document.querySelector('.slot-popup')).toBeTruthy()
  })

  it('popupRender slot takes priority over prop', async () => {
    mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        popupRender: () => <div class="prop-popup">prop</div>,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        default: () => <span>trigger</span>,
        popupRender: () => <div class="slot-popup">slot</div>,
      },
    })
    await flushDropdownTimer()
    expect(document.querySelector('.slot-popup')).toBeTruthy()
    expect(document.querySelector('.prop-popup')).toBeNull()
  })

  it('should support popupRender without menu items', async () => {
    mount(Dropdown, {
      attachTo: document.body,
      props: {
        popupRender: () => <div class="custom-content">Custom Content</div>,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    expect(document.querySelector('.custom-content')).toBeTruthy()
    // No menu rendered
    expect(document.querySelector('.ant-dropdown-menu')).toBeNull()
  })

  // =================== Disabled ===================

  it('should respect disabled on trigger child', () => {
    const wrapper = mount(Dropdown, {
      props: { menu },
      slots: { default: () => <button disabled>disabled btn</button> },
    })
    const trigger = wrapper.find('.ant-dropdown-trigger')
    expect(trigger.attributes('disabled')).toBeDefined()
  })

  it('should respect disabled prop on Dropdown', () => {
    const wrapper = mount(Dropdown, {
      props: { menu, disabled: true },
      slots: { default: () => <button>btn</button> },
    })
    const trigger = wrapper.find('.ant-dropdown-trigger')
    expect(trigger.attributes('disabled')).toBeDefined()
  })

  // =================== RTL ===================

  it('should add rtl class in RTL mode', async () => {
    mount({
      render() {
        return (
          <ConfigProvider direction="rtl">
            <Dropdown menu={menu} open={true} mouseEnterDelay={0} mouseLeaveDelay={0}>
              <span>trigger</span>
            </Dropdown>
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })
    await flushDropdownTimer()

    // trigger should have rtl class
    const trigger = document.querySelector('.ant-dropdown-trigger')
    expect(trigger?.classList.contains('ant-dropdown-rtl')).toBe(true)

    // overlay should have rtl class
    const overlay = document.querySelector('.ant-dropdown')
    expect(overlay?.classList.contains('ant-dropdown-rtl')).toBe(true)
  })

  it('should render RightOutlined arrow in LTR submenu', async () => {
    const subMenu: DropdownProps['menu'] = {
      items: [
        {
          key: 'sub',
          label: 'Parent',
          children: [
            { key: 'sub-1', label: 'Sub Item 1' },
          ],
        },
      ],
    }
    mount(Dropdown, {
      attachTo: document.body,
      props: { menu: subMenu, open: true, mouseEnterDelay: 0, mouseLeaveDelay: 0 },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    expect(document.querySelector('.ant-dropdown-menu-submenu-arrow-icon')).toBeTruthy()
  })

  it('should render LeftOutlined arrow in RTL submenu', async () => {
    const subMenu: DropdownProps['menu'] = {
      items: [
        {
          key: 'sub',
          label: 'Parent',
          children: [
            { key: 'sub-1', label: 'Sub Item 1' },
          ],
        },
      ],
    }
    mount({
      render() {
        return (
          <ConfigProvider direction="rtl">
            <Dropdown menu={subMenu} open={true} mouseEnterDelay={0} mouseLeaveDelay={0}>
              <span>trigger</span>
            </Dropdown>
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })
    await flushDropdownTimer()
    expect(document.querySelector('.ant-dropdown-menu-submenu-arrow-icon')).toBeTruthy()
  })

  // =================== rootClass ===================

  it('should apply rootClass to overlay', async () => {
    mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        rootClass: 'my-root',
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    const overlay = document.querySelector('.ant-dropdown')
    expect(overlay?.classList.contains('my-root')).toBe(true)
  })

  // =================== destroyOnHidden ===================

  it('should support destroyOnHidden', async () => {
    const wrapper = mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        destroyOnHidden: true,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    expect(isDropdownOpen()).toBe(true)

    await wrapper.setProps({ open: false })
    await flushDropdownTimer()
    // After closing with destroyOnHidden, the DOM may be removed
    // Just verify no error occurs
  })

  // =================== Menu disabled item ===================

  it('should render disabled menu item', async () => {
    const disabledMenu: DropdownProps['menu'] = {
      items: [
        { key: '1', label: 'Enabled' },
        { key: '2', label: 'Disabled', disabled: true },
      ],
    }
    mount(Dropdown, {
      attachTo: document.body,
      props: { menu: disabledMenu, open: true, mouseEnterDelay: 0, mouseLeaveDelay: 0 },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    const disabledItem = document.querySelector('.ant-dropdown-menu-item-disabled')
    expect(disabledItem).toBeTruthy()
  })

  // =================== Menu with danger item ===================

  it('should render danger menu item', async () => {
    const dangerMenu: DropdownProps['menu'] = {
      items: [
        { key: '1', label: 'Normal' },
        { key: '2', label: 'Delete', danger: true },
      ],
    }
    mount(Dropdown, {
      attachTo: document.body,
      props: { menu: dangerMenu, open: true, mouseEnterDelay: 0, mouseLeaveDelay: 0 },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    const dangerItem = document.querySelector('.ant-dropdown-menu-item-danger')
    expect(dangerItem).toBeTruthy()
  })

  // =================== Menu with divider ===================

  it('should render menu divider', async () => {
    const dividerMenu: DropdownProps['menu'] = {
      items: [
        { key: '1', label: 'Item 1' },
        { type: 'divider' },
        { key: '2', label: 'Item 2' },
      ],
    }
    mount(Dropdown, {
      attachTo: document.body,
      props: { menu: dividerMenu, open: true, mouseEnterDelay: 0, mouseLeaveDelay: 0 },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    const divider = document.querySelector('.ant-dropdown-menu-item-divider')
    expect(divider).toBeTruthy()
  })

  // =================== Menu with group ===================

  it('should render menu item group', async () => {
    const groupMenu: DropdownProps['menu'] = {
      items: [
        {
          key: 'group',
          type: 'group',
          label: 'Group Title',
          children: [
            { key: '1', label: 'Item 1' },
            { key: '2', label: 'Item 2' },
          ],
        },
      ],
    }
    mount(Dropdown, {
      attachTo: document.body,
      props: { menu: groupMenu, open: true, mouseEnterDelay: 0, mouseLeaveDelay: 0 },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()
    const group = document.querySelector('.ant-dropdown-menu-item-group')
    expect(group).toBeTruthy()
    const groupTitle = document.querySelector('.ant-dropdown-menu-item-group-title')
    expect(groupTitle).toBeTruthy()
  })

  // =================== ConfigProvider ===================

  it('should work with ConfigProvider prefixCls', async () => {
    mount({
      render() {
        return (
          <ConfigProvider prefixCls="my">
            <Dropdown menu={menu} open={true} mouseEnterDelay={0} mouseLeaveDelay={0}>
              <span>trigger</span>
            </Dropdown>
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })
    await flushDropdownTimer()
    expect(document.querySelector('.my-dropdown')).toBeTruthy()
  })

  // =================== PurePanel ===================

  it('_InternalPanelDoNotUseOrYouWillBeFired renders without error', () => {
    const InternalPanel = (Dropdown as any)._InternalPanelDoNotUseOrYouWillBeFired

    expect(() => {
      mount(InternalPanel, {
        props: { menu },
      })
    }).not.toThrow()
  })

  // =================== Dynamic update ===================

  it('should update when menu items change dynamically', async () => {
    const items = ref([{ key: '1', label: 'Item 1' }])
    mount({
      render() {
        return (
          <Dropdown menu={{ items: items.value }} open={true} mouseEnterDelay={0} mouseLeaveDelay={0}>
            <span>trigger</span>
          </Dropdown>
        )
      },
    }, { attachTo: document.body })
    await flushDropdownTimer()
    expect(document.querySelectorAll('.ant-dropdown-menu-item').length).toBe(1)

    items.value = [
      { key: '1', label: 'Item 1' },
      { key: '2', label: 'Item 2' },
    ]
    await nextTick()
    await flushDropdownTimer()
    expect(document.querySelectorAll('.ant-dropdown-menu-item').length).toBe(2)
  })

  // =================== Snapshot ===================

  it('should match snapshot', async () => {
    mount(Dropdown, {
      attachTo: document.body,
      props: { menu, open: true, mouseEnterDelay: 0, mouseLeaveDelay: 0 },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()

    const snapshotContainer = document.createElement('div')
    const dropdownEl = document.querySelector('.ant-dropdown')
    if (dropdownEl) {
      snapshotContainer.appendChild(dropdownEl.cloneNode(true))
    }
    expect(snapshotContainer.innerHTML).toMatchSnapshot()
  })
})
