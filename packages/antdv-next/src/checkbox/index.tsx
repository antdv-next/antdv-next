import type { App } from 'vue'

import Checkbox from './Checkbox'

import CheckboxGroup from './Group'

export type { CheckboxEmits, CheckboxProps, CheckboxSlots } from './Checkbox'

export type {
  CheckboxGroupClassNamesType,
  CheckboxGroupEmits,
  CheckboxGroupProps,
  CheckboxGroupSemanticClassNames,
  CheckboxGroupSemanticStyles,
  CheckboxGroupSlots,
  CheckboxGroupStylesType,
  CheckboxOptionType,
} from './Group'

export { CheckboxGroup }
;(Checkbox as any).install = (app: App) => {
  app.component(Checkbox.name, Checkbox)
  app.component(CheckboxGroup.name, CheckboxGroup)
}
export default Checkbox
