import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import Paragraph from '../Paragraph'
import { mount, triggerResize, waitFakeTimer } from '/@tests/utils'

// Mock styleChecker
vi.mock('../../_util/styleChecker', () => ({
  isStyleSupport: () => true,
}))

describe('typography.Ellipsis', () => {
  const LINE_STR_COUNT = 20
  const LINE_HEIGHT = 16
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  let offsetWidth = 100
  let scrollWidth = 0

  function getContentHeight(this: HTMLElement) {
    const html = this.innerHTML.replace(/<[^>]*>/g, '')
    const lines = Math.ceil(html.length / LINE_STR_COUNT)
    return lines * LINE_HEIGHT
  }

  const originGetComputedStyle = window.getComputedStyle

  beforeAll(() => {
    vi.useFakeTimers()

    window.getComputedStyle = (ele) => {
      const style = originGetComputedStyle(ele)
      style.lineHeight = '16px'
      style.fontSize = '12px'
      return style
    }

    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      get() { return offsetWidth },
      configurable: true,
    })
    Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
      get() { return scrollWidth },
      configurable: true,
    })
    Object.defineProperty(HTMLElement.prototype, 'scrollHeight', {
      get: getContentHeight,
      configurable: true,
    })
    Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
      get() {
        const { WebkitLineClamp } = this.style as any
        return WebkitLineClamp ? Number(WebkitLineClamp) * LINE_HEIGHT : getContentHeight.call(this)
      },
      configurable: true,
    })
    HTMLElement.prototype.getBoundingClientRect = function () {
      const isMeasure = this.classList.contains('ant-typography-css-ellipsis-content-measure')

      if (isMeasure && this.parentElement) {
        const parent = this.parentElement
        const html = parent.innerHTML.replace(/<[^>]*>/g, '')
        const isSingleLine = parent.classList.contains('ant-typography-ellipsis-single-line')

        if (isSingleLine) {
          const width = html.length * 10
          return {
            left: 0,
            top: 0,
            right: width,
            bottom: LINE_HEIGHT,
            width,
            height: LINE_HEIGHT,
            x: 0,
            y: 0,
            toJSON: () => {},
          } as DOMRect
        }
        else {
          const lines = Math.ceil(html.length / LINE_STR_COUNT)
          const height = lines * LINE_HEIGHT
          return {
            left: 0,
            top: 0,
            right: 100,
            bottom: height,
            width: 100,
            height,
            x: 0,
            y: 0,
            toJSON: () => {},
          } as DOMRect
        }
      }

      const { WebkitLineClamp } = this.style as any
      const isSingleLine = this.classList.contains('ant-typography-ellipsis-single-line')

      let height = LINE_HEIGHT

      if (WebkitLineClamp) {
        height = Number(WebkitLineClamp) * LINE_HEIGHT
      }
      else if (isSingleLine) {
        height = LINE_HEIGHT
      }
      else {
        const html = this.innerHTML.replace(/<[^>]*>/g, '')
        const lines = Math.ceil(html.length / LINE_STR_COUNT)
        height = lines * LINE_HEIGHT
      }

      return {
        left: 0,
        top: 0,
        right: 100,
        bottom: height,
        width: 100,
        height,
        x: 0,
        y: 0,
        toJSON: () => {},
      } as DOMRect
    }
  })

  afterEach(() => {
    errorSpy.mockReset()
    offsetWidth = 100
    scrollWidth = 0
  })

  afterAll(() => {
    vi.useRealTimers()
    errorSpy.mockRestore()
    window.getComputedStyle = originGetComputedStyle
  })

  it.skip('should trigger update', async () => {
    const onEllipsis = vi.fn()
    const fullStr = 'Bamboo is Little Light '.repeat(50)

    const wrapper = mount(Paragraph, {
      props: {
        ellipsis: { onEllipsis, rows: 1 },
      },
      slots: { default: () => fullStr },
    })

    triggerResize(wrapper.element)
    await waitFakeTimer()

    expect(wrapper.text()).toContain('...')
    expect(onEllipsis).toHaveBeenCalledWith(true)
  })
})
