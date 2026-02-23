import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import DatePicker from '..'
import { resetWarned } from '../../_util/warning'
import enUS from '../locale/en_US'
import { mount, resetMockDate, setMockDate } from '/@tests/utils'

const { RangePicker } = DatePicker

describe('range-picker', () => {
  beforeEach(() => {
    setMockDate()
  })

  afterEach(() => {
    resetMockDate()
  })

  it('should render correctly', () => {
    const wrapper = mount(RangePicker)
    expect(wrapper.find('.ant-picker').exists()).toBe(true)
    expect(wrapper.find('.ant-picker-range').exists()).toBe(true)
  })

  it('should support custom separator', () => {
    const wrapper = mount(RangePicker, {
      props: {
        separator: 'test',
      },
    })

    expect(wrapper.find('.ant-picker-separator').text()).toContain('test')
  })

  it('should use default placeholders when placeholder is undefined', () => {
    const wrapper = mount(RangePicker, {
      props: {
        placeholder: undefined,
      },
    })

    const inputs = wrapper.findAll('input')
    expect(inputs[0]?.attributes('placeholder')).toBe('Start date')
    expect(inputs[1]?.attributes('placeholder')).toBe('End date')
  })

  it('should support quarter placeholders', () => {
    const wrapper = mount(RangePicker, {
      props: {
        picker: 'quarter',
        locale: enUS,
      },
    })

    const inputs = wrapper.findAll('input')
    expect(inputs[0]?.attributes('placeholder')).toBe('Start quarter')
    expect(inputs[1]?.attributes('placeholder')).toBe('End quarter')
  })

  it('should support allowClear and custom clearIcon', async () => {
    const open = ref(true)
    const value = [dayjs('2023-08-01'), dayjs('2023-08-02')]
    const wrapper = mount({
      render: () => (
        <RangePicker
          open={open.value}
          value={value}
          allowClear={{ clearIcon: <span data-testid="custom-range-clear">x</span> }}
        />
      ),
    }, {
      attachTo: document.body,
    })
    await nextTick()

    expect(wrapper.find('.ant-picker-clear').exists()).toBe(true)
    expect(wrapper.find('[data-testid="custom-range-clear"]').exists()).toBe(true)

    open.value = false
    await nextTick()
    wrapper.unmount()
  })

  it('should hide clear button when allowClear is false', () => {
    const wrapper = mount(RangePicker, {
      props: {
        value: [dayjs('2023-08-01'), dayjs('2023-08-02')],
        allowClear: false,
      },
    })

    expect(wrapper.find('.ant-picker-clear').exists()).toBe(false)
  })

  it('should warn and apply legacy popupClassName', async () => {
    resetWarned()

    const open = ref(true)
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount({
      render: () => <RangePicker popupClassName="legacy" open={open.value} />,
    }, {
      attachTo: document.body,
    })
    await nextTick()

    expect(errSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Warning: [antd: DatePicker.RangePicker] `popupClassName` is deprecated. Please use `classes.popup.root` instead.',
      ),
    )
    expect(document.querySelector('.legacy')).toBeTruthy()

    errSpy.mockRestore()
    open.value = false
    await nextTick()
    wrapper.unmount()
  })

  it('should warn and apply legacy popupStyle', async () => {
    resetWarned()

    const open = ref(true)
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount({
      render: () => <RangePicker popupStyle={{ backgroundColor: 'red' }} open={open.value} />,
    }, {
      attachTo: document.body,
    })
    await nextTick()

    expect(errSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Warning: [antd: DatePicker.RangePicker] `popupStyle` is deprecated. Please use `styles.popup.root` instead.',
      ),
    )

    const dropdown = document.querySelector('.ant-picker-dropdown') as HTMLElement | null
    expect(dropdown).toBeTruthy()
    expect(dropdown?.style.backgroundColor).toBe('red')

    errSpy.mockRestore()
    open.value = false
    await nextTick()
    wrapper.unmount()
  })
})
