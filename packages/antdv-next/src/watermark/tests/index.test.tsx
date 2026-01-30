import { mount } from '@vue/test-utils'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import Watermark from '../index'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { waitFakeTimer } from '/@tests/utils'

// Mock Canvas
const mockGetContext = {
  measureText: vi.fn().mockReturnValue({ width: 50, fontBoundingBoxAscent: 10, fontBoundingBoxDescent: 2 }),
  fillText: vi.fn(),
  fillRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  drawImage: vi.fn(),
  font: '',
  fillStyle: '',
  globalAlpha: 1,
}

// @ts-expect-error mock implementation
HTMLCanvasElement.prototype.getContext = vi.fn((type) => {
  if (type === '2d')
    return mockGetContext
  return null
})

HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,mock')

if (typeof CanvasRenderingContext2D === 'undefined') {
  // @ts-expect-error mock implementation
  global.CanvasRenderingContext2D = class {
    drawImage() {}
  }
}

describe('watermark', () => {
  mountTest(Watermark)
  rtlTest(Watermark)

  let mockSrcSet: any

  beforeAll(() => {
    mockSrcSet = vi.spyOn(Image.prototype, 'src', 'set').mockImplementation(function (this: HTMLImageElement, val: string) {
      if (val === 'https://test.svg') {
        // trigger error for invalid image
        this.onerror?.(new Event('error'))
      }
      else {
        // trigger load for valid image
        this.onload?.(new Event('load'))
      }
    })
  })

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  afterAll(() => {
    mockSrcSet.mockRestore()
  })

  it('the watermark should render successfully', async () => {
    const wrapper = mount(<Watermark content="Ant Design" rootClass="watermark" class="watermark" />)

    await waitFakeTimer()
    expect(wrapper.find('.watermark').exists()).toBeTruthy()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('the offset should be correct', async () => {
    const wrapper = mount(
      <Watermark
        rootClass="watermark"
        offset={[200, 200]}
        content={['Ant Design', 'Ant Design Pro']}
        class="watermark"
      />,
    )

    await waitFakeTimer()

    // Find the watermark element (absolute positioned div)
    const watermarkDiv = wrapper.element.querySelector('div[style*="position: absolute"]')
    expect(watermarkDiv).toBeTruthy()

    const style = (watermarkDiv as HTMLElement).style
    expect(style.left).toBe('150px')
    expect(style.top).toBe('150px')
    expect(style.width).toBe('calc(100% - 150px)')
    expect(style.height).toBe('calc(100% - 150px)')

    expect(wrapper.html()).toMatchSnapshot()
  })

  it('interleaved watermark backgroundSize is correct', async () => {
    const wrapper = mount(
      <Watermark
        rootClass="watermark"
        width={200}
        height={200}
        content="Ant Design"
        gap={[100, 100]}
        class="watermark"
      />,
    )

    await waitFakeTimer()
    const watermarkDiv = wrapper.element.querySelector('div[style*="position: absolute"]')
    expect((watermarkDiv as HTMLElement).style.backgroundSize).toBe('720px')
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('image watermark snapshot', async () => {
    const wrapper = mount(
      <Watermark image="https://gw.alipayobjects.com/zos/bmw-prod/59a18171-ae17-4fc5-93a0-2645f64a3aca.svg" />,
    )
    await waitFakeTimer()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('invalid image watermark', async () => {
    const wrapper = mount(
      <Watermark
        rootClass="watermark"
        content="Ant Design"
        image="https://test.svg"
        class="watermark"
      />,
    )

    await waitFakeTimer()
    expect(wrapper.find('.watermark').exists()).toBeTruthy()
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('mutationObserver should work properly', async () => {
    let counter = 0
    const originalToDataURL = HTMLCanvasElement.prototype.toDataURL
    // Manually mock to avoid potential spy recursion issues with nested mocks
    HTMLCanvasElement.prototype.toDataURL = function (this: HTMLCanvasElement, ...args: any[]) {
      counter += 1
      return originalToDataURL.apply(this, args as any)
    }

    const wrapper = mount(
      <Watermark rootClass="watermark" content="MutationObserver" class="watermark" />,
    )

    await waitFakeTimer()
    const watermarkDiv = wrapper.element.querySelector('div[style*="position: absolute"]')
    expect(watermarkDiv).toBeTruthy()
    expect(counter).toBe(1)

    watermarkDiv?.remove()
    await waitFakeTimer()
    expect(counter).toBe(1)

    expect(wrapper.html()).toMatchSnapshot()

    // Restore
    HTMLCanvasElement.prototype.toDataURL = originalToDataURL
  })

  describe('observe the modification of style', () => {
    it('watermark', async () => {
      const wrapper = mount(
        <Watermark
          offset={[-200, -200]}
          rootClass="watermark"
          content="MutationObserver"
          class="watermark"
        />,
      )
      await waitFakeTimer()
      const watermarkDiv = wrapper.element.querySelector('div[style*="position: absolute"]') as HTMLElement

      watermarkDiv.setAttribute('style', '')
      await waitFakeTimer()
      expect(wrapper.html()).toMatchSnapshot()
    })

    it('container', async () => {
      const wrapper = mount(
        <Watermark
          offset={[-200, -200]}
          rootClass="watermark"
          content="MutationObserver"
          class="watermark"
        />,
      )
      await waitFakeTimer()

      const container = wrapper.element as HTMLElement
      container.setAttribute('style', '')
      await waitFakeTimer()

      expect(container.style.overflow).toBe('hidden')
      expect(container.style.position).toBe('relative')
    })
  })

  it('should not crash if content is empty string', async () => {
    const spy = vi.spyOn(CanvasRenderingContext2D.prototype, 'drawImage')
    mount(<Watermark content="" rootClass="watermark" />)
    await waitFakeTimer()
    expect(spy).not.toHaveBeenCalledWith(expect.anything(), 0, 0)
    spy.mockRestore()
  })

  it('should call onRemove when watermark is hard removed', async () => {
    const onRemove = vi.fn()
    const wrapper = mount(<Watermark content="Ant" onRemove={onRemove} />)
    await waitFakeTimer()

    wrapper.find<HTMLDivElement>('[style*="background-image"]').element?.remove()
    await waitFakeTimer()

    expect(onRemove).toHaveBeenCalledTimes(1)
  })

  it('should not call onRemove when unmount', async () => {
    const onRemove = vi.fn()
    const wrapper = mount(<Watermark content="Ant" onRemove={onRemove} />)
    await waitFakeTimer()
    wrapper.unmount()
    await waitFakeTimer()
    expect(onRemove).not.toHaveBeenCalled()
  })
})
