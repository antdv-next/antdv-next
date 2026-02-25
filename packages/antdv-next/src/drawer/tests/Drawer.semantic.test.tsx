import type { DrawerProps } from '..'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Drawer from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

describe('drawer.Semantic', () => {
  // Semantic slots: root, mask, header, title, extra, section, body, footer, wrapper, dragger, close

  // Drawer teleports to document.body, cleanup stale DOM between tests
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should support classNames and styles', async () => {
    const wrapper = mount(Drawer, {
      props: {
        open: true,
        title: 'Semantic Test',
        footer: 'Footer',
        classes: {
          header: 'custom-header',
          title: 'custom-title',
          body: 'custom-body',
          footer: 'custom-footer',
        },
        styles: {
          header: { color: 'red' },
          title: { fontSize: '20px' },
          body: { padding: '16px' },
          footer: { borderTop: '1px solid' },
        },
      },
      slots: {
        default: () => <p>Body</p>,
        extra: () => <span>Extra</span>,
      },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()

    const header = document.querySelector('.ant-drawer-header')
    expect(header?.classList.contains('custom-header')).toBe(true)
    expect((header as HTMLElement)?.style.color).toBe('red')

    const title = document.querySelector('.ant-drawer-title')
    expect(title?.classList.contains('custom-title')).toBe(true)
    expect((title as HTMLElement)?.style.fontSize).toBe('20px')

    const body = document.querySelector('.ant-drawer-body')
    expect(body?.classList.contains('custom-body')).toBe(true)
    expect((body as HTMLElement)?.style.padding).toBe('16px')

    const footer = document.querySelector('.ant-drawer-footer')
    expect(footer?.classList.contains('custom-footer')).toBe(true)
    expect((footer as HTMLElement)?.style.borderTop).toBe('1px solid')

    wrapper.unmount()
  })

  it('should support classNames and styles as functions', async () => {
    const classNamesFn = vi.fn((_info: { props: DrawerProps }) => {
      return { header: 'fn-header', body: 'fn-body' }
    })

    const wrapper = mount(Drawer, {
      props: {
        open: true,
        title: 'Fn Test',
        classes: classNamesFn,
      },
      slots: {
        default: () => <p>Body</p>,
      },
      attachTo: document.body,
    })
    await nextTick()
    await nextTick()

    expect(classNamesFn).toHaveBeenCalled()

    const header = document.querySelector('.ant-drawer-header')
    expect(header?.classList.contains('fn-header')).toBe(true)

    const body = document.querySelector('.ant-drawer-body')
    expect(body?.classList.contains('fn-body')).toBe(true)

    wrapper.unmount()
  })

  it('should merge classNames from ConfigProvider', async () => {
    const wrapper = mount({
      render() {
        return (
          <ConfigProvider drawer={{
            class: 'provider-cls',
            classes: { header: 'provider-header', body: 'provider-body' },
            styles: { header: { color: 'blue' } },
          }}
          >
            <Drawer
              open
              title="Merge Test"
              classes={{ header: 'comp-header' }}
            >
              <p>Body</p>
            </Drawer>
          </ConfigProvider>
        )
      },
    }, { attachTo: document.body })
    await nextTick()
    await nextTick()

    const header = document.querySelector('.ant-drawer-header')
    expect(header?.classList.contains('provider-header')).toBe(true)
    expect(header?.classList.contains('comp-header')).toBe(true)
    expect((header as HTMLElement)?.style.color).toBe('blue')

    const body = document.querySelector('.ant-drawer-body')
    expect(body?.classList.contains('provider-body')).toBe(true)

    wrapper.unmount()
  })
})
