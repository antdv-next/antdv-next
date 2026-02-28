import type { App } from 'vue'
import type { CheckboxOptionType } from '../checkbox'
import Group from './group'
import Radio from './radio'
import Button from './radioButton'

export type { InternalRadioGroupProps as RadioGroupProps } from './group'
export type {
  RadioChangeEvent,
  RadioEmits,
  RadioGroupEmits,
  RadioGroupOptionType,
  RadioGroupSlots,
  RadioSlots,
} from './interface'
export type { InternalRadioProps as RadioProps } from './radio'

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
