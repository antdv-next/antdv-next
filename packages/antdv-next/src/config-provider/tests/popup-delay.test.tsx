import type { Component } from 'vue'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import ConfigProvider from '..'
import Popconfirm from '../../popconfirm'
import Popover from '../../popover'
import Tooltip from '../../tooltip'
import { mount, waitFakeTimer } from '/@tests/utils'

function isPopupOpen(cls: string) {
  const ele = document.querySelector(cls) as HTMLElement | null
  if (!ele) {
    return false
  }
  if (ele.classList.contains(`${cls.slice(1)}-hidden`)) {
    return false
  }
  return getComputedStyle(ele).display !== 'none'
}

function mountWithConfig(config: Record<string, any>, comp: Component, props: Record<string, any>) {
  return mount(ConfigProvider, {
    attachTo: document.body,
    props: config,
    slots: {
      default: () => h(comp as any, props, { default: () => h('button', { id: 'trigger' }, 'trigger') }),
    },
  })
}

describe('configProvider popup delay', () => {
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

  const cases: [name: string, comp: Component, configKey: string, popupCls: string, props: Record<string, any>][] = [
    ['tooltip', Tooltip, 'tooltip', '.ant-tooltip', { title: 'title' }],
    ['popover', Popover, 'popover', '.ant-popover', { title: 'title', content: 'content' }],
    ['popconfirm', Popconfirm, 'popconfirm', '.ant-popconfirm', { title: 'title', trigger: 'hover' }],
  ]

  cases.forEach(([name, comp, configKey, popupCls, props]) => {
    describe(name, () => {
      it('opens after the default 0.1s delay when nothing is configured', async () => {
        const wrapper = mountWithConfig({}, comp, props)

        await wrapper.find('#trigger').trigger('mouseenter')
        await waitFakeTimer(150, 2)

        expect(isPopupOpen(popupCls)).toBe(true)
      })

      it(`honours the \`${configKey}\` global mouseEnterDelay`, async () => {
        const wrapper = mountWithConfig(
          { [configKey]: { mouseEnterDelay: 1 } },
          comp,
          props,
        )

        await wrapper.find('#trigger').trigger('mouseenter')
        await waitFakeTimer(150, 2)
        expect(isPopupOpen(popupCls)).toBe(false)

        await waitFakeTimer(400, 3)
        expect(isPopupOpen(popupCls)).toBe(true)
      })

      it('lets the component prop override the global mouseEnterDelay', async () => {
        const wrapper = mountWithConfig(
          { [configKey]: { mouseEnterDelay: 1 } },
          comp,
          { ...props, mouseEnterDelay: 0 },
        )

        await wrapper.find('#trigger').trigger('mouseenter')
        await waitFakeTimer(10, 2)

        expect(isPopupOpen(popupCls)).toBe(true)
      })

      it(`honours the \`${configKey}\` global mouseLeaveDelay`, async () => {
        const wrapper = mountWithConfig(
          { [configKey]: { mouseEnterDelay: 0, mouseLeaveDelay: 1 } },
          comp,
          props,
        )

        await wrapper.find('#trigger').trigger('mouseenter')
        await waitFakeTimer(10, 2)
        expect(isPopupOpen(popupCls)).toBe(true)

        await wrapper.find('#trigger').trigger('mouseleave')
        await waitFakeTimer(150, 2)
        expect(isPopupOpen(popupCls)).toBe(true)

        await waitFakeTimer(400, 3)
        expect(isPopupOpen(popupCls)).toBe(false)
      })
    })
  })
})
