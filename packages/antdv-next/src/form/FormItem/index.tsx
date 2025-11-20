import type { SlotsType } from 'vue'
import type { ComponentBaseProps } from '../../config-provider/context'
import type { FormItemLayout } from '../Form'
import type { FormItemInputProps } from '../FormItemInput'
import type { FormItemLabelProps, LabelTooltipType } from '../FormItemLabel'
import type { InternalNamePath, Meta, Rule, RuleError, RuleObject, ValidateOptions } from '../types'
import type { ItemHolderProps } from './ItemHolder.tsx'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, createVNode, defineComponent, isVNode, onBeforeUnmount, shallowRef, watch } from 'vue'
import { useComponentBaseConfig } from '../../config-provider/context'
import useCSSVarCls from '../../config-provider/hooks/useCSSVarCls'
import { useFormContext, useFormItemProvider, useNoStyleItemContext } from '../context.tsx'
import useStyle from '../style'
import { getFieldId, initialValueFormat, toArray } from '../util.ts'
import { validateRules } from '../utils/validateUtil.ts'
import { getNamePath, getValue, setValue } from '../utils/valueUtil.ts'
import ItemHolder from './ItemHolder.tsx'
import StatusProvider from './StatusProvider.tsx'

const NAME_SPLIT = '__SPLIT__'

interface FieldError {
  errors: string[]
  warnings: string[]
}

const _ValidateStatuses = ['success', 'warning', 'error', 'validating', ''] as const
export type ValidateStatus = (typeof _ValidateStatuses)[number]

export type FeedbackIcons = (itemStatus: {
  status: ValidateStatus
  errors?: any[]
  warnings?: any[]
}) => { [key in ValidateStatus]?: any }

interface BaseFormItemProps {
  name?: string
  rules?: Rule[]
  trigger?: string
  validateTrigger?: string | string[] | false
  validateDebounce?: number
  validateFirst?: boolean | 'parallel'
}

export type FormItemProps = BaseFormItemProps
  & ComponentBaseProps
  & Omit<FormItemLabelProps, 'requiredMark'>
  & FormItemInputProps
  & {
    noStyle?: boolean
    id?: string
    hasFeedback?: boolean | { icons: FeedbackIcons }
    validateStatus?: ValidateStatus
    required?: boolean
    hidden?: boolean
    // initialValue?: any;
    messageVariables?: Record<string, string>
    tooltip?: LabelTooltipType
    layout?: FormItemLayout
  }

export interface FormItemEmits {
  [key: string]: (...args: any[]) => void
}
export interface FormItemSlots {
  default: () => any
}

function genEmptyMeta(): Meta {
  return {
    errors: [],
    warnings: [],
    touched: false,
    validating: false,
    name: [],
    validated: false,
  }
}

const InternalFormItem = defineComponent<
  FormItemProps,
  FormItemEmits,
  string,
  SlotsType<FormItemSlots>
>(
  (props, { slots, attrs }) => {
    const formContext = useFormContext()
    const mergedValidateTrigger = computed(() => {
      const { validateTrigger } = props
      return validateTrigger !== undefined
        ? validateTrigger
        : formContext.value?.validateTrigger ?? 'change'
    })
    const { prefixCls } = useComponentBaseConfig('form', props)
    const notifyParentMetaChange = useNoStyleItemContext()
    const hasName = computed(() => !(props.name === undefined || props.name === null))
    const namePath = computed<InternalNamePath>(() => (hasName.value ? getNamePath(props.name!) : []))
    const fieldId = computed(() => getFieldId(namePath.value, formContext.value?.name))
    // Style
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const meta = shallowRef<Meta>({ ...genEmptyMeta(), name: namePath.value })
    watch(namePath, (val) => {
      meta.value = { ...meta.value, name: val }
    })

    const errors = shallowRef<any[]>([])
    const warnings = shallowRef<any[]>([])
    const validateDisabled = shallowRef(false)
    const subFieldErrors = shallowRef<Record<string, FieldError>>({})
    // 获取初始值的类型，如果是单个的值，直接复制，如果是个对象，就需要进行深拷贝
    const initialValue = shallowRef<any>(initialValueFormat(formContext.value?.getFieldValue?.(namePath.value)))

    const mergedRules = computed<RuleObject[]>(() => {
      const collectedRules: (Rule | RuleObject)[] = []
      const formRules = formContext.value?.rules
        ? getValue(formContext.value.rules, namePath.value)
        : undefined
      if (formRules) {
        collectedRules.push(...(Array.isArray(formRules) ? formRules : [formRules]))
      }
      if (props.rules) {
        collectedRules.push(...props.rules)
      }
      if (props.required !== undefined) {
        collectedRules.push({
          required: !!props.required,
          trigger: mergedValidateTrigger.value || [],
        } as RuleObject)
      }
      return collectedRules as RuleObject[]
    })

    const isRequired = computed(
      () => mergedRules.value.some(rule => (rule as RuleObject)?.required && !(rule as RuleObject)?.warningOnly),
    )

    const messageVariables = computed(() => {
      let variables: Record<string, string> = {}
      if (typeof props.label === 'string') {
        variables.label = props.label
      }
      else if (props.name) {
        variables.label = String(props.name)
      }
      if (props.messageVariables) {
        variables = { ...variables, ...props.messageVariables }
      }
      return variables
    })

    const fieldValue = computed<any>(() => {
      if (!hasName.value)
        return undefined
      if (formContext.value?.getFieldValue) {
        return formContext.value.getFieldValue(namePath.value)
      }
      return getValue(formContext.value?.model ?? {}, namePath.value)
    })

    const updateMeta = (state: Partial<Meta>) => {
      meta.value = { ...meta.value, ...state }
      if (props.noStyle && notifyParentMetaChange) {
        notifyParentMetaChange(meta.value, meta.value.name)
      }
    }

    const validateRulesInner = (options: ValidateOptions & { triggerName?: string } = {}) => {
      if (!namePath.value.length) {
        return Promise.resolve()
      }
      let filteredRules = mergedRules.value
      const { triggerName } = options

      if (triggerName) {
        filteredRules = filteredRules.filter((rule) => {
          const ruleTrigger = (rule as any).trigger
          if (!ruleTrigger && !mergedValidateTrigger.value) {
            return true
          }
          const triggerList = toArray(ruleTrigger || mergedValidateTrigger.value || [])
          return triggerList.includes(triggerName)
        })
      }

      if (!filteredRules.length) {
        errors.value = []
        warnings.value = []
        updateMeta({
          errors: [],
          warnings: [],
          validating: false,
          validated: true,
        })
        formContext.value?.onValidate?.(namePath.value, true, null)
        formContext.value?.triggerFieldsChange?.([namePath.value])
        return Promise.resolve()
      }

      updateMeta({ validating: true, validated: true })
      errors.value = []
      warnings.value = []

      const promise = validateRules(
        namePath.value,
        fieldValue.value,
        filteredRules as RuleObject[],
        {
          validateMessages: formContext.value?.validateMessages,
          ...options,
        },
        props.validateFirst ?? false,
        messageVariables.value,
      )

      return promise
        .catch(e => e)
        .then((results: RuleError[] = []) => {
          const mergedErrors: any[] = []
          const mergedWarnings: any[] = []

          results.forEach(({ rule: { warningOnly }, errors: ruleErrors }) => {
            if (warningOnly) {
              mergedWarnings.push(...ruleErrors)
            }
            else {
              mergedErrors.push(...ruleErrors)
            }
          })

          errors.value = mergedErrors
          warnings.value = mergedWarnings

          updateMeta({
            errors: mergedErrors,
            warnings: mergedWarnings,
            validating: false,
            validated: true,
            touched: meta.value.touched,
          })
          formContext.value?.onValidate?.(namePath.value, mergedErrors.length === 0, mergedErrors.length ? mergedErrors : null)
          formContext.value?.triggerFieldsChange?.([namePath.value])

          if (mergedErrors.length) {
            return Promise.reject(results)
          }
          return results
        })
    }

    const triggerValidate = (triggerName: string) => {
      const trigger = mergedValidateTrigger.value
      if (trigger === false)
        return
      const triggerList = Array.isArray(trigger) ? trigger : [trigger]
      if (triggerList.includes(triggerName)) {
        validateRulesInner({ triggerName })
      }
    }

    const clearValidate = () => {
      errors.value = []
      warnings.value = []
      updateMeta({
        errors: [],
        warnings: [],
        validating: false,
      })
    }

    const resetField = () => {
      validateDisabled.value = true
      errors.value = []
      warnings.value = []
      updateMeta({
        errors: [],
        warnings: [],
        validating: false,
        touched: false,
        validated: false,
      })
      if (hasName.value && formContext.value?.model) {
        // 避免对原始值造成影响
        setValue(formContext.value.model, namePath.value, initialValueFormat(initialValue.value))
      }
    }

    const onFieldBlur = () => {
      updateMeta({ touched: true })
      triggerValidate('blur')
    }

    const onFieldChange = () => {
      triggerValidate('change')
    }

    watch(
      fieldValue,
      (val, prev) => {
        if (!hasName.value)
          return
        if (validateDisabled.value) {
          validateDisabled.value = false
          return
        }
        if (!meta.value.touched && val !== prev) {
          updateMeta({ touched: true })
        }
        formContext.value?.triggerValuesChange?.(namePath.value, val)
        triggerValidate('change')
      },
      { immediate: false },
    )

    const onSubItemMetaChange: ItemHolderProps['onSubItemMetaChange'] = (subMeta, uniqueKeys) => {
      const clone: Record<string, FieldError> = { ...subFieldErrors.value }
      const mergedNamePath = [...subMeta.name.slice(0, -1), ...uniqueKeys]
      const mergedNameKey = mergedNamePath.join(NAME_SPLIT)
      if ((subMeta as any).destroy) {
        delete clone[mergedNameKey]
      }
      else {
        clone[mergedNameKey] = subMeta
      }
      subFieldErrors.value = clone
    }

    const mergedErrorList = computed(() => {
      const errorList: any[] = [...errors.value]
      const warningList: any[] = [...warnings.value]

      Object.values(subFieldErrors.value).forEach((subFieldError) => {
        errorList.push(...(subFieldError.errors || []))
        warningList.push(...(subFieldError.warnings || []))
      })
      return {
        errors: errorList,
        warnings: warningList,
      }
    })

    const rootClassName = computed(() => clsx(cssVarCls.value, rootCls.value, hashId.value, props.rootClass))

    const eventKey = `form-item-${fieldId.value || namePath.value.join('-') || Math.random().toString(36).slice(2)}`
    watch(
      hasName,
      (val) => {
        if (val && formContext.value?.addField) {
          formContext.value.addField(eventKey, {
            onFieldBlur,
            namePath: () => namePath.value,
            getValue: () => fieldValue.value,
            getMeta: () => meta.value,
            rules: () => mergedRules.value,
            // @ts-expect-error this
            validateRules: (options?: ValidateOptions) => validateRulesInner(options),
            resetField,
            clearValidate,
            setFieldState: (state: Partial<Meta> & { errors?: any[], warnings?: any[] }) => {
              if (state.errors)
                errors.value = state.errors
              if (state.warnings)
                warnings.value = state.warnings
              updateMeta({
                ...meta.value,
                ...state,
                errors: state.errors ?? meta.value.errors,
                warnings: state.warnings ?? meta.value.warnings,
              })
            },
          })
        }
        else {
          formContext.value?.removeField?.(eventKey)
        }
      },
      { immediate: true },
    )

    onBeforeUnmount(() => {
      formContext.value?.removeField?.(eventKey)
    })

    // const handleFocusout = (e: FocusEvent) => {
    //   updateMeta({ touched: true })
    //   triggerValidate('blur')
    // }
    useFormItemProvider({
      fieldId,
      triggerFieldBlur: onFieldBlur,
      triggerFieldChange: onFieldChange,
      clearValidate,
    })
    return () => {
      let children: any = filterEmpty(slots.default?.() ?? [])
      if (children.length > 0 && children.length === 1) {
        children = children[0]
        if (isVNode(children)) {
          // 自动注入onBlur和change
          children = createVNode(children, {
            onBlur: onFieldBlur,
            onChange: onFieldChange,
          })
        }
      }
      return renderLayout(
        children,
        fieldId.value,
        isRequired.value,
      )
    }

    function renderLayout(
      baseChildren: any,
      currentFieldId?: string,
      isRequiredMark?: boolean,
    ) {
      if (props.noStyle && !props.hidden) {
        return (
          <StatusProvider
            prefixCls={prefixCls.value}
            hasFeedback={props.hasFeedback}
            validateStatus={props.validateStatus}
            meta={meta.value}
            errors={mergedErrorList.value.errors}
            warnings={mergedErrorList.value.warnings}
            noStyle
            name={props.name}
          >
            {baseChildren}
          </StatusProvider>
        )
      }

      return (
        <ItemHolder
          {...props}
          {...attrs}
          rootClass={rootClassName.value}
          prefixCls={prefixCls.value}
          fieldId={currentFieldId}
          isRequired={isRequiredMark}
          errors={mergedErrorList.value.errors}
          warnings={mergedErrorList.value.warnings}
          meta={meta.value}
          onSubItemMetaChange={onSubItemMetaChange}
          layout={props.layout}
          name={props.name}
        >
          <StatusProvider
            prefixCls={prefixCls.value}
            meta={meta.value}
            errors={mergedErrorList.value.errors}
            warnings={mergedErrorList.value.warnings}
            hasFeedback={props.hasFeedback}
            validateStatus={props.validateStatus}
            name={props.name}
          >
            {baseChildren}
          </StatusProvider>
        </ItemHolder>
      )
    }
  },
  {
    name: 'AFormItem',
    inheritAttrs: false,
  },
)

export default InternalFormItem
