import type { Dayjs } from 'dayjs'
import type { DatePickerEmits, DatePickerProps, RangePickerProps } from '..'
import type { RangePickerEmits } from '../generatePicker/generateRangePicker'
import dayjs from 'dayjs'
import { describe, expect, it } from 'vitest'
import DatePicker from '..'

describe('date-picker.typescript', () => {
  it('should support DatePicker ref methods', () => {
    const datePicker = (
      <DatePicker
        ref={(picker: any) => {
          picker?.focus?.()
          picker?.blur?.()
        }}
      />
    )

    expect(datePicker).toBeTruthy()
  })

  it('should support RangePicker ref methods', () => {
    const rangePicker = (
      <DatePicker.RangePicker
        ref={(picker: any) => {
          picker?.focus?.()
          picker?.blur?.()
        }}
      />
    )

    expect(rangePicker).toBeTruthy()
  })

  it('should support popupClassName on DatePicker and RangePicker', () => {
    const datePicker = <DatePicker popupClassName="popupClassName" />
    const rangePicker = <DatePicker.RangePicker popupClassName="popupClassName" />

    expect(datePicker).toBeTruthy()
    expect(rangePicker).toBeTruthy()
  })

  it('should type single picker props', () => {
    const props: DatePickerProps<Dayjs, false> = {
      value: dayjs(),
      defaultValue: dayjs(),
    }

    const node = <DatePicker {...props} />
    expect(node).toBeTruthy()
  })

  it('should type single picker emits listeners in JSX', () => {
    const onChange: DatePickerEmits<Dayjs>['change'] = (value, dateString) => {
      const _value: Dayjs | Dayjs[] | null = value
      const _dateString: string | string[] = dateString
      return [_value, _dateString]
    }
    const onOk: DatePickerEmits<Dayjs>['ok'] = (value) => {
      const _value: Dayjs | Dayjs[] = value
      return _value
    }

    const node = <DatePicker onChange={onChange} onOk={onOk} />
    expect(node).toBeTruthy()
  })

  it('should type multiple picker props', () => {
    const props: DatePickerProps<Dayjs, true> = {
      multiple: true,
      value: [dayjs()],
      defaultValue: [dayjs()],
    }

    const node = <DatePicker {...props} />
    expect(node).toBeTruthy()
  })

  it('should type multiple picker emits listeners in JSX', () => {
    const onChange: DatePickerEmits<Dayjs>['change'] = (value, dateString) => {
      const _value: Dayjs | Dayjs[] | null = value
      const _dateString: string | string[] = dateString
      return [_value, _dateString]
    }
    const onOk: DatePickerEmits<Dayjs>['ok'] = (value) => {
      const _value: Dayjs | Dayjs[] = value
      return _value
    }

    const node = <DatePicker multiple onChange={onChange} onOk={onOk} />
    expect(node).toBeTruthy()
  })

  it('should type RangePicker props', () => {
    const props: RangePickerProps = {
      value: [dayjs(), dayjs()],
      popupClassName: 'popupClassName',
    }

    const node = <DatePicker.RangePicker {...props} />
    expect(node).toBeTruthy()
  })

  it('should type RangePicker emits listeners in JSX', () => {
    const onChange: RangePickerEmits<Dayjs>['change'] = (dates, dateStrings) => {
      const _dates: Dayjs[] | null = dates
      const _strings: [string, string] = dateStrings
      return [_dates, _strings]
    }

    const node = <DatePicker.RangePicker onChange={onChange} />
    expect(node).toBeTruthy()
  })
})
