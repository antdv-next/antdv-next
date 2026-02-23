import type { PopoverProps } from '..'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import Popover from '..'
import ConfigProvider from '../../config-provider'
import { mount, waitFakeTimer } from '/@tests/utils'

async function flushPopoverTimer() {
  await waitFakeTimer(150, 10)
}

describe('popover.Semantic', () => {
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

  it('supports static object classes on root, container, arrow, title, content', async () => {
    const classes: PopoverProps['classes'] = {
      root: 'custom-root',
      container: 'custom-container',
      title: 'custom-title',
      content: 'custom-content',
    }

    mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Title',
        content: 'Content',
        classes,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        default: () => <span>trigger</span>,
      },
    })
    await flushPopoverTimer()

    const popoverEl = document.querySelector<HTMLElement>('.ant-popover')
    const containerEl = document.querySelector<HTMLElement>('.ant-popover-container')
    const titleEl = document.querySelector<HTMLElement>('.ant-popover-title')
    const contentEl = document.querySelector<HTMLElement>('.ant-popover-content')

    expect(popoverEl).toHaveClass('custom-root')
    expect(containerEl).toHaveClass('custom-container')
    expect(titleEl).toHaveClass('custom-title')
    expect(contentEl).toHaveClass('custom-content')
  })

  it('supports static object styles on root, container, title, content', async () => {
    const styles: PopoverProps['styles'] = {
      root: { backgroundColor: 'red' },
      container: { color: 'blue' },
      title: { fontWeight: 'bold' },
      content: { fontSize: '14px' },
    }

    mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Title',
        content: 'Content',
        styles,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        default: () => <span>trigger</span>,
      },
    })
    await flushPopoverTimer()

    const popoverEl = document.querySelector<HTMLElement>('.ant-popover')
    const containerEl = document.querySelector<HTMLElement>('.ant-popover-container')
    const titleEl = document.querySelector<HTMLElement>('.ant-popover-title')
    const contentEl = document.querySelector<HTMLElement>('.ant-popover-content')

    expect(popoverEl).toHaveStyle('background-color: rgb(255, 0, 0)')
    expect(containerEl).toHaveStyle('color: rgb(0, 0, 255)')
    expect(titleEl).toHaveStyle('font-weight: bold')
    expect(contentEl).toHaveStyle('font-size: 14px')
  })

  it('supports function-based classes', async () => {
    const classes: PopoverProps['classes'] = (info) => {
      if (info.props.placement === 'bottom') {
        return { root: 'bottom-popover', title: 'bottom-title' }
      }
      return { root: 'top-popover' }
    }

    mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Title',
        content: 'Content',
        placement: 'bottom',
        classes,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        default: () => <span>trigger</span>,
      },
    })
    await flushPopoverTimer()

    const popoverEl = document.querySelector<HTMLElement>('.ant-popover')
    const titleEl = document.querySelector<HTMLElement>('.ant-popover-title')

    expect(popoverEl).toHaveClass('bottom-popover')
    expect(titleEl).toHaveClass('bottom-title')
  })

  it('supports function-based styles', async () => {
    const styles: PopoverProps['styles'] = (info) => {
      if (info.props.placement === 'top') {
        return { content: { padding: '8px' } }
      }
      return { content: { padding: '4px' } }
    }

    mount(Popover, {
      attachTo: document.body,
      props: {
        title: 'Title',
        content: 'Content',
        placement: 'top',
        styles,
        open: true,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
      },
      slots: {
        default: () => <span>trigger</span>,
      },
    })
    await flushPopoverTimer()

    const contentEl = document.querySelector<HTMLElement>('.ant-popover-content')
    expect(contentEl).toHaveStyle('padding: 8px')
  })

  it('configProvider classes merge with component classes', async () => {
    mount({
      render() {
        return (
          <ConfigProvider
            popover={{
              classes: { root: 'cp-root' },
            }}
          >
            <Popover
              title="Title"
              content="Content"
              classes={{ container: 'comp-container' }}
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

    const popoverEl = document.querySelector<HTMLElement>('.ant-popover')
    const containerEl = document.querySelector<HTMLElement>('.ant-popover-container')

    expect(popoverEl).toHaveClass('cp-root')
    expect(containerEl).toHaveClass('comp-container')
  })

  it('configProvider styles merge with component styles', async () => {
    mount({
      render() {
        return (
          <ConfigProvider
            popover={{
              styles: { root: { zIndex: 1001 } },
            }}
          >
            <Popover
              title="Title"
              content="Content"
              styles={{ container: { padding: '12px' } }}
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

    const containerEl = document.querySelector<HTMLElement>('.ant-popover-container')
    expect(containerEl).toHaveStyle('padding: 12px')
  })
})
