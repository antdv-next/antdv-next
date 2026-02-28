import type { Dayjs } from 'dayjs'
import type { App } from 'vue'
import type { InternalRangePickerProps } from './generatePicker/generateRangePicker'
import type { DatePickerEmits, DatePickerSlots, InternalPickerProps } from './generatePicker/generateSinglePicker'
import type {
  PickerPropsWithMultiple,
} from './generatePicker/interface'
import dayjsGenerateConfig from '@v-c/picker/generate/dayjs'
import genPurePanel from '../_util/PurePanel.tsx'
import generatePicker from './generatePicker'

export type { PickerLocale } from './generatePicker'

export type {
  DatePickerEmits,
  DatePickerSlots,
}

export type DatePickerProps<
  ValueType = Dayjs,
  IsMultiple extends boolean = boolean,
> = PickerPropsWithMultiple<Dayjs, InternalPickerProps<Dayjs>, ValueType, IsMultiple>

export type MonthPickerProps<ValueType = Dayjs | Dayjs> = Omit<
  DatePickerProps<ValueType>,
  'picker'
>

export type WeekPickerProps<ValueType = Dayjs | Dayjs> = Omit<
  DatePickerProps<ValueType>,
  'picker'
>

export type RangePickerProps = InternalRangePickerProps<Dayjs>

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig)

export type DatePickerType = typeof DatePicker & {
  generatePicker: typeof generatePicker
  _InternalPanelDoNotUseOrYouWillBeFired: any
  _InternalRangePanelDoNotUseOrYouWillBeFired: any
}

;(DatePicker as DatePickerType).generatePicker = generatePicker

;(DatePicker as any).install = (app: App) => {
  app.component(DatePicker.name, DatePicker)
  app.component(DatePicker.WeekPicker.name, DatePicker.WeekPicker)
  app.component(DatePicker.MonthPicker.name, DatePicker.MonthPicker)
  app.component(DatePicker.YearPicker.name, DatePicker.YearPicker)
  app.component(DatePicker.QuarterPicker.name, DatePicker.QuarterPicker)
  app.component(DatePicker.RangePicker.name, DatePicker.RangePicker)
}

export default DatePicker as DatePickerType

export const DateRangePicker = DatePicker.RangePicker
export const DateWeekPicker = DatePicker.WeekPicker
export const DateMonthPicker = DatePicker.MonthPicker
export const DateYearPicker = DatePicker.YearPicker
export const DateQuarterPicker = DatePicker.QuarterPicker

// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(DatePicker, 'popupAlign', undefined, 'picker');
(DatePicker as DatePickerType)._InternalPanelDoNotUseOrYouWillBeFired = PurePanel
const PureRangePanel = genPurePanel(DatePicker.RangePicker, 'popupAlign', undefined, 'picker');
(DatePicker as DatePickerType)._InternalRangePanelDoNotUseOrYouWillBeFired = PureRangePanel
