import scrollIntoView from 'scroll-into-view-if-needed'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import Anchor from '..'
import { mount, waitFakeTimer } from '/@tests/utils'

vi.mock('scroll-into-view-if-needed', () => ({ default: vi.fn() }))
const scrollIntoViewMock = vi.mocked(scrollIntoView)

function createDiv() {
  const root = document.createElement('div')
  document.body.appendChild(root)
  return root
}

let idCounter = 0
const getHashUrl = () => `Anchor-LinkOffset-${idCounter++}`

describe('anchor Link.targetOffset', () => {
  const getBoundingClientRectMock = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
  const getClientRectsMock = vi.spyOn(HTMLElement.prototype, 'getClientRects')

  beforeAll(() => {
    getBoundingClientRectMock.mockReturnValue({
      width: 100,
      height: 100,
      top: 1000,
    } as DOMRect)
    getClientRectsMock.mockReturnValue([1] as unknown as DOMRectList)
  })

  beforeEach(() => {
    vi.useFakeTimers()
    scrollIntoViewMock.mockReset()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  afterAll(() => {
    getBoundingClientRectMock.mockRestore()
    getClientRectsMock.mockRestore()
  })

  it('per-link targetOffset wins over Anchor.offsetTop', async () => {
    const hash = getHashUrl()
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const root = createDiv()
    root.innerHTML = `<h1 id="${hash}">Hello</h1>`
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        offsetTop: 100,
        items: [{ key: hash, href: `#${hash}`, title: hash, targetOffset: 250 }],
      },
      attachTo: document.body,
    })

    await wrapper.find(`a[href="#${hash}"]`).trigger('click')
    await waitFakeTimer()
    // scrollTop (0) + getOffsetTop (1000) - link.targetOffset (250) = 750.
    expect(scrollToSpy).toHaveBeenLastCalledWith(0, 750)

    scrollToSpy.mockRestore()
    wrapper.unmount()
    root.remove()
  })

  it('falls back to Anchor.targetOffset / offsetTop when link.targetOffset is undefined', async () => {
    const hash = getHashUrl()
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const root = createDiv()
    root.innerHTML = `<h1 id="${hash}">Hello</h1>`
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        offsetTop: 100,
        items: [{ key: hash, href: `#${hash}`, title: hash }],
      },
      attachTo: document.body,
    })

    await wrapper.find(`a[href="#${hash}"]`).trigger('click')
    await waitFakeTimer()
    // 1000 - 100 = 900.
    expect(scrollToSpy).toHaveBeenLastCalledWith(0, 900)

    scrollToSpy.mockRestore()
    wrapper.unmount()
    root.remove()
  })

  it('targetOffset=0 is honoured (no fallback)', async () => {
    const hash = getHashUrl()
    const scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const root = createDiv()
    root.innerHTML = `<h1 id="${hash}">Hello</h1>`
    const wrapper = mount(Anchor, {
      props: {
        affix: false,
        offsetTop: 100,
        items: [{ key: hash, href: `#${hash}`, title: hash, targetOffset: 0 }],
      },
      attachTo: document.body,
    })

    await wrapper.find(`a[href="#${hash}"]`).trigger('click')
    await waitFakeTimer()
    // 1000 - 0 = 1000, NOT 1000 - 100.
    expect(scrollToSpy).toHaveBeenLastCalledWith(0, 1000)

    scrollToSpy.mockRestore()
    wrapper.unmount()
    root.remove()
  })
})
