import type { InjectionKey, Ref } from 'vue'
import type { CheckboxSemanticClassNames, CheckboxSemanticStyles } from './Checkbox.tsx'
import type { CheckboxOptionType } from './Group.tsx'
import { inject, provide } from 'vue'

export interface CheckboxGroupContext {
  name?: string
  toggleOption?: (option: CheckboxOptionType) => void
  value?: any
  disabled?: boolean
  classes?: CheckboxSemanticClassNames
  styles?: CheckboxSemanticStyles
  registerValue: (val: any) => void
  cancelValue: (val: any) => void
}

const GroupContextKey: InjectionKey<Ref<CheckboxGroupContext>> = Symbol('GroupContext')
export function useGroupContextProvider(value: Ref<CheckboxGroupContext>) {
  provide(GroupContextKey, value)
}
export function useGroupContext() {
  return inject(GroupContextKey, undefined)
}
