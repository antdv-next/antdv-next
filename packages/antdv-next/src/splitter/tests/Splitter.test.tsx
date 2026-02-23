import type { SplitterProps } from '..'
import type { Orientation } from '../../_util/hooks'
import type { PanelProps } from '../interface'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick } from 'vue'
import Splitter, { SplitterPanel } from '..'
import { resetWarned } from '../../_util/warning'
import ConfigProvider from '../../config-provider'
import SplitBar from '../SplitBar'
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

describe('splitter', () => {
  const errSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
  const mountedWrappers: Array<ReturnType<typeof mount>> = []

  let containerSize = 100

  const originOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')
  const originOffsetHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetHeight')

  const trackWrapper = <T extends ReturnType<typeof mount>>(wrapper: T) => {
    mountedWrappers.push(wrapper)
    return wrapper
  }

  const mountSplitter = (
    props: { items?: PanelProps[] } & SplitterProps = {},
    options: Parameters<typeof mount>[1] = {},
  ) => {
    return trackWrapper(mount(SplitterDemo, {
      props,
      attachTo: document.body,
      ...options,
    }))
  }

  const resizeSplitter = async () => {
    const splitter = document.body.querySelector('.ant-splitter') as HTMLElement
    triggerResize(splitter)
    await waitFakeTimer(0, 1)
  }

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
    errSpy.mockReset()
    resetWarned()
    vi.useFakeTimers()
  })

  afterEach(() => {
    mountedWrappers.splice(0).forEach(wrapper => wrapper.unmount())
    document.body.innerHTML = ''
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  afterAll(() => {
    if (originOffsetWidth) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originOffsetWidth)
    }
    if (originOffsetHeight) {
      Object.defineProperty(HTMLElement.prototype, 'offsetHeight', originOffsetHeight)
    }
    errSpy.mockRestore()
  })

  it('should correct render', () => {
    const wrapper = mountSplitter()

    expect(wrapper.find('.ant-splitter').exists()).toBe(true)
    expect(wrapper.findAll('.ant-splitter-panel')).toHaveLength(2)
    expect(wrapper.find('.ant-splitter-bar').exists()).toBe(true)
  })

  it('should correct render panel size', async () => {
    const wrapper = mountSplitter({ items: [{ size: 20 }, { size: '45%' }, {}] })

    await resizeSplitter()

    const panels = wrapper.findAll('.ant-splitter-panel')

    expect(panels[0]?.element).toHaveStyle('flex-basis: 20px')
    expect(panels[1]?.element).toHaveStyle('flex-basis: 45px')
    expect(panels[2]?.element).toHaveStyle('flex-basis: 35px')
  })

  describe('onDraggerDoubleClick', () => {
    it('should trigger onDraggerDoubleClick when clicking within 300ms', () => {
      const onDraggerDoubleClick = vi.fn()
      const wrapper = mountSplitter({
        items: [{}, {}],
        onDraggerDoubleClick,
      })

      const dragger = wrapper.find('.ant-splitter-bar-dragger').element

      dragger.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
      vi.advanceTimersByTime(200)
      dispatchMouseEvent(dragger, 'mousedown', 0, 0)

      expect(onDraggerDoubleClick).toHaveBeenCalledTimes(1)
      expect(onDraggerDoubleClick).toHaveBeenCalledWith(0)
    })

    it('should not trigger onDraggerDoubleClick when time gap > 300ms', () => {
      const onDraggerDoubleClick = vi.fn()
      const wrapper = mountSplitter({
        items: [{}, {}],
        onDraggerDoubleClick,
      })

      const dragger = wrapper.find('.ant-splitter-bar-dragger').element

      dispatchMouseEvent(dragger, 'mousedown', 0, 0)
      dispatchMouseEvent(dragger, 'mouseup', 0, 0)
      dragger.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      vi.advanceTimersByTime(400)

      dispatchMouseEvent(dragger, 'mousedown', 0, 0)
      dispatchMouseEvent(dragger, 'mouseup', 0, 0)
      dragger.dispatchEvent(new MouseEvent('click', { bubbles: true }))

      expect(onDraggerDoubleClick).not.toHaveBeenCalled()
    })

    it('should trigger with correct index for multiple splitters', () => {
      const onDraggerDoubleClick = vi.fn()
      const wrapper = mountSplitter({
        items: [{}, {}, {}],
        onDraggerDoubleClick,
      })

      const draggers = wrapper.findAll('.ant-splitter-bar-dragger')
      const secondDragger = draggers[1]?.element as HTMLElement

      secondDragger.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))

      vi.advanceTimersByTime(100)

      secondDragger.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))

      expect(onDraggerDoubleClick).toHaveBeenCalledWith(1)
    })

    it('should stop propagation to allow nested splitter usage', () => {
      const onOuterDoubleClick = vi.fn()
      const onInnerDoubleClick = vi.fn()

      const wrapper = trackWrapper(mount(() => (
        <Splitter onDraggerDoubleClick={onOuterDoubleClick}>
          <SplitterPanel>Outer Left</SplitterPanel>
          <SplitterPanel>
            <div data-testid="inner-wrapper">
              <Splitter onDraggerDoubleClick={onInnerDoubleClick}>
                <SplitterPanel>Inner Top</SplitterPanel>
                <SplitterPanel>Inner Bottom</SplitterPanel>
              </Splitter>
            </div>
          </SplitterPanel>
        </Splitter>
      ), {
        attachTo: document.body,
      }))

      const innerWrapper = wrapper.find('[data-testid="inner-wrapper"]').element
      const innerDragger = innerWrapper.querySelector('.ant-splitter-bar-dragger') as HTMLElement

      innerDragger.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
      vi.advanceTimersByTime(100)
      innerDragger.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))

      expect(onInnerDoubleClick).toHaveBeenCalled()
      expect(onOuterDoubleClick).not.toHaveBeenCalled()
    })

    it('should prevent drag start when mouse down happens within 300ms', () => {
      const onOffsetStart = vi.fn()

      const wrapper = trackWrapper(mount(SplitBar, {
        props: {
          index: 0,
          active: false,
          prefixCls: 'ant-splitter',
          rootPrefixCls: 'ant',
          resizable: true,
          vertical: false,
          startCollapsible: true,
          endCollapsible: true,
          showStartCollapsibleIcon: true,
          showEndCollapsibleIcon: true,
          containerSize: 500,
          ariaNow: 50,
          ariaMin: 0,
          ariaMax: 100,
          onOffsetStart,
          onOffsetUpdate: vi.fn(),
          onOffsetEnd: vi.fn(),
          onCollapse: vi.fn(),
        },
      }))

      const dragger = wrapper.find('.ant-splitter-bar-dragger').element

      dispatchMouseEvent(dragger, 'mousedown', 0, 0)
      expect(onOffsetStart).toHaveBeenCalledTimes(1)

      dispatchMouseEvent(dragger, 'mouseup', 0, 0)

      vi.advanceTimersByTime(200)
      dispatchMouseEvent(dragger, 'mousedown', 0, 0)

      expect(onOffsetStart).toHaveBeenCalledTimes(1)
    })
  })

  it('the layout should work fine', async () => {
    const wrapper = mountSplitter()

    expect(wrapper.find('.ant-splitter-horizontal').exists()).toBe(true)

    await wrapper.setProps({
      items: [{}, {}, {}],
      orientation: 'vertical',
    })

    expect(wrapper.find('.ant-splitter-vertical').exists()).toBe(true)
  })

  it('the resizable should work fine', async () => {
    const wrapper = mountSplitter({ items: [{ size: 20 }, { resizable: false }, {}] })

    expect(wrapper.findAll('.ant-splitter-bar-dragger')).toHaveLength(2)
    expect(wrapper.findAll('.ant-splitter-bar-dragger-disabled')).toHaveLength(2)

    await wrapper.setProps({ items: [{ size: 20 }, {}, { resizable: false }] })

    expect(wrapper.findAll('.ant-splitter-bar-dragger')).toHaveLength(2)
    expect(wrapper.findAll('.ant-splitter-bar-dragger-disabled')).toHaveLength(1)
  })

  it('splitter.Panel is syntactic sugar', () => {
    const wrapper = trackWrapper(mount(() => <SplitterPanel />))
    expect(wrapper.html()).toBe('')
  })

  describe('drag', () => {
    const mockDrag = async (draggerEle: Element, offset: number, container?: HTMLElement) => {
      dispatchMouseEvent(draggerEle, 'mousedown', 0, 0)
      await nextTick()
      dispatchMouseEvent(window, 'mousemove', offset, offset)
      await nextTick()

      if (container) {
        expect(container.querySelector('.ant-splitter-mask')).toBeTruthy()
      }

      dispatchMouseEvent(window, 'mouseup', offset, offset)
      await nextTick()
    }

    const mockTouchDrag = async (draggerEle: Element, offset: number) => {
      dispatchTouchEvent(draggerEle, 'touchstart', 0, 0)
      await nextTick()
      dispatchTouchEvent(window, 'touchmove', offset, offset)
      await nextTick()
      dispatchTouchEvent(window, 'touchend')
      await nextTick()
    }

    it('the mousemove should work fine', async () => {
      const onResize = vi.fn()
      const onResizeEnd = vi.fn()

      const wrapper = mountSplitter({ items: [{}, {}], onResize, onResizeEnd })

      await resizeSplitter()

      await mockDrag(wrapper.find('.ant-splitter-bar-dragger').element, 40, wrapper.element)
      expect(onResize).toHaveBeenCalledWith([90, 10])
      expect(onResizeEnd).toHaveBeenCalledTimes(1)
      expect(onResizeEnd).toHaveBeenCalledWith([90, 10])

      await mockDrag(wrapper.find('.ant-splitter-bar-dragger').element, -200)
      expect(onResize).toHaveBeenCalledWith([0, 100])
      expect(onResizeEnd).toHaveBeenCalledWith([0, 100])

      expect(wrapper.element.querySelector('.ant-splitter-mask')).toBeFalsy()
    })

    it('the touchmove should work fine', async () => {
      const onResize = vi.fn()
      const onResizeEnd = vi.fn()

      const wrapper = mountSplitter({ items: [{}, {}], onResize, onResizeEnd })

      await resizeSplitter()

      await mockTouchDrag(wrapper.find('.ant-splitter-bar-dragger').element, 40)
      expect(onResize).toHaveBeenCalledWith([90, 10])
      expect(onResizeEnd).toHaveBeenCalledTimes(1)
      expect(onResizeEnd).toHaveBeenCalledWith([90, 10])

      await mockTouchDrag(wrapper.find('.ant-splitter-bar-dragger').element, -200)
      expect(onResize).toHaveBeenCalledWith([0, 100])
      expect(onResizeEnd).toHaveBeenCalledWith([0, 100])
    })

    it('with min', async () => {
      const onResize = vi.fn()
      const onResizeEnd = vi.fn()

      const wrapper = mountSplitter({
        items: [{ min: 10 }, {}],
        onResize,
        onResizeEnd,
      })

      await resizeSplitter()

      await mockDrag(wrapper.find('.ant-splitter-bar-dragger').element, -100)
      expect(onResize).toHaveBeenCalledWith([10, 90])
      expect(onResizeEnd).toHaveBeenCalledWith([10, 90])
    })

    it('with max', async () => {
      const onResize = vi.fn()
      const onResizeEnd = vi.fn()

      const wrapper = mountSplitter({
        items: [{ max: 90 }, {}],
        onResize,
        onResizeEnd,
      })

      await resizeSplitter()

      await mockDrag(wrapper.find('.ant-splitter-bar-dragger').element, 100)
      expect(onResize).toHaveBeenCalledWith([90, 10])
      expect(onResizeEnd).toHaveBeenCalledWith([90, 10])
    })

    it('both panel has min and max', async () => {
      const onResize = vi.fn()
      const onResizeEnd = vi.fn()

      const wrapper = mountSplitter({
        items: [
          { min: 10, max: 80 },
          { min: 10, max: 80 },
        ],
        onResize,
        onResizeEnd,
      })

      await resizeSplitter()

      await mockDrag(wrapper.find('.ant-splitter-bar-dragger').element, -100)
      expect(onResize).toHaveBeenCalledWith([20, 80])
      expect(onResizeEnd).toHaveBeenCalledWith([20, 80])

      await mockDrag(wrapper.find('.ant-splitter-bar-dragger').element, 100)
      expect(onResize).toHaveBeenCalledWith([80, 20])
      expect(onResizeEnd).toHaveBeenCalledWith([80, 20])
    })

    it('rtl', async () => {
      const onResize = vi.fn()
      const onResizeEnd = vi.fn()

      trackWrapper(mount(() => (
        <ConfigProvider direction="rtl">
          <SplitterDemo items={[{}, {}]} onResize={onResize} onResizeEnd={onResizeEnd} />
        </ConfigProvider>
      ), {
        attachTo: document.body,
      }))

      await resizeSplitter()

      const dragger = document.body.querySelector('.ant-splitter-bar-dragger') as HTMLElement
      await mockDrag(dragger, -40)
      expect(onResize).toHaveBeenCalledWith([90, 10])
      expect(onResizeEnd).toHaveBeenCalledWith([90, 10])
    })

    it('[true, 0, true] can be move left', async () => {
      const onResize = vi.fn()
      const onResizeEnd = vi.fn()

      const wrapper = mountSplitter({
        items: [{}, { defaultSize: 0 }, {}],
        onResize,
        onResizeEnd,
      })

      await resizeSplitter()

      const draggers = wrapper.findAll('.ant-splitter-bar-dragger')
      await mockDrag(draggers[1]?.element as HTMLElement, -100)
      expect(onResize).toHaveBeenCalledWith([0, 50, 50])
      expect(onResizeEnd).toHaveBeenCalledWith([0, 50, 50])
    })

    it('[false, 0, true] can not be move left', async () => {
      const onResize = vi.fn()
      const onResizeEnd = vi.fn()

      const wrapper = mountSplitter({
        items: [{ resizable: false }, { defaultSize: 0 }, {}],
        onResize,
        onResizeEnd,
      })

      await resizeSplitter()

      const draggers = wrapper.findAll('.ant-splitter-bar-dragger')
      await mockDrag(draggers[1]?.element as HTMLElement, -100)
      expect(onResize).toHaveBeenCalledWith([50, 0, 50])
      expect(onResizeEnd).toHaveBeenCalledWith([50, 0, 50])
    })

    it('aria-valuemin/aria-valuemax should not set NaN when container width is zero', async () => {
      containerSize = 0

      const wrapper = mountSplitter({ items: [{}, {}, {}] })

      await resizeSplitter()

      const draggers = wrapper.findAll('.ant-splitter-bar-dragger')
      await mockDrag(draggers[1]?.element as HTMLElement, -100)

      const splitter = wrapper.find('.ant-splitter').element
      triggerResize(splitter)
      await waitFakeTimer(0, 1)

      expect(errSpy).not.toHaveBeenCalled()
      expect(wrapper.find('[aria-valuemin]').attributes('aria-valuemin')).not.toBe('NaN')
      expect(wrapper.find('[aria-valuemax]').attributes('aria-valuemax')).not.toBe('NaN')
    })
  })

  describe('collapsible', () => {
    it('basic', async () => {
      const wrapper = mountSplitter({
        items: [{ size: 20, collapsible: true }, { collapsible: true }],
      })

      await resizeSplitter()

      expect(wrapper.findAll('.ant-splitter-bar-collapse-icon')).toHaveLength(2)
      expect(wrapper.find('.ant-splitter-bar-collapse-start').exists()).toBe(true)
      expect(wrapper.find('.ant-splitter-bar-collapse-end').exists()).toBe(true)

      await wrapper.setProps({
        items: [
          {
            size: 20,
            collapsible: true,
          },
          {
            collapsible: true,
          },
          {},
        ],
      })

      expect(wrapper.findAll('.ant-splitter-bar-collapse-start')).toHaveLength(2)
      expect(wrapper.findAll('.ant-splitter-bar-collapse-end')).toHaveLength(1)
    })

    it('collapsible - true', async () => {
      const onResize = vi.fn()
      const onResizeEnd = vi.fn()

      const wrapper = mountSplitter({
        items: [
          {
            size: 20,
            collapsible: true,
          },
          {},
        ],
        onResize,
        onResizeEnd,
      })

      await resizeSplitter()

      await wrapper.find('.ant-splitter-bar-collapse-start').trigger('click')
      expect(onResize).toHaveBeenCalledWith([0, 100])
      expect(onResizeEnd).toHaveBeenCalledWith([0, 100])
    })

    it('collapsible - start:true', async () => {
      const onResize = vi.fn()
      const onResizeEnd = vi.fn()

      const wrapper = mountSplitter({
        items: [
          {},
          {
            size: 20,
            collapsible: {
              start: true,
            },
          },
          {},
        ],
        onResize,
        onResizeEnd,
      })

      await resizeSplitter()

      expect(wrapper.find('.ant-splitter-bar-collapse-start').exists()).toBe(false)
      expect(wrapper.find('.ant-splitter-bar-collapse-end').exists()).toBe(true)

      await wrapper.find('.ant-splitter-bar-collapse-end').trigger('click')
      expect(onResize).toHaveBeenCalledWith([60, 0, 40])
      expect(onResizeEnd).toHaveBeenCalledWith([60, 0, 40])
    })

    it('collapsible - end:true', async () => {
      const onResize = vi.fn()
      const onResizeEnd = vi.fn()

      const wrapper = mountSplitter({
        items: [
          {},
          {
            size: 20,
            collapsible: {
              end: true,
            },
          },
          {},
        ],
        onResize,
        onResizeEnd,
      })

      await resizeSplitter()

      expect(wrapper.find('.ant-splitter-bar-collapse-start').exists()).toBe(true)
      expect(wrapper.find('.ant-splitter-bar-collapse-end').exists()).toBe(false)

      await wrapper.find('.ant-splitter-bar-collapse-start').trigger('click')
      expect(onResize).toHaveBeenCalledWith([40, 0, 60])
      expect(onResizeEnd).toHaveBeenCalledWith([40, 0, 60])
    })

    it('collapsible - showCollapsibleIcon:true', async () => {
      const wrapper = mountSplitter({
        items: [
          {},
          {
            collapsible: {
              start: true,
              end: true,
              showCollapsibleIcon: true,
            },
          },
          {},
        ],
      })

      await resizeSplitter()
      expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-always-visible')).toHaveLength(2)

      await wrapper.setProps({
        items: [
          {},
          {
            collapsible: {
              start: true,
              end: false,
              showCollapsibleIcon: true,
            },
          },
          {},
        ],
      })

      await resizeSplitter()
      expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-always-visible')).toHaveLength(1)

      await wrapper.setProps({
        items: [
          {
            collapsible: {
              start: true,
              end: true,
              showCollapsibleIcon: true,
            },
          },
          {
            collapsible: {
              start: true,
              end: true,
              showCollapsibleIcon: true,
            },
          },
          {
            collapsible: {
              start: true,
              end: true,
              showCollapsibleIcon: true,
            },
          },
        ],
      })

      await resizeSplitter()

      expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-always-visible')).toHaveLength(4)

      await wrapper.findAll('.ant-splitter-bar-collapse-start')[0]!.trigger('click')
      expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-always-visible')).toHaveLength(3)
      expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-end')).toHaveLength(2)
      expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-start')).toHaveLength(1)

      await wrapper.findAll('.ant-splitter-bar-collapse-end')[0]!.trigger('click')
      await wrapper.findAll('.ant-splitter-bar-collapse-end')[0]!.trigger('click')
      expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-always-visible')).toHaveLength(2)
      expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-start')).toHaveLength(1)
      expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-end')).toHaveLength(1)

      await wrapper.findAll('.ant-splitter-bar-collapse-end')[0]!.trigger('click')
      expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-always-visible')).toHaveLength(4)
    })

    it('collapsible - showCollapsibleIcon:false', async () => {
      const wrapper = mountSplitter({
        items: [
          {
            collapsible: {
              start: true,
              end: true,
              showCollapsibleIcon: false,
            },
          },
          {
            collapsible: {
              start: true,
              end: true,
              showCollapsibleIcon: false,
            },
          },
        ],
      })

      await resizeSplitter()
      expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-always-hidden')).toHaveLength(2)

      await wrapper.setProps({
        items: [
          {
            collapsible: {
              start: true,
              end: true,
              showCollapsibleIcon: false,
            },
          },
          {
            size: 0,
            collapsible: {
              start: true,
              end: true,
              showCollapsibleIcon: false,
            },
          },
          {
            collapsible: {
              start: true,
              end: true,
              showCollapsibleIcon: false,
            },
          },
        ],
      })

      await resizeSplitter()
      expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-always-hidden')).toHaveLength(2)
    })

    it('collapsible - showCollapsibleIcon:auto', async () => {
      const wrapper = mountSplitter({
        items: [
          {},
          {
            collapsible: true,
          },
          {},
        ],
      })

      await resizeSplitter()
      expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-hover-only')).toHaveLength(2)

      await wrapper.setProps({
        items: [
          {},
          {
            collapsible: {
              start: true,
            },
          },
          {},
        ],
      })

      await resizeSplitter()
      expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-hover-only')).toHaveLength(1)

      await wrapper.setProps({
        items: [
          {},
          {
            collapsible: {
              start: true,
              end: true,
              showCollapsibleIcon: 'auto',
            },
          },
          {},
        ],
      })

      await resizeSplitter()
      expect(wrapper.findAll('.ant-splitter-bar-collapse-bar-hover-only')).toHaveLength(2)
    })

    it('both collapsible', async () => {
      const onResize = vi.fn()
      const onResizeEnd = vi.fn()

      const wrapper = mountSplitter({
        items: [
          {
            collapsible: true,
          },
          {
            collapsible: true,
          },
        ],
        onResize,
        onResizeEnd,
      })

      await resizeSplitter()

      const expectClick = async (element: Element, size: number[]) => {
        onResize.mockReset()
        onResizeEnd.mockReset()

        element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        await waitFakeTimer(0, 1)
        expect(onResize).toHaveBeenCalledWith(size)
        expect(onResizeEnd).toHaveBeenCalledWith(size)
      }

      await expectClick(wrapper.find('.ant-splitter-bar-collapse-start').element, [0, 100])
      await expectClick(wrapper.find('.ant-splitter-bar-collapse-end').element, [50, 50])
      await expectClick(wrapper.find('.ant-splitter-bar-collapse-end').element, [100, 0])
      await expectClick(wrapper.find('.ant-splitter-bar-collapse-start').element, [50, 50])
    })

    it('collapsible with cache', async () => {
      const onResize = vi.fn()
      const onResizeEnd = vi.fn()

      const wrapper = mountSplitter({
        items: [
          {
            defaultSize: 20,
            collapsible: true,
            min: 10,
          },
          {
            collapsible: true,
            min: '80%',
          },
        ],
        onResize,
        onResizeEnd,
      })

      await resizeSplitter()

      await wrapper.find('.ant-splitter-bar-collapse-start').trigger('click')
      expect(onResize).toHaveBeenCalledWith([0, 100])
      expect(onResizeEnd).toHaveBeenCalledWith([0, 100])
      expect(wrapper.find('.ant-splitter-bar-dragger-disabled').exists()).toBe(true)

      onResize.mockReset()
      onResizeEnd.mockReset()
      await wrapper.find('.ant-splitter-bar-collapse-end').trigger('click')
      expect(onResize).toHaveBeenCalledWith([20, 80])
      expect(onResizeEnd).toHaveBeenCalledWith([20, 80])
      expect(wrapper.find('.ant-splitter-bar-dragger-disabled').exists()).toBe(false)

      onResize.mockReset()
      onResizeEnd.mockReset()
      await wrapper.find('.ant-splitter-bar-collapse-end').trigger('click')
      expect(onResize).toHaveBeenCalledWith([100, 0])
      expect(onResizeEnd).toHaveBeenCalledWith([100, 0])
      expect(wrapper.find('.ant-splitter-bar-dragger-disabled').exists()).toBe(true)
    })

    it('collapsible with fallback', async () => {
      const onResize = vi.fn()
      const onResizeEnd = vi.fn()

      containerSize = 500

      const wrapper = mountSplitter({
        items: [
          {
            defaultSize: 300,
            collapsible: true,
            max: 200,
          },
          {
            collapsible: true,
          },
        ],
        onResize,
        onResizeEnd,
      })

      await resizeSplitter()

      await wrapper.find('.ant-splitter-bar-collapse-start').trigger('click')
      expect(onResize).toHaveBeenCalledWith([0, 500])
      expect(onResizeEnd).toHaveBeenCalledWith([0, 500])

      onResize.mockReset()
      onResizeEnd.mockReset()
      await wrapper.find('.ant-splitter-bar-collapse-end').trigger('click')
      expect(onResize).toHaveBeenCalledWith([100, 400])
      expect(onResizeEnd).toHaveBeenCalledWith([100, 400])

      onResize.mockReset()
      onResizeEnd.mockReset()
      await wrapper.find('.ant-splitter-bar-collapse-end').trigger('click')
      expect(onResize).toHaveBeenCalledWith([500, 0])
      expect(onResizeEnd).toHaveBeenCalledWith([500, 0])
    })

    it('collapsible with min', async () => {
      const onResize = vi.fn()
      const onResizeEnd = vi.fn()

      containerSize = 440

      const wrapper = mountSplitter({
        items: [
          {
            defaultSize: 100,
            collapsible: true,
            min: 150,
          },
          {
            collapsible: true,
          },
        ],
        onResize,
        onResizeEnd,
      })

      await resizeSplitter()

      await wrapper.find('.ant-splitter-bar-collapse-start').trigger('click')
      expect(onResize).toHaveBeenCalledWith([0, 440])
      expect(onResizeEnd).toHaveBeenCalledWith([0, 440])

      onResize.mockReset()
      onResizeEnd.mockReset()
      await wrapper.find('.ant-splitter-bar-collapse-end').trigger('click')
      expect(onResize).toHaveBeenCalledWith([150, 290])
      expect(onResizeEnd).toHaveBeenCalledWith([150, 290])

      onResize.mockReset()
      onResizeEnd.mockReset()
      await wrapper.find('.ant-splitter-bar-collapse-end').trigger('click')
      expect(onResize).toHaveBeenCalledWith([440, 0])
      expect(onResizeEnd).toHaveBeenCalledWith([440, 0])
    })

    it('should trigger onCollapse when collapse button clicked', async () => {
      const onCollapse = vi.fn()
      const wrapper = mountSplitter({
        items: [{ collapsible: true }, { collapsible: true }],
        onCollapse,
      })

      await resizeSplitter()

      await wrapper.find('.ant-splitter-bar-collapse-start').trigger('click')
      expect(onCollapse).toHaveBeenCalledTimes(1)
      expect(onCollapse).toHaveBeenCalledWith([true, false], [0, 100])

      await wrapper.find('.ant-splitter-bar-collapse-end').trigger('click')
      expect(onCollapse).toHaveBeenCalledTimes(2)
      expect(onCollapse).toHaveBeenCalledWith([false, false], [50, 50])
    })
  })

  it('auto resize', async () => {
    containerSize = 200

    const onResize = vi.fn()
    const wrapper = mountSplitter({
      items: [
        {
          collapsible: true,
        },
        {},
      ],
      onResize,
    })

    triggerResize(wrapper.find('.ant-splitter').element)
    await waitFakeTimer(0, 1)

    await wrapper.find('.ant-splitter-bar-collapse-start').trigger('click')
    expect(onResize).toHaveBeenCalledWith([0, 200])
  })

  describe('customize', () => {
    it('customize draggerIcon', () => {
      const wrapper = mountSplitter({
        draggerIcon: <span class="customize-dragger-icon" />,
      })

      const draggerEle = wrapper.find('.ant-splitter-bar-dragger')

      expect(draggerEle.classes()).toContain('ant-splitter-bar-dragger-customize')
      expect(draggerEle.find('.ant-splitter-bar-dragger-icon').exists()).toBe(true)
      expect(draggerEle.find('.customize-dragger-icon').exists()).toBe(true)
    })

    it('customize collapsibleIcon', async () => {
      const wrapper = mountSplitter({
        items: [{ size: 20, collapsible: true }, { collapsible: true }],
        collapsibleIcon: {
          start: <span class="customize-icon-start" />,
          end: <span class="customize-icon-end" />,
        },
      })

      await resizeSplitter()

      const startEle = wrapper.find('.ant-splitter-bar-collapse-bar-start')
      const endEle = wrapper.find('.ant-splitter-bar-collapse-bar-end')

      expect(startEle.classes()).toContain('ant-splitter-bar-collapse-bar-customize')
      expect(endEle.classes()).toContain('ant-splitter-bar-collapse-bar-customize')

      expect(startEle.find('.customize-icon-start').exists()).toBe(true)
      expect(endEle.find('.customize-icon-end').exists()).toBe(true)
    })

    it('styles', async () => {
      const customStyles = {
        root: { background: 'red' },
        panel: { background: 'blue' },
        dragger: { background: 'green' },
      }
      const customClasses = {
        root: 'custom-root',
        panel: 'custom-panel',
        dragger: { default: 'custom-dragger', active: 'custom-dragger-active' },
      }

      const wrapper = mountSplitter({
        styles: customStyles,
        classes: customClasses,
      })

      const root = wrapper.find('.ant-splitter')
      expect(root.element).toHaveStyle(customStyles.root)
      expect(root.classes()).toContain(customClasses.root)

      const panel = wrapper.find('.ant-splitter-panel')
      expect(panel.element).toHaveStyle(customStyles.panel)
      expect(panel.classes()).toContain(customClasses.panel)

      const dragger = wrapper.find('.ant-splitter-bar-dragger')
      expect(dragger.element).toHaveStyle(customStyles.dragger)
      expect(dragger.classes()).toContain(customClasses.dragger.default)
      expect(dragger.classes()).not.toContain(customClasses.dragger.active)

      dispatchMouseEvent(dragger.element, 'mousedown', 0, 0)
      await nextTick()
      expect(dragger.classes()).toContain(customClasses.dragger.default)
      expect(dragger.classes()).toContain(customClasses.dragger.active)
    })
  })

  describe('orientation attribute', () => {
    const testCases: Array<
      [
        params: [orientation?: Orientation, defaultVertical?: boolean, layout?: Orientation],
        expected: string,
      ]
    > = [
      [[undefined, undefined, 'vertical'], 'vertical'],
      [['vertical', undefined, 'horizontal'], 'vertical'],
      [['vertical', undefined, undefined], 'vertical'],
      [['horizontal', true, undefined], 'horizontal'],
      [[undefined, true, undefined], 'vertical'],
    ]

    it.each(testCases)('with args %j should have %s node', (params, expected) => {
      const wrapper = mountSplitter({
        items: [{}, {}, {}],
        orientation: params[0],
        vertical: params[1],
        ...(params[2] && { layout: params[2] }),
      })

      expect(wrapper.find(`.ant-splitter-${expected}`).exists()).toBe(true)

      if (params[2]) {
        const warningMatched = errSpy.mock.calls.some(call =>
          call.join(' ').includes('`layout` is deprecated. Please use `orientation` instead.'),
        )
        expect(warningMatched).toBe(true)
      }
    })
  })
})
