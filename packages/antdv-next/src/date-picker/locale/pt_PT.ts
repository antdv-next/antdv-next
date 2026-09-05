import type { PickerLocale } from '../generatePicker'

import CalendarLocale from '@v-c/picker/locale/pt_PT'
import TimePickerLocale from '../../time-picker/locale/pt_PT'

// Merge into a locale object
const locale: PickerLocale = {
  lang: {
    ...CalendarLocale,
    placeholder: 'Data',
    yearPlaceholder: 'Ano',
    quarterPlaceholder: 'Trimestre',
    monthPlaceholder: 'Mês',
    weekPlaceholder: 'Semana',
    rangePlaceholder: ['Data inicial', 'Data final'],
    rangeYearPlaceholder: ['Ano inicial', 'Ano final'],
    rangeQuarterPlaceholder: ['Trimestre inicial', 'Trimestre final'],
    rangeMonthPlaceholder: ['Mês inicial', 'Mês final'],
    rangeWeekPlaceholder: ['Semana inicial', 'Semana final'],
    today: 'Hoje',
    now: 'Agora',
    backToToday: 'Hoje',
    ok: 'OK',
    clear: 'Limpar',
    month: 'Mês',
    year: 'Ano',
    timeSelect: 'Hora',
    dateSelect: 'Selecionar data',
    monthSelect: 'Selecionar mês',
    yearSelect: 'Selecionar ano',
    decadeSelect: 'Selecionar década',
    yearFormat: 'YYYY',
    monthFormat: 'MMMM',
    monthBeforeYear: false,
    previousMonth: 'Mês anterior (PageUp)',
    nextMonth: 'Mês seguinte (PageDown)',
    previousYear: 'Ano anterior (Control + left)',
    nextYear: 'Ano seguinte (Control + right)',
    previousDecade: 'Última década',
    nextDecade: 'Próxima década',
    previousCentury: 'Último século',
    nextCentury: 'Próximo século',
  },
  timePickerLocale: {
    ...TimePickerLocale,
    placeholder: 'Hora',
  },
}

// All settings at:
// https://github.com/ant-design/ant-design/blob/master/components/date-picker/locale/example.json

export default locale
