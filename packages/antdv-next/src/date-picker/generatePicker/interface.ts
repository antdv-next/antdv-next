import type {
  PickerRef,
  Locale as VcPickerLocale,
  PickerProps as VcPickerProps,
  RangePickerProps as VcRangePickerProps,
} from '@v-c/picker'
import type { CSSProperties, Ref } from 'vue'
import type {
  SemanticClassNamesType,
  SemanticStylesType,
} from '../../_util/hooks'
import type { InputStatus } from '../../_util/statusUtils'
import type { AnyObject } from '../../_util/type'
import type { Variant } from '../../config-provider/context'
import type { SizeType } from '../../config-provider/SizeContext'
import type { TimePickerLocale } from '../../time-picker'

const _DataPickerPlacements = ['bottomLeft', 'bottomRight', 'topLeft', 'topRight'] as const

type DataPickerPlacement = (typeof _DataPickerPlacements)[number]

export type DatePickerSemanticName = keyof DatePickerSemanticClassNames
  & keyof DatePickerSemanticStyles

export type DatePickerPanelSemanticName = keyof DatePickerPanelSemanticClassNames
  & keyof DatePickerPanelSemanticStyles

export interface DatePickerSemanticClassNames {
  root?: string
  prefix?: string
  input?: string
  suffix?: string
}

export interface DatePickerSemanticStyles {
  root?: CSSProperties
  prefix?: CSSProperties
  input?: CSSProperties
  suffix?: CSSProperties
}

export interface DatePickerPanelSemanticClassNames {
  root?: string
  header?: string
  body?: string
  content?: string
  item?: string
  footer?: string
  container?: string
}

export interface DatePickerPanelSemanticStyles {
  root?: CSSProperties
  header?: CSSProperties
  body?: CSSProperties
  content?: CSSProperties
  item?: CSSProperties
  footer?: CSSProperties
  container?: CSSProperties
}

export type DatePickerClassNamesType<P> = SemanticClassNamesType<
  InjectDefaultProps<P>,
  DatePickerSemanticClassNames,
  { popup?: string | DatePickerPanelSemanticClassNames }
>

export type DatePickerStylesType<P> = SemanticStylesType<
  InjectDefaultProps<P>,
  DatePickerSemanticStyles,
  { popup?: DatePickerPanelSemanticStyles }
>
export type PickerLocale = {
  lang: VcPickerLocale & AdditionalPickerLocaleLangProps
  timePickerLocale: TimePickerLocale
} & AdditionalPickerLocaleProps

/** @deprecated **Useless**. */
export interface AdditionalPickerLocaleProps {
  /**
   * @deprecated **Invalid**, Please use `lang.fieldDateFormat` instead.
   * @see [Migration Guide](https://github.com/ant-design/ant-design/discussions/53011)
   */
  dateFormat?: string
  /**
   * @deprecated **Invalid**, Please use `lang.fieldDateTimeFormat` instead,
   * @see [Migration Guide](https://github.com/ant-design/ant-design/discussions/53011)
   */
  dateTimeFormat?: string
  /**
   * @deprecated **Invalid**, Please use `lang.fieldWeekFormat` instead,
   * @see [Migration Guide](https://github.com/ant-design/ant-design/discussions/53011)
   */
  weekFormat?: string
  /**
   * @deprecated **Invalid**, Please use `lang.fieldWeekFormat` instead,
   * @see [Migration Guide](https://github.com/ant-design/ant-design/discussions/53011)
   */
  monthFormat?: string
}

export interface AdditionalPickerLocaleLangProps {
  placeholder: string
  yearPlaceholder?: string
  quarterPlaceholder?: string
  monthPlaceholder?: string
  weekPlaceholder?: string
  rangeYearPlaceholder?: [string, string]
  rangeQuarterPlaceholder?: [string, string]
  rangeMonthPlaceholder?: [string, string]
  rangeWeekPlaceholder?: [string, string]
  rangePlaceholder?: [string, string]
}

export type RequiredSemanticPicker = Readonly<
  [
      classes: Ref<DatePickerSemanticClassNames & { popup: DatePickerPanelSemanticClassNames }>,
      styles: Ref<DatePickerSemanticStyles & { popup: DatePickerPanelSemanticStyles }>,
  ]
>
type RcEventKeys
  = | 'onChange'
    | 'onCalendarChange'
    | 'onPanelChange'
    | 'onOpenChange'
    | 'onOk'
    | 'onSelect'
    | 'onFocus'
    | 'onBlur'
    | 'onKeyDown'
    | 'onClick'
    | 'onMouseDown'
    | 'onMouseEnter'
    | 'onMouseLeave'

export type InjectDefaultProps<Props> = Omit<
  Props,
  'locale' | 'generateConfig' | 'hideHeader' | 'classNames' | 'styles' | RcEventKeys | 'className' | 'style' | 'rootClassName'
> & {
  locale?: PickerLocale
  size?: SizeType
  placement?: DataPickerPlacement
  /** @deprecated Use `variant` instead */
  bordered?: boolean
  status?: InputStatus
  /**
   * @since 5.13.0
   * @default "outlined"
   */
  variant?: Variant
  /**
   * @deprecated `dropdownClassName` is deprecated which will be removed in next major
   *   version.Please use `classes.popup.root` instead.
   */
  dropdownClassName?: string
  /**
   * @deprecated please use `classes.popup.root` instead
   */
  popupClassName?: string
  rootClass?: string
  /**
   * @deprecated please use `styles.popup.root` instead
   */
  popupStyle?: CSSProperties
  classes?: DatePickerClassNamesType<Props>
  styles?: DatePickerStylesType<Props>
}

export interface BaseDefaultProps<Props> {
  locale?: PickerLocale
  size?: SizeType
  placement?: DataPickerPlacement
  /** @deprecated Use `variant` instead */
  bordered?: boolean
  status?: InputStatus
  /**
   * @since 5.13.0
   * @default "outlined"
   */
  variant?: Variant
  /**
   * @deprecated `dropdownClassName` is deprecated which will be removed in next major
   *   version.Please use `classes.popup.root` instead.
   */
  dropdownClassName?: string
  /**
   * @deprecated please use `classes.popup.root` instead
   */
  popupClassName?: string
  rootClass?: string
  /**
   * @deprecated please use `styles.popup.root` instead
   */
  popupStyle?: CSSProperties
  classes?: DatePickerClassNamesType<Props>
  styles?: DatePickerStylesType<Props>
}
/** Base Single Picker props */
// export type PickerProps<DateType extends AnyObject = any> = VcPickerProps<DateType> & BaseDefaultProps<VcPickerProps<DateType>>

export interface PickerProps<DateType extends AnyObject = any> extends BaseDefaultProps<DateType>, Omit<VcPickerProps, 'placement' | 'locale' | 'generateConfig' | 'hideHeader' | 'classNames' | 'styles' | RcEventKeys | 'className' | 'style' | 'rootClassName'> {

}

/** Base Range Picker props */
export interface RangePickerProps<DateType extends AnyObject = any>
  extends BaseDefaultProps<DateType>,
  Omit<VcRangePickerProps<DateType>, 'placement' | 'locale' | 'generateConfig' | 'hideHeader' | 'classNames' | 'styles' | RcEventKeys | 'className' | 'style' | 'rootClassName'> {

}

export type GenericTimePickerProps<DateType extends AnyObject = any> = Omit<
  PickerProps<DateType>,
  'picker' | 'showTime'
>

type MultiValueType<ValueType, IsMultiple extends boolean = false> = IsMultiple extends true
  ? ValueType[]
  : ValueType

/**
 * Single Picker has the `multiple` prop,
 * which will make the `value` be `DateType[]` type.
 * Here to be a generic which accept the `ValueType` for developer usage.
 */
export type PickerPropsWithMultiple<
  DateType extends AnyObject = any,
  InnerPickerProps extends PickerProps<DateType> = PickerProps<DateType>,
  ValueType = DateType,
  IsMultiple extends boolean = false,
> = Omit<InnerPickerProps, 'defaultValue' | 'value' | 'onChange' | 'onOk'> & {
  multiple?: IsMultiple
  defaultValue?: MultiValueType<ValueType, IsMultiple> | null
  value?: MultiValueType<ValueType, IsMultiple> | null
}

export type { PickerRef }
