import type { Locale } from '.'

import Calendar from '../calendar/locale/es_US'
import DatePicker from '../date-picker/locale/es_US'
import esES from './es_ES'

const localeValues: Locale = {
  ...esES,
  locale: 'es-us',
  DatePicker,
  Calendar,
}

export default localeValues
