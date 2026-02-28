import type { App } from 'vue'
import type { CheckboxOptionType } from '../checkbox'
import type { InternalRadioGroupProps } from './group'
import type { InternalRadioProps } from './radio'
import Group from './group'
import Radio from './radio'
import Button from './radioButton'

export type {
  RadioChangeEvent,
  RadioEmits,
  RadioGroupEmits,
  RadioGroupOptionType,
  RadioGroupSlots,
  RadioSlots,
} from './interface'
export type RadioGroupProps = InternalRadioGroupProps
export type RadioProps = InternalRadioProps

export type RadioOptionType = CheckboxOptionType
export const RadioGroup = Group
export const RadioButton = Button

;(Radio as any).Button = Button
;(Radio as any).Group = Group
;(Radio as any).__ANT_RADIO = true

;(Radio as any).install = (app: App) => {
  app.component(Radio.name, Radio)
  app.component(RadioGroup.name, RadioGroup)
  app.component(RadioButton.name, RadioButton)
}

export default Radio
