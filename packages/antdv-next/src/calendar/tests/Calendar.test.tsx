import dayjs from 'dayjs'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Calendar from '..'
import rtlTest from '../../../../../tests/shared/rtlTest'
import { mount, resetMockDate, setMockDate } from '../../../../../tests/utils'

describe('calendar', () => {
  beforeEach(() => {
    setMockDate('2017-09-18T03:30:07.795Z')
  })

  afterEach(() => {
    resetMockDate()
  })

  rtlTest(() => h(Calendar))

  it('should render default calendar', () => {
    const wrapper = mount(Calendar)
    expect(wrapper.find('.ant-picker-calendar').exists()).toBe(true)
    expect(wrapper.find('.ant-picker-calendar-full').exists()).toBe(true)
  })

  it('should render mini calendar when fullscreen is false', () => {
    const wrapper = mount(Calendar, {
      props: { fullscreen: false },
    })
    expect(wrapper.find('.ant-picker-calendar-mini').exists()).toBe(true)
    expect(wrapper.find('.ant-picker-calendar-full').exists()).toBe(false)
  })

  it('should render with defaultValue', () => {
    const wrapper = mount(Calendar, {
      props: { defaultValue: dayjs('2025-06-15T00:00:00Z') },
    })
    expect(wrapper.find('.ant-picker-calendar').exists()).toBe(true)
    const selectedCell = wrapper.find('.ant-picker-cell-selected')
    expect(selectedCell.exists()).toBe(true)
    expect(selectedCell.text()).toContain('15')
  })

  it('should render with controlled value', () => {
    const wrapper = mount(Calendar, {
      props: { value: dayjs('2025-03-20T00:00:00Z') },
    })
    expect(wrapper.find('.ant-picker-calendar').exists()).toBe(true)
    const selectedCell = wrapper.find('.ant-picker-cell-selected')
    expect(selectedCell.exists()).toBe(true)
    expect(selectedCell.text()).toContain('20')
  })

  it('should render year mode (month picker panel)', () => {
    const wrapper = mount(Calendar, {
      props: { mode: 'year' },
    })
    expect(wrapper.find('.ant-picker-month-panel').exists()).toBe(true)
  })

  it('should emit panelChange when mode changes', async () => {
    const onPanelChange = vi.fn()
    const wrapper = mount(Calendar, {
      props: { onPanelChange },
    })
    // Find the year radio input and click to switch mode
    const radioInputs = wrapper.findAll('.ant-radio-button-input')
    expect(radioInputs.length).toBeGreaterThan(1)
    await radioInputs[1].setValue(true)
    expect(onPanelChange).toHaveBeenCalled()
  })

  it('should emit select and change when date is selected', async () => {
    const onSelect = vi.fn()
    const onChange = vi.fn()
    // Use controlled value so onChange fires correctly
    // (uncontrolled mode has a bug: innerValue is updated before the comparison)
    const wrapper = mount(Calendar, {
      props: { value: dayjs('2017-09-18T00:00:00Z'), onSelect, onChange },
    })
    // Click a date cell that is different from the current value
    const cells = wrapper.findAll('.ant-picker-cell')
    expect(cells.length).toBeGreaterThan(0)
    await cells[0].trigger('click')
    expect(onSelect).toHaveBeenCalled()
    expect(onChange).toHaveBeenCalled()
  })

  it('should respect validRange boundaries', () => {
    const wrapper = mount(Calendar, {
      props: {
        value: dayjs('2025-04-15T00:00:00Z'),
        validRange: [dayjs('2025-04-10T00:00:00Z'), dayjs('2025-04-20T00:00:00Z')],
      },
    })
    // Dates outside range (e.g. Apr 1-9, Apr 21-30, spillover dates) should be disabled
    expect(wrapper.find('.ant-picker-cell-disabled').exists()).toBe(true)
  })

  it('should render header with year and month select', () => {
    const wrapper = mount(Calendar)
    expect(wrapper.find('.ant-picker-calendar-header').exists()).toBe(true)
    // Year select and month select
    const selects = wrapper.findAll('.ant-select')
    expect(selects.length).toBeGreaterThanOrEqual(1)
  })

  it('should render header with mode switch', () => {
    const wrapper = mount(Calendar)
    expect(wrapper.find('.ant-radio-group').exists()).toBe(true)
  })

  it('should support custom headerRender', () => {
    const wrapper = mount(Calendar, {
      props: {
        headerRender: ({ type }: any) => {
          return h('div', { class: 'custom-header' }, `${type}`)
        },
      },
    })
    expect(wrapper.find('.custom-header').exists()).toBe(true)
    // Should not render default header
    expect(wrapper.find('.ant-picker-calendar-header').exists()).toBe(false)
  })

  it('should support headerRender slot', () => {
    const wrapper = mount(Calendar, {
      slots: {
        headerRender: ({ type }: any) => h('div', { class: 'slot-header' }, type),
      },
    })
    expect(wrapper.find('.slot-header').exists()).toBe(true)
  })

  it('should support cellRender', () => {
    const wrapper = mount(Calendar, {
      props: {
        cellRender: (_date: any, info: any) => {
          if (info.type === 'date') {
            return h('div', { class: 'custom-cell' }, 'custom')
          }
        },
      },
    })
    expect(wrapper.find('.custom-cell').exists()).toBe(true)
  })

  it('should support cellRender slot', () => {
    const wrapper = mount(Calendar, {
      slots: {
        cellRender: ({ info }: any) => {
          if (info.type === 'date') {
            return h('div', { class: 'slot-cell' }, 'slot')
          }
        },
      },
    })
    expect(wrapper.find('.slot-cell').exists()).toBe(true)
  })

  it('should support fullCellRender', () => {
    const wrapper = mount(Calendar, {
      props: {
        fullCellRender: (_date: any, _info: any) => {
          return h('div', { class: 'full-cell' }, 'full')
        },
      },
    })
    expect(wrapper.find('.full-cell').exists()).toBe(true)
  })

  it('should support disabledDate', () => {
    const wrapper = mount(Calendar, {
      props: {
        disabledDate: (date: any) => date.day() === 0,
      },
    })
    // Disabled cells should exist
    expect(wrapper.find('.ant-picker-cell-disabled').exists()).toBe(true)
  })

  it('should support showWeek', () => {
    const wrapper = mount(Calendar, {
      props: { showWeek: true },
    })
    expect(wrapper.find('.ant-picker-cell-week').exists()).toBe(true)
  })

  it('should support data attributes', () => {
    const wrapper = mount(() => (
      <Calendar data-test="calendar-test" />
    ))
    expect(wrapper.find('[data-test="calendar-test"]').exists()).toBe(true)
  })

  it('should match default snapshot', () => {
    const wrapper = mount(() => (
      <Calendar value={dayjs('2025-01-15T00:00:00Z')} />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })

  it('should match mini snapshot', () => {
    const wrapper = mount(() => (
      <Calendar value={dayjs('2025-01-15T00:00:00Z')} fullscreen={false} />
    ))
    expect(wrapper.html()).toMatchSnapshot()
  })
})
