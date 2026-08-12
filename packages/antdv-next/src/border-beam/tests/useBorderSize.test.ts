import type { Ref } from 'vue'
import type { BorderWidth } from '../util'
import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, shallowRef } from 'vue'
import useBorderSize from '../hooks/useBorderSize'

const DEFAULT_BORDER_WIDTH: BorderWidth = [0, 0, 0, 0]

function createHost(cssText: string) {
  const el = document.createElement('div')
  el.style.cssText = cssText
  document.body.appendChild(el)
  return el
}

function renderHook(node: HTMLElement | null = null) {
  const domNode = shallowRef<HTMLElement | null>(node)
  let borderWidth!: Ref<BorderWidth>
  const wrapper = mount(
    defineComponent({
      setup() {
        borderWidth = useBorderSize(domNode)
        return () => null
      },
    }),
  )
  return { domNode, wrapper, width: () => borderWidth.value }
}

describe('useBorderSize', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('reads each border side from the computed style', async () => {
    const host = createHost(
      'border-style: solid; border-top-width: 1px; border-right-width: 2px; border-bottom-width: 3px; border-left-width: 4px; border-radius: 12px;',
    )
    const { wrapper, width } = renderHook(host)
    await nextTick()

    expect(width()).toEqual([1, 2, 3, 4])

    wrapper.unmount()
  })

  it('falls back to the default width when no node is supplied', async () => {
    const { wrapper, width } = renderHook(null)
    await nextTick()

    expect(width()).toEqual(DEFAULT_BORDER_WIDTH)

    wrapper.unmount()
  })

  it('resets the inferred border width once the host becomes unavailable', async () => {
    const host = createHost('border: 2px solid red;')
    const { domNode, wrapper, width } = renderHook(host)
    await nextTick()
    expect(width()).toEqual([2, 2, 2, 2])

    domNode.value = null
    await nextTick()
    expect(width()).toEqual(DEFAULT_BORDER_WIDTH)

    wrapper.unmount()
  })

  it('keeps the same reference when the measured border width does not change', async () => {
    const host = createHost('border: 4px solid #fff;')
    const { domNode, wrapper, width } = renderHook(host)
    await nextTick()
    const prev = width()
    expect(prev).toEqual([4, 4, 4, 4])

    const next = createHost('border: 4px solid #000;')
    domNode.value = next
    await nextTick()
    expect(width()).toBe(prev)

    wrapper.unmount()
  })

  it('coerces non-numeric border widths to 0', async () => {
    // A `var()` border width cannot be resolved outside a real browser, so
    // `Number.parseFloat` yields NaN and must be normalized to 0.
    const host = createHost('border-style: solid; border-width: var(--not-defined);')
    const { wrapper, width } = renderHook(host)
    await nextTick()

    expect(width()).toEqual([0, 0, 0, 0])

    wrapper.unmount()
  })

  it('falls back to the default width when getComputedStyle throws', async () => {
    // jsdom's cssstyle throws while folding border longhands back into a
    // `var()`-based `border` shorthand; the hook must not break the host tree.
    const spy = vi.spyOn(window, 'getComputedStyle').mockImplementation(() => {
      throw new TypeError('Cannot create property \'border-width\' on string')
    })
    const host = createHost('border: 2px solid red;')
    const { wrapper, width } = renderHook(host)
    await nextTick()

    expect(spy).toHaveBeenCalled()
    expect(width()).toEqual(DEFAULT_BORDER_WIDTH)

    wrapper.unmount()
  })
})
