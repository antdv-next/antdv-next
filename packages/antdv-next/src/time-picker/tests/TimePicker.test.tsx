import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import MockDate from 'mockdate'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import TimePicker from '..'
import { resetWarned } from '../../_util/warning'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

dayjs.extend(customParseFormat)

const { RangePicker } = TimePicker

describe('time-picker', () => {
  beforeEach(() => {
    MockDate.set(dayjs('2020-01-01T00:00:00Z').valueOf())
  })

  afterEach(() => {
    MockDate.reset()
  })

  // ====================== Basic Rendering ======================
  it('should render correctly', () => {
    const wrapper = mount(TimePicker)
    expect(wrapper.find('.ant-picker').exists()).toBe(true)
  })

  it('should have default placeholder', () => {
    const wrapper = mount(TimePicker)
    expect(wrapper.find('input').attributes('placeholder')).toBe('Select time')
  })

  it('should support custom placeholder', () => {
    const wrapper = mount(TimePicker, {
      props: { placeholder: 'Pick a time' },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Pick a time')
  })

  // ====================== Size ======================
  it('should support size=large', () => {
    const wrapper = mount(TimePicker, {
      props: { size: 'large' },
    })
    expect(wrapper.find('.ant-picker-large').exists()).toBe(true)
  })

  it('should support size=small', () => {
    const wrapper = mount(TimePicker, {
      props: { size: 'small' },
    })
    expect(wrapper.find('.ant-picker-small').exists()).toBe(true)
  })

  // ====================== Disabled ======================
  it('should support disabled', () => {
    const wrapper = mount(TimePicker, {
      props: { disabled: true },
    })
    expect(wrapper.find('.ant-picker-disabled').exists()).toBe(true)
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  // ====================== Status ======================
  it('should support status=error', () => {
    const wrapper = mount(TimePicker, {
      props: { status: 'error' },
    })
    expect(wrapper.find('.ant-picker-status-error').exists()).toBe(true)
  })

  it('should support status=warning', () => {
    const wrapper = mount(TimePicker, {
      props: { status: 'warning' },
    })
    expect(wrapper.find('.ant-picker-status-warning').exists()).toBe(true)
  })

  // ====================== Value & Format ======================
  it('should display value', () => {
    const wrapper = mount(TimePicker, {
      props: {
        value: dayjs('12:30:00', 'HH:mm:ss'),
        format: 'HH:mm:ss',
      },
    })
    expect(wrapper.find('input').element.value).toBe('12:30:00')
  })

  it('should support defaultValue', () => {
    const wrapper = mount(TimePicker, {
      props: {
        defaultValue: dayjs('08:15:00', 'HH:mm:ss'),
        format: 'HH:mm:ss',
      },
    })
    expect(wrapper.find('input').element.value).toBe('08:15:00')
  })

  it('should support custom format', () => {
    const wrapper = mount(TimePicker, {
      props: {
        value: dayjs('14:30:00', 'HH:mm:ss'),
        format: 'HH:mm',
      },
    })
    expect(wrapper.find('input').element.value).toBe('14:30')
  })

  // ====================== AllowClear ======================
  it('should show clear icon when value exists', () => {
    const wrapper = mount(TimePicker, {
      props: {
        value: dayjs('12:00:00', 'HH:mm:ss'),
      },
    })
    expect(wrapper.find('.ant-picker-clear').exists()).toBe(true)
  })

  it('should hide clear icon when allowClear=false', () => {
    const wrapper = mount(TimePicker, {
      props: {
        value: dayjs('12:00:00', 'HH:mm:ss'),
        allowClear: false,
      },
    })
    expect(wrapper.find('.ant-picker-clear').exists()).toBe(false)
  })

  it('should support custom clear icon', () => {
    const wrapper = mount(TimePicker, {
      props: {
        value: dayjs('12:00:00', 'HH:mm:ss'),
        allowClear: { clearIcon: <span data-testid="custom-clear">x</span> },
      },
    })
    expect(wrapper.find('[data-testid="custom-clear"]').exists()).toBe(true)
  })

  // ====================== Open / Popup ======================
  it('should open popup when open=true', async () => {
    const wrapper = mount(TimePicker, {
      props: { open: true },
      attachTo: document.body,
    })
    await nextTick()

    expect(document.querySelector('.ant-picker-dropdown')).toBeTruthy()

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should render time columns in popup', async () => {
    const wrapper = mount(TimePicker, {
      props: { open: true },
      attachTo: document.body,
    })
    await nextTick()

    const columns = document.querySelectorAll('.ant-picker-time-panel-column')
    // Default: hour, minute, second
    expect(columns.length).toBe(3)
    expect(columns[0]?.querySelectorAll('.ant-picker-time-panel-cell').length).toBe(24)
    expect(columns[1]?.querySelectorAll('.ant-picker-time-panel-cell').length).toBe(60)
    expect(columns[2]?.querySelectorAll('.ant-picker-time-panel-cell').length).toBe(60)

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should support showHour/showMinute/showSecond', async () => {
    const wrapper = mount(TimePicker, {
      props: {
        open: true,
        showHour: true,
        showMinute: true,
        showSecond: false,
      },
      attachTo: document.body,
    })
    await nextTick()

    const columns = document.querySelectorAll('.ant-picker-time-panel-column')
    expect(columns.length).toBe(2)

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should support use12Hours', async () => {
    const wrapper = mount(TimePicker, {
      props: {
        open: true,
        use12Hours: true,
      },
      attachTo: document.body,
    })
    await nextTick()

    const columns = document.querySelectorAll('.ant-picker-time-panel-column')
    // 12-hour mode: hour(12), minute(60), second(60), AM/PM(2)
    expect(columns.length).toBe(4)
    expect(columns[0]?.querySelectorAll('.ant-picker-time-panel-cell').length).toBe(12)

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  // ====================== Events ======================
  it('should support controlled open prop', async () => {
    const open = ref(false)
    const wrapper = mount(() => (
      <TimePicker open={open.value} />
    ), {
      attachTo: document.body,
    })

    expect(document.querySelector('.ant-picker-dropdown')).toBeFalsy()

    open.value = true
    await nextTick()
    expect(document.querySelector('.ant-picker-dropdown')).toBeTruthy()

    open.value = false
    await nextTick()
    wrapper.unmount()
  })

  it('should emit focus and blur', async () => {
    const onFocus = vi.fn()
    const onBlur = vi.fn()
    const wrapper = mount(TimePicker, {
      props: { onFocus, onBlur },
      attachTo: document.body,
    })

    const input = wrapper.find('input')
    await input.trigger('focus')
    await nextTick()
    expect(onFocus).toHaveBeenCalled()

    await input.trigger('blur')
    await nextTick()
    expect(onBlur).toHaveBeenCalled()

    wrapper.unmount()
  })

  // ====================== RenderExtraFooter / Addon ======================
  it('should support renderExtraFooter slot', async () => {
    const wrapper = mount(TimePicker, {
      props: { open: true },
      slots: {
        renderExtraFooter: () => <span class="custom-footer">Extra</span>,
      },
      attachTo: document.body,
    })
    await nextTick()

    expect(document.querySelector('.custom-footer')).toBeTruthy()
    expect(document.querySelector('.custom-footer')?.textContent).toBe('Extra')

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should support renderExtraFooter as prop', async () => {
    const wrapper = mount(TimePicker, {
      props: {
        open: true,
        renderExtraFooter: () => <span class="prop-footer">PropFooter</span>,
      },
      attachTo: document.body,
    })
    await nextTick()

    expect(document.querySelector('.prop-footer')).toBeTruthy()
    expect(document.querySelector('.prop-footer')?.textContent).toBe('PropFooter')

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should support addon prop (deprecated)', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    resetWarned()

    const wrapper = mount(TimePicker, {
      props: { open: true, addon: () => <span class="addon-prop">AddonProp</span> },
      attachTo: document.body,
    })
    await nextTick()

    expect(document.querySelector('.addon-prop')).toBeTruthy()

    errSpy.mockRestore()
    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should support addon as slot (deprecated)', async () => {
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    resetWarned()

    const wrapper = mount(TimePicker, {
      props: { open: true },
      slots: {
        addon: () => <span class="addon-slot">AddonSlot</span>,
      },
      attachTo: document.body,
    })
    await nextTick()

    expect(document.querySelector('.addon-slot')).toBeTruthy()

    errSpy.mockRestore()
    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should prioritize renderExtraFooter slot over addon', async () => {
    const wrapper = mount(TimePicker, {
      props: {
        open: true,
        addon: () => <span class="addon-content">Addon</span>,
      },
      slots: {
        renderExtraFooter: () => <span class="footer-slot">FooterSlot</span>,
      },
      attachTo: document.body,
    })
    await nextTick()

    // renderExtraFooter slot wins
    expect(document.querySelector('.footer-slot')).toBeTruthy()
    expect(document.querySelector('.addon-content')).toBeFalsy()

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  // ====================== Expose ======================
  it('should expose focus and blur methods', async () => {
    const wrapper = mount(TimePicker, {
      attachTo: document.body,
    })

    const vm = wrapper.vm as any
    expect(typeof vm.focus).toBe('function')
    expect(typeof vm.blur).toBe('function')

    wrapper.unmount()
  })

  // ====================== Variant / Bordered ======================
  it('should support variant=filled', () => {
    const wrapper = mount(TimePicker, {
      props: { variant: 'filled' },
    })
    expect(wrapper.find('.ant-picker-filled').exists()).toBe(true)
  })

  it('should support variant=borderless', () => {
    const wrapper = mount(TimePicker, {
      props: { variant: 'borderless' },
    })
    expect(wrapper.find('.ant-picker-borderless').exists()).toBe(true)
  })

  it('should support bordered=false (deprecated)', () => {
    const wrapper = mount(TimePicker, {
      props: { bordered: false },
    })
    expect(wrapper.find('.ant-picker-borderless').exists()).toBe(true)
  })

  // ====================== Deprecated popupClassName ======================
  it('should apply deprecated popupClassName', async () => {
    resetWarned()
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const wrapper = mount(TimePicker, {
      props: { open: true, popupClassName: 'legacy-popup' },
      attachTo: document.body,
    })
    await nextTick()

    expect(document.querySelector('.legacy-popup')).toBeTruthy()

    errSpy.mockRestore()
    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  // ====================== Suffix Icon ======================
  it('should support suffixIcon slot', () => {
    const wrapper = mount(TimePicker, {
      slots: {
        suffixIcon: () => <span data-testid="custom-suffix">icon</span>,
      },
    })
    expect(wrapper.find('[data-testid="custom-suffix"]').exists()).toBe(true)
  })

  // ====================== ID Passthrough ======================
  it('should pass id to input', () => {
    const wrapper = mount(TimePicker, {
      props: { id: 'my-time-picker' },
    })
    expect(wrapper.find('input').attributes('id')).toBe('my-time-picker')
  })

  // ====================== RTL ======================
  it('should render correctly in RTL direction', () => {
    const wrapper = mount(() => (
      <ConfigProvider direction="rtl">
        <TimePicker />
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-picker-rtl').exists()).toBe(true)
  })

  // ====================== ConfigProvider Size ======================
  it('should inherit size from ConfigProvider', () => {
    const wrapper = mount(() => (
      <ConfigProvider componentSize="large">
        <TimePicker />
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-picker-large').exists()).toBe(true)
  })

  // ====================== Snapshot ======================
  it('should match snapshot', () => {
    const wrapper = mount(TimePicker, {
      props: {
        value: dayjs('12:30:00', 'HH:mm:ss'),
        format: 'HH:mm:ss',
      },
    })
    expect(wrapper.html()).toMatchSnapshot()
  })

  // ====================== RangePicker ======================
  describe('range-picker', () => {
    it('should render correctly', () => {
      const wrapper = mount(RangePicker)
      expect(wrapper.find('.ant-picker-range').exists()).toBe(true)
    })

    it('should have default placeholders', () => {
      const wrapper = mount(RangePicker)
      const inputs = wrapper.findAll('input')
      expect(inputs[0]?.attributes('placeholder')).toBe('Start time')
      expect(inputs[1]?.attributes('placeholder')).toBe('End time')
    })

    it('should support disabled', () => {
      const wrapper = mount(RangePicker, {
        props: { disabled: true },
      })
      expect(wrapper.find('.ant-picker-disabled').exists()).toBe(true)
    })

    it('should support size variants', () => {
      const wrapper = mount(RangePicker, {
        props: { size: 'small' },
      })
      expect(wrapper.find('.ant-picker-small').exists()).toBe(true)
    })

    it('should support status=error', () => {
      const wrapper = mount(RangePicker, {
        props: { status: 'error' },
      })
      expect(wrapper.find('.ant-picker-status-error').exists()).toBe(true)
    })

    it('should display range values', () => {
      const wrapper = mount(RangePicker, {
        props: {
          value: [dayjs('08:00:00', 'HH:mm:ss'), dayjs('18:00:00', 'HH:mm:ss')],
          format: 'HH:mm:ss',
        },
      })
      const inputs = wrapper.findAll('input')
      expect(inputs[0]?.element.value).toBe('08:00:00')
      expect(inputs[1]?.element.value).toBe('18:00:00')
    })

    it('should open popup when open=true', async () => {
      const wrapper = mount(RangePicker, {
        props: { open: true },
        attachTo: document.body,
      })
      await nextTick()

      expect(document.querySelector('.ant-picker-dropdown')).toBeTruthy()

      await wrapper.setProps({ open: false })
      await nextTick()
      wrapper.unmount()
    })

    it('should support controlled open', async () => {
      const onOpenChange = vi.fn()
      const open = ref(false)
      const wrapper = mount(() => (
        <RangePicker
          open={open.value}
          onOpenChange={(v: boolean) => {
            open.value = v
            onOpenChange(v)
          }}
        />
      ), {
        attachTo: document.body,
      })

      open.value = true
      await nextTick()
      // Verify open state applies
      expect(document.querySelector('.ant-picker-dropdown')).toBeTruthy()

      open.value = false
      await nextTick()
      wrapper.unmount()
    })

    it('should support variant=filled', () => {
      const wrapper = mount(RangePicker, {
        props: { variant: 'filled' },
      })
      expect(wrapper.find('.ant-picker-filled').exists()).toBe(true)
    })

    it('should render correctly in RTL', () => {
      const wrapper = mount(() => (
        <ConfigProvider direction="rtl">
          <RangePicker />
        </ConfigProvider>
      ))
      expect(wrapper.find('.ant-picker-rtl').exists()).toBe(true)
    })

    it('should apply deprecated popupClassName', async () => {
      resetWarned()
      const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const wrapper = mount(RangePicker, {
        props: { open: true, popupClassName: 'legacy-range-popup' },
        attachTo: document.body,
      })
      await nextTick()

      expect(document.querySelector('.legacy-range-popup')).toBeTruthy()

      errSpy.mockRestore()
      await wrapper.setProps({ open: false })
      await nextTick()
      wrapper.unmount()
    })

    it('should expose focus and blur methods', async () => {
      const wrapper = mount(RangePicker, {
        attachTo: document.body,
      })

      const vm = wrapper.vm as any
      expect(typeof vm.focus).toBe('function')
      expect(typeof vm.blur).toBe('function')

      wrapper.unmount()
    })

    it('should support status=warning', () => {
      const wrapper = mount(RangePicker, {
        props: { status: 'warning' },
      })
      expect(wrapper.find('.ant-picker-status-warning').exists()).toBe(true)
    })

    it('should support variant=borderless', () => {
      const wrapper = mount(RangePicker, {
        props: { variant: 'borderless' },
      })
      expect(wrapper.find('.ant-picker-borderless').exists()).toBe(true)
    })

    it('should match snapshot', () => {
      const wrapper = mount(RangePicker, {
        props: {
          value: [dayjs('08:00:00', 'HH:mm:ss'), dayjs('18:00:00', 'HH:mm:ss')],
          format: 'HH:mm:ss',
        },
      })
      expect(wrapper.html()).toMatchSnapshot()
    })
  })
})
