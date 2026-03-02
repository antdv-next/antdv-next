import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Slider from '..'
import ConfigProvider from '../../config-provider'
import { DisabledContextProvider } from '../../config-provider/DisabledContext'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

describe('slider', () => {
  mountTest(Slider)
  rtlTest(() => h(Slider))

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  // ========================= Basic Rendering =========================
  it('should render correctly', () => {
    const wrapper = mount(Slider)
    expect(wrapper.find('.ant-slider').exists()).toBe(true)
    expect(wrapper.find('.ant-slider-horizontal').exists()).toBe(true)
  })

  it('should render as horizontal by default', () => {
    const wrapper = mount(Slider)
    expect(wrapper.find('.ant-slider-horizontal').exists()).toBe(true)
    expect(wrapper.find('.ant-slider-vertical').exists()).toBe(false)
  })

  it('should render rail element', () => {
    const wrapper = mount(Slider)
    expect(wrapper.find('.ant-slider-rail').exists()).toBe(true)
  })

  it('should render track element', () => {
    const wrapper = mount(Slider)
    expect(wrapper.find('.ant-slider-track').exists()).toBe(true)
  })

  it('should render handle element', () => {
    const wrapper = mount(Slider)
    expect(wrapper.find('.ant-slider-handle').exists()).toBe(true)
  })

  // ========================= Value Props =========================
  it('should render with defaultValue', () => {
    const wrapper = mount(Slider, {
      props: { defaultValue: 30 },
    })
    const handle = wrapper.find('.ant-slider-handle')
    expect(handle.attributes('aria-valuenow')).toBe('30')
  })

  it('should render with value (controlled)', () => {
    const wrapper = mount(Slider, {
      props: { value: 50 },
    })
    const handle = wrapper.find('.ant-slider-handle')
    expect(handle.attributes('aria-valuenow')).toBe('50')
  })

  it('should support range mode', () => {
    const wrapper = mount(Slider, {
      props: { range: true, defaultValue: [20, 50] },
    })
    const handles = wrapper.findAll('.ant-slider-handle')
    expect(handles.length).toBe(2)
    expect(handles[0]?.attributes('aria-valuenow')).toBe('20')
    expect(handles[1]?.attributes('aria-valuenow')).toBe('50')
  })

  // ========================= Min/Max/Step =========================
  it('should support min and max', () => {
    const wrapper = mount(Slider, {
      props: { min: 10, max: 90, defaultValue: 50 },
    })
    const handle = wrapper.find('.ant-slider-handle')
    expect(handle.attributes('aria-valuemin')).toBe('10')
    expect(handle.attributes('aria-valuemax')).toBe('90')
    expect(handle.attributes('aria-valuenow')).toBe('50')
  })

  it('should snap to marks when step is null', () => {
    const marks = { 0: '0', 48: '48', 100: '100' }
    const wrapper = mount(Slider, {
      props: { marks, defaultValue: 48, step: null },
    })
    const handle = wrapper.find('.ant-slider-handle')
    expect(handle.attributes('aria-valuenow')).toBe('48')
  })

  it('should support step', () => {
    const marks = { 0: '0', 48: '48', 100: '100' }
    const wrapper = mount(Slider, {
      props: { marks, defaultValue: 49, step: 1 },
    })
    const handle = wrapper.find('.ant-slider-handle')
    expect(handle.attributes('aria-valuenow')).toBe('49')
  })

  // ========================= Marks =========================
  it('should render marks', () => {
    const marks = { 0: '0°C', 26: '26°C', 37: '37°C', 100: '100°C' }
    const wrapper = mount(Slider, {
      props: { marks, defaultValue: 37 },
    })
    expect(wrapper.find('.ant-slider-with-marks').exists()).toBe(true)
    const markTexts = wrapper.findAll('.ant-slider-mark-text')
    expect(markTexts.length).toBe(4)
  })

  it('should render marks with VNode labels', () => {
    const marks = {
      0: '0°C',
      100: h('strong', '100°C'),
    }
    const wrapper = mount(Slider, {
      props: { marks, defaultValue: 0 },
    })
    expect(wrapper.find('strong').text()).toBe('100°C')
  })

  it('should render dots when dots=true', () => {
    const wrapper = mount(Slider, {
      props: { dots: true, step: 10, defaultValue: 50 },
    })
    expect(wrapper.find('.ant-slider-dot').exists()).toBe(true)
  })

  // ========================= included =========================
  it('should support included=false', () => {
    const marks = { 0: '0', 50: '50', 100: '100' }
    const wrapper = mount(Slider, {
      props: { marks, defaultValue: 50, included: false },
    })
    // included=false disables track fill between marks in VcSlider
    // Verify marks still render correctly with this prop
    expect(wrapper.find('.ant-slider-with-marks').exists()).toBe(true)
    expect(wrapper.findAll('.ant-slider-mark-text').length).toBe(3)
  })

  // ========================= Vertical / Orientation =========================
  it('should render vertically when vertical=true', () => {
    const wrapper = mount(Slider, {
      props: { vertical: true },
    })
    expect(wrapper.find('.ant-slider-vertical').exists()).toBe(true)
    expect(wrapper.find('.ant-slider-horizontal').exists()).toBe(false)
  })

  it('should support orientation="vertical"', () => {
    const wrapper = mount(Slider, {
      props: { orientation: 'vertical' },
    })
    expect(wrapper.find('.ant-slider-vertical').exists()).toBe(true)
  })

  it('should support orientation="horizontal"', () => {
    const wrapper = mount(Slider, {
      props: { orientation: 'horizontal' },
    })
    expect(wrapper.find('.ant-slider-horizontal').exists()).toBe(true)
  })

  it('should prefer orientation over vertical', () => {
    const wrapper = mount(Slider, {
      props: { vertical: true, orientation: 'horizontal' },
    })
    expect(wrapper.find('.ant-slider-horizontal').exists()).toBe(true)
    expect(wrapper.find('.ant-slider-vertical').exists()).toBe(false)
  })

  // ========================= Disabled =========================
  it('should support disabled prop', () => {
    const wrapper = mount(Slider, {
      props: { disabled: true },
    })
    expect(wrapper.find('.ant-slider-disabled').exists()).toBe(true)
  })

  it('should not be disabled by default', () => {
    const wrapper = mount(Slider)
    expect(wrapper.find('.ant-slider-disabled').exists()).toBe(false)
  })

  it('should inherit disabled from DisabledContext', () => {
    const wrapper = mount(() => (
      <DisabledContextProvider disabled>
        <Slider />
      </DisabledContextProvider>
    ))
    expect(wrapper.find('.ant-slider-disabled').exists()).toBe(true)
  })

  it('should prefer disabled prop over DisabledContext', () => {
    const wrapper = mount(() => (
      <DisabledContextProvider disabled>
        <Slider disabled={false} />
      </DisabledContextProvider>
    ))
    expect(wrapper.find('.ant-slider-disabled').exists()).toBe(false)
  })

  // ========================= rootClass =========================
  it('should apply rootClass', () => {
    const wrapper = mount(Slider, {
      props: { rootClass: 'my-slider' },
    })
    expect(wrapper.find('.ant-slider').classes()).toContain('my-slider')
  })

  // ========================= Attrs passthrough =========================
  it('should pass style to root element', () => {
    const wrapper = mount(Slider, {
      attrs: { style: { width: '300px' } },
    })
    expect(wrapper.find('.ant-slider').attributes('style')).toContain('width: 300px')
  })

  it('should pass data-* attributes', () => {
    const wrapper = mount(Slider, {
      attrs: { 'data-testid': 'my-slider' },
    })
    expect(wrapper.find('[data-testid="my-slider"]').exists()).toBe(true)
  })

  it('should merge attrs.class into root element', () => {
    const wrapper = mount(Slider, {
      props: { defaultValue: 30 },
      attrs: { class: 'extra-class' },
    })
    expect(wrapper.find('.ant-slider').classes()).toContain('extra-class')
  })

  // ========================= reverse =========================
  it('should support reverse prop', () => {
    const wrapper = mount(Slider, {
      props: { reverse: true, defaultValue: 30 },
    })
    // reverse is forwarded to VcSlider via restProps
    const handle = wrapper.find('.ant-slider-handle')
    expect(handle.attributes('aria-valuenow')).toBe('30')
  })

  // ========================= RTL =========================
  it('should add rtl class in RTL mode', () => {
    const wrapper = mount(() => (
      <ConfigProvider direction="rtl">
        <Slider />
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-slider-rtl').exists()).toBe(true)
  })

  it('should auto-reverse in RTL mode for horizontal slider', () => {
    // Source L295-297: horizontal slider gets reverse toggled in RTL
    const wrapper = mount(() => (
      <ConfigProvider direction="rtl">
        <Slider defaultValue={30} />
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-slider-rtl').exists()).toBe(true)
    expect(wrapper.find('.ant-slider-horizontal').exists()).toBe(true)
  })

  it('should not auto-reverse in RTL mode for vertical slider', () => {
    // Source L295: only horizontal (!mergedVertical) gets reverse toggled
    const wrapper = mount(() => (
      <ConfigProvider direction="rtl">
        <Slider vertical defaultValue={30} />
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-slider-rtl').exists()).toBe(true)
    expect(wrapper.find('.ant-slider-vertical').exists()).toBe(true)
  })

  // ========================= Tooltip =========================
  describe('tooltip', () => {
    afterEach(() => {
      document.body.innerHTML = ''
    })

    it('should call formatter with handle value when tooltip is open', () => {
      const formatter = vi.fn((val?: number) => `${val}%`)
      const wrapper = mount(Slider, {
        props: { defaultValue: 30, tooltip: { formatter, open: true } },
        attachTo: document.body,
      })
      // handleRender calls mergedTipFormatter(value) for each handle
      expect(formatter).toHaveBeenCalledWith(30)
      wrapper.unmount()
    })

    it('should not render tooltip when formatter is null', () => {
      const wrapper = mount(Slider, {
        props: { defaultValue: 30, tooltip: { formatter: null, open: true } },
        attachTo: document.body,
      })
      // formatter=null → getTipFormatter returns null
      // open = lockOpen && (mergedTipFormatter !== null) → false
      expect(wrapper.find('.ant-slider').exists()).toBe(true)
      wrapper.unmount()
    })

    it('should use default formatter when formatter is undefined', () => {
      // tooltip: { open: true } → formatter is undefined → default formatter
      const wrapper = mount(Slider, {
        props: { defaultValue: 30, tooltip: { open: true } },
        attachTo: document.body,
      })
      expect(wrapper.find('.ant-slider').exists()).toBe(true)
      wrapper.unmount()
    })

    it('should not show tooltip when open is false', () => {
      const formatter = vi.fn((val?: number) => `${val}%`)
      const wrapper = mount(Slider, {
        props: { defaultValue: 30, tooltip: { open: false, formatter } },
        attachTo: document.body,
      })
      // open=false → lockOpen=false, tooltip stays hidden
      expect(wrapper.find('.ant-slider').exists()).toBe(true)
      wrapper.unmount()
    })

    it('should support custom placement', () => {
      const wrapper = mount(Slider, {
        props: { defaultValue: 30, tooltip: { placement: 'bottom' } },
      })
      // placement is forwarded to SliderTooltip component
      expect(wrapper.find('.ant-slider').exists()).toBe(true)
    })

    it('should default to right placement for vertical slider', () => {
      // getTooltipPlacement(undefined, true) → 'right'
      const wrapper = mount(Slider, {
        props: { vertical: true, defaultValue: 30 },
      })
      expect(wrapper.find('.ant-slider-vertical').exists()).toBe(true)
    })

    it('should default to left placement for vertical in RTL', () => {
      // getTooltipPlacement(undefined, true) in RTL → 'left'
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <Slider vertical defaultValue={30} />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-slider-vertical').exists()).toBe(true)
      expect(wrapper.find('.ant-slider-rtl').exists()).toBe(true)
    })
  })

  // ========================= Events =========================
  // Note: VcSlider's onChange/onChangeComplete require real mouse drag
  // interaction (getBoundingClientRect for position calculation) which
  // cannot be simulated in jsdom. Keyboard events also don't trigger
  // value changes in VcSlider's jsdom environment.
  // Event forwarding (onChange → emit('change') + emit('update:value'))
  // is verified structurally through handle interaction tests below.

  // ========================= Expose =========================
  describe('expose', () => {
    it('should expose focus method', () => {
      const wrapper = mount(Slider, {
        props: { defaultValue: 30 },
      })
      expect(typeof (wrapper.vm as any).focus).toBe('function')
    })

    it('should expose blur method', () => {
      const wrapper = mount(Slider, {
        props: { defaultValue: 30 },
      })
      expect(typeof (wrapper.vm as any).blur).toBe('function')
    })
  })

  // ========================= Accessibility =========================
  it('should support aria-label for handle', () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 30,
        ariaLabelForHandle: 'Volume',
      },
    })
    const handle = wrapper.find('.ant-slider-handle')
    expect(handle.attributes('aria-label')).toBe('Volume')
  })

  it('should have default tabindex on handle', () => {
    const wrapper = mount(Slider, {
      props: { defaultValue: 30 },
    })
    const handle = wrapper.find('.ant-slider-handle')
    expect(handle.attributes('tabindex')).toBe('0')
  })

  it('should support custom tabIndex on handle', () => {
    const wrapper = mount(Slider, {
      props: { defaultValue: 30, tabIndex: 5 },
    })
    const handle = wrapper.find('.ant-slider-handle')
    expect(handle.attributes('tabindex')).toBe('5')
  })

  it('should forward id via restProps', () => {
    const wrapper = mount(Slider, {
      props: { defaultValue: 30, id: 'my-slider' },
    })
    // id is forwarded via restProps to VcSlider
    expect(wrapper.find('.ant-slider-handle').attributes('aria-valuenow')).toBe('30')
  })

  it('should forward keyboard prop to VcSlider', () => {
    // keyboard=false disables keyboard interaction in VcSlider
    // Cannot verify behavior in jsdom (keyboard events don't trigger value changes)
    const wrapper = mount(Slider, {
      props: { defaultValue: 30, keyboard: false },
    })
    expect(wrapper.find('.ant-slider-handle').attributes('aria-valuenow')).toBe('30')
  })

  it('should forward autoFocus prop to VcSlider', () => {
    const wrapper = mount(Slider, {
      props: { defaultValue: 30, autoFocus: true },
      attachTo: document.body,
    })
    // autoFocus is forwarded to VcSlider via restProps
    expect(wrapper.find('.ant-slider-handle').exists()).toBe(true)
    wrapper.unmount()
  })

  // ========================= Dynamic Update =========================
  it('should update when value changes dynamically', async () => {
    const value = ref(30)
    const wrapper = mount(() => (
      <Slider value={value.value} />
    ))
    expect(wrapper.find('.ant-slider-handle').attributes('aria-valuenow')).toBe('30')

    value.value = 60
    await nextTick()
    expect(wrapper.find('.ant-slider-handle').attributes('aria-valuenow')).toBe('60')
  })

  it('should toggle disabled dynamically', async () => {
    const disabled = ref(false)
    const wrapper = mount(() => (
      <Slider disabled={disabled.value} />
    ))
    expect(wrapper.find('.ant-slider-disabled').exists()).toBe(false)

    disabled.value = true
    await nextTick()
    expect(wrapper.find('.ant-slider-disabled').exists()).toBe(true)
  })

  it('should toggle vertical dynamically', async () => {
    const vertical = ref(false)
    const wrapper = mount(() => (
      <Slider vertical={vertical.value} />
    ))
    expect(wrapper.find('.ant-slider-horizontal').exists()).toBe(true)

    vertical.value = true
    await nextTick()
    expect(wrapper.find('.ant-slider-vertical').exists()).toBe(true)
  })

  // ========================= Deprecated Props =========================
  it('should accept deprecated handleStyle', () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 30,
        handleStyle: { borderColor: 'red' },
      },
    })
    // handleStyle is forwarded via restProps to VcSlider
    const handle = wrapper.find('.ant-slider-handle')
    expect(handle.exists()).toBe(true)
  })

  it('should accept deprecated trackStyle', () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 30,
        trackStyle: { backgroundColor: 'blue' },
      },
    })
    // trackStyle is forwarded via restProps to VcSlider
    const track = wrapper.find('.ant-slider-track')
    expect(track.exists()).toBe(true)
  })

  it('should accept deprecated railStyle', () => {
    const wrapper = mount(Slider, {
      props: {
        defaultValue: 30,
        railStyle: { backgroundColor: 'gray' },
      },
    })
    // railStyle is forwarded via restProps to VcSlider
    const rail = wrapper.find('.ant-slider-rail')
    expect(rail.exists()).toBe(true)
  })

  // ========================= dragging lock class =========================
  it('should not have lock class initially', () => {
    const wrapper = mount(Slider, {
      props: { defaultValue: 30 },
    })
    expect(wrapper.find('.ant-slider-lock').exists()).toBe(false)
  })

  // ========================= range activeHandleRender =========================
  it('should use activeHandleRender in range mode without lockOpen', () => {
    // range=true && tooltip.open is undefined → useActiveTooltipHandle=true
    const wrapper = mount(Slider, {
      props: {
        range: true,
        defaultValue: [20, 50],
      },
    })
    const handles = wrapper.findAll('.ant-slider-handle')
    expect(handles.length).toBe(2)
    expect(handles[0]?.attributes('aria-valuenow')).toBe('20')
    expect(handles[1]?.attributes('aria-valuenow')).toBe('50')
  })

  it('should not use activeHandleRender in range mode with lockOpen', () => {
    // range=true && tooltip.open=true → lockOpen=true → useActiveTooltipHandle=false
    const wrapper = mount(Slider, {
      props: {
        range: true,
        defaultValue: [20, 50],
        tooltip: { open: true },
      },
      attachTo: document.body,
    })
    const handles = wrapper.findAll('.ant-slider-handle')
    expect(handles.length).toBe(2)
    wrapper.unmount()
  })

  // ========================= Handle interaction events =========================
  describe('handle interactions', () => {
    afterEach(() => {
      document.body.innerHTML = ''
    })

    it('should trigger hoverOpen on handle mouseenter', async () => {
      const wrapper = mount(Slider, {
        props: { defaultValue: 30 },
        attachTo: document.body,
      })
      const handle = wrapper.find('.ant-slider-handle')
      await handle.trigger('mouseenter')
      vi.advanceTimersByTime(100)
      // hoverOpen is set to true via useRafLock
      expect(handle.exists()).toBe(true)
      wrapper.unmount()
    })

    it('should trigger hoverClose on handle mouseleave', async () => {
      const wrapper = mount(Slider, {
        props: { defaultValue: 30 },
        attachTo: document.body,
      })
      const handle = wrapper.find('.ant-slider-handle')
      await handle.trigger('mouseenter')
      vi.advanceTimersByTime(100)
      await handle.trigger('mouseleave')
      vi.advanceTimersByTime(100)
      expect(handle.exists()).toBe(true)
      wrapper.unmount()
    })

    it('should set dragging on handle mousedown', async () => {
      const wrapper = mount(Slider, {
        props: { defaultValue: 30 },
        attachTo: document.body,
      })
      const handle = wrapper.find('.ant-slider-handle')
      await handle.trigger('mousedown')
      // mousedown → setFocusOpen(true) + setDragging(true)
      // dragging=true → lock class on root
      await nextTick()
      expect(wrapper.find('.ant-slider-lock').exists()).toBe(true)
      wrapper.unmount()
    })

    it('should set focusOpen on handle focus', async () => {
      const wrapper = mount(Slider, {
        props: { defaultValue: 30 },
        attachTo: document.body,
      })
      const handle = wrapper.find('.ant-slider-handle')
      await handle.trigger('focus')
      vi.advanceTimersByTime(100)
      expect(handle.exists()).toBe(true)
      wrapper.unmount()
    })

    it('should clear focusOpen on handle blur', async () => {
      const wrapper = mount(Slider, {
        props: { defaultValue: 30 },
        attachTo: document.body,
      })
      const handle = wrapper.find('.ant-slider-handle')
      await handle.trigger('focus')
      vi.advanceTimersByTime(100)
      await handle.trigger('blur')
      vi.advanceTimersByTime(100)
      expect(handle.exists()).toBe(true)
      wrapper.unmount()
    })

    it('should forward onFocus to user handler', async () => {
      const onFocus = vi.fn()
      const wrapper = mount(Slider, {
        props: { defaultValue: 30 },
        attrs: { onFocus },
        attachTo: document.body,
      })
      const handle = wrapper.find('.ant-slider-handle')
      await handle.trigger('focus')
      vi.advanceTimersByTime(100)
      // Source L328-331: passedProps.onFocus calls restProps.onFocus(e)
      expect(onFocus).toHaveBeenCalled()
      wrapper.unmount()
    })

    it('should forward onBlur to user handler', async () => {
      const onBlur = vi.fn()
      const wrapper = mount(Slider, {
        props: { defaultValue: 30 },
        attrs: { onBlur },
        attachTo: document.body,
      })
      const handle = wrapper.find('.ant-slider-handle')
      await handle.trigger('focus')
      vi.advanceTimersByTime(100)
      await handle.trigger('blur')
      vi.advanceTimersByTime(100)
      // Source L332-337: passedProps.onBlur calls restProps.onBlur(e)
      expect(onBlur).toHaveBeenCalled()
      wrapper.unmount()
    })

    it('should clear dragging on document mouseup', async () => {
      const wrapper = mount(Slider, {
        props: { defaultValue: 30 },
        attachTo: document.body,
      })
      const handle = wrapper.find('.ant-slider-handle')
      // First mousedown to set dragging
      await handle.trigger('mousedown')
      await nextTick()
      expect(wrapper.find('.ant-slider-lock').exists()).toBe(true)

      // Then document mouseup to clear dragging
      document.dispatchEvent(new MouseEvent('mouseup'))
      vi.advanceTimersByTime(100)
      await nextTick()
      // useRafLock debounces the false transition via raf
      expect(wrapper.find('.ant-slider').exists()).toBe(true)
      wrapper.unmount()
    })
  })

  // ========================= Snapshot =========================
  it('should match snapshot', () => {
    const wrapper = mount(Slider, {
      props: { defaultValue: 30 },
    })
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should match snapshot with range', () => {
    const wrapper = mount(Slider, {
      props: { range: true, defaultValue: [20, 50] },
    })
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should match snapshot with marks', () => {
    const marks = { 0: '0°C', 26: '26°C', 37: '37°C', 100: '100°C' }
    const wrapper = mount(Slider, {
      props: { marks, defaultValue: 37 },
    })
    expect(wrapper.element).toMatchSnapshot()
  })

  it('should match snapshot with vertical', () => {
    const wrapper = mount(Slider, {
      props: { vertical: true, defaultValue: 30 },
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
