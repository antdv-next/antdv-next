import type { PickerMode, PickerRef } from '@v-c/picker'
import type { App, CSSProperties, SlotsType } from 'vue'
import type {
  SemanticClassNamesType,
  SemanticStylesType,
} from '../_util/hooks'
import type { InputStatus } from '../_util/statusUtils'
import type { AnyObject, VueNode } from '../_util/type'
import type {
  PickerProps,
  RangePickerProps,
} from '../date-picker/generatePicker'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef } from 'vue'
import { runEvents } from '../_util/eventRun.ts'
import genPurePanel from '../_util/PurePanel.tsx'
import { toPropsRefs } from '../_util/tools'
import { devUseWarning, isDev } from '../_util/warning'
import DatePicker from '../date-picker'
import useMergedPickerSemantic from '../date-picker/hooks/useMergedPickerSemantic'
import { useVariants } from '../form/hooks/useVariant'

export type TimePickerSemanticName = keyof TimePickerSemanticClassNames
  & keyof TimePickerSemanticStyles

// import type { SemanticName } from '@rc-component/picker/interface';
export interface TimePickerSemanticClassNames {
  root?: string
  prefix?: string
  input?: string
  suffix?: string
}

// import type { SemanticName } from '@rc-component/picker/interface';
export interface TimePickerSemanticStyles {
  root?: CSSProperties
  prefix?: CSSProperties
  input?: CSSProperties
  suffix?: CSSProperties
}

export type TimePickerPanelSemanticName = keyof TimePickerPanelSemanticClassNames
  & keyof TimePickerPanelSemanticStyles

export interface TimePickerPanelSemanticClassNames {
  root?: string
  content?: string
  item?: string
  footer?: string
  container?: string
}

export interface TimePickerPanelSemanticStyles {
  root?: CSSProperties
  content?: CSSProperties
  item?: CSSProperties
  footer?: CSSProperties
  container?: CSSProperties
}

export type TimePickerClassNames = SemanticClassNamesType<
  TimePickerProps,
  TimePickerSemanticClassNames,
  { popup?: string | TimePickerPanelSemanticClassNames }
>

export type TimePickerStyles = SemanticStylesType<
  TimePickerProps,
  TimePickerSemanticStyles,
  { popup?: TimePickerPanelSemanticStyles }
>

export interface PickerTimeProps<DateType extends AnyObject> extends Omit<PickerProps<DateType>, 'picker' | 'showTime'> {

}

export interface RangePickerTimeProps<DateType extends AnyObject> extends Omit<
  RangePickerProps<DateType>,
  'showTime' | 'picker'
> {
  /** @deprecated Please use `classes.popup` instead */
  popupClassName?: string
  /** @deprecated Please use `styles.popup` instead */
  popupStyle?: CSSProperties
}

const { TimePicker: InternalTimePicker, RangePicker: InternalRangePicker } = DatePicker

export interface TimePickerLocale {
  placeholder?: string
  rangePlaceholder?: [string, string]
}

export interface TimeRangePickerProps extends Omit<RangePickerTimeProps<AnyObject>, 'picker'> {
  /** @deprecated Please use `classes.popup` instead */
  popupClassName?: string
  /** @deprecated Please use `styles.popup` instead */
  popupStyle?: CSSProperties
}

export interface TimeRangePickerEmits<DateType = AnyObject> {
  'change': (dates: DateType[] | null, dateStrings: [string, string]) => void
  'update:value': (dates: DateType[] | null) => void
  'calendarChange': (dates: DateType[], dateStrings: [string, string], info: any) => void
  'panelChange': (dates: DateType[], modes: [PickerMode, PickerMode]) => void
  'openChange': (open: boolean) => void
  'ok': (dates: DateType[]) => void
  'focus': (e: FocusEvent, info: any) => void
  'blur': (e: FocusEvent, info: any) => void
  'keydown': (e: KeyboardEvent, preventDefault: VoidFunction) => void
}

const RangePicker = defineComponent<
  TimeRangePickerProps,
  TimeRangePickerEmits
>(
  (props, { slots, expose, attrs }) => {
    const rangeRef = shallowRef<PickerRef>()
    const callbackProps = props as any
    const eventAttrKeys = [
      'onChange',
      'onUpdate:value',
      'onCalendarChange',
      'onPanelChange',
      'onOpenChange',
      'onOk',
      'onFocus',
      'onBlur',
      'onKeydown',
      'onKeyDown',
    ] as const

    const onChange = (dates: AnyObject[] | null, dateStrings: [string, string]) => {
      runEvents(callbackProps, 'onUpdate:value', dates)
      runEvents(callbackProps, 'onChange', dates, dateStrings)
    }

    const onCalendarChange = (dates: AnyObject[], dateStrings: [string, string], info: any) => {
      runEvents(callbackProps, 'onCalendarChange', dates, dateStrings, info)
    }

    const onPanelChange = (dates: AnyObject[], modes: [PickerMode, PickerMode]) => {
      runEvents(callbackProps, 'onPanelChange', dates, modes)
    }

    const onOpenChange = (open: boolean) => {
      runEvents(callbackProps, 'onOpenChange', open)
    }

    const onOk = (dates: AnyObject[]) => {
      runEvents(callbackProps, 'onOk', dates)
    }

    const onFocus = (e: FocusEvent, info: any) => {
      runEvents(callbackProps, 'onFocus', e, info)
    }

    const onBlur = (e: FocusEvent, info: any) => {
      runEvents(callbackProps, 'onBlur', e, info)
    }

    const onKeyDown = (e: KeyboardEvent, preventDefault: VoidFunction) => {
      runEvents(callbackProps, 'onKeydown', e, preventDefault)
    }

    expose({
      focus: (options?: FocusOptions) => rangeRef.value?.focus?.(options as any),
      blur: () => rangeRef.value?.blur?.(),
      nativeElement: computed(() => rangeRef.value?.nativeElement),
    })

    return () => {
      const rangePickerAttrs = omit(attrs as any, eventAttrKeys as unknown as string[])
      return (
        <InternalRangePicker
          {...rangePickerAttrs}
          {...omit(props as any, [
            'onChange',
            'onUpdate:value',
            'onCalendarChange',
            'onPanelChange',
            'onOpenChange',
            'onOk',
            'onFocus',
            'onBlur',
            'onKeydown',
            'onKeyDown',
          ]) as any}
          ref={rangeRef as any}
          picker="time"
          mode={undefined}
          onChange={onChange}
          onCalendarChange={onCalendarChange}
          onPanelChange={onPanelChange}
          onOpenChange={onOpenChange}
          onOk={onOk}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeydown={onKeyDown}
          v-slots={slots}
        />
      )
    }
  },
  {
    name: 'ATimeRangePicker',
    inheritAttrs: false,
  },
)

export interface TimePickerProps
  extends Omit<PickerTimeProps<AnyObject>, 'picker' | 'classes' | 'styles'> {
  addon?: () => VueNode
  status?: InputStatus
  /** @deprecated Please use `classes.popup` instead */
  popupClassName?: string
  /** @deprecated Please use `styles.popup` instead */
  popupStyle?: CSSProperties
  rootClass?: string

  classes?: TimePickerClassNames
  styles?: TimePickerStyles
}

export interface TimePickerSlots {
  addon?: () => any
  renderExtraFooter?: (mode: PickerMode) => any
  suffixIcon?: () => any
  [key: string]: any
}

export interface TimePickerEmits<DateType = AnyObject> {
  'change': (date: DateType | DateType[] | null, dateString: string | string[]) => void
  'update:value': (date: DateType | DateType[] | null) => void
  'calendarChange': (date: DateType | DateType[], dateString: string | string[], info: any) => void
  'panelChange': (date: DateType, mode: PickerMode) => void
  'openChange': (open: boolean) => void
  'ok': (date: DateType | DateType[]) => void
  'select': (date: DateType) => void
  'focus': (e: FocusEvent, info: any) => void
  'blur': (e: FocusEvent, info: any) => void
  'keydown': (e: KeyboardEvent, preventDefault: VoidFunction) => void
}

const TimePicker = defineComponent<
  TimePickerProps,
  TimePickerEmits,
  string,
  SlotsType<TimePickerSlots>
>(
  (props, { slots, expose, attrs }) => {
    const {
      variant,
      bordered,
      classes,
      styles,
      popupClassName,
      popupStyle,
    } = toPropsRefs(
      props,
      'variant',
      'bordered',
      'classes',
      'styles',
      'popupClassName',
      'popupStyle',
    )

    if (isDev) {
      const warning = devUseWarning('TimePicker')
      warning.deprecated(!props.addon, 'addon', 'renderExtraFooter')
    }

    const [mergedVariant] = useVariants('timePicker', variant, bordered)

    const mergedProps = computed(() => ({
      ...props,
      variant: mergedVariant.value,
    }))

    const [mergedClassNames, mergedStyles] = useMergedPickerSemantic<TimePickerProps>(
      'timePicker',
      classes,
      styles,
      popupClassName,
      popupStyle,
      mergedProps,
    )

    const pickerRef = shallowRef<PickerRef>()
    const callbackProps = props as any
    const eventAttrKeys = [
      'onChange',
      'onUpdate:value',
      'onCalendarChange',
      'onPanelChange',
      'onOpenChange',
      'onOk',
      'onSelect',
      'onFocus',
      'onBlur',
      'onKeydown',
      'onKeyDown',
    ] as const

    const onChange = (date: AnyObject | AnyObject[] | null, dateString: string | string[]) => {
      runEvents(callbackProps, 'onUpdate:value', date)
      runEvents(callbackProps, 'onChange', date, dateString)
    }

    const onCalendarChange = (date: AnyObject | AnyObject[], dateString: string | string[], info: any) => {
      runEvents(callbackProps, 'onCalendarChange', date, dateString, info)
    }

    const onPanelChange = (date: AnyObject, mode: PickerMode) => {
      runEvents(callbackProps, 'onPanelChange', date, mode)
    }

    const onOpenChange = (open: boolean) => {
      runEvents(callbackProps, 'onOpenChange', open)
    }

    const onOk = (date: AnyObject | AnyObject[]) => {
      runEvents(callbackProps, 'onOk', date)
    }

    const onSelect = (date: AnyObject) => {
      runEvents(callbackProps, 'onSelect', date)
    }

    const onFocus = (e: FocusEvent, info: any) => {
      runEvents(callbackProps, 'onFocus', e, info)
    }

    const onBlur = (e: FocusEvent, info: any) => {
      runEvents(callbackProps, 'onBlur', e, info)
    }

    const onKeyDown = (e: KeyboardEvent, preventDefault: VoidFunction) => {
      runEvents(callbackProps, 'onKeydown', e, preventDefault)
    }

    const internalRenderExtraFooter = (mode: PickerMode) => {
      const renderSlot = slots.renderExtraFooter
      if (renderSlot) {
        return renderSlot(mode)
      }
      const renderExtraFooter = props.renderExtraFooter
      if (renderExtraFooter) {
        return renderExtraFooter(mode)
      }
      const addonSlot = slots.addon
      if (addonSlot) {
        return addonSlot()
      }
      const addon = props.addon
      if (addon) {
        return addon()
      }
      return undefined
    }

    expose({
      focus: (options?: FocusOptions) => pickerRef.value?.focus?.(options),
      blur: () => pickerRef.value?.blur?.(),
      nativeElement: computed(() => pickerRef.value?.nativeElement),
    })

    return () => {
      const {
        addon,
        renderExtraFooter,
        classes,
        styles,
        popupClassName,
        popupStyle,
        variant,
        bordered,
        ...restProps
      } = props
      const pickerAttrs = omit(attrs as any, eventAttrKeys as unknown as string[])

      return (
        <InternalTimePicker
          {...pickerAttrs}
          {...omit(restProps, [
            'onChange',
            'onUpdate:value',
            'onCalendarChange',
            'onPanelChange',
            'onOpenChange',
            'onOk',
            'onSelect',
            'onFocus',
            'onBlur',
            'onKeydown',
            'onKeyDown',
          ]) as any}
          ref={pickerRef as any}
          mode={undefined}
          renderExtraFooter={internalRenderExtraFooter as any}
          variant={mergedVariant.value}
          classes={mergedClassNames.value as any}
          styles={mergedStyles.value as any}
          {
            ...{
              onChange,
              onCalendarChange,
              onPanelChange,
              onOpenChange,
              onOk,
              onSelect,
              onFocus,
              onBlur,
              onKeydown: onKeyDown,
            } as any
          }
          v-slots={slots}
        />
      )
    }
  },
  {
    name: 'ATimePicker',
    inheritAttrs: false,
  },
)

export type MergedTimePicker = typeof TimePicker & {
  RangePicker: typeof RangePicker
  _InternalPanelDoNotUseOrYouWillBeFired: any
}

// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(TimePicker, 'popupAlign', undefined, 'picker')
;(TimePicker as MergedTimePicker)._InternalPanelDoNotUseOrYouWillBeFired = PurePanel
;(TimePicker as MergedTimePicker).RangePicker = RangePicker

;(TimePicker as any).install = (app: App) => {
  app.component(TimePicker.name, TimePicker)
  app.component(RangePicker.name, RangePicker)
}

export default TimePicker as MergedTimePicker

export const TimeRangePicker = RangePicker
