import type { PickerLocale } from '../generatePicker'

import CalendarLocale from '@v-c/picker/locale/kmr_IQ'
import TimePickerLocale from '../../time-picker/locale/kmr_IQ'

// Merge into a locale object
const locale: PickerLocale = {
  lang: {
    placeholder: 'Dîrok hilbijêre',
    rangePlaceholder: ['Dîroka destpêkê', 'Dîroka dawîn'],
    yearPlaceholder: 'Sal hilbijêre',
    quarterPlaceholder: 'Çaryek hilbijêre',
    monthPlaceholder: 'Meh hilbijêre',
    weekPlaceholder: 'Hefte hilbijêre',
    rangeYearPlaceholder: ['Sala destpêkê', 'Sala dawîn'],
    rangeQuarterPlaceholder: ['Çaryeka destpêkê', 'Çaryeka dawîn'],
    rangeMonthPlaceholder: ['Meha destpêkê', 'Meha dawîn'],
    rangeWeekPlaceholder: ['Hefteya destpêkê', 'Hefteya dawîn'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
}

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json
export default locale
