import type { PickerLocale } from '../generatePicker'

import CalendarLocale from '@v-c/picker/locale/eu_ES'
import TimePickerLocale from '../../time-picker/locale/eu_ES'

// Merge into a locale object
const locale: PickerLocale = {
  lang: {
    placeholder: 'Hautatu data',
    rangePlaceholder: ['Hasierako data', 'Amaiera data'],
    yearPlaceholder: 'Hautatu urtea',
    quarterPlaceholder: 'Hautatu hiruhilekoa',
    monthPlaceholder: 'Hautatu hilabetea',
    weekPlaceholder: 'Hautatu astea',
    rangeYearPlaceholder: ['Hasierako urtea', 'Amaiera urtea'],
    rangeQuarterPlaceholder: ['Hasierako hiruhilekoa', 'Amaiera hiruhilekoa'],
    rangeMonthPlaceholder: ['Hasierako hilabetea', 'Amaiera hilabetea'],
    rangeWeekPlaceholder: ['Hasierako astea', 'Amaiera astea'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
}

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale
