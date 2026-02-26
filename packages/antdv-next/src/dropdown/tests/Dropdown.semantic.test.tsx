import type { DropdownProps } from '..'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import Dropdown from '..'
import ConfigProvider from '../../config-provider'
import { mount, waitFakeTimer } from '/@tests/utils'

const menu: DropdownProps['menu'] = {
  items: [
    { key: '1', label: 'Item 1', icon: <span class="item-icon">icon</span> },
    { key: '2', label: 'Item 2' },
    {
      key: 'group',
      type: 'group',
      label: 'Group Title',
      children: [
        { key: '3', label: 'Group Item' },
      ],
    },
  ],
}

async function flushDropdownTimer() {
  await waitFakeTimer(150, 10)
}

describe('dropdown.Semantic', () => {
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

  it('supports static object classes on root', async () => {
    const classes: DropdownProps['classes'] = {
      root: 'custom-root',
    }

    mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        classes,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()

    const dropdownEl = document.querySelector<HTMLElement>('.ant-dropdown')
    expect(dropdownEl?.classList.contains('custom-root')).toBe(true)
  })

  it('supports static object styles on root', async () => {
    const styles: DropdownProps['styles'] = {
      root: { backgroundColor: 'red' },
    }

    mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        styles,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()

    const dropdownEl = document.querySelector<HTMLElement>('.ant-dropdown')
    expect(dropdownEl?.style.backgroundColor).toBe('red')
  })

  it('supports function-based classes', async () => {
    const classes: DropdownProps['classes'] = (info) => {
      if (info.props.placement === 'top') {
        return { root: 'top-dropdown' }
      }
      return { root: 'other-dropdown' }
    }

    mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        placement: 'top',
        classes,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()

    const dropdownEl = document.querySelector<HTMLElement>('.ant-dropdown')
    expect(dropdownEl?.classList.contains('top-dropdown')).toBe(true)
  })

  it('supports function-based styles', async () => {
    const styles: DropdownProps['styles'] = (info) => {
      if (info.props.arrow) {
        return { root: { padding: '8px' } }
      }
      return { root: { padding: '4px' } }
    }

    mount(Dropdown, {
      attachTo: document.body,
      props: {
        menu,
        arrow: true,
        styles,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: { default: () => <span>trigger</span> },
    })
    await flushDropdownTimer()

    const dropdownEl = document.querySelector<HTMLElement>('.ant-dropdown')
    expect(dropdownEl?.style.padding).toBe('8px')
  })

  it('configProvider classes merge with component classes', async () => {
    mount({
      render() {
        return (
          <ConfigProvider
            dropdown={{
              classes: { root: 'cp-root' },
            }}
          >
            <Dropdown
              menu={menu}
              classes={{ root: 'comp-root' }}
              open={true}
              mouseEnterDelay={0}
              mouseLeaveDelay={0}
            >
              <span>trigger</span>
            </Dropdown>
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })
    await flushDropdownTimer()

    const dropdownEl = document.querySelector<HTMLElement>('.ant-dropdown')
    expect(dropdownEl?.classList.contains('cp-root')).toBe(true)
    expect(dropdownEl?.classList.contains('comp-root')).toBe(true)
  })

  it('configProvider styles merge with component styles', async () => {
    mount({
      render() {
        return (
          <ConfigProvider
            dropdown={{
              styles: { root: { margin: '1px' } },
            }}
          >
            <Dropdown
              menu={menu}
              styles={{ root: { padding: '2px' } }}
              open={true}
              mouseEnterDelay={0}
              mouseLeaveDelay={0}
            >
              <span>trigger</span>
            </Dropdown>
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })
    await flushDropdownTimer()

    const dropdownEl = document.querySelector<HTMLElement>('.ant-dropdown')
    // Styles are merged on overlay
    expect(dropdownEl?.style.padding).toBe('2px')
  })
})
