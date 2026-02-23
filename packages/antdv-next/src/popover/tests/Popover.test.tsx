import type { PopoverRef } from '..'
import KeyCode from '@v-c/util/dist/KeyCode'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import Popover from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount, waitFakeTimer } from '/@tests/utils'

async function flushPopoverTimer() {
  await waitFakeTimer(150, 10)
}

function isPopoverOpen() {
  const ele = document.querySelector<HTMLElement>('.ant-popover')
  if (!ele)
    return false
  if (ele.classList.contains('ant-popover-hidden'))
    return false
  return getComputedStyle(ele).display !== 'none'
}

describe('popover', () => {
  mountTest(Popover)
  rtlTest(Popover)

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

  it('renders title prop in overlay', async () => {
    mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Popover Title',
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        default: () => <span>trigger</span>,
      },
    })
    await flushPopoverTimer()
    expect(document.querySelector('.ant-popover-title')?.textContent).toContain('Popover Title')
  })

  it('renders content prop in overlay', async () => {
    mount(Popover, {
      attachTo: document.body,
      props: {
        content: 'Popover Content',
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        default: () => <span>trigger</span>,
      },
    })
    await flushPopoverTimer()
    expect(document.querySelector('.ant-popover-content')?.textContent).toContain('Popover Content')
  })

  it('renders title and content via slots', async () => {
    mount(Popover, {
      attachTo: document.body,
      props: {
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        title: () => <span class="slot-title">Slot Title</span>,
        content: () => <span class="slot-content">Slot Content</span>,
        default: () => <span>trigger</span>,
      },
    })
    await flushPopoverTimer()
    expect(document.querySelector('.slot-title')).toBeTruthy()
    expect(document.querySelector('.slot-content')).toBeTruthy()
  })

  it('slot takes priority over prop for title and content', async () => {
    mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Prop Title',
        content: 'Prop Content',
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        title: () => 'Slot Title',
        content: () => 'Slot Content',
        default: () => <span>trigger</span>,
      },
    })
    await flushPopoverTimer()
    expect(document.querySelector('.ant-popover-title')?.textContent).toContain('Slot Title')
    expect(document.querySelector('.ant-popover-content')?.textContent).toContain('Slot Content')
  })

  it('should not render overlay when both title and content are empty', async () => {
    mount(Popover, {
      attachTo: document.body,
      props: {
        trigger: 'click',
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        default: () => <span id="trigger-el">click me</span>,
      },
    })
    await flushPopoverTimer()
    const triggerEl = document.getElementById('trigger-el')!
    triggerEl.click()
    await flushPopoverTimer()
    expect(document.querySelector('.ant-popover')).toBeNull()
  })

  it('supports defaultOpen', async () => {
    mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Title',
        defaultOpen: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        default: () => <span>trigger</span>,
      },
    })
    await flushPopoverTimer()
    expect(isPopoverOpen()).toBe(true)
  })

  it('controlled open', async () => {
    const wrapper = mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Title',
        open: false,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        default: () => <span>trigger</span>,
      },
    })
    await flushPopoverTimer()
    expect(isPopoverOpen()).toBe(false)

    await wrapper.setProps({ open: true })
    await flushPopoverTimer()
    expect(isPopoverOpen()).toBe(true)

    await wrapper.setProps({ open: false })
    await flushPopoverTimer()
    expect(isPopoverOpen()).toBe(false)
  })

  it('fires openChange and update:open when hover trigger opens/closes', async () => {
    const onOpenChange = vi.fn()
    const onUpdateOpen = vi.fn()

    const wrapper = mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Title',
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onOpenChange,
        'onUpdate:open': onUpdateOpen,
      },
      slots: {
        default: () => <span id="hover-trigger">hover me</span>,
      },
    })
    await flushPopoverTimer()

    const triggerEl = wrapper.find('#hover-trigger')
    await triggerEl.trigger('mouseenter')
    await triggerEl.trigger('pointerenter')
    await flushPopoverTimer()

    expect(onOpenChange).toHaveBeenLastCalledWith(true, undefined)
    expect(onUpdateOpen).toHaveBeenLastCalledWith(true)

    await triggerEl.trigger('mouseleave')
    await triggerEl.trigger('pointerleave')
    await flushPopoverTimer()

    expect(onOpenChange).toHaveBeenLastCalledWith(false, undefined)
    expect(onUpdateOpen).toHaveBeenLastCalledWith(false)
  })

  it('in controlled mode, openChange fires but internal open stays false', async () => {
    const onOpenChange = vi.fn()

    const wrapper = mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Title',
        open: false,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onOpenChange,
      },
      slots: {
        default: () => <span id="ctrl-trigger">hover me</span>,
      },
    })
    await flushPopoverTimer()

    const triggerEl = wrapper.find('#ctrl-trigger')
    await triggerEl.trigger('mouseenter')
    await triggerEl.trigger('pointerenter')
    await flushPopoverTimer()

    // event fires but visual state stays closed (controlled)
    expect(onOpenChange).toHaveBeenLastCalledWith(true, undefined)
    expect(isPopoverOpen()).toBe(false)
  })

  it('switches from controlled to uncontrolled when open becomes undefined', async () => {
    const open = ref<boolean | undefined>(true)

    mount({
      render() {
        return (
          <Popover
            title="Title"
            open={open.value}
            mouseEnterDelay={0}
            mouseLeaveDelay={0}
          >
            <span id="switch-trigger">trigger</span>
          </Popover>
        )
      },
    }, { attachTo: document.body })

    await flushPopoverTimer()
    expect(isPopoverOpen()).toBe(true)

    // transition to uncontrolled: open was defined (true), now set to undefined → closes
    open.value = undefined
    await nextTick()
    await flushPopoverTimer()
    expect(isPopoverOpen()).toBe(false)
  })

  it('eSC key closes the popover', async () => {
    const onOpenChange = vi.fn()

    const wrapper = mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Title',
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onOpenChange,
      },
      slots: {
        default: () => <span id="esc-trigger">trigger</span>,
      },
    })
    await flushPopoverTimer()

    // open it first
    const triggerEl = wrapper.find('#esc-trigger')
    await triggerEl.trigger('mouseenter')
    await triggerEl.trigger('pointerenter')
    await flushPopoverTimer()
    expect(onOpenChange).toHaveBeenLastCalledWith(true, undefined)

    // press ESC
    await triggerEl.trigger('keydown', { keyCode: KeyCode.ESC })
    await flushPopoverTimer()
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.any(Object))
  })

  it('defaults to hover trigger', async () => {
    const onOpenChange = vi.fn()

    const wrapper = mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Title',
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onOpenChange,
      },
      slots: {
        default: () => <span id="default-trigger">hover me</span>,
      },
    })
    await flushPopoverTimer()

    const triggerEl = wrapper.find('#default-trigger')
    await triggerEl.trigger('mouseenter')
    await triggerEl.trigger('pointerenter')
    await flushPopoverTimer()
    expect(onOpenChange).toHaveBeenLastCalledWith(true, undefined)
  })

  it('supports click trigger', async () => {
    const onOpenChange = vi.fn()

    const wrapper = mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Title',
        trigger: 'click',
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onOpenChange,
      },
      slots: {
        default: () => <span id="click-trigger">click me</span>,
      },
    })
    await flushPopoverTimer()

    const triggerEl = wrapper.find('#click-trigger')
    await triggerEl.trigger('click')
    await flushPopoverTimer()
    expect(onOpenChange).toHaveBeenLastCalledWith(true, undefined)
  })

  it('supports placement prop', async () => {
    mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Title',
        placement: 'bottom',
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        default: () => <span>trigger</span>,
      },
    })
    await flushPopoverTimer()
    // popover should render (placement doesn't affect visibility test)
    expect(isPopoverOpen()).toBe(true)
  })

  it('supports arrow prop', async () => {
    mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Title',
        arrow: true,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        default: () => <span>trigger</span>,
      },
    })
    await flushPopoverTimer()
    expect(document.querySelector('.ant-popover-arrow')).toBeTruthy()
  })

  it('arrow={false} hides the arrow', async () => {
    mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Title',
        arrow: false,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        default: () => <span>trigger</span>,
      },
    })
    await flushPopoverTimer()
    expect(document.querySelector('.ant-popover-arrow')).toBeNull()
  })

  it('configProvider arrow prop controls popover arrow', async () => {
    mount({
      render() {
        return (
          <ConfigProvider popover={{ arrow: false }}>
            <Popover
              title="Title"
              open={true}
              mouseEnterDelay={0}
              mouseLeaveDelay={0}
            >
              <span>trigger</span>
            </Popover>
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })
    await flushPopoverTimer()
    expect(document.querySelector('.ant-popover-arrow')).toBeNull()
  })

  it('component-level arrow overrides ConfigProvider arrow', async () => {
    mount({
      render() {
        return (
          <ConfigProvider popover={{ arrow: false }}>
            <Popover
              title="Title"
              arrow={true}
              open={true}
              mouseEnterDelay={0}
              mouseLeaveDelay={0}
            >
              <span>trigger</span>
            </Popover>
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })
    await flushPopoverTimer()
    expect(document.querySelector('.ant-popover-arrow')).not.toBeNull()
  })

  it('configProvider trigger prop controls popover trigger', async () => {
    const onOpenChange = vi.fn()

    const wrapper = mount({
      render() {
        return (
          <ConfigProvider popover={{ trigger: 'click' }}>
            <Popover
              title="Title"
              mouseEnterDelay={0}
              mouseLeaveDelay={0}
              onOpenChange={onOpenChange}
            >
              <span id="cp-trigger">trigger</span>
            </Popover>
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })
    await flushPopoverTimer()

    // hover should NOT trigger open (trigger=click from ConfigProvider)
    const triggerEl = wrapper.find('#cp-trigger')
    await triggerEl.trigger('mouseenter')
    await triggerEl.trigger('pointerenter')
    await flushPopoverTimer()
    expect(onOpenChange).not.toHaveBeenCalled()

    // click should open it
    await triggerEl.trigger('click')
    await flushPopoverTimer()
    expect(onOpenChange).toHaveBeenLastCalledWith(true, undefined)
  })

  it('exposes forceAlign, nativeElement, popupElement', () => {
    const popoverRef = ref<PopoverRef | null>(null)
    mount({
      render() {
        return (
          <Popover
            ref={popoverRef}
            title="Title"
            open={true}
          >
            <span>trigger</span>
          </Popover>
        )
      },
    }, { attachTo: document.body })

    expect(typeof popoverRef.value?.forceAlign).toBe('function')
  })

  it('non-ESC keydown does not close the popover', async () => {
    const onOpenChange = vi.fn()

    const wrapper = mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Title',
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onOpenChange,
      },
      slots: {
        default: () => <span id="non-esc-trigger">trigger</span>,
      },
    })
    await flushPopoverTimer()

    // open it
    const triggerEl = wrapper.find('#non-esc-trigger')
    await triggerEl.trigger('mouseenter')
    await triggerEl.trigger('pointerenter')
    await flushPopoverTimer()
    expect(onOpenChange).toHaveBeenLastCalledWith(true, undefined)

    const callCountBefore = onOpenChange.mock.calls.length

    // press Enter (not ESC)
    await triggerEl.trigger('keydown', { keyCode: 13 })
    await flushPopoverTimer()

    // openChange should NOT be called again
    expect(onOpenChange.mock.calls.length).toBe(callCountBefore)
  })

  it('renders without default slot children', () => {
    // children is null → createVNode branch skipped
    expect(() => {
      mount(Popover, {
        props: {
          title: 'Title',
          open: true,
        },
      })
    }).not.toThrow()
  })

  it('purePanel _InternalPanelDoNotUseOrYouWillBeFired renders without error', () => {
    const InternalPanel = (Popover as any)._InternalPanelDoNotUseOrYouWillBeFired

    expect(() => {
      mount(InternalPanel, {
        props: {
          title: 'Panel Title',
          content: 'Panel Content',
        },
      })
    }).not.toThrow()
  })

  it('purePanel handles null title and content without error', () => {
    const InternalPanel = (Popover as any)._InternalPanelDoNotUseOrYouWillBeFired

    expect(() => {
      mount(InternalPanel, {
        props: {
          title: null,
          content: null,
        },
      })
    }).not.toThrow()
  })

  it('matches snapshot with title and content', async () => {
    mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Snapshot Title',
        content: 'Snapshot Content',
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        default: () => <span>trigger</span>,
      },
    })
    await flushPopoverTimer()

    const snapshotContainer = document.createElement('div')
    const popoverEl = document.querySelector('.ant-popover')
    if (popoverEl) {
      snapshotContainer.appendChild(popoverEl.cloneNode(true))
    }
    expect(snapshotContainer.innerHTML).toMatchSnapshot()
  })
})
