import type { PickerLocale } from '../generatePicker'

import CalendarLocale from '@v-c/picker/locale/ka_GE'
import TimePickerLocale from '../../time-picker/locale/ka_GE'

const locale: PickerLocale = {
  lang: {
    placeholder: 'აირჩიეთ თარიღი',
    yearPlaceholder: 'აირჩიეთ წელი',
    quarterPlaceholder: 'აირჩიეთ მეოთხედი',
    monthPlaceholder: 'აირჩიეთ თვე',
    weekPlaceholder: 'აირჩიეთ კვირა',
    rangePlaceholder: ['საწყისი თარიღი', 'საბოლოო თარიღი'],
    rangeYearPlaceholder: ['საწყისი წელი', 'საბოლოო წელი'],
    rangeMonthPlaceholder: ['საწყისი თვე', 'საბოლოო თვე'],
    rangeWeekPlaceholder: ['საწყისი კვირა', 'საბოლოო კვირა'],
    rangeQuarterPlaceholder: ['საწყისი მეოთხედი', 'საბოლოო მეოთხედი'],
    ...CalendarLocale,
  },
  timePickerLocale: {
    ...TimePickerLocale,
  },
}

export default locale
