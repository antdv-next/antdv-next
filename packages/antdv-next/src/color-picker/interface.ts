import type {
  ColorGenInput,
  ColorPickerProps as VcColorPickerProps,
} from '@v-c/color-picker'

import type { Key } from '@v-c/util/dist/type'
import type { CSSProperties } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type.ts'
import type { SizeType } from '../config-provider/SizeContext'
import type { PopoverProps } from '../popover'
import type { TooltipPlacement } from '../tooltip'
import type { AggregationColor } from './color'

export type { ColorGenInput }

export type Colors<T> = {
  color: ColorGenInput<T>
  percent: number
}[]

export const FORMAT_HEX = 'hex'
export const FORMAT_RGB = 'rgb'
export const FORMAT_HSB = 'hsb'

export type ColorFormatType = typeof FORMAT_HEX | typeof FORMAT_RGB | typeof FORMAT_HSB

export interface PresetsItem {
  label: VueNode
  colors: (string | AggregationColor)[]
  /**
   * Whether the initial state is collapsed
   * @since 5.11.0
   * @default true
   */
  defaultOpen?: boolean
  /**
   * The key of the panel
   * @since 5.23.0
   */
  key?: Key
}

export type TriggerType = 'click' | 'hover'

export type TriggerPlacement = TooltipPlacement // Alias, to prevent breaking changes.

export type SingleValueType = AggregationColor | string

export type LineGradientType = {
  color: SingleValueType
  percent: number
}[]

export type ColorValueType = SingleValueType | null | LineGradientType

export type ModeType = 'single' | 'gradient'

export type ColorPickerSemanticName = keyof ColorPickerSemanticClassNames & keyof ColorPickerSemanticStyles

export interface ColorPickerSemanticClassNames {
  root?: string
  body?: string
  content?: string
  description?: string
}

export interface ColorPickerSemanticStyles {
  root?: CSSProperties
  body?: CSSProperties
  content?: CSSProperties
  description?: CSSProperties
}

export type ColorPickerClassNamesType = SemanticClassNamesType<
  ColorPickerProps,
  ColorPickerSemanticClassNames,
  { popup?: { root?: string } }
>

export type ColorPickerStylesType = SemanticStylesType<
  ColorPickerProps,
  ColorPickerSemanticStyles,
  {
    popup?: { root?: CSSProperties }
    popupOverlayInner?: CSSProperties
  }
>

export type ColorPickerProps
  = Omit<VcColorPickerProps, 'onChange' | 'onChangeComplete' | 'value'
  | 'defaultValue'
  | 'panelRender'
  | 'disabledAlpha'
  | 'components'> & {
    mode?: ModeType | ModeType[]
    value?: ColorValueType
    defaultValue?: ColorValueType
    open?: boolean
    disabled?: boolean
    placement?: TriggerPlacement
    trigger?: TriggerType
    format?: ColorFormatType
    defaultFormat?: ColorFormatType
    allowClear?: boolean
    presets?: PresetsItem[]
    arrow?: boolean | { pointAtCenter?: boolean }
    panelRender?: (params: { panel: any, extra: { components: { Picker: any, Presets: any } } }) => any
    showText?: boolean | ((params: { color: AggregationColor }) => any)
    size?: SizeType
    classes?: ColorPickerClassNamesType
    styles?: ColorPickerStylesType
    rootClass?: string
    disabledAlpha?: boolean
    disabledFormat?: boolean
    [key: `data-${string}`]: string
  } & Pick<
    PopoverProps,
    'getPopupContainer' | 'autoAdjustOverflow' | 'destroyOnHidden'
  >

export interface ColorPickerEmits {
  'change': (value: AggregationColor, css: string) => void
  'clear': () => void
  'changeComplete': (value: AggregationColor) => void
  'openChange': (open: boolean) => void
  'update:open': (open: boolean) => void
  'formatChange': (format?: ColorFormatType) => void
  'update:value': (value: ColorValueType) => void
  'update:format': (format: ColorFormatType) => void
}

export interface ColorPickerSlots {
  panelRender: (params: { panel: any, extra: { components: { Picker: any, Presets: any } } }) => any
  showText: (params: { color: AggregationColor }) => any
  default: () => any
}
