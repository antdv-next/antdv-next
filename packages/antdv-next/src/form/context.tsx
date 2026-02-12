import type { Key } from '@v-c/util/dist/type'
import type { InjectionKey, Ref } from 'vue'
import type { SemanticClassNames, SemanticStyles } from '../_util/hooks'
import type { Variant } from '../config-provider/context'
import type { FormLayout, FormSemanticName, RequiredMark } from './Form'
import type { FeedbackIcons, ValidateStatus } from './FormItem'
import type { ColPropsWithClass, FormTooltipProps } from './FormItemLabel'
import type { FormLabelAlign } from './interface'
import type { InternalNamePath, Meta, NamePath, Rule, ValidateMessages } from './types.ts'
import { computed, defineComponent, inject, provide, ref } from 'vue'

/** Form Context. Set top form style and pass to Form Item usage. */
export interface FormFieldRegister {
  namePath: () => InternalNamePath
  getValue: () => any
  getMeta: () => Meta
  rules?: () => Rule[]
  validateRules: (options?: Record<string, any>) => Promise<void>
  resetField: () => void
  clearValidate: () => void
  setFieldState?: (state: Partial<Meta> & { errors?: any[], warnings?: any[], value?: any }) => void
}

export interface FormContextProps {
  classes?: SemanticClassNames<FormSemanticName>
  styles?: SemanticStyles<FormSemanticName>
  layout: FormLayout
  name?: string
  colon?: boolean
  labelAlign?: FormLabelAlign
  labelWrap?: boolean
  labelCol?: ColPropsWithClass
  wrapperCol?: ColPropsWithClass
  requiredMark?: RequiredMark
  feedbackIcons?: FeedbackIcons
  model?: Record<string, any>
  rules?: Record<string, Rule[]>
  validateTrigger?: string | string[] | false
  validateMessages?: ValidateMessages
  preserve?: boolean
  clearOnDestroy?: boolean
  addField?: (eventKey: string, field: FormFieldRegister) => void
  removeField?: (eventKey: string) => void
  onValidate?: (name: InternalNamePath, status: boolean, errors: any[] | null) => void
  triggerValuesChange?: (namePath: InternalNamePath, value: any) => void
  triggerFieldsChange?: (namePathList?: InternalNamePath[]) => void
  getFieldValue?: (namePath: InternalNamePath) => any
  getFieldsValue?: (nameList?: InternalNamePath[] | true) => any
  tooltip?: FormTooltipProps
}

const FormContextKey: InjectionKey<Ref<FormContextProps>> = Symbol('FormContextKey')

export function useFormContextProvider(value: Ref<FormContextProps>) {
  provide(FormContextKey, value)
}

export function useFormContext() {
  return inject(FormContextKey, ref<FormContextProps>({
    labelAlign: 'right',
    layout: 'horizontal',
  })) as Ref<FormContextProps>
}

const FormItemPrefixContextKey: InjectionKey<Ref<FormItemPrefixContextProps>> = Symbol('FormItemPrefixContextKey')

/** Used for ErrorList only */
export interface FormItemPrefixContextProps {
  prefixCls: string
  status?: ValidateStatus
}

export function useFormItemPrefixContextProvider(value: Ref<FormItemPrefixContextProps>) {
  provide(FormItemPrefixContextKey, value)
}

export const FormItemPrefixContextProvider = defineComponent<FormItemPrefixContextProps>(
  (props, { slots }) => {
    useFormItemPrefixContextProvider(computed(() => props))
    return () => {
      return slots?.default?.()
    }
  },
)

export function useFormItemPrefixContext() {
  return inject(FormItemPrefixContextKey, ref({
    prefixCls: '',
  }))
}

const VariantContextKey: InjectionKey<Ref<Variant | undefined>> = Symbol('VariantContextKey')
export function useVariantContextProvider(variant: Ref<Variant | undefined>) {
  provide(VariantContextKey, variant)
}

export function useVariantContext() {
  return inject(VariantContextKey, ref(undefined))
}

export interface FormItemStatusContextProps {
  isFormItemInput?: boolean
  status?: ValidateStatus
  errors?: any[]
  warnings?: any[]
  hasFeedback?: boolean
  feedbackIcon?: any
  name?: NamePath
}

const FormItemInputContextKey: InjectionKey<Ref<FormItemStatusContextProps>> = Symbol('FormItemInputContextKey')

export function useFormItemInputContextProvider(value: Ref<FormItemStatusContextProps>) {
  provide(FormItemInputContextKey, value)
}
export function useFormItemInputContext() {
  return inject(FormItemInputContextKey, ref({} as FormItemStatusContextProps))
}

/** `noStyle` Form Item Context. Used for error collection */
export type ReportMetaChange = (meta: Meta, uniqueKeys: Key[]) => void
const NoStyleItemContextKey: InjectionKey<ReportMetaChange | null> = Symbol('NoStyleItemContextKey')

export function useNoStyleItemContextProvider(value: ReportMetaChange) {
  provide(NoStyleItemContextKey, value)
}

export const NoStyleItemContextProvider = defineComponent<{ value: ReportMetaChange }>(
  (props, { slots }) => {
    useNoStyleItemContextProvider(props.value)
    return () => {
      return slots?.default?.()
    }
  },
  {
    name: 'NoStyleItemContext',
  },
)

export function useNoStyleItemContext() {
  return inject(NoStyleItemContextKey, null)
}

export const NoFormStyle = defineComponent<{
  override?: boolean
  status?: boolean
}>(
  (props, { slots }) => {
    const formItemInputContext = useFormItemInputContext()
    const newFormItemInputContext = computed(() => {
      const { override, status } = props
      const newContext = { ...formItemInputContext.value }
      if (override) {
        delete newContext.isFormItemInput
      }
      if (status) {
        delete newContext.status
        delete newContext.hasFeedback
        delete newContext.feedbackIcon
      }
      return newContext
    })
    useFormItemInputContextProvider(newFormItemInputContext)
    return () => {
      return slots?.default?.()
    }
  },
)

export interface FormItemProviderProps {
  fieldId: Ref<string | undefined>
  triggerChange: () => void
  triggerBlur: () => void
  triggerFocus: () => void
  clearValidate: () => void
}

const FormItemProviderContextKey: InjectionKey<FormItemProviderProps> = Symbol('FormItemProviderContextKey')
export function useFormItemProvider(value: FormItemProviderProps) {
  provide(FormItemProviderContextKey, value)
}

export function useFormItemContext(rest = false) {
  if (rest) {
    useFormItemProviderRest()
  }
  return inject(FormItemProviderContextKey, undefined)
}

export function useFormItemProviderRest() {
  return provide(FormItemProviderContextKey, {
    fieldId: ref(undefined),
    triggerChange: () => {},
    triggerBlur: () => {},
    clearValidate: () => {},
    triggerFocus: () => {},
  })
}
