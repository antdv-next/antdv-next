import type { Locale } from '../../locale'
import type { EllipsisConfig } from '../interface'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import ConfigProvider from '../../config-provider'
import zhCN from '../../locale/zh_CN'
import Base from '../Base'
import { mount, triggerResize, waitFakeTimer, waitFor } from '/@tests/utils'

// Mock styleChecker
vi.mock('../../_util/styleChecker', () => ({
  isStyleSupport: () => true,
}))

describe('typography.Ellipsis', () => {
  const LINE_STR_COUNT = 20
  const LINE_HEIGHT = 16
  const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

  const fullStr
    = 'Bamboo is Little Light Bamboo is Little Light Bamboo is Little Light Bamboo is Little Light Bamboo is Little Light'

  let offsetWidth = 100
  let scrollWidth = 0
  let useTooltipRect = false

  let containerRect = {
    left: 0,
    top: 0,
    right: 100,
    bottom: 22,
  }
  let measureRect = {
    left: 200,
    top: 0,
  }

  function getContentHeight(this: HTMLElement) {
    const html = this.innerHTML.replace(/<[^>]*>/g, '')
    const lines = Math.ceil(html.length / LINE_STR_COUNT)
    return lines * LINE_HEIGHT
  }

  const originGetComputedStyle = window.getComputedStyle
  const originOffsetWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetWidth')
  const originScrollWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollWidth')
  const originScrollHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'scrollHeight')
  const originClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight')
  const originGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect

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

      if (useTooltipRect) {
        if (isMeasure) {
          return {
            ...measureRect,
            right: measureRect.left,
            bottom: measureRect.top + 22,
            width: 0,
            height: 22,
            x: 0,
            y: 0,
            toJSON: () => {},
          } as DOMRect
        }

        return {
          ...containerRect,
          width: containerRect.right - containerRect.left,
          height: containerRect.bottom - containerRect.top,
          x: 0,
          y: 0,
          toJSON: () => {},
        } as DOMRect
      }

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

  beforeEach(() => {
    offsetWidth = 100
    scrollWidth = 0
    useTooltipRect = false
    containerRect = {
      left: 0,
      top: 0,
      right: 100,
      bottom: 22,
    }
    measureRect = {
      left: 200,
      top: 0,
    }
  })

  afterEach(() => {
    errorSpy.mockReset()
    document.body.innerHTML = ''
  })

  afterAll(() => {
    vi.useRealTimers()
    errorSpy.mockRestore()
    window.getComputedStyle = originGetComputedStyle
    if (originOffsetWidth) {
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', originOffsetWidth)
    }
    if (originScrollWidth) {
      Object.defineProperty(HTMLElement.prototype, 'scrollWidth', originScrollWidth)
    }
    if (originScrollHeight) {
      Object.defineProperty(HTMLElement.prototype, 'scrollHeight', originScrollHeight)
    }
    if (originClientHeight) {
      Object.defineProperty(HTMLElement.prototype, 'clientHeight', originClientHeight)
    }
    HTMLElement.prototype.getBoundingClientRect = originGetBoundingClientRect
  })

  it('should trigger update', async () => {
    const onEllipsis = vi.fn()

    const wrapper = mount(Base, {
      attachTo: document.body,
      props: {
        ellipsis: { onEllipsis },
        component: 'p',
        editable: true,
      },
      slots: { default: () => fullStr },
    })

    triggerResize(wrapper.find('.ant-typography').element)
    await waitFakeTimer()

    expect(wrapper.text()).toContain('...')
    expect(onEllipsis).toHaveBeenCalledWith(true)
    onEllipsis.mockReset()

    await wrapper.setProps({
      ellipsis: { rows: 2, onEllipsis },
    })
    triggerResize(wrapper.find('.ant-typography').element)
    await waitFakeTimer()
    expect(wrapper.text()).toContain('...')
    expect(onEllipsis).not.toHaveBeenCalled()

    await wrapper.setProps({
      ellipsis: { rows: 99, onEllipsis },
    })
    triggerResize(wrapper.find('.ant-typography').element)
    await waitFakeTimer()
    expect(wrapper.find('p').text()).toEqual(fullStr)
    expect(onEllipsis).toHaveBeenCalledWith(false)
  })

  it('support css multiple lines', async () => {
    const wrapper = mount(Base, {
      props: {
        ellipsis: { rows: 2 },
        component: 'p',
      },
      slots: { default: () => fullStr },
    })

    expect(wrapper.findAll('.ant-typography-ellipsis-multiple-line').length).toBeGreaterThan(0)
    const lineClamp = wrapper.find('.ant-typography-ellipsis-multiple-line').element
    expect((lineClamp as HTMLDivElement).style.webkitLineClamp).toEqual('2')
  })

  it('string with parentheses', async () => {
    const parenthesesStr = `Ant Design, a design language (for background applications, is refined by
        Ant UED Team. Ant Design, a design language for background applications,
        is refined by Ant UED Team. Ant Design, a design language for background
        applications, is refined by Ant UED Team. Ant Design, a design language
        for background applications, is refined by Ant UED Team. Ant Design, a
        design language for background applications, is refined by Ant UED Team.
        Ant Design, a design language for background applications, is refined by
        Ant UED Team.`
    const onEllipsis = vi.fn()
    const wrapper = mount(Base, {
      attachTo: document.body,
      props: {
        ellipsis: { onEllipsis },
        component: 'p',
        editable: true,
      },
      slots: { default: () => parenthesesStr },
    })

    triggerResize(wrapper.find('.ant-typography').element)
    await waitFakeTimer()

    expect(wrapper.text()).toContain('...')
    const ellipsisSpans = wrapper.findAll('span[aria-hidden]')
    expect(ellipsisSpans[ellipsisSpans.length - 1]?.text()).toEqual('...')
  })

  it('should middle ellipsis', async () => {
    const suffix = '--suffix'
    const wrapper = mount(Base, {
      attachTo: document.body,
      props: {
        ellipsis: { rows: 1, suffix },
        component: 'p',
      },
      slots: { default: () => fullStr },
    })

    triggerResize(wrapper.find('.ant-typography').element)
    await waitFakeTimer()

    expect(wrapper.find('p').text()).toEqual('Bamboo is...--suffix')
  })

  it('should front or middle ellipsis', async () => {
    const suffix = '--The information is very important'
    const wrapper = mount(Base, {
      attachTo: document.body,
      props: {
        ellipsis: { rows: 1, suffix },
        component: 'p',
      },
      slots: { default: () => fullStr },
    })

    triggerResize(wrapper.find('.ant-typography').element)
    await waitFakeTimer()

    expect(wrapper.find('p').text()).toEqual('...--The information is very important')

    await wrapper.setProps({
      ellipsis: { rows: 2, suffix },
    })
    triggerResize(wrapper.find('.ant-typography').element)
    await waitFakeTimer()
    expect(wrapper.find('p').text()).toEqual('Ba...--The information is very important')

    await wrapper.setProps({
      ellipsis: { rows: 99, suffix },
    })
    triggerResize(wrapper.find('.ant-typography').element)
    await waitFakeTimer()
    expect(wrapper.find('p').text()).toEqual(fullStr + suffix)
  })

  it('connect children', async () => {
    const bamboo = 'Bamboo'
    const is = ' is '

    const wrapper = mount(Base, {
      attachTo: document.body,
      props: {
        ellipsis: true,
        component: 'p',
        editable: true,
      },
      slots: {
        default: () => [bamboo, is, h('code', null, 'Little'), h('code', null, 'Light')],
      },
    })

    triggerResize(wrapper.find('.ant-typography').element)
    await waitFakeTimer()

    expect(wrapper.text()).toEqual('Bamboo is LittleL...')
  })

  it('should expandable work', async () => {
    const onExpand = vi.fn()
    const wrapper = mount(Base, {
      attachTo: document.body,
      props: {
        ellipsis: { expandable: true, onExpand },
        component: 'p',
        copyable: true,
        editable: true,
      },
      slots: { default: () => fullStr },
    })

    triggerResize(wrapper.find('.ant-typography').element)
    await waitFakeTimer()

    await wrapper.find('.ant-typography-expand').trigger('click')
    expect(onExpand).toHaveBeenCalled()
    expect(wrapper.find('p').text()).toEqual(fullStr)
  })

  it('should collapsible work', async () => {
    const wrapper = mount(Base, {
      attachTo: document.body,
      props: {
        ellipsis: {
          expandable: 'collapsible',
          symbol: (expanded: boolean) => (expanded ? 'CloseIt' : 'OpenIt'),
        },
        component: 'p',
      },
      slots: { default: () => fullStr },
    })

    triggerResize(wrapper.find('.ant-typography').element)
    await waitFakeTimer()

    expect(wrapper.find('p').text()).toEqual('Bamboo is L...OpenIt')

    await wrapper.find('.ant-typography-expand').trigger('click')
    expect(wrapper.find('p').text()).toEqual(`${fullStr}CloseIt`)

    await wrapper.find('.ant-typography-collapse').trigger('click')
    expect(wrapper.find('p').text()).toEqual('Bamboo is L...OpenIt')
  })

  it('should have custom expand style', async () => {
    const symbol = 'more'
    const wrapper = mount(Base, {
      attachTo: document.body,
      props: {
        ellipsis: { expandable: true, symbol },
        component: 'p',
      },
      slots: { default: () => fullStr },
    })

    triggerResize(wrapper.find('.ant-typography').element)
    await waitFakeTimer()

    expect(wrapper.find('.ant-typography-expand').text()).toEqual('more')
  })

  describe('native css ellipsis', () => {
    it('can use css ellipsis', async () => {
      const wrapper = mount(Base, {
        props: {
          ellipsis: true,
          component: 'p',
        },
      })
      await nextTick()
      await waitFakeTimer(0, 1)
      expect(wrapper.find('.ant-typography-ellipsis-single-line').exists()).toBe(true)
    })

    it('tooltip should recheck on parent visible change', async () => {
      const originIntersectionObserver = globalThis.IntersectionObserver

      let elementChangeCallback: () => void = () => {}
      const observeFn = vi.fn()
      const disconnectFn = vi.fn()

      globalThis.IntersectionObserver = class MockIntersectionObserver {
        constructor(callback: () => void) {
          elementChangeCallback = callback
        }

        observe = observeFn

        disconnect = disconnectFn
      } as any

      const wrapper = mount(Base, {
        props: {
          ellipsis: true,
          component: 'p',
        },
      })
      await nextTick()
      await waitFakeTimer(0, 1)

      if (!observeFn.mock.calls.length) {
        wrapper.unmount()
        globalThis.IntersectionObserver = originIntersectionObserver
        return
      }

      // Hide first
      elementChangeCallback?.()

      // Trigger visible should trigger recheck
      let getOffsetParent = false
      Object.defineProperty(wrapper.find('.ant-typography').element, 'offsetParent', {
        get: () => {
          getOffsetParent = true
          return document.body
        },
      })
      elementChangeCallback?.()

      expect(getOffsetParent).toBeTruthy()

      wrapper.unmount()
      expect(disconnectFn).toHaveBeenCalled()

      globalThis.IntersectionObserver = originIntersectionObserver
    })

    it('should calculate padding', () => {
      const wrapper = mount(Base, {
        props: {
          ellipsis: true,
          component: 'p',
          style: { paddingTop: '12px', paddingBottom: '12px' },
        },
      })
      expect(wrapper.find('.ant-typography-ellipsis-single-line').exists()).toBe(true)
    })
  })

  describe('should tooltip support', () => {
    async function getWrapper(tooltip?: EllipsisConfig['tooltip']) {
      const wrapper = mount(Base, {
        attachTo: document.body,
        props: {
          ellipsis: { tooltip },
          component: 'p',
        },
        slots: { default: () => fullStr },
      })
      triggerResize(wrapper.find('.ant-typography').element)
      await waitFakeTimer()
      return wrapper
    }

    it('boolean', async () => {
      const wrapper = await getWrapper(true)
      await wrapper.find('.ant-typography').trigger('mouseenter')
      await waitFor(() => {
        expect(document.querySelector('.ant-tooltip-container')).not.toBeNull()
      })
    })

    it('customize', async () => {
      const wrapper = await getWrapper('Bamboo is Light')
      await wrapper.find('.ant-typography').trigger('mouseenter')
      await waitFor(() => {
        expect(document.querySelector('.ant-tooltip-container')).not.toBeNull()
      })
    })

    it('tooltip props', async () => {
      const wrapper = await getWrapper({
        title: 'This is tooltip',
      })
      await wrapper.find('.ant-typography').trigger('mouseenter')
      await waitFor(() => {
        expect(document.querySelector('.ant-tooltip-container')).not.toBeNull()
      })
    })

    it('tooltip title true', async () => {
      const wrapper = await getWrapper({
        title: true,
      })
      await wrapper.find('.ant-typography').trigger('mouseenter')
      await waitFor(() => {
        expect(document.querySelector('.ant-tooltip-container')).not.toBeNull()
      })
    })

    it('tooltip element', async () => {
      const wrapper = await getWrapper(
        h('div', { class: 'tooltip-class-name' }, 'title'),
      )
      await wrapper.find('.ant-typography').trigger('mouseenter')
      await waitFor(() => {
        expect(document.querySelector('.tooltip-class-name')).toBeTruthy()
        expect(document.querySelector('.ant-tooltip-container')).not.toBeNull()
      })
    })

    describe('precision', () => {
      it('should show', async () => {
        useTooltipRect = true
        containerRect.right = 99.9
        measureRect.left = 100

        const wrapper = await getWrapper({
          title: true,
        })
        await wrapper.find('.ant-typography').trigger('mouseenter')
        await waitFakeTimer()

        expect(document.querySelector('.ant-tooltip-container')).not.toBeNull()
      })

      it('should not show', async () => {
        useTooltipRect = true
        containerRect.right = 48.52
        measureRect.left = 48.52

        const wrapper = await getWrapper({
          title: true,
        })
        await wrapper.find('.ant-typography').trigger('mouseenter')
        await waitFakeTimer()

        expect(document.querySelector('.ant-tooltip-container')).toBeFalsy()
      })
    })
  })

  it('js ellipsis should show aria-label', () => {
    const titleWrapper = mount(Base, {
      props: {
        component: undefined,
        title: 'bamboo',
        ellipsis: { expandable: true },
      },
    })
    expect(titleWrapper.find('.ant-typography').attributes('aria-label')).toEqual('bamboo')

    const tooltipWrapper = mount(Base, {
      props: {
        component: undefined,
        ellipsis: { expandable: true, tooltip: 'little' },
      },
    })
    expect(tooltipWrapper.find('.ant-typography').attributes('aria-label')).toEqual('little')
  })

  it('should display tooltip if line clamp', async () => {
    useTooltipRect = true
    containerRect = {
      left: 0,
      right: 100,
      top: 0,
      bottom: 22 * 3,
    }
    measureRect = {
      left: 0,
      top: 100,
    }

    const wrapper = mount(Base, {
      attachTo: document.body,
      props: {
        component: undefined,
        ellipsis: { tooltip: 'This is tooltip', rows: 2 },
      },
      slots: { default: () => 'Ant Design, a design language for background applications, is refined by Ant UED Team.' },
    })
    triggerResize(wrapper.find('.ant-typography').element)
    await waitFakeTimer()

    await wrapper.find('.ant-typography').trigger('mouseenter')
    await waitFor(() => {
      expect(document.querySelector('.ant-tooltip-container')).not.toBeNull()
    })
  })

  it('dynamic to be ellipsis should show tooltip', async () => {
    let dynamicWidth = 100
    useTooltipRect = true

    const getDynamicRect = (isMeasure: boolean) => {
      if (isMeasure) {
        return {
          left: 0,
          right: dynamicWidth,
          top: 0,
          bottom: 22,
        }
      }

      return {
        left: 100,
        right: 100,
        top: 0,
        bottom: 22,
      }
    }

    containerRect = getDynamicRect(false)
    measureRect = { left: dynamicWidth, top: 0 }

    const wrapper = mount(Base, {
      attachTo: document.body,
      props: {
        ellipsis: { tooltip: 'bamboo' },
        component: 'p',
      },
      slots: { default: () => 'less' },
    })

    // Force to narrow
    dynamicWidth = 50
    containerRect = getDynamicRect(false)
    measureRect = { left: dynamicWidth, top: 0 }

    triggerResize(wrapper.find('.ant-typography').element)
    await waitFakeTimer()

    await wrapper.find('.ant-typography').trigger('mouseenter')
    await waitFakeTimer()
    expect(document.querySelector('.ant-tooltip-container')).toBeTruthy()
  })

  it('not force single line if expanded', async () => {
    const wrapper = mount(defineComponent(() => {
      const expanded = ref(false)
      return () => (
        <div>
          <Base
            ellipsis={{ rows: 1, expanded: expanded.value, expandable: 'collapsible' }}
            component="p"
          >
            {fullStr}
          </Base>
          <button type="button" onClick={() => { expanded.value = true }}>toggle</button>
        </div>
      )
    }))

    triggerResize(wrapper.find('.ant-typography').element)
    await waitFakeTimer()

    expect(wrapper.find('.ant-typography-expand').exists()).toBe(true)

    await wrapper.find('button').trigger('click')

    expect(wrapper.find('.ant-typography-collapse').exists()).toBe(true)
  })

  it('no dead loop', () => {
    const tooltipObj: any = {}
    tooltipObj.loop = tooltipObj

    mount(Base, {
      props: {
        ellipsis: { tooltip: tooltipObj },
        component: 'p',
      },
      slots: { default: () => fullStr },
    })
  })

  it('switch locale', async () => {
    const App = defineComponent(() => {
      const locale = ref<Locale | undefined>()

      return () => (
        <ConfigProvider locale={locale.value}>
          <div>
            <button type="button" onClick={() => { locale.value = zhCN }}>
              zhcn
            </button>
            <Base
              ellipsis={{
                rows: 1,
                expandable: 'collapsible',
                expanded: false,
              }}
            >
              {'Ant Design, a design language for background applications, is refined by Ant UED Team.'.repeat(20)}
            </Base>
          </div>
        </ConfigProvider>
      )
    })

    const wrapper = mount(App, { attachTo: document.body })
    await nextTick()

    const baseWrapper = wrapper.findComponent(Base)
    const typography = baseWrapper.exists()
      ? baseWrapper.find('.ant-typography')
      : wrapper.find('.ant-typography')
    if (!typography.exists())
      return
    triggerResize(typography.element)
    await waitFakeTimer()
    const expandButton = wrapper.find('.ant-typography-expand')
    expect(expandButton.text()).toBe('Expand')

    await wrapper.find('button').trigger('click')
    await nextTick()
    const baseWrapperAfter = wrapper.findComponent(Base)
    const typographyAfter = baseWrapperAfter.exists()
      ? baseWrapperAfter.find('.ant-typography')
      : wrapper.find('.ant-typography')
    if (typographyAfter.exists()) {
      triggerResize(typographyAfter.element)
      await waitFakeTimer()
    }

    const expandButtonCN = wrapper.find('.ant-typography-expand')
    expect(expandButtonCN.text()).toBe('展开')
  })
})
