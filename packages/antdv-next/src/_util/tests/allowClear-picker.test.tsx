import type { AllowClear } from '../hooks/useAllowClear'
import dayjs from 'dayjs'
import { describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import ConfigProvider from '../../config-provider'
import DatePicker from '../../date-picker'
import zhCN from '../../locale/zh_CN'
import TimePicker from '../../time-picker'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59567
const date = dayjs('2026-10-13')

interface ClearProps {
  allowClear?: AllowClear
  onClear?: () => void
}

const clearCases: {
  name: string
  configKey: 'datePicker' | 'timePicker'
  render: (props: ClearProps) => any
}[] = [
  {
    name: 'DatePicker',
    configKey: 'datePicker',
    render: props => <DatePicker defaultValue={date} {...props} />,
  },
  {
    name: 'RangePicker',
    configKey: 'datePicker',
    render: props => <DatePicker.RangePicker defaultValue={[date, date]} {...props} />,
  },
  {
    name: 'TimePicker',
    configKey: 'timePicker',
    render: props => <TimePicker defaultValue={date} {...props} />,
  },
  {
    name: 'TimeRangePicker',
    configKey: 'timePicker',
    render: props => <TimePicker.RangePicker defaultValue={[date, date]} {...props} />,
  },
]

function getClearButton(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.ant-picker-clear')
}

describe.each(clearCases)('$name unified allowClear', ({ configKey, render: renderComponent }) => {
  it('removes the clear entry when disabled and restores its configuration when enabled', async () => {
    const onClear = vi.fn()
    const config = {
      clearIcon: <span data-testid="clear-icon">Custom</span>,
      label: 'Remove value',
      tabIndex: -1,
    }
    const allowClear = ref<AllowClear>(config)
    const wrapper = mount(defineComponent(() => () => renderComponent({ allowClear: allowClear.value, onClear })))

    expect(getClearButton(wrapper).attributes('aria-label')).toBe('Remove value')
    expect(getClearButton(wrapper).attributes('tabindex')).toBe('-1')

    allowClear.value = { ...config, disabled: true }
    await nextTick()
    expect(getClearButton(wrapper).exists()).toBe(false)
    expect(wrapper.find('[data-testid="clear-icon"]').exists()).toBe(false)
    expect(onClear).not.toHaveBeenCalled()

    allowClear.value = { ...config, disabled: false }
    await nextTick()
    expect(getClearButton(wrapper).attributes('aria-label')).toBe('Remove value')
    expect(getClearButton(wrapper).attributes('tabindex')).toBe('-1')
    expect(wrapper.find('[data-testid="clear-icon"]').exists()).toBe(true)

    await getClearButton(wrapper).trigger('click')
    expect(onClear).toHaveBeenCalledTimes(1)
  })

  it('updates the localized label and preserves an explicit label', async () => {
    const chinese = ref(false)
    const allowClear = ref<AllowClear>(true)
    const wrapper = mount(defineComponent(() => () => (
      <ConfigProvider locale={chinese.value ? zhCN : undefined}>
        {renderComponent({ allowClear: allowClear.value })}
      </ConfigProvider>
    )))

    expect(getClearButton(wrapper).attributes('aria-label')).toBe('Clear')

    chinese.value = true
    await nextTick()
    expect(getClearButton(wrapper).attributes('aria-label')).toBe('清除')

    allowClear.value = { label: 'Remove value' }
    await nextTick()
    expect(getClearButton(wrapper).attributes('aria-label')).toBe('Remove value')
  })

  it('merges fields before normalization and preserves explicit false and zero overrides', async () => {
    const contextAllowClear = {
      clearIcon: <span data-testid="global-clear">Custom</span>,
      disabled: true,
      tabIndex: -1,
      label: 'Global clear',
    }
    const allowClear = ref<AllowClear | undefined>(undefined)
    const wrapper = mount(defineComponent(() => () => (
      <ConfigProvider {...{ [configKey]: { allowClear: contextAllowClear } }}>
        {renderComponent({ allowClear: allowClear.value })}
      </ConfigProvider>
    )))
    const hasGlobalClear = () => wrapper.find('[data-testid="global-clear"]').exists()

    expect(hasGlobalClear()).toBe(false)

    allowClear.value = true
    await nextTick()
    expect(hasGlobalClear()).toBe(false)

    allowClear.value = { tabIndex: 0 }
    await nextTick()
    expect(hasGlobalClear()).toBe(false)

    allowClear.value = { disabled: false }
    await nextTick()
    expect(getClearButton(wrapper).attributes('aria-label')).toBe('Global clear')
    expect(getClearButton(wrapper).attributes('tabindex')).toBe('-1')
    expect(hasGlobalClear()).toBe(true)

    allowClear.value = { disabled: false, tabIndex: 0, label: 'Local clear' }
    await nextTick()
    expect(getClearButton(wrapper).attributes('aria-label')).toBe('Local clear')
    expect(getClearButton(wrapper).attributes('tabindex')).toBe('0')
    expect(hasGlobalClear()).toBe(true)

    allowClear.value = false
    await nextTick()
    expect(hasGlobalClear()).toBe(false)
  })
})

it('uses the picker locale as the default clear label', () => {
  const locale = { ...zhCN.DatePicker!, lang: { ...zhCN.DatePicker!.lang, clear: 'Clear date' } }

  const single = mount(DatePicker, { props: { defaultValue: date, locale } })
  expect(single.find('.ant-picker-clear').attributes('aria-label')).toBe('Clear date')

  const range = mount(DatePicker.RangePicker, { props: { defaultValue: [date, date], locale } })
  expect(range.find('.ant-picker-clear').attributes('aria-label')).toBe('Clear date')
})
