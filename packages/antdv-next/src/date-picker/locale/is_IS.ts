import type { PickerLocale } from '../generatePicker'

import CalendarLocale from '@v-c/picker/locale/is_IS'
import TimePickerLocale from '../../time-picker/locale/is_IS'

// Merge into a locale object
const locale: PickerLocale = {
  lang: {
    placeholder: 'Veldu dag',
    rangePlaceholder: ['Upphafsdagur', 'Lokadagur'],
    yearPlaceholder: 'Veldu ár',
    quarterPlaceholder: 'Veldu fjórðung',
    monthPlaceholder: 'Veldu mánuð',
    weekPlaceholder: 'Veldu viku',
    rangeYearPlaceholder: ['Upphafsár', 'Lokaár'],
    rangeQuarterPlaceholder: ['Upphafsfjórðungur', 'Lokafjórðungur'],
    rangeMonthPlaceholder: ['Upphafsmánuður', 'Lokamánuður'],
    rangeWeekPlaceholder: ['Upphafsvika', 'Lokavika'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
}

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale
