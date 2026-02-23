import type { TooltipPlacement } from '..'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import Tooltip from '..'
import getPlacements from '../../_util/placements'
import Button from '../../button'
import ConfigProvider from '../../config-provider'
import { defaultPrefixCls } from '../../config-provider/context'
import DatePicker from '../../date-picker'
import Radio from '../../radio'
import Switch from '../../switch'
import { genCssVar } from '../../theme/util/genStyleUtils'
import { parseColor } from '../util'
import { isTooltipOpen } from './util'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount, waitFakeTimer } from '/@tests/utils'

async function flushTooltipTimer() {
  await waitFakeTimer(150, 10)
}

function getTooltipSnapshotContainer(triggerElement: Element, tooltipElement?: Element | null) {
  const snapshotContainer = document.createElement('div')
  snapshotContainer.appendChild(triggerElement.cloneNode(true))
  if (tooltipElement) {
    snapshotContainer.appendChild(tooltipElement.cloneNode(true))
  }
  return snapshotContainer
}

interface TriggerTarget {
  trigger: (name: string) => Promise<any>
  element?: Element
}

async function triggerWithDisabledFallback(target: TriggerTarget, name: string) {
  await target.trigger(name)

  const element = target.element as HTMLElement | undefined
  if (!element) {
    return
  }

  const isDisabled = (
    ('disabled' in element && !!(element as HTMLButtonElement | HTMLInputElement).disabled)
    || element.getAttribute('disabled') !== null
  )

  if (!isDisabled) {
    return
  }

  const EventCtor = (name.startsWith('pointer') && typeof PointerEvent !== 'undefined')
    ? PointerEvent
    : MouseEvent
  element.dispatchEvent(new EventCtor(name, { bubbles: true, cancelable: true }))
}

async function triggerEnter(target: TriggerTarget) {
  await triggerWithDisabledFallback(target, 'mouseenter')
  await triggerWithDisabledFallback(target, 'pointerenter')
}

async function triggerLeave(target: TriggerTarget) {
  await triggerWithDisabledFallback(target, 'mouseleave')
  await triggerWithDisabledFallback(target, 'pointerleave')
}

describe('tooltip', () => {
  mountTest(Tooltip)
  rtlTest(Tooltip)

  let originOffsetParentDescriptor: PropertyDescriptor | undefined

  beforeAll(() => {
    originOffsetParentDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'offsetParent')
    Object.defineProperty(HTMLElement.prototype, 'offsetParent', {
      configurable: true,
      get: () => document.body,
    })
  })

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  afterAll(() => {
    if (originOffsetParentDescriptor) {
      Object.defineProperty(HTMLElement.prototype, 'offsetParent', originOffsetParentDescriptor)
    }
  })

  it('check `onOpenChange` arguments', async () => {
    const onOpenChange = vi.fn()

    const wrapper = mount(Tooltip, {
      attachTo: document.body,
      props: {
        title: '',
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onOpenChange,
      },
      slots: {
        default: () => <div id="hello">Hello world!</div>,
      },
    })

    const divElement = wrapper.find('#hello')
    await triggerEnter(divElement)
    await flushTooltipTimer()
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(isTooltipOpen()).toBeFalsy()
    expect(wrapper.find('.ant-tooltip-open').exists()).toBe(false)

    await triggerLeave(divElement)
    await flushTooltipTimer()
    expect(onOpenChange).not.toHaveBeenCalled()
    expect(isTooltipOpen()).toBeFalsy()
    expect(wrapper.find('.ant-tooltip-open').exists()).toBe(false)

    await wrapper.setProps({
      title: 'Have a nice day!',
    })
    await nextTick()

    const updatedDivElement = wrapper.find('#hello')
    await triggerEnter(updatedDivElement)
    await flushTooltipTimer()
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    expect(isTooltipOpen()).toBeTruthy()
    expect(wrapper.find('.ant-tooltip-open').exists()).toBe(true)

    await triggerLeave(updatedDivElement)
    await flushTooltipTimer()
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(isTooltipOpen()).toBeFalsy()
    expect(wrapper.find('.ant-tooltip-open').exists()).toBe(false)

    await wrapper.setProps({
      open: false,
    })
    await nextTick()
    await triggerEnter(updatedDivElement)
    await flushTooltipTimer()
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    const lastCount = onOpenChange.mock.calls.length
    expect(isTooltipOpen()).toBeFalsy()
    expect(wrapper.find('.ant-tooltip-open').exists()).toBe(false)

    await triggerLeave(updatedDivElement)
    await flushTooltipTimer()
    expect(onOpenChange.mock.calls.length).toBe(lastCount)
    expect(isTooltipOpen()).toBeFalsy()
    expect(wrapper.find('.ant-tooltip-open').exists()).toBe(false)
  })

  it('should switch to uncontrolled mode when controlled open path becomes undefined', async () => {
    const state = ref<Record<string, any>>({ open: true })

    const wrapper = mount({
      render() {
        return (
          <Tooltip
            title="Have a nice day!"
            mouseEnterDelay={0}
            mouseLeaveDelay={0}
            open={state.value.open}
            {...{
              'onUpdate:open': (val: boolean) => {
                state.value.open = val
              },
            }}
          >
            <div id="tooltip-open-switch">Hello world!</div>
          </Tooltip>
        )
      },
    }, {
      attachTo: document.body,
    })

    await flushTooltipTimer()
    expect(isTooltipOpen()).toBeTruthy()
    expect(wrapper.find('.ant-tooltip-open').exists()).toBe(true)

    state.value = {}
    await nextTick()
    await flushTooltipTimer()
    expect(isTooltipOpen()).toBeFalsy()
    expect(wrapper.find('.ant-tooltip-open').exists()).toBe(false)

    const target = wrapper.find('#tooltip-open-switch')
    await triggerEnter(target)
    await flushTooltipTimer()

    expect(isTooltipOpen()).toBeTruthy()
    expect(wrapper.find('.ant-tooltip-open').exists()).toBe(true)
    expect(state.value.open).toBe(true)
  })

  it('should hide when mouse leave native disabled button', async () => {
    const onOpenChange = vi.fn()

    const wrapper = mount(Tooltip, {
      attachTo: document.body,
      props: {
        title: 'xxxxx',
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onOpenChange,
      },
      slots: {
        default: () => (
          <button type="button" disabled>
            Hello world!
          </button>
        ),
      },
    })

    const button = wrapper.find('button')
    await triggerEnter(button)
    await flushTooltipTimer()
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(isTooltipOpen()).toBeTruthy()
    expect(wrapper.find('.ant-tooltip-open').exists()).toBe(true)

    await triggerLeave(button)
    await flushTooltipTimer()
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(isTooltipOpen()).toBeFalsy()
    expect(wrapper.find('.ant-tooltip-open').exists()).toBe(false)
  })

  describe('should hide when mouse leave antd disabled component', () => {
    function testComponent(name: string, Component: any) {
      it(name, async () => {
        const onOpenChange = vi.fn()
        const wrapper = mount(
          {
            render() {
              return (
                <Tooltip
                  title="xxxxx"
                  mouseEnterDelay={0}
                  mouseLeaveDelay={0}
                  onOpenChange={onOpenChange}
                >
                  <Component disabled />
                </Tooltip>
              )
            },
          },
          {
            attachTo: document.body,
          },
        )

        const button = wrapper.find('button')
        expect(button.exists()).toBe(true)

        await triggerEnter(button)
        await flushTooltipTimer()
        expect(onOpenChange).toHaveBeenCalledWith(true)
        expect(isTooltipOpen()).toBeTruthy()
        expect(wrapper.find('.ant-tooltip-open').exists()).toBe(true)

        await triggerLeave(button)
        await flushTooltipTimer()
        expect(onOpenChange).toHaveBeenCalledWith(false)
        expect(isTooltipOpen()).toBeFalsy()
        expect(wrapper.find('.ant-tooltip-open').exists()).toBe(false)
      })
    }

    testComponent('Button', Button)
    testComponent('Switch', Switch)
  })

  it('should render disabled Button style properly', () => {
    const inlineWrapper = mount(
      {
        render() {
          return (
            <Tooltip title="xxxxx">
              <Button disabled>Hello world!</Button>
            </Tooltip>
          )
        },
      },
      {
        attachTo: document.body,
      },
    )

    const blockWrapper = mount(
      {
        render() {
          return (
            <Tooltip title="xxxxx">
              <Button disabled style={{ display: 'block' }}>
                Hello world!
              </Button>
            </Tooltip>
          )
        },
      },
      {
        attachTo: document.body,
      },
    )

    expect(getComputedStyle(inlineWrapper.find('button').element).display).toBe('inline-flex')
    expect(getComputedStyle(blockWrapper.find('button').element).display).toBe('block')
  })

  it('should works for date picker', async () => {
    const onOpenChange = vi.fn()
    const wrapper = mount(
      {
        render() {
          return (
            <Tooltip
              title="date picker"
              mouseEnterDelay={0}
              mouseLeaveDelay={0}
              onOpenChange={onOpenChange}
            >
              <DatePicker />
            </Tooltip>
          )
        },
      },
      {
        attachTo: document.body,
      },
    )

    const picker = wrapper.findComponent(DatePicker as any)
    expect(picker.exists()).toBe(true)

    picker.vm.$emit('mouseenter', new MouseEvent('mouseenter'))
    picker.vm.$emit('pointerenter', new MouseEvent('pointerenter'))
    await flushTooltipTimer()
    expect(onOpenChange).toHaveBeenCalledWith(true)
    expect(isTooltipOpen()).toBeTruthy()

    picker.vm.$emit('mouseleave', new MouseEvent('mouseleave'))
    picker.vm.$emit('pointerleave', new MouseEvent('pointerleave'))
    await flushTooltipTimer()
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(isTooltipOpen()).toBeFalsy()
  })

  it('should display zero', async () => {
    mount(Tooltip, {
      attachTo: document.body,
      props: {
        title: 0,
        open: true,
      },
      slots: {
        default: () => <div />,
      },
    })

    await flushTooltipTimer()
    expect(document.querySelector('.ant-tooltip-container')?.innerHTML).toBe('0')
  })

  it('autoAdjustOverflow should be object or undefined', () => {
    expect(() => {
      mount(Tooltip, {
        props: {
          title: 0,
          open: true,
          autoAdjustOverflow: { adjustX: 0, adjustY: 0 } as any,
        },
        slots: {
          default: () => <div />,
        },
      })
    }).not.toThrow()

    expect(() => {
      mount(Tooltip, {
        props: {
          title: 0,
          open: true,
          autoAdjustOverflow: undefined,
        },
        slots: {
          default: () => <div />,
        },
      })
    }).not.toThrow()
  })

  describe('support other placement when mouse enter', () => {
    const placementList = [
      'top',
      'left',
      'right',
      'bottom',
      'topLeft',
      'topRight',
      'bottomLeft',
      'bottomRight',
      'leftTop',
      'leftBottom',
      'rightTop',
      'rightBottom',
    ] as const

    const testPlacement = (name: string, placement: TooltipPlacement) => {
      it(name, async () => {
        const wrapper = mount(Tooltip, {
          attachTo: document.body,
          props: {
            title: 'xxxxx',
            motion: { name: '' } as any,
            mouseEnterDelay: 0,
            placement,
            autoAdjustOverflow: false,
          },
          slots: {
            default: () => <span>Hello world!</span>,
          },
        })
        const element = wrapper.find('span')
        await element.trigger('mouseenter')
        await flushTooltipTimer()
        expect(document.querySelector(`.ant-tooltip-placement-${placement}`)).toBeTruthy()
      })

      it(`${name} with arrow point at center`, () => {
        const placementInfo: Record<string, any> = getPlacements({
          arrowPointAtCenter: true,
          autoAdjustOverflow: false,
          arrowWidth: 0,
          borderRadius: 10,
          offset: 0,
        })

        const { offset } = placementInfo[placement]
        const existOffset = offset[0] !== 0 || offset[1] !== 0

        if (['left', 'right', 'top', 'bottom'].includes(placement)) {
          expect(existOffset).toBeFalsy()
        }
        else {
          expect(existOffset).toBeTruthy()
        }
      })
    }

    placementList.forEach(placement => testPlacement(`Placement ${placement}`, placement))
  })

  it('should works for mismatch placement', async () => {
    const wrapper = mount(Tooltip, {
      attachTo: document.body,
      props: {
        title: 'xxxxx',
        align: {
          points: ['bc', 'tl'],
        },
        mouseEnterDelay: 0,
      },
      slots: {
        default: () => <span>Hello world!</span>,
      },
    })
    const element = wrapper.find('span')
    await element.trigger('mouseenter')
    await flushTooltipTimer()
    expect(document.querySelector('.ant-tooltip')).not.toBeNull()
  })

  it('should pass styles.container through to the inner component', async () => {
    mount(Tooltip, {
      attachTo: document.body,
      props: {
        styles: { container: { color: 'red' } },
        title: 'xxxxx',
        open: true,
      },
      slots: {
        default: () => <div />,
      },
    })

    await flushTooltipTimer()
    expect(document.querySelector<HTMLElement>('.ant-tooltip-container')).toHaveStyle({
      color: 'rgb(255, 0, 0)',
    })
  })

  it('should work with loading switch', async () => {
    const onOpenChange = vi.fn()
    const wrapper = mount(
      {
        render() {
          return (
            <Tooltip
              title="loading tips"
              mouseEnterDelay={0}
              mouseLeaveDelay={0}
              onOpenChange={onOpenChange}
            >
              <Switch loading defaultChecked />
            </Tooltip>
          )
        },
      },
      {
        attachTo: document.body,
      },
    )

    await triggerEnter(wrapper.find('button'))
    await flushTooltipTimer()
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    expect(wrapper.find('.ant-tooltip-open').exists()).toBe(true)
  })

  it('should work with disabled Radio', async () => {
    const onOpenChange = vi.fn()
    const wrapper = mount(
      {
        render() {
          return (
            <Tooltip
              title="loading tips"
              mouseEnterDelay={0}
              mouseLeaveDelay={0}
              onOpenChange={onOpenChange}
            >
              <Radio disabled />
            </Tooltip>
          )
        },
      },
      {
        attachTo: document.body,
      },
    )

    await triggerEnter(wrapper.find('.ant-radio-wrapper'))
    await flushTooltipTimer()
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    expect(document.querySelector('.ant-tooltip')).not.toBeNull()
  })

  it('should work with Fragment children', async () => {
    const onOpenChange = vi.fn()
    const wrapper = mount(Tooltip, {
      attachTo: document.body,
      props: {
        title: 'Have a nice day!',
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        onOpenChange,
      },
      slots: {
        default: () => [
          <div class="hello">Hello world!</div>,
          <div class="hello">Hello world!</div>,
        ],
      },
    })

    const divElement = wrapper.find('.hello')
    await triggerEnter(divElement)
    await flushTooltipTimer()
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    expect(isTooltipOpen()).toBeTruthy()

    await triggerLeave(divElement)
    await flushTooltipTimer()
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(isTooltipOpen()).toBeFalsy()
  })

  it('not inject class when children class is not string type', async () => {
    const HOC = defineComponent(
      (props: { className: () => string }) => () => <span class={{ [props.className()]: true }} />,
      {
        props: ['className'] as any,
      },
    )

    const wrapper = mount(
      {
        render() {
          return (
            <Tooltip open title="test">
              <HOC className={() => 'bamboo'} />
            </Tooltip>
          )
        },
      },
      {
        attachTo: document.body,
      },
    )

    await flushTooltipTimer()
    expect(wrapper.find('.bamboo').exists()).toBe(true)
    expect(document.querySelector('.ant-tooltip')).toBeTruthy()
  })

  it('support arrow props pass false to hide arrow', async () => {
    const wrapper = mount(Tooltip, {
      attachTo: document.body,
      props: {
        open: true,
        arrow: false,
      },
      slots: {
        default: () => <div class="target">target</div>,
      },
    })

    await flushTooltipTimer()
    const tooltip = document.querySelector<HTMLElement>('.ant-tooltip')
    expect(tooltip).not.toBeNull()
    expect(getTooltipSnapshotContainer(wrapper.element, tooltip)).toMatchSnapshot()
    expect(document.querySelector('.ant-tooltip-arrow')).toBeNull()
  })

  it('support arrow props by default', async () => {
    const wrapper = mount(Tooltip, {
      attachTo: document.body,
      props: {
        open: true,
      },
      slots: {
        default: () => <div class="target">target</div>,
      },
    })

    await flushTooltipTimer()
    const tooltip = document.querySelector<HTMLElement>('.ant-tooltip')
    expect(tooltip).not.toBeNull()
    expect(getTooltipSnapshotContainer(wrapper.element, tooltip)).toMatchSnapshot()
    expect(document.querySelector('.ant-tooltip-arrow')).not.toBeNull()
  })

  it('should apply custom styles to Tooltip', async () => {
    const customClasses = {
      container: 'custom-container',
      root: 'custom-root',
    }

    const customStyles = {
      container: { borderTopWidth: '3px' },
      root: { borderBottomWidth: '5px' },
    }

    mount(Tooltip, {
      attachTo: document.body,
      props: {
        classes: customClasses,
        styles: customStyles,
        title: <div />,
        open: true,
      },
      slots: {
        default: () => <button type="button">button</button>,
      },
    })

    await flushTooltipTimer()

    const tooltipElement = document.querySelector<HTMLElement>('.ant-tooltip')
    const tooltipContainerElement = document.querySelector<HTMLElement>('.ant-tooltip-container')

    expect(tooltipElement).toHaveClass(customClasses.root)
    expect(tooltipContainerElement).toHaveClass(customClasses.container)
    expect(tooltipElement).toHaveStyle({ 'border-bottom-width': '5px' })
    expect(tooltipContainerElement).toHaveStyle({ 'border-top-width': '3px' })
  })

  it('configProvider support arrow props', async () => {
    const TooltipTestComponent = defineComponent(() => {
      const configArrow = ref(true)
      return () => (
        <ConfigProvider tooltip={{ arrow: configArrow.value }}>
          <button
            type="button"
            class="configArrow"
            onClick={() => {
              configArrow.value = false
            }}
          >
            showconfigArrow
          </button>
          <Tooltip open title="tooltip">
            <div class="target">target</div>
          </Tooltip>
        </ConfigProvider>
      )
    })

    const wrapper = mount(TooltipTestComponent, { attachTo: document.body })

    await flushTooltipTimer()
    expect(document.querySelector('.ant-tooltip-arrow')).not.toBeNull()
    await wrapper.find('.configArrow').trigger('click')
    await flushTooltipTimer()
    expect(document.querySelector('.ant-tooltip-arrow')).toBeNull()
  })

  it('configProvider with arrow set to false, Tooltip arrow controlled by prop', async () => {
    const TooltipTestComponent = defineComponent(() => {
      const arrow = ref(true)
      return () => (
        <ConfigProvider tooltip={{ arrow: false }}>
          <button
            type="button"
            class="toggleArrow"
            onClick={() => {
              arrow.value = !arrow.value
            }}
          >
            toggleArrow
          </button>
          <Tooltip open title="tooltip" arrow={arrow.value}>
            <div class="target">target</div>
          </Tooltip>
        </ConfigProvider>
      )
    })

    const wrapper = mount(TooltipTestComponent, { attachTo: document.body })

    await flushTooltipTimer()
    expect(document.querySelector('.ant-tooltip-arrow')).not.toBeNull()

    await wrapper.find('.toggleArrow').trigger('click')
    await flushTooltipTimer()
    expect(document.querySelector('.ant-tooltip-arrow')).toBeNull()

    await wrapper.find('.toggleArrow').trigger('click')
    await flushTooltipTimer()
    expect(document.querySelector('.ant-tooltip-arrow')).not.toBeNull()
  })

  describe('parseColor', () => {
    const prefixCls = 'ant-tooltip'

    it('should set white text for dark backgrounds', () => {
      const darkColor = '#003366'
      const { overlayStyle } = parseColor(defaultPrefixCls, prefixCls, darkColor)
      const [varName] = genCssVar(defaultPrefixCls, 'tooltip')
      expect(overlayStyle.background).toBe(darkColor)
      expect(overlayStyle[varName('overlay-color')]).toBe('#FFF')
    })

    it('should set black text for light backgrounds', () => {
      const lightColor = '#f8f8f8'
      const { overlayStyle } = parseColor(defaultPrefixCls, prefixCls, lightColor)
      const [varName] = genCssVar(defaultPrefixCls, 'tooltip')
      expect(overlayStyle.background).toBe(lightColor)
      expect(overlayStyle[varName('overlay-color')]).toBe('#000')
    })

    it('actual tooltip color rendering (default)', async () => {
      mount(Tooltip, {
        attachTo: document.body,
        props: {
          title: 'Test',
          color: '#003366',
          open: true,
        },
        slots: {
          default: () => <span>Hover me</span>,
        },
      })
      await flushTooltipTimer()
      const [varName] = genCssVar(defaultPrefixCls, 'tooltip')
      const tooltipContainer = document.querySelector<HTMLElement>('.ant-tooltip-container')
      expect(tooltipContainer).toHaveStyle({ [varName('overlay-color')]: '#FFF' })
    })

    it('actual tooltip color rendering (styles)', async () => {
      mount(Tooltip, {
        attachTo: document.body,
        props: {
          title: 'Test',
          open: true,
          color: '#003366',
          styles: { container: { color: 'rgb(0, 255, 255)' } },
        },
        slots: {
          default: () => <span>Hover me</span>,
        },
      })

      await flushTooltipTimer()
      const tooltipContainer = document.querySelector<HTMLElement>('.ant-tooltip-container')
      expect(tooltipContainer).toHaveStyle({
        color: 'rgb(0, 255, 255)',
      })
    })
  })
})
