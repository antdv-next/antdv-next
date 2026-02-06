import type { Locale } from '@v-c/picker'
import type { GenerateConfig } from '@v-c/picker/generate'
import type { CSSProperties, Ref } from 'vue'
import type { CalendarMode, SelectInfo } from './generateCalendar'
import { clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, ref } from 'vue'
import { useFormItemInputContext, useFormItemInputContextProvider } from '../form/context'
import { RadioButton, RadioGroup } from '../radio'
import Select from '../select'

const YEAR_SELECT_OFFSET = 10
const YEAR_SELECT_TOTAL = 20

interface SharedProps<DateType> {
  prefixCls: string
  value: DateType
  validRange?: [DateType, DateType]
  generateConfig: GenerateConfig<DateType>
  locale: Locale
  fullscreen: boolean
  divRef: Ref<HTMLDivElement | null>
  onChange: (year: DateType) => void
}

const YearSelect = defineComponent<SharedProps<any>>(
  (props) => {
    return () => {
      const { fullscreen, validRange, generateConfig, locale, prefixCls, value, onChange, divRef } = props
      const year = generateConfig.getYear(value || generateConfig.getNow())

      let start = year - YEAR_SELECT_OFFSET
      let end = start + YEAR_SELECT_TOTAL

      if (validRange) {
        start = generateConfig.getYear(validRange[0])
        end = generateConfig.getYear(validRange[1]) + 1
      }

      const suffix = locale && locale.year === '年' ? '年' : ''
      const options: { label: string, value: number }[] = []
      for (let index = start; index < end; index += 1) {
        options.push({ label: `${index}${suffix}`, value: index })
      }

      return (
        <Select
          size={fullscreen ? undefined : 'small'}
          options={options}
          value={year}
          class={`${prefixCls}-year-select`}
          onChange={(numYear: any) => {
            let newDate = generateConfig.setYear(value, numYear)

            if (validRange) {
              const [startDate, endDate] = validRange
              const newYear = generateConfig.getYear(newDate)
              const newMonth = generateConfig.getMonth(newDate)
              if (
                newYear === generateConfig.getYear(endDate)
                && newMonth > generateConfig.getMonth(endDate)
              ) {
                newDate = generateConfig.setMonth(newDate, generateConfig.getMonth(endDate))
              }
              if (
                newYear === generateConfig.getYear(startDate)
                && newMonth < generateConfig.getMonth(startDate)
              ) {
                newDate = generateConfig.setMonth(newDate, generateConfig.getMonth(startDate))
              }
            }

            onChange(newDate)
          }}
          getPopupContainer={() => divRef.value!}
        />
      )
    }
  },
  {
    name: 'YearSelect',
    inheritAttrs: false,
  },
)

const MonthSelect = defineComponent<SharedProps<any>>(
  (props) => {
    return () => {
      const { prefixCls, fullscreen, validRange, value, generateConfig, locale, onChange, divRef } = props
      const month = generateConfig.getMonth(value || generateConfig.getNow())

      let start = 0
      let end = 11

      if (validRange) {
        const [rangeStart, rangeEnd] = validRange
        const currentYear = generateConfig.getYear(value)
        if (generateConfig.getYear(rangeEnd) === currentYear) {
          end = generateConfig.getMonth(rangeEnd)
        }
        if (generateConfig.getYear(rangeStart) === currentYear) {
          start = generateConfig.getMonth(rangeStart)
        }
      }

      const months = locale.shortMonths || generateConfig.locale.getShortMonths!(locale.locale)
      const options: { label: string, value: number }[] = []
      for (let index = start; index <= end; index += 1) {
        options.push({
          label: months[index!]!,
          value: index,
        })
      }

      return (
        <Select
          size={fullscreen ? undefined : 'small'}
          class={`${prefixCls}-month-select`}
          value={month}
          options={options}
          onChange={(newMonth: any) => {
            onChange(generateConfig.setMonth(value, newMonth))
          }}
          getPopupContainer={() => divRef.value!}
        />
      )
    }
  },
  {
    inheritAttrs: false,
    name: 'MonthSelect',
  },
)

interface ModeSwitchProps<DateType> extends Omit<SharedProps<DateType>, 'onChange'> {
  mode: CalendarMode
  onModeChange: (type: CalendarMode) => void
}

const ModeSwitch = defineComponent<ModeSwitchProps<any>>((props) => {
  return () => {
    const { prefixCls, locale, mode, fullscreen, onModeChange } = props
    return (
      <RadioGroup
        onChange={(e: any) => {
          onModeChange(e.target.value)
        }}
        value={mode}
        size={fullscreen ? undefined : 'small'}
        class={`${prefixCls}-mode-switch`}
        optionType="button"
      >
        <RadioButton value="month">{locale.month}</RadioButton>
        <RadioButton value="year">{locale.year}</RadioButton>
      </RadioGroup>
    )
  }
}, {
  inheritAttrs: false,
  name: 'ModeSwitch',
})

export interface CalendarHeaderProps<DateType> {
  className?: string
  style?: CSSProperties
  prefixCls: string
  value: DateType
  validRange?: [DateType, DateType]
  generateConfig: GenerateConfig<DateType>
  locale: Locale
  mode: CalendarMode
  fullscreen: boolean
  onChange: (date: DateType, source: SelectInfo['source']) => void
  onModeChange: (mode: CalendarMode) => void
}

const CalendarHeader = defineComponent<CalendarHeaderProps<any>>(
  (props) => {
    const divRef = ref<HTMLDivElement | null>(null)

    const formItemInputContext = useFormItemInputContext()
    const mergedFormItemInputContext = computed(() => ({
      ...formItemInputContext.value,
      isFormItemInput: false,
    }))

    useFormItemInputContextProvider(mergedFormItemInputContext)

    return () => {
      const { prefixCls, fullscreen, mode, onChange, onModeChange, className, style } = props

      const sharedProps = {
        ...props,
        fullscreen,
        divRef,
      }

      return (
        <div class={clsx(`${prefixCls}-header`, className)} style={style} ref={divRef}>
          <YearSelect
            {...omit(sharedProps, ['onChange', 'onModeChange'])}
            onChange={(value) => {
              onChange(value, 'year')
            }}
          />
          {mode === 'month'
            ? (
                <MonthSelect
                  {...omit(sharedProps, ['onChange', 'onModeChange'])}
                  onChange={(value) => {
                    onChange(value, 'month')
                  }}
                />
              )
            : null}
          <ModeSwitch {...omit(sharedProps, ['onChange', 'onModeChange'])} onModeChange={onModeChange} />
        </div>
      )
    }
  },
  {
    name: 'ACalendarHeader',
  },
)

export default CalendarHeader
