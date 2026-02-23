import type { SplitterProps } from '..'
import type { PanelProps } from '../interface'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import Splitter, { SplitterPanel } from '..'
import { resetWarned } from '../../_util/warning'
import { mount, triggerResize, waitFakeTimer } from '/@tests/utils'

const SplitterDemo = defineComponent<{ items?: PanelProps[] } & SplitterProps>((props) => {
  return () => {
    const items = props.items ?? [{}, {}]
    return (
      <Splitter {...props}>
        {items.map((item, idx) => {
          const key = `panel-${idx}`
          return <SplitterPanel key={key} {...item} />
        })}
      </Splitter>
    )
  }
})

function dispatchMouseEvent(target: EventTarget, type: string, pageX: number, pageY: number) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
  })
  Object.defineProperty(event, 'pageX', { value: pageX })
  Object.defineProperty(event, 'pageY', { value: pageY })
  target.dispatchEvent(event)
}

function dispatchTouchEvent(target: EventTarget, type: string, pageX?: number, pageY?: number) {
  const event = new Event(type, {
    bubbles: true,
    cancelable: true,
  }) as TouchEvent

  Object.defineProperty(event, 'touches', {
    value: pageX === undefined || pageY === undefined ? [] : [{ pageX, pageY }],
  })

  target.dispatchEvent(event)
}

async function mockDrag(
  draggerEle: Element,
  onResize: ReturnType<typeof vi.fn>,
  offset: number,
  container?: HTMLElement,
) {
  dispatchMouseEvent(draggerEle, 'mousedown', 0, 0)
  await nextTick()
  dispatchMouseEvent(window, 'mousemove', offset, offset)
  await nextTick()

  if (container) {
    expect(container.querySelector('.ant-splitter-mask')).toBeTruthy()
  }

  expect(onResize).not.toHaveBeenCalled()

  dispatchMouseEvent(window, 'mouseup', offset, offset)
  await nextTick()
}

async function mockTouchDrag(
  draggerEle: Element,
  onResize: ReturnType<typeof vi.fn>,
  offset: number,
) {
  dispatchTouchEvent(draggerEle, 'touchstart', 0, 0)
  await nextTick()
  dispatchTouchEvent(window, 'touchmove', offset, offset)
  await nextTick()

  expect(onResize).not.toHaveBeenCalled()

  dispatchTouchEvent(window, 'touchend')
  await nextTick()
}

describe('splitter lazy', () => {
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
  const mountedWrappers: Array<ReturnType<typeof mount>> = []

  let containerSize = 100

  const originOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')
  const originOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')

  beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
      configurable: true,
      get: () => containerSize,
    })

    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get: () => containerSize,
    })
  })

  beforeEach(() => {
    containerSize = 100
    errorSpy.mockReset()
    resetWarned()
    vi.useFakeTimers()
  })

  afterEach(() => {
    mountedWrappers.splice(0).forEach(wrapper => wrapper.unmount())
    vi.clearAllTimers()
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  afterAll(() => {
    if (originOffsetWidth) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originOffsetWidth)
    }
    if (originOffsetHeight) {
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originOffsetHeight)
    }
    errorSpy.mockRestore()
  })

  async function resizeSplitter(wrapper: ReturnType<typeof mount>) {
    const splitter = wrapper.element.querySelector('.ant-splitter') as HTMLElement
    triggerResize(splitter)
    await waitFakeTimer(0, 1)
  }

  it('should only update after mouse up when lazy is true', async () => {
    const onResize = vi.fn()
    const onResizeEnd = vi.fn()

    const wrapper = mount(SplitterDemo, {
      props: {
        items: [
          {
            defaultSize: '50%',
            min: '30%',
            max: '70%',
          },
          {
            defaultSize: '50%',
            min: '30%',
            max: '70%',
          },
        ],
        onResize,
        onResizeEnd,
        lazy: true,
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)

    await resizeSplitter(wrapper)

    await mockDrag(wrapper.find('.ant-splitter-bar-dragger').element, onResize, 1000, wrapper.element)
    expect(onResizeEnd).toHaveBeenCalledTimes(1)
    expect(onResizeEnd).toHaveBeenCalledWith([70, 30])

    onResize.mockReset()
    await mockDrag(wrapper.find('.ant-splitter-bar-dragger').element, onResize, -1000)
    expect(onResizeEnd).toHaveBeenCalledWith([30, 70])

    expect(wrapper.element.querySelector('.ant-splitter-mask')).toBeFalsy()
  })

  it('should work with touch events when lazy', async () => {
    const onResize = vi.fn()
    const onResizeEnd = vi.fn()

    const wrapper = mount(SplitterDemo, {
      props: {
        items: [
          {
            defaultSize: '50%',
            min: '20%',
            max: '70%',
          },
          {
            defaultSize: '50%',
            min: '20%',
            max: '70%',
          },
        ],
        onResize,
        onResizeEnd,
        lazy: true,
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)

    await resizeSplitter(wrapper)

    await mockTouchDrag(wrapper.find('.ant-splitter-bar-dragger').element, onResize, 1000)
    expect(onResizeEnd).toHaveBeenCalledWith([70, 30])

    onResize.mockReset()
    await mockTouchDrag(wrapper.find('.ant-splitter-bar-dragger').element, onResize, -1000)
    expect(onResizeEnd).toHaveBeenCalledWith([30, 70])
  })

  it('should work with vertical splitter', async () => {
    const onResize = vi.fn()
    const onResizeEnd = vi.fn()

    const wrapper = mount(SplitterDemo, {
      props: {
        items: [
          {
            defaultSize: '50%',
            min: '30%',
            max: '70%',
          },
          {
            defaultSize: '50%',
            min: '30%',
            max: '70%',
          },
        ],
        onResize,
        onResizeEnd,
        orientation: 'vertical',
        lazy: true,
      },
      attachTo: document.body,
    })
    mountedWrappers.push(wrapper)

    await resizeSplitter(wrapper)

    await mockDrag(wrapper.find('.ant-splitter-bar-dragger').element, onResize, 1000)
    expect(onResizeEnd).toHaveBeenCalledWith([70, 30])

    onResize.mockReset()
    await mockDrag(wrapper.find('.ant-splitter-bar-dragger').element, onResize, -1000)
    expect(onResizeEnd).toHaveBeenCalledWith([30, 70])

    onResize.mockReset()
    await mockTouchDrag(wrapper.find('.ant-splitter-bar-dragger').element, onResize, 1000)
    expect(onResizeEnd).toHaveBeenCalledWith([70, 30])

    onResize.mockReset()
    await mockTouchDrag(wrapper.find('.ant-splitter-bar-dragger').element, onResize, -1000)
    expect(onResizeEnd).toHaveBeenCalledWith([30, 70])
  })
})
