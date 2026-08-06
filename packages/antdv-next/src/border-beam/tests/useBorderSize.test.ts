import type { Ref } from 'vue'
import type { BorderInfo } from '../hooks/useBorderSize'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, shallowRef } from 'vue'
import useBorderSize from '../hooks/useBorderSize'

const DEFAULT_BORDER_INFO: BorderInfo = {
  borderWidth: [0, 0, 0, 0],
  borderRadius: '0px',
}

function createHost(cssText: string) {
  const el = document.createElement('div')
  el.style.cssText = cssText
  document.body.appendChild(el)
  return el
}

function renderHook(node: HTMLElement | null = null) {
  const domNode = shallowRef<HTMLElement | null>(node)
  let borderInfo!: Ref<BorderInfo>
  const wrapper = mount(
    defineComponent({
      setup() {
        borderInfo = useBorderSize(domNode)
        return () => null
      },
    }),
  )
  return { domNode, wrapper, info: () => borderInfo.value }
}

describe('useBorderSize', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('reads each border side and the radius from the computed style', async () => {
    const host = createHost(
      'border-style: solid; border-top-width: 1px; border-right-width: 2px; border-bottom-width: 3px; border-left-width: 4px; border-radius: 12px;',
    )
    const { wrapper, info } = renderHook(host)
    await nextTick()

    expect(info().borderWidth).toEqual([1, 2, 3, 4])
    expect(info().borderRadius).toBe('12px')

    wrapper.unmount()
  })

  it('falls back to the default info when no node is supplied', async () => {
    const { wrapper, info } = renderHook(null)
    await nextTick()

    expect(info()).toEqual(DEFAULT_BORDER_INFO)

    wrapper.unmount()
  })

  it('resets to the default info once the node is detached', async () => {
    const host = createHost('border: 2px solid red;')
    const { domNode, wrapper, info } = renderHook(host)
    await nextTick()
    expect(info().borderWidth).toEqual([2, 2, 2, 2])

    domNode.value = null
    await nextTick()
    expect(info()).toEqual(DEFAULT_BORDER_INFO)

    wrapper.unmount()
  })

  it('coerces non-numeric border widths to 0', async () => {
    // A `var()` border width cannot be resolved outside a real browser, so
    // `Number.parseFloat` yields NaN and must be normalized to 0.
    const host = createHost('border-style: solid; border-width: var(--not-defined);')
    const { wrapper, info } = renderHook(host)
    await nextTick()

    expect(info().borderWidth).toEqual([0, 0, 0, 0])

    wrapper.unmount()
  })

  it('falls back to the default info when getComputedStyle throws', async () => {
    // jsdom's cssstyle throws while folding border longhands back into a
    // `var()`-based `border` shorthand; the hook must not break the host tree.
    const spy = vi.spyOn(window, 'getComputedStyle').mockImplementation(() => {
      throw new TypeError('Cannot create property \'border-width\' on string')
    })
    const host = createHost('border: 2px solid red;')
    const { wrapper, info } = renderHook(host)
    await nextTick()

    expect(spy).toHaveBeenCalled()
    expect(info()).toEqual(DEFAULT_BORDER_INFO)

    wrapper.unmount()
  })
})
