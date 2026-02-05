import type { SemanticClassNames, SemanticStyles } from '../_util/hooks'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import pickAttrs from '@v-c/util/dist/pickAttrs'
import { computed, defineComponent, shallowRef } from 'vue'
import { clsx } from '../_util/tools.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls.ts'
import CheckableTag from './CheckableTag.tsx'
import useStyle from './style'

type CheckableTagDefaultValue = string | number
export interface CheckableTagOption<CheckableTagValue = CheckableTagDefaultValue> {
  value: CheckableTagValue
  label: VueNode
  disabled?: boolean
}

interface CheckableTagGroupSingleProps<CheckableTagValue = CheckableTagDefaultValue> {
  multiple?: false
  value?: CheckableTagValue | null
  defaultValue?: CheckableTagValue | null
  onChange?: (value: CheckableTagValue | null) => void
}

interface CheckableTagGroupMultipleProps<CheckableTagValue = CheckableTagDefaultValue> {
  multiple: true
  value?: CheckableTagValue[]
  defaultValue?: CheckableTagValue[]
  // onChange?: (value: CheckableTagValue[]) => void
}

export type SemanticName = 'root' | 'item'

export type CheckableTagGroupProps<CheckableTagValue = CheckableTagDefaultValue> = ComponentBaseProps & {
  classes?: SemanticClassNames<SemanticName>
  styles?: SemanticStyles<SemanticName>
  options?: (CheckableTagOption<CheckableTagValue> | CheckableTagValue)[]
  id?: string
  role?: string
  disabled?: boolean
} & (CheckableTagGroupSingleProps<CheckableTagValue> | CheckableTagGroupMultipleProps<CheckableTagValue>)

export interface CheckableTagGroupRef {
  nativeElement: HTMLDivElement
}

export interface CheckableTagGroupEmits<CheckableTagValue = CheckableTagDefaultValue> {
  'change': (value: CheckableTagValue | CheckableTagValue[] | null) => void
  'update:value': (value: CheckableTagValue | CheckableTagValue[] | null) => void
}

const CheckableTagGroup = defineComponent<
  CheckableTagGroupProps,
  CheckableTagGroupEmits,
  string
>((
  props: CheckableTagGroupProps,
  { emit, attrs, expose },
) => {
  const { prefixCls, direction } = useComponentBaseConfig('tag', props)
  const groupPrefixCls = computed(() => `${prefixCls.value}-checkable-group`)
  const rootCls = useCSSVarCls(prefixCls)
  const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

  const mergedClassNames = computed(() => props.classes || {})
  const mergedStyles = computed(() => props.styles || {})
  // =============================== Option ===============================
  const parsedOptions = computed(() => {
    return (props.options ?? []).map((option) => {
      if (option && typeof option === 'object') {
        return option
      }
      return {
        value: option,
        label: option,
      }
    })
  })

  // =============================== Values ===============================
  const _mergedValue = shallowRef<CheckableTagDefaultValue | null | CheckableTagDefaultValue[]>(props.defaultValue ?? props.value ?? null)
  const mergedValue = computed({
    set(value: CheckableTagDefaultValue | null | CheckableTagDefaultValue[]) {
      _mergedValue.value = value
      emit('update:value', value)
    },
    get() {
      return props.value ?? _mergedValue.value
    },
  })
  const handleChange = (checked: boolean, option: CheckableTagOption) => {
    let newValue: CheckableTagDefaultValue | null | CheckableTagDefaultValue[] = null
    if (props.multiple) {
      const valueList = (mergedValue.value || []) as CheckableTagDefaultValue[]
      newValue = checked ? [...valueList, option.value] : valueList.filter(v => v !== option.value)
    }
    else {
      newValue = checked ? option.value : null
    }
    mergedValue.value = newValue
    emit('change', newValue)
  }

  // ================================ Refs ================================
  const divRef = shallowRef<HTMLDivElement>()
  expose({
    nativeElement: divRef,
  })
  return () => {
    const { rootClass, disabled, id, multiple } = props
    // ================================ ARIA ================================
    const ariaProps = pickAttrs(attrs, {
      aria: true,
      data: true,
    })
    // =============================== Render ===============================

    return (
      <div
        {...ariaProps}
        class={clsx(
          groupPrefixCls.value,
          rootClass,
          {
            [`${groupPrefixCls.value}-disabled`]: disabled,
            [`${groupPrefixCls.value}-rtl`]: direction.value === 'rtl',
          },
          hashId.value,
          cssVarCls.value,
          (attrs as any).class,
          mergedClassNames.value.root,
        )}
        style={[
          mergedStyles.value.root,
          (attrs as any).style,
        ]}
        id={id}
        ref={divRef}
      >
        {parsedOptions.value.map((option) => {
          return (
            <CheckableTag
              key={option.value}
              class={clsx(`${groupPrefixCls.value}-item`, mergedClassNames.value.item)}
              style={mergedStyles.value.item}
              checked={multiple ? (mergedValue.value as CheckableTagDefaultValue[] || []).includes(option.value) : mergedValue.value === option.value}
              onChange={(checked: boolean) => handleChange(checked, option)}
              disabled={option.disabled ?? disabled}
            >
              {option.label}
            </CheckableTag>
          )
        })}
      </div>
    )
  }
}, {
  name: 'ACheckableTagGroup',
  inheritAttrs: false,
})

export default CheckableTagGroup
