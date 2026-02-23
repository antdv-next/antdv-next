import dayjs from 'dayjs'
import MockDate from 'mockdate'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import DatePicker from '..'
import { resetWarned } from '../../_util/warning'
import { mount } from '/@tests/utils'

function getCell(text: string) {
  return Array.from(document.querySelectorAll('.ant-picker-cell')).find(cell => cell.textContent?.trim() === text)
}

describe('date-picker', () => {
  beforeEach(() => {
    MockDate.set(dayjs('2016-11-22').valueOf())
  })

  afterEach(() => {
    MockDate.reset()
  })

  it('should render correctly', () => {
    const wrapper = mount(DatePicker)
    expect(wrapper.find('.ant-picker').exists()).toBe(true)
  })

  it('should use default placeholder when placeholder is undefined', () => {
    const wrapper = mount(DatePicker, {
      props: {
        placeholder: undefined,
      },
    })

    expect(wrapper.find('input').attributes('placeholder')).toBe('Select date')
  })

  it('should support disabledDate', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        open: true,
        disabledDate: (current: dayjs.Dayjs) => current && current < dayjs().endOf('day'),
      },
      attachTo: document.body,
    })
    await nextTick()

    expect(getCell('21')?.className).toContain('ant-picker-cell-disabled')
    expect(getCell('23')?.className).not.toContain('ant-picker-cell-disabled')

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should render time columns based on showTime options', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        open: true,
        defaultValue: dayjs(),
        showTime: { showHour: true, showMinute: true },
        format: 'YYYY-MM-DD',
      },
      attachTo: document.body,
    })
    await nextTick()

    const columns = document.querySelectorAll('.ant-picker-time-panel-column')
    expect(columns.length).toBe(2)
    expect(columns[0]?.querySelectorAll('.ant-picker-time-panel-cell').length).toBe(24)
    expect(columns[1]?.querySelectorAll('.ant-picker-time-panel-cell').length).toBe(60)

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should render clear icon content when value exists', () => {
    const wrapper = mount(DatePicker, {
      props: {
        value: dayjs('2026-02-23'),
      },
    })

    expect(wrapper.find('.ant-picker-clear').exists()).toBe(true)
    expect(wrapper.find('.ant-picker-clear .anticon').exists()).toBe(true)
    expect(wrapper.find('.ant-picker-clear svg').exists()).toBe(true)
  })

  it('should support custom clear icon through allowClear config', () => {
    const wrapper = mount(DatePicker, {
      props: {
        value: dayjs('2026-02-23'),
        allowClear: { clearIcon: <span data-testid="custom-clear-icon">x</span> },
      },
    })

    expect(wrapper.find('.ant-picker-clear').exists()).toBe(true)
    expect(wrapper.find('[data-testid="custom-clear-icon"]').exists()).toBe(true)
  })

  it('should warn and apply legacy popupClassName', async () => {
    resetWarned()
    const open = ref(true)
    const errSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount({
      render: () => <DatePicker popupClassName="legacy" open={open.value} />,
    }, {
      attachTo: document.body,
    })
    await nextTick()

    expect(errSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'Warning: [antd: DatePicker] `popupClassName` is deprecated. Please use `classes.popup.root` instead.',
      ),
    )
    expect(document.querySelector('.legacy')).toBeTruthy()

    errSpy.mockRestore()
    open.value = false
    await nextTick()
    wrapper.unmount()
  })
})
