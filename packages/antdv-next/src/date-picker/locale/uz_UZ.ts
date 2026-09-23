import type { PickerLocale } from '../generatePicker'

import CalendarLocale from '@v-c/picker/locale/uz_UZ'
import TimePickerLocale from '../../time-picker/locale/uz_UZ'

// Merge into a locale object
const locale: PickerLocale = {
  lang: {
    placeholder: 'Sanani tanlang',
    yearPlaceholder: 'Yilni tanlang',
    quarterPlaceholder: 'Chorakni tanlang',
    monthPlaceholder: 'Oyni tanlang',
    weekPlaceholder: 'Haftani tanlang',
    rangePlaceholder: ['Boshlanish sanasi', 'Tugallanish sanasi'],
    rangeYearPlaceholder: ['Boshlanish yili', 'Tugallanish yili'],
    rangeMonthPlaceholder: ['Boshlanish oyi', 'Tugallanish oyi'],
    rangeWeekPlaceholder: ['Boshlanish haftasi', 'Tugallanish haftasi'],
    rangeQuarterPlaceholder: ['Boshlanish choragi', 'Tugallanish choragi'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
}

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale
