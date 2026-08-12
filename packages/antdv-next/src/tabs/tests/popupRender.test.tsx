import type { Tab } from '..'
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Tabs from '..'
import { mount, waitFakeTimer } from '/@tests/utils'

const items: Tab[] = Array.from({ length: 10 }, (_, i) => ({
  key: String(i),
  label: `Tab-${i}`,
  content: `Content ${i}`,
}))

const TAB_SIZE = 50

function mockedOffsetWidth(el: HTMLElement) {
  const cls = typeof el.className === 'string' ? el.className : ''
  if (cls.includes('ant-tabs-nav-list')) {
    return items.length * TAB_SIZE
  }
  if (cls.includes('ant-tabs-tab')) {
    return TAB_SIZE
  }
  if (cls.includes('ant-tabs-nav-operations')) {
    return 30
  }
  if (cls.includes('ant-tabs-nav')) {
    // Only fits ~1 tab, so the rest overflows into the "more" dropdown
    return 100
  }
  return 0
}

/**
 * jsdom reports every box as 0x0, so the "more" dropdown never has any tab to
 * show. Fake the layout so tabs actually overflow.
 */
function mockLayout() {
  const descriptors = (['offsetWidth', 'offsetHeight', 'offsetLeft'] as const).map(key => [
    key,
    Object.getOwnPropertyDescriptor(HTMLElement.prototype, key),
  ] as const)

  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
    configurable: true,
    get() {
      return mockedOffsetWidth(this)
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
    configurable: true,
    get() {
      return 40
    },
  })
  Object.defineProperty(HTMLElement.prototype, 'offsetLeft', {
    configurable: true,
    get() {
      const cls = typeof this.className === 'string' ? this.className : ''
      const parent = (this as HTMLElement).parentElement
      if (cls.includes('ant-tabs-tab') && parent) {
        return Array.prototype.indexOf.call(parent.children, this) * TAB_SIZE
      }
      return 0
    },
  })

  return () => {
    descriptors.forEach(([key, descriptor]) => {
      if (descriptor) {
        Object.defineProperty(HTMLElement.prototype, key, descriptor)
      }
      else {
        delete (HTMLElement.prototype as any)[key]
      }
    })
  }
}

/**
 * Sizes are only re-read on a ResizeObserver callback (never fired in jsdom) or
 * on a direction flip, so mount as `rtl` then switch back to `ltr`.
 */
async function mountWithOverflow(more: Record<string, any>) {
  const wrapper = mount(Tabs, {
    props: { items, more, direction: 'rtl' },
    attachTo: document.body,
  })
  await waitFakeTimer(100, 3)
  await wrapper.setProps({ direction: 'ltr' })
  await waitFakeTimer(100, 3)
  await wrapper.find('.ant-tabs-nav-more').trigger('click')
  await waitFakeTimer(100, 5)
  return wrapper
}

describe('tabs more popupRender', () => {
  let restoreLayout: () => void

  beforeAll(() => {
    restoreLayout = mockLayout()
    vi.useFakeTimers()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  afterAll(() => {
    vi.useRealTimers()
    restoreLayout()
  })

  it('renders the built-in menu when popupRender is not provided', async () => {
    const wrapper = await mountWithOverflow({ trigger: 'click' })

    expect(document.querySelector('.ant-tabs-dropdown-menu')).toBeTruthy()
    expect(document.querySelector('.custom-more-popup')).toBeFalsy()

    wrapper.unmount()
  })

  it('renders custom popup content and passes the default menu, restTabs and onClose', async () => {
    const popupRender = vi.fn((menu: any, info: any) =>
      h('div', { class: 'custom-more-popup' }, [
        h('span', { class: 'rest-count' }, String(info.restTabs.length)),
        h('span', { class: 'rest-keys' }, info.restTabs.map((tab: any) => tab.key).join(',')),
        h('button', { class: 'close-popup', onClick: () => info.onClose() }, 'close'),
        menu,
      ]),
    )

    const wrapper = await mountWithOverflow({ trigger: 'click', popupRender })

    expect(popupRender).toHaveBeenCalled()

    const popup = document.querySelector('.custom-more-popup')
    expect(popup).toBeTruthy()

    const restCount = Number(popup!.querySelector('.rest-count')!.textContent)
    expect(restCount).toBeGreaterThan(0)
    expect(restCount).toBeLessThan(items.length + 1)
    expect(popup!.querySelector('.rest-keys')!.textContent).toBe(
      items.slice(items.length - restCount).map(item => item.key).join(','),
    )

    // The default overflow menu is still handed to the render function
    expect(popup!.querySelector('.ant-tabs-dropdown-menu')).toBeTruthy()

    // `onClose` closes the popup
    expect(document.querySelector('.ant-tabs-nav-more')!.getAttribute('aria-expanded')).toBe('true')
    ;(popup!.querySelector('.close-popup') as HTMLElement).click()
    await waitFakeTimer(100, 5)
    expect(document.querySelector('.ant-tabs-nav-more')!.getAttribute('aria-expanded')).toBe('false')

    wrapper.unmount()
  })
})
