import type { App } from 'vue'
import type { FormEmits, FormInstance, FormProps, FormSlots } from './Form'
import Form from './Form'
import FormItem from './FormItem'
import { useForm, useFormInstance } from './hooks/useForm'

export type { FormEmits, FormInstance, FormProps, FormSlots }
;(Form as any).install = (app: App) => {
  app.component(Form.name, Form)
  app.component(FormItem.name, FormItem)
}
;(Form as any).useForm = useForm
;(Form as any).useFormInstance = useFormInstance
export default Form

export {
  FormItem,
  useForm,
  useFormInstance,
}
export type { FormItemEmits, FormItemProps, FormItemSlots } from './FormItem'
export type { FormHookInstance } from './hooks/useForm'
