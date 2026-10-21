import type { CheckboxChangeEvent } from '@v-c/checkbox'
import type { CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import type { CheckboxGroupContext } from './GroupContext.tsx'
import { clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef, toRef, watch } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { useBaseConfig } from '../config-provider/context.ts'
import { useDisabledContext } from '../config-provider/DisabledContext'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import Checkbox from './Checkbox'
import { useGroupContextProvider } from './GroupContext.tsx'
import useStyle from './style'

export interface CheckboxOptionType {
  label: VueNode
  value: any
  style?: CSSProperties
  class?: string // 👈 5.25.0+
  disabled?: boolean
  title?: string
  id?: string
  onChange?: (e: CheckboxChangeEvent) => void
  required?: boolean
}

export interface AbstractCheckboxGroupProps extends ComponentBaseProps {
  options?: (CheckboxOptionType | string | number)[]
  disabled?: boolean
}

export interface CheckboxGroupSemanticClassNames {
  root?: string
  item?: string
  itemIcon?: string
  itemLabel?: string
}

export interface CheckboxGroupSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  itemIcon?: CSSProperties
  itemLabel?: CSSProperties
}

export type CheckboxGroupClassNamesType = SemanticClassNamesType<CheckboxGroupProps, CheckboxGroupSemanticClassNames>

export type CheckboxGroupStylesType = SemanticStylesType<CheckboxGroupProps, CheckboxGroupSemanticStyles>

export interface CheckboxGroupProps extends AbstractCheckboxGroupProps,
  /* @vue-ignore */
  CheckboxGroupEmitsProps {
  name?: string
  defaultValue?: any[]
  value?: any[]
  labelRender?: (params: { item: CheckboxOptionType, index: number }) => any
  role?: string
  classes?: CheckboxGroupClassNamesType
  styles?: CheckboxGroupStylesType
  'onUpdate:value'?: (value: any[]) => void
}

export interface CheckboxGroupEmits {
  'change': (checkedValue: any[]) => void
}
export interface CheckboxGroupEmitsProps {
  onChange?: CheckboxGroupEmits['change']
}

export interface CheckboxGroupSlots {
  default: () => any
  labelRender: (params: { item: CheckboxOptionType, index: number }) => any

}

// type InternalCheckboxValueType = string | number | boolean
const defaults = {
  options: [],
  role: 'group',
} as any
const CheckboxGroup = defineComponent<
  CheckboxGroupProps,
  CheckboxGroupEmits,
  string,
  SlotsType<CheckboxGroupSlots>
>(
  (props = defaults, { slots, emit, attrs }) => {
    const { prefixCls, direction } = useBaseConfig('checkbox', props)
    const value = shallowRef(props?.value ?? props?.defaultValue ?? [])
    // Only read when toggling, so a plain array is enough. Checkbox cancels from a
    // watcher cleanup, which on unmount runs inside the parent's render effect,
    // where reading and writing a ref would re-render the parent.
    let registeredValues: any[] = []
    watch(
      () => props.value,
      () => {
        value.value = props?.value ?? []
      },
    )
    const memoizedOptions = computed(() => {
      return (props?.options ?? [])
        .map((option) => {
          if (typeof option === 'string' || typeof option === 'number') {
            return {
              label: option,
              value: option,
            }
          }
          return option
        })
        .filter((item): item is CheckboxOptionType =>
          item !== null && item !== undefined && item.value !== null && item.value !== undefined,
        )
    })

    const cancelValue = (val: any) => {
      registeredValues = registeredValues.filter(v => v !== val)
    }
    const registerValue = (val: any) => {
      registeredValues = [...registeredValues, val]
    }

    const toggleOption: CheckboxGroupContext['toggleOption'] = (option) => {
      const optionIndex = value.value.indexOf(option.value)
      const newValue = [...value.value]
      if (optionIndex === -1) {
        newValue.push(option.value)
      }
      else {
        newValue.splice(optionIndex, 1)
      }
      const sortVals = newValue
        .filter(val => registeredValues.includes(val))
        .sort((a, b) => {
          const indexA = memoizedOptions.value.findIndex(opt => opt.value === a)
          const indexB = memoizedOptions.value.findIndex(opt => opt.value === b)
          return indexA - indexB
        })
      emit('change', sortVals)
      props?.['onUpdate:value']?.(sortVals)
      if (props.value === undefined) {
        value.value = newValue
      }
    }
    const groupPrefixCls = computed(() => `${prefixCls.value}-group`)
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    // =========== Merged Props for Semantic ==========
    const contextDisabled = useDisabledContext()
    const mergedProps = computed(() => ({
      ...props,
      options: props.options,
      value: value.value,
      disabled: props.disabled ?? contextDisabled.value,
    }) as CheckboxGroupProps)

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      CheckboxGroupClassNamesType,
      CheckboxGroupStylesType,
      CheckboxGroupProps
    >(
      useToArr(toRef(() => props.classes)),
      useToArr(toRef(() => props.styles)),
      useToProps(mergedProps),
    )

    const memoizedContext = computed(() => {
      return {
        toggleOption,
        value: value.value,
        disabled: props.disabled,
        name: props.name,
        classes: {
          root: mergedClassNames.value.item,
          icon: mergedClassNames.value.itemIcon,
          label: mergedClassNames.value.itemLabel,
        },
        styles: {
          root: mergedStyles.value.item,
          icon: mergedStyles.value.itemIcon,
          label: mergedStyles.value.itemLabel,
        },
        // https://github.com/ant-design/ant-design/issues/16376
        registerValue,
        cancelValue,
      }
    })

    useGroupContextProvider(memoizedContext)
    return () => {
      const { rootClass, role } = props
      const restProps = omit(props, ['options', 'rootClass', 'defaultValue', 'prefixCls', 'classes', 'styles'])
      const children = slots?.default?.()
      const { restAttrs, className, style } = getAttrStyleAndClass(attrs)

      const labelRender = slots?.labelRender ?? props?.labelRender
      const childrenNode = memoizedOptions.value.length
        ? memoizedOptions.value.map((option, index) => {
            const _label = labelRender ? labelRender({ item: option, index }) : option.label
            return (
              <Checkbox
                prefixCls={prefixCls.value}
                key={option.value.toString()}
                disabled={'disabled' in option ? option.disabled : restProps.disabled}
                value={option.value as any}
                checked={value.value.includes(option.value)}
                {
                  ...{
                    onChange: option.onChange,
                  }
                }
                class={clsx(`${groupPrefixCls.value}-item`, option.class)}
                style={option.style}
                title={option.title}
                id={option.id}
                required={option.required}
              >
                {_label}
              </Checkbox>
            )
          })
        : children

      const classString = clsx(
        groupPrefixCls.value,
        {
          [`${groupPrefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        className,
        rootClass,
        mergedClassNames.value.root,
        cssVarCls.value,
        rootCls.value,
        hashId.value,
      )
      return (
        <div class={classString} role={role} style={[mergedStyles.value.root, style]} {...restAttrs}>
          {childrenNode}
        </div>
      )
    }
  },
  {
    name: 'ACheckboxGroup',
    inheritAttrs: false,
  },
)

export default CheckboxGroup
