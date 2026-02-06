import type { CSSProperties, HTMLAttributes, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { ComponentBaseProps, Variant } from '../config-provider/context'
import type { SizeType } from '../config-provider/SizeContext.tsx'
import type { ColProps } from '../grid'
import type { FormContextProps, FormFieldRegister } from './context.tsx'
import type { FeedbackIcons } from './FormItem'
import type { FormLabelAlign, ScrollFocusOptions } from './interface'
import type {
  FieldData,
  InternalNamePath,
  NamePath,
  Rule,
  ValidateErrorEntity,
  ValidateMessages,
  ValidateOptions,
} from './types.ts'
import { clsx, get, set } from '@v-c/util'
import { pick } from 'es-toolkit'
import scrollIntoView from 'scroll-into-view-if-needed'
import { computed, defineComponent, shallowRef, watch } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { toPropsRefs } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context'
import { useDisabledContext, useDisabledContextProvider } from '../config-provider/DisabledContext.tsx'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls.ts'
import { useSize } from '../config-provider/hooks/useSize.ts'
import { useSizeProvider } from '../config-provider/SizeContext.tsx'
import { NoFormStyle, useFormContextProvider, useVariantContextProvider } from './context.tsx'
import useStyle from './style'
import { getFieldId, toArray } from './util.ts'
import { allPromiseFinish } from './utils/asyncUtil'
import { defaultValidateMessages } from './utils/messages'
import { cloneByNamePathList, containsNamePath, getNamePath, setValue } from './utils/valueUtil.ts'
import { useValidateMessagesContext, useValidateMessagesProvider } from './validateMessagesContext.tsx'

export type RequiredMark
  = | boolean
    | 'optional'
    | ((labelNode: any, info: { required: boolean }) => any)
export type FormLayout = 'horizontal' | 'inline' | 'vertical'
export type FormItemLayout = 'horizontal' | 'vertical'

export type { ScrollFocusOptions }

export type FormSemanticName = keyof FormSemanticClassNames & keyof FormSemanticStyles

export interface FormSemanticClassNames {
  root?: string
  label?: string
  content?: string
}

export interface FormSemanticStyles {
  root?: CSSProperties
  label?: CSSProperties
  content?: CSSProperties
}

export type FormClassNamesType = SemanticClassNamesType<FormProps, FormSemanticClassNames>

export type FormStylesType = SemanticStylesType<FormProps, FormSemanticStyles>

export interface FormProps extends ComponentBaseProps {
  classes?: FormClassNamesType
  styles?: FormStylesType
  colon?: boolean
  name?: string
  layout?: FormLayout
  labelAlign?: FormLabelAlign
  labelWrap?: boolean
  labelCol?: ColProps & Partial<HTMLAttributes>
  wrapperCol?: ColProps & Partial<HTMLAttributes>
  feedbackIcons?: FeedbackIcons
  size?: SizeType
  disabled?: boolean
  scrollToFirstError?: ScrollFocusOptions | boolean
  requiredMark?: RequiredMark
  variant?: Variant
  validateMessages?: ValidateMessages
  model?: Record<string, any>
  rules?: Record<string, Rule[]>
  validateTrigger?: string | string[] | false
  preserve?: boolean
  clearOnDestroy?: boolean
  validateOnRuleChange?: boolean
  autoComplete?: string | undefined
}

export interface FormEmits {
  finish: (values: Record<string, any>) => void
  finishFailed: (errorInfo: ValidateErrorEntity) => void
  submit: (e: Event) => void
  reset: (e: Event) => void
  validate: (name: InternalNamePath, status: boolean, errors: any[] | null) => void
  valuesChange: (changedValues: Record<string, any>, values: Record<string, any>) => void
  fieldsChange: (changedFields: FieldData[], allFields: FieldData[]) => void
}

export interface FormSlots {
  default: () => any
}

export interface FormInstance {
  getFieldValue: (name: NamePath) => any
  getFieldsValue: (nameList?: NamePath[] | true) => Record<string, any>
  getFieldError: (name: NamePath) => string[]
  getFieldsError: (nameList?: NamePath[]) => { name: InternalNamePath, errors: string[], warnings: string[] }[]
  getFieldWarning: (name: NamePath) => string[]
  isFieldsTouched: (nameList?: NamePath[] | boolean, allFieldsTouched?: boolean) => boolean
  isFieldTouched: (name: NamePath) => boolean
  isFieldsValidating: (nameList?: NamePath[]) => boolean
  isFieldValidating: (name: NamePath) => boolean
  resetFields: (nameList?: NamePath[] | InternalNamePath[]) => void
  clearValidate: (nameList?: NamePath[] | InternalNamePath[]) => void
  setFields: (data: FieldData[]) => void
  setFieldValue: (name: NamePath, value: any) => void
  setFieldsValue: (values: Record<string, any>) => void
  validateFields: (nameList?: NamePath[], options?: ValidateOptions) => Promise<Record<string, any>>
  validate: () => Promise<Record<string, any>>
  submit: () => void
  nativeElement: HTMLFormElement | undefined
  scrollToField: (fieldName: NamePath, options?: ScrollFocusOptions | boolean) => void
  focusField: (fieldName: NamePath) => void
  getFieldInstance: (name: NamePath) => any
}
const defaults = {
  layout: 'horizontal',
} as any
const InternalForm = defineComponent<
  FormProps,
  FormEmits,
  string,
  SlotsType<FormSlots>
>(
  (props = defaults, { slots, expose, emit, attrs }) => {
    const contextDisabled = useDisabledContext()
    const {
      prefixCls,
      direction,
      requiredMark: contextRequiredMark,
      colon: contextColon,
      scrollToFirstError: contextScrollToFirstError,
      class: contextClassName,
      style: contextStyle,
      styles: contextStyles,
      classes: contextClassNames,
    } = useComponentBaseConfig('form', props, ['scrollToFirstError', 'colon', 'requiredMark'])
    const {
      size,
      styles,
      classes,
      variant,
      model,
      rules,
      validateTrigger,
      validateMessages,
      feedbackIcons,
    } = toPropsRefs(
      props,
      'size',
      'classes',
      'styles',
      'variant',
      'model',
      'rules',
      'validateTrigger',
      'validateMessages',
      'feedbackIcons',
    )
    const mergedSize = useSize(size)
    const disabled = computed(() => props?.disabled ?? contextDisabled.value)
    const contextValidateMessages = useValidateMessagesContext()

    const mergedRequiredMark = computed(() => {
      if (props.requiredMark !== undefined) {
        return props.requiredMark
      }
      if (contextRequiredMark.value !== undefined) {
        return contextRequiredMark.value
      }
      return true
    })

    const mergedColon = computed(() => props.colon ?? contextColon.value)
    const mergedValidateMessages = computed(() => ({
      ...defaultValidateMessages,
      ...(contextValidateMessages?.value || {}),
      ...(validateMessages.value || {}),
    }))
    useValidateMessagesProvider(mergedValidateMessages)

    // Style
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    // =========== Merged Props for Semantic ===========
    const mergedProps = computed(() => {
      return {
        ...props,
        size: mergedSize.value,
        colon: mergedColon.value,
        requiredMark: mergedRequiredMark.value,
      } as FormProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      FormClassNamesType,
      FormStylesType,
      FormProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    const fields = shallowRef<Record<string, FormFieldRegister>>({})
    const lastValidatePromise = shallowRef<Promise<any>>()

    const addField = (eventKey: string, field: FormFieldRegister) => {
      fields.value[eventKey] = field
    }

    const removeField = (eventKey: string) => {
      delete fields.value[eventKey]
    }

    const getFieldsByNameList = (namePathList?: InternalNamePath[]) => {
      const mergedNamePathList = namePathList?.length ? namePathList : undefined
      const fieldList = Object.values(fields.value)
      if (!mergedNamePathList) {
        return fieldList
      }
      return fieldList.filter(field => containsNamePath(mergedNamePathList, field.namePath()))
    }

    const getFieldValue = (namePath: InternalNamePath) => {
      return get(model.value ?? {}, namePath)
    }

    const getFieldsValue = (nameList: InternalNamePath[] | true = true) => {
      if (nameList === true) {
        const allNameList = Object.values(fields.value).map(field => field.namePath())
        return cloneByNamePathList(model.value ?? {}, allNameList)
      }
      return cloneByNamePathList(model.value ?? {}, nameList)
    }

    const getFields = (namePathList?: InternalNamePath[]): FieldData[] => {
      const fieldList = getFieldsByNameList(namePathList)
      return fieldList.map((field) => {
        const meta = field.getMeta()
        return {
          ...meta,
          name: field.namePath(),
          value: field.getValue(),
        }
      })
    }

    const triggerFieldsChange = (namePathList?: InternalNamePath[]) => {
      emit('fieldsChange', getFields(namePathList), getFields())
    }

    const triggerValuesChange = (namePath: InternalNamePath, value: any) => {
      if (model.value) {
        const changedValues = setValue({}, namePath, value)
        emit('valuesChange', changedValues, model.value)
      }
      triggerFieldsChange([namePath])
    }

    const onValidate = (name: InternalNamePath, status: boolean, errors: any[] | null) => {
      emit('validate', name, status, errors)
    }

    const resetFields = (nameList?: NamePath[] | InternalNamePath[]) => {
      const targetList = nameList ? nameList.map(getNamePath) : undefined
      getFieldsByNameList(targetList).forEach(field => field.resetField())
    }

    const clearValidate = (nameList?: NamePath[] | InternalNamePath[]) => {
      const targetList = nameList ? nameList.map(getNamePath) : undefined
      getFieldsByNameList(targetList).forEach(field => field.clearValidate())
    }

    const validateFields = (nameList?: NamePath[], options: ValidateOptions = {}) => {
      const provideNameList = !!(nameList && toArray(nameList).length)
      const namePathList: InternalNamePath[] = provideNameList
        ? toArray(nameList).map(getNamePath)
        : []

      const promiseList: Promise<{
        name: InternalNamePath
        errors: string[]
        warnings: string[]
      }>[] = []

      getFieldsByNameList(provideNameList ? namePathList : undefined).forEach((field) => {
        if (!provideNameList) {
          namePathList.push(field.namePath())
        }
        if (!field.rules || !field.rules()?.length) {
          return
        }
        const promise = field
          .validateRules(options)
          .then(() => ({ name: field.namePath(), errors: [], warnings: [] }))
          .catch((ruleErrors: any[]) => {
            const mergedErrors: string[] = []
            const mergedWarnings: string[] = []
            ruleErrors?.forEach(({ rule: { warningOnly }, errors }: any) => {
              if (warningOnly) {
                mergedWarnings.push(...errors)
              }
              else {
                mergedErrors.push(...errors)
              }
            })

            if (mergedErrors.length) {
              // eslint-disable-next-line prefer-promise-reject-errors
              return Promise.reject({
                name: field.namePath(),
                errors: mergedErrors,
                warnings: mergedWarnings,
              })
            }
            return {
              name: field.namePath(),
              errors: mergedErrors,
              warnings: mergedWarnings,
            }
          })
        promiseList.push(promise)
      })

      const summaryPromise = allPromiseFinish(promiseList)
      lastValidatePromise.value = summaryPromise

      const returnPromise = summaryPromise
        .then(() => {
          if (lastValidatePromise.value === summaryPromise) {
            return Promise.resolve(getFieldsValue(namePathList))
          }
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject([])
        })
        .catch((results) => {
          const errorList = results.filter((result: any) => result && result.errors.length)
          // eslint-disable-next-line prefer-promise-reject-errors
          return Promise.reject({
            values: getFieldsValue(namePathList),
            errorFields: errorList,
            outOfDate: lastValidatePromise.value !== summaryPromise,
          })
        })

      returnPromise.catch(e => e)
      return returnPromise
    }

    const formContextValue = computed(() => {
      return {
        ...pick(props, [
          'name',
          'labelAlign',
          'labelCol',
          'labelWrap',
          'wrapperCol',
          'layout',
        ]),
        colon: mergedColon.value,
        requiredMark: mergedRequiredMark.value,
        classes: mergedClassNames.value,
        styles: mergedStyles.value,
        rules: rules.value,
        model: model.value,
        validateTrigger: validateTrigger.value,
        validateMessages: mergedValidateMessages.value,
        feedbackIcons: feedbackIcons.value,
        addField,
        removeField,
        onValidate,
        triggerValuesChange,
        triggerFieldsChange,
        getFieldValue,
        getFieldsValue,
      } as FormContextProps
    })

    const nativeElementRef = shallowRef<HTMLFormElement>()

    const scrollToField = (fieldName: InternalNamePath, options: ScrollFocusOptions | boolean = {}) => {
      let defaultScrollToFirstError: ScrollFocusOptions = { block: 'nearest' }
      if (typeof options === 'object') {
        defaultScrollToFirstError = { ...defaultScrollToFirstError, ...options }
      }
      const targetId = getFieldId(fieldName, props.name)
      const node = targetId ? document.getElementById(targetId) : null
      if (node) {
        // @ts-expect-error this is fine
        scrollIntoView(node, defaultScrollToFirstError)
        if (defaultScrollToFirstError.focus !== false) {
          try {
            node.focus()
          }
          catch {
            // ignore focus error
          }
        }
      }
    }

    const onInternalFinishFailed = (errorInfo: ValidateErrorEntity) => {
      emit('finishFailed', errorInfo)
      if (errorInfo.errorFields?.length) {
        const fieldName = errorInfo.errorFields?.[0]?.name
        if (props.scrollToFirstError !== undefined) {
          scrollToField(fieldName!, props.scrollToFirstError)
        }
        else if (contextScrollToFirstError.value !== undefined) {
          scrollToField(fieldName!, contextScrollToFirstError.value)
        }
      }
    }

    const updateModelValue = (namePath: InternalNamePath, value: any) => {
      if (!model.value)
        return
      const newStore = set(model.value, namePath, value)
      Object.assign(model.value, newStore)
    }

    const setFieldValue = (name: NamePath, value: any) => {
      const namePath = getNamePath(name)
      updateModelValue(namePath, value)
      triggerValuesChange(namePath, value)
    }

    const setFieldsValue = (values: Record<string, any>) => {
      if (!model.value)
        return
      Object.keys(values || {}).forEach((key) => {
        updateModelValue(getNamePath(key as any), values[key])
      })
      triggerFieldsChange()
    }

    const getFieldError = (name: NamePath) => {
      const namePath = getNamePath(name)
      const field = getFields([namePath])[0]
      return field?.errors || []
    }

    const getFieldWarning = (name: NamePath) => {
      const namePath = getNamePath(name)
      const field = getFields([namePath])[0]
      return field?.warnings || []
    }

    const getFieldsError = (nameList?: NamePath[]) => {
      const namePathList = nameList?.length ? nameList.map(getNamePath) : undefined
      return getFields(namePathList).map(field => ({
        name: field.name,
        errors: field.errors,
        warnings: field.warnings,
      }))
    }

    const isFieldTouched = (name: NamePath) => {
      const namePath = getNamePath(name)
      const field = getFields([namePath])[0]
      return !!field?.touched
    }

    const isFieldsTouched = (
      nameList?: NamePath[] | boolean,
      allFieldsTouched?: boolean,
    ) => {
      const arrNameList = typeof nameList === 'boolean' || nameList === undefined
        ? undefined
        : nameList.map(getNamePath)
      const fieldsData = getFields(arrNameList)
      if (nameList === false) {
        return false
      }
      if (!fieldsData.length) {
        return false
      }
      if (allFieldsTouched) {
        return fieldsData.every(field => field.touched)
      }
      return fieldsData.some(field => field.touched)
    }

    const isFieldValidating = (name: NamePath) => {
      const namePath = getNamePath(name)
      const field = getFields([namePath])[0]
      return !!field?.validating
    }

    const isFieldsValidating = (nameList?: NamePath[]) => {
      const namePathList = nameList?.length ? nameList.map(getNamePath) : undefined
      return getFields(namePathList).some(field => field.validating)
    }

    const setFields = (data: FieldData[]) => {
      data.forEach((item) => {
        const target = Object.values(fields.value).find(field => containsNamePath([field.namePath()], item.name as InternalNamePath))
        if (target?.setFieldState) {
          target.setFieldState({
            errors: item.errors || [],
            warnings: item.warnings || [],
            touched: item.touched ?? target.getMeta().touched,
            validating: item.validating ?? target.getMeta().validating,
          })
        }
        if (item.value !== undefined) {
          updateModelValue(item.name as InternalNamePath, item.value)
        }
      })
      triggerFieldsChange()
    }

    const submit = () => {
      const syntheticEvent = new Event('submit')
      handleSubmit(syntheticEvent as any)
    }

    useFormContextProvider(formContextValue)
    useVariantContextProvider(variant)
    useDisabledContextProvider(disabled)
    useSizeProvider(mergedSize)

    expose({
      getFieldValue: (name: NamePath) => getFieldValue(getNamePath(name)),
      getFieldsValue,
      getFieldError,
      getFieldsError,
      getFieldWarning,
      isFieldsTouched,
      isFieldTouched,
      isFieldValidating,
      isFieldsValidating,
      resetFields,
      clearValidate,
      setFields,
      setFieldValue,
      setFieldsValue,
      validateFields,
      validate: () => validateFields(),
      submit,
      nativeElement: nativeElementRef,
      scrollToField: (name: NamePath, options: ScrollFocusOptions | boolean = {}) => {
        scrollToField(getNamePath(name), options)
      },
      focusField: (name: NamePath) => {
        const targetId = getFieldId(getNamePath(name), props.name)
        const node = targetId ? document.getElementById(targetId) : null
        if (node) {
          try {
            node.focus?.()
          }
          finally {
            // ignore focus error
          }
        }
      },
      getFieldInstance: (name: NamePath) => {
        const targetId = getFieldId(getNamePath(name), props.name)
        if (targetId) {
          return fields.value?.[targetId]
        }
      },
    })

    watch(
      () => rules.value,
      () => {
        if (props.validateOnRuleChange) {
          validateFields()
        }
      },
      { deep: true },
    )

    function handleSubmit(e: Event) {
      e.preventDefault()
      e.stopPropagation()
      emit('submit', e)
      if (props.model) {
        validateFields()
          .then((values) => {
            emit('finish', values)
          })
          .catch((errors) => {
            onInternalFinishFailed(errors)
          })
      }
    }

    const handleReset = (e: Event) => {
      e.preventDefault()
      emit('reset', e)
      resetFields()
    }

    return () => {
      const {
        layout,
        rootClass,
        name,
      } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const formClassName = clsx(
        prefixCls.value,
        `${prefixCls.value}-${layout}`,
        {
          [`${prefixCls.value}-hide-required-mark`]: mergedRequiredMark.value === false, // todo: remove in next major version
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-${mergedSize.value}`]: mergedSize.value,
        },
        cssVarCls.value,
        rootCls.value,
        hashId.value,
        contextClassName.value,
        className,
        rootClass,
        mergedClassNames.value.root,
      )
      return (
        <NoFormStyle status>
          <form
            id={name}
            {...restAttrs}
            name={name}
            ref={nativeElementRef}
            style={[mergedStyles.value.root, contextStyle.value, style]}
            class={formClassName}
            onSubmit={handleSubmit}
            onReset={handleReset}
          >
            {slots?.default?.()}
          </form>
        </NoFormStyle>
      )
    }
  },
  {
    name: 'AForm',
    inheritAttrs: false,
  },
)

export default InternalForm
