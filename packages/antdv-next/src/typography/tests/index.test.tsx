import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import Base from '../Base'
import Link from '../Link'
import Paragraph from '../Paragraph'
import Text from '../Text'
import Title from '../Title'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

vi.mock('../../_util/copy')

describe('typography', () => {
  mountTest(Paragraph)
  mountTest(Base)
  mountTest(Title)
  mountTest(Link)
  mountTest(Text)

  rtlTest(Paragraph)
  rtlTest(Base)
  rtlTest(Title)
  rtlTest(Link)

  const LINE_STR_COUNT = 20
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  // Mock offsetHeight
  const originOffsetHeight = Object.getOwnPropertyDescriptor(
    HTMLElement.prototype,
    'offsetHeight',
  )?.get

  const mockGetBoundingClientRect = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      get() {
        let html = this.innerHTML
        html = html.replace(/<[^>]*>/g, '')
        const lines = Math.ceil(html.length / LINE_STR_COUNT)
        return lines * 16
      },
    })
    mockGetBoundingClientRect.mockImplementation(function fn(this: HTMLElement) {
      let html = this.innerHTML
      html = html.replace(/<[^>]*>/g, '')
      const lines = Math.ceil(html.length / LINE_STR_COUNT)
      return { height: lines * 16 } as DOMRect
    })
  })

  // Mock getComputedStyle
  const originGetComputedStyle = window.getComputedStyle
  window.getComputedStyle = (ele) => {
    const style = originGetComputedStyle(ele)
    style.lineHeight = '16px'
    return style
  }

  afterEach(() => {
    errorSpy.mockReset()
  })

  afterAll(() => {
    errorSpy.mockRestore()
    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      get: originOffsetHeight,
    })
    mockGetBoundingClientRect.mockRestore()
    window.getComputedStyle = originGetComputedStyle
  })

  describe('title', () => {
    it('warning if `level` not correct', () => {
      mount(Title, {
        props: {
          level: false as any,
        },
      })

      expect(errorSpy).toHaveBeenCalledWith(
        'Warning: [antd: Typography.Title] Title only accept `1 | 2 | 3 | 4 | 5` as `level` value.',
      )
    })
  })

  it('no italic warning', () => {
    mount(Text, {
      props: {
        italic: true,
      },
      slots: {
        default: () => 'Little',
      },
    })
    expect(errorSpy).not.toHaveBeenCalled()
  })

  it('should get HTMLHeadingElement ref from Title', () => {
    const wrapper = mount(Title, {
      props: { level: 1 },
    })
    const heading = wrapper.find('h1')
    expect(heading.exists()).toBe(true)
    expect(heading.element instanceof HTMLHeadingElement).toBe(true)
  })

  it('should get HTMLDivElement ref from Paragraph', () => {
    const wrapper = mount(Paragraph)
    expect(wrapper.element instanceof HTMLDivElement).toBe(true)
  })

  it('should get HTMLSpanElement ref from Text', () => {
    const wrapper = mount(Text)
    const span = wrapper.find('span')
    expect(span.exists()).toBe(true)
    expect(span.element instanceof HTMLSpanElement).toBe(true)
  })
})
