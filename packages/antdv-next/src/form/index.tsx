import type { App, EmitFn, PublicProps } from 'vue'
import type { FormEmits, FormInstance, FormProps, FormSlots } from './Form'
import InternalForm from './Form'
import FormItem from './FormItem'
import { useForm, useFormInstance } from './hooks/useForm'

export type { FormEmits, FormInstance, FormProps, FormSlots }

type FormComponentInstance<Values = any> = {
  $props: FormProps<Values> & PublicProps
  $emit: EmitFn<FormEmits<Values>>
  $slots: FormSlots
} & FormInstance<Values>

export interface FormConstructor {
  /**
   * Generic signature: `Values` is inferred from `model`, so `@finish` /
   * `@values-change` receive the model type in templates and TSX.
   */
  new<Values = any>(props: FormProps<Values>): FormComponentInstance<Values>
  /**
   * Non-generic fallback signature. TypeScript infers from the last overload,
   * so render-function usage like `h(Form, props)` stays resolvable against
   * Vue's `Constructor<P>` overload of `h` (same as Table, see #634).
   */
  new (props: FormProps<any>): FormComponentInstance<any>
  name: string
  install: (app: App) => void
  useForm: typeof useForm
  useFormInstance: typeof useFormInstance
}

const Form = InternalForm as unknown as FormConstructor

Form.install = (app: App) => {
  app.component(Form.name, Form)
  app.component(FormItem.name, FormItem)
}
Form.useForm = useForm
Form.useFormInstance = useFormInstance
export default Form

export {
  FormItem,
  useForm,
  useFormInstance,
}
export type { FormItemEmits, FormItemProps, FormItemSlots } from './FormItem'
export type { FormHookInstance } from './hooks/useForm'
export type { FormValues, Rule, RuleObject, RuleRender, RuleType } from './types'
