import type { HeadingAlias } from './types'

/**
 * Headings that cannot be mapped to a component automatically.
 *
 * Automatic matching already handles `TextArea`, `Radio/RadioButton`,
 * `Tag.CheckableTag`, `Option props` (page prefix), `DatePicker[picker=year]`
 * and `TreeSelect Props`; only list the leftovers here.
 */
export const headingAliases: HeadingAlias[] = [
  // Shared props of DatePicker and RangePicker.
  { doc: 'date-picker', heading: /^(?:共同的 api|common api)$/i, component: ['ADatePicker', 'ARangePicker'], section: 'props' },
  // TimePicker's RangePicker is a different component from DatePicker's.
  { doc: 'time-picker', heading: 'RangePicker', component: 'ATimeRangePicker' },
  // `type="line"` / `type="circle"` / `type="dashboard"` list extra Progress props.
  { doc: 'progress', heading: /^type=/i, component: 'AProgress', section: 'props' },
]
