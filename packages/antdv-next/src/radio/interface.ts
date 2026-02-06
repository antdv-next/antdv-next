import type { CSSProperties } from 'vue'
import type { Orientation, SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { AbstractCheckboxProps, CheckboxEmits } from '../checkbox/Checkbox.tsx'
import type { AbstractCheckboxGroupProps, CheckboxOptionType } from '../checkbox/Group.tsx'
import type { SizeType } from '../config-provider/SizeContext.tsx'

export type RadioGroupButtonStyle = 'outline' | 'solid'
export type RadioGroupOptionType = 'default' | 'button'

export interface RadioGroupProps extends AbstractCheckboxGroupProps {
  defaultValue?: any
  value?: any
  size?: SizeType
  disabled?: boolean
  name?: string
  id?: string
  optionType?: RadioGroupOptionType
  orientation?: Orientation
  buttonStyle?: RadioGroupButtonStyle
  block?: boolean
  vertical?: boolean
  labelRender?: (params: { item: CheckboxOptionType, index: number }) => any
}

export interface RadioGroupEmits {
  'change': (e: RadioChangeEvent) => void
  'mouseenter': (e: MouseEvent) => void
  'mouseleave': (e: MouseEvent) => void
  'focus': (e: FocusEvent) => void
  'blur': (e: FocusEvent) => void
  'update:value': (value: any) => void
}

export interface RadioGroupSlots {
  default: () => any
  labelRender: (params: { item: CheckboxOptionType, index: number }) => any
}

export interface RadioGroupContextProps {
  onChange: (e: RadioChangeEvent) => void
  value: any
  disabled?: boolean
  name?: string
  /**
   * Control the appearance for Radio to display as button or not
   *
   * @default 'default'
   * @internal
   */
  optionType?: RadioGroupOptionType
  block?: boolean
}

export type RadioSemanticName = keyof RadioSemanticClassNames & keyof RadioSemanticStyles

export interface RadioSemanticClassNames {
  root?: string
  icon?: string
  label?: string
}

export interface RadioSemanticStyles {
  root?: CSSProperties
  icon?: CSSProperties
  label?: CSSProperties
}

export type RadioClassNamesType = SemanticClassNamesType<RadioProps, RadioSemanticClassNames>

export type RadioStylesType = SemanticStylesType<RadioProps, RadioSemanticStyles>

export interface RadioProps extends AbstractCheckboxProps {
  /**
   * Control the appearance for Radio to display as button or not
   *
   * @default 'default'
   * @internal
   */
  optionType?: RadioGroupOptionType
  classes?: RadioClassNamesType
  styles?: RadioStylesType
}

export interface RadioEmits extends CheckboxEmits {

}

export interface RadioSlots {
  default?: () => any
}

export interface RadioChangeEventTarget extends RadioProps {
  checked: boolean
}

export interface RadioChangeEvent {
  target: RadioChangeEventTarget
  stopPropagation: () => void
  preventDefault: () => void
  nativeEvent: MouseEvent
}

export type RadioOptionTypeContextProps = RadioGroupOptionType
