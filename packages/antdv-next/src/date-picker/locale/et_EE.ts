import type { PickerLocale } from '../generatePicker'

import CalendarLocale from '@v-c/picker/locale/et_EE'
import TimePickerLocale from '../../time-picker/locale/et_EE'

// 统一合并为完整的 Locale
const locale: PickerLocale = {
  lang: {
    placeholder: 'Vali kuupäev',
    rangePlaceholder: ['Algus kuupäev', 'Lõpu kuupäev'],
    yearPlaceholder: 'Vali aasta',
    quarterPlaceholder: 'Vali kvartal',
    monthPlaceholder: 'Vali kuu',
    weekPlaceholder: 'Vali nädal',
    rangeYearPlaceholder: ['Algus aasta', 'Lõpu aasta'],
    rangeQuarterPlaceholder: ['Algus kvartal', 'Lõpu kvartal'],
    rangeMonthPlaceholder: ['Algus kuu', 'Lõpu kuu'],
    rangeWeekPlaceholder: ['Algus nädal', 'Lõpu nädal'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
}

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale
