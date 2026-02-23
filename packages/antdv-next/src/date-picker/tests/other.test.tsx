import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import { h, nextTick } from 'vue'
import DatePicker from '..'
import ConfigProvider from '../../config-provider'
import jaJP from '../../locale/ja_JP'
import zhCN from '../../locale/zh_CN'
import zhTW from '../locale/zh_TW'
import { mount } from '/@tests/utils'

describe('date-picker.other', () => {
  const { MonthPicker, WeekPicker } = DatePicker

  it('should override ConfigProvider locale with component locale for DatePicker', () => {
    const wrapper = mount({
      render: () => h(ConfigProvider, { locale: jaJP }, {
        default: () => h(DatePicker, { locale: zhTW }),
      }),
    })

    expect(wrapper.find('input').attributes('placeholder')).toBe('請選擇日期')
  })

  it('should override ConfigProvider locale with component locale for RangePicker', () => {
    const wrapper = mount({
      render: () => h(ConfigProvider, { locale: jaJP }, {
        default: () => h(DatePicker.RangePicker, { locale: zhTW }),
      }),
    })

    const inputs = wrapper.findAll('input')
    expect(inputs[0]?.attributes('placeholder')).toBe('開始日期')
    expect(inputs[1]?.attributes('placeholder')).toBe('結束日期')
  })

  it('should apply custom locale placeholders from ConfigProvider', () => {
    const myLocale = {
      ...zhCN,
      DatePicker: {
        ...zhCN.DatePicker,
        lang: {
          ...zhCN.DatePicker?.lang,
          placeholder: '自定义日期占位',
          monthPlaceholder: '自定义月份占位',
          weekPlaceholder: '自定义周占位',
        },
      },
    }

    const dateWrapper = mount({
      render: () => h(ConfigProvider, { locale: myLocale as any }, { default: () => h(DatePicker) }),
    })
    expect(dateWrapper.find('input').attributes('placeholder')).toBe('自定义日期占位')

    const monthWrapper = mount({
      render: () => h(ConfigProvider, { locale: myLocale as any }, { default: () => h(MonthPicker) }),
    })
    expect(monthWrapper.find('input').attributes('placeholder')).toBe('自定义月份占位')

    const weekWrapper = mount({
      render: () => h(ConfigProvider, { locale: myLocale as any }, { default: () => h(WeekPicker) }),
    })
    expect(weekWrapper.find('input').attributes('placeholder')).toBe('自定义周占位')
  })

  it('should render MonthPicker dropdown when open', async () => {
    const wrapper = mount(MonthPicker, {
      props: {
        open: true,
        value: dayjs('2000-01-01'),
      },
      attachTo: document.body,
    })
    await nextTick()

    expect(document.querySelector('.ant-picker-dropdown')).toBeTruthy()
    expect(document.querySelector('.ant-picker-month-panel')).toBeTruthy()

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })

  it('should render WeekPicker dropdown when open', async () => {
    const wrapper = mount(WeekPicker, {
      props: {
        open: true,
        value: dayjs('2000-01-01'),
      },
      attachTo: document.body,
    })
    await nextTick()

    expect(document.querySelector('.ant-picker-dropdown')).toBeTruthy()
    expect(document.querySelector('.ant-picker-week-panel')).toBeTruthy()

    await wrapper.setProps({ open: false })
    await nextTick()
    wrapper.unmount()
  })
})
