import type { Dayjs } from 'dayjs'
import type { App } from 'vue'
import type { CalendarMode, CalendarProps, CalendarRef } from './generateCalendar'
import dayjsGenerateConfig from '@v-c/picker/generate/dayjs'
import generateCalendar from './generateCalendar'

const Calendar = generateCalendar<Dayjs>(dayjsGenerateConfig)

export type CalendarType = typeof Calendar & {
  generateCalendar: typeof generateCalendar
}

;(Calendar as CalendarType).generateCalendar = generateCalendar

;(Calendar as any).install = (app: App) => {
  app.component(Calendar.name, Calendar)
}

export type { CalendarMode, CalendarProps, CalendarRef }
export default Calendar as CalendarType
