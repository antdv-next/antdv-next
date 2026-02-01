import type { Component } from 'vue'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'

import { mount, sleep } from '../utils'

/**
 * Standardized focus and blur tests for interactive Vue components.
 * Vue equivalent of ant-design's focusTest.
 *
 * @param Comp - The Vue component to test
 * @param options - Configuration options
 * @param options.refFocus - Whether the component exposes focus/blur methods via ref
 * @param options.blurDelay - Delay in ms to wait after blur event before assertions
 */
function focusTest(
  Comp: Component,
  { refFocus = false, blurDelay = 0 } = {},
) {
  describe('focus and blur', () => {
    let focused = false
    let blurred = false
    const mockFocus = vi.spyOn(HTMLElement.prototype, 'focus')
    const mockBlur = vi.spyOn(HTMLElement.prototype, 'blur')

    beforeAll(() => {
      if (refFocus) {
        mockFocus.mockImplementation(() => {
          focused = true
        })
        mockBlur.mockImplementation(() => {
          blurred = true
        })
      }
    })

    let containerHtml: HTMLDivElement
    beforeEach(() => {
      containerHtml = document.createElement('div')
      document.body.appendChild(containerHtml)
      focused = false
      blurred = false
    })

    afterAll(() => {
      mockFocus.mockRestore()
      mockBlur.mockRestore()
    })

    afterEach(() => {
      document.body.removeChild(containerHtml)
    })

    const getElement = (container: HTMLElement) =>
      container.querySelector('input')
      || container.querySelector('button')
      || container.querySelector('textarea')
      || container.querySelector('div[tabindex]')

    if (refFocus) {
      it('Ref: focus() and onFocus', async () => {
        const onFocus = vi.fn()
        const wrapper = mount({
          render() {
            return h('div', [h(Comp as any, { onFocus, ref: 'compRef' })])
          },
        }, {
          attachTo: containerHtml,
        })

        const compRef = (wrapper.vm.$refs as any).compRef
        compRef?.focus?.()
        expect(focused).toBeTruthy()

        const el = getElement(wrapper.element as HTMLElement)
        if (el) {
          el.dispatchEvent(new FocusEvent('focus'))
        }
        expect(onFocus).toHaveBeenCalled()

        wrapper.unmount()
      })

      it('Ref: blur() and onBlur', async () => {
        vi.useRealTimers()
        const onBlur = vi.fn()
        const wrapper = mount({
          render() {
            return h('div', [h(Comp as any, { onBlur, ref: 'compRef' })])
          },
        }, {
          attachTo: containerHtml,
        })

        const compRef = (wrapper.vm.$refs as any).compRef
        compRef?.blur?.()
        expect(blurred).toBeTruthy()

        const el = getElement(wrapper.element as HTMLElement)
        if (el) {
          el.dispatchEvent(new FocusEvent('blur'))
        }
        await sleep(blurDelay)
        expect(onBlur).toHaveBeenCalled()

        wrapper.unmount()
      })

      it('Ref: autoFocus', async () => {
        const onFocus = vi.fn()
        const wrapper = mount(Comp as any, {
          props: { autofocus: true, onFocus },
          attachTo: containerHtml,
        })

        expect(focused).toBeTruthy()

        const el = getElement(wrapper.element as HTMLElement)
        if (el) {
          el.dispatchEvent(new FocusEvent('focus'))
        }
        expect(onFocus).toHaveBeenCalled()

        wrapper.unmount()
      })
    }
    else {
      it('focus() and onFocus', async () => {
        const handleFocus = vi.fn()
        const wrapper = mount(Comp as any, {
          props: { onFocus: handleFocus },
          attachTo: containerHtml,
        })

        const el = getElement(wrapper.element as HTMLElement)
        if (el) {
          el.dispatchEvent(new FocusEvent('focus'))
        }
        expect(handleFocus).toHaveBeenCalled()

        wrapper.unmount()
      })

      it('blur() and onBlur', async () => {
        vi.useRealTimers()
        const handleBlur = vi.fn()
        const wrapper = mount(Comp as any, {
          props: { onBlur: handleBlur },
          attachTo: containerHtml,
        })

        const el = getElement(wrapper.element as HTMLElement)
        if (el) {
          el.dispatchEvent(new FocusEvent('focus'))
          await sleep(0)
          el.dispatchEvent(new FocusEvent('blur'))
          await sleep(0)
        }
        expect(handleBlur).toHaveBeenCalled()

        wrapper.unmount()
      })

      it('autoFocus', async () => {
        const handleFocus = vi.fn()
        mount(Comp as any, {
          props: { autofocus: true, onFocus: handleFocus },
          attachTo: containerHtml,
        })

        expect(handleFocus).toHaveBeenCalled()
      })
    }
  })
}

export default focusTest
