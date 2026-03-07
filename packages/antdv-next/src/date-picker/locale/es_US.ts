import type { PickerLocale } from '../generatePicker'
import TimePickerLocale from '../../time-picker/locale/es_ES'

import esLocale from './es_ES'

const locale: PickerLocale = {
  lang: {
    ...esLocale.lang,
    locale: 'en_US',
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
}

export default locale
