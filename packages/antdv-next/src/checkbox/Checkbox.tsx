import type { CheckboxChangeEvent } from '@v-c/checkbox'
import type { CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { ComponentBaseProps } from '../config-provider/context'
import VcCheckbox from '@v-c/checkbox'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, nextTick, onBeforeUnmount, shallowRef, watch } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { isValueEqual } from '../_util/isEqual'
import isNonNullable from '../_util/isNonNullable.ts'
import { toPropsRefs } from '../_util/tools'
import { checkRenderNode } from '../_util/vueNode.ts'
import { devUseWarning, isDev } from '../_util/warning'
import Wave from '../_util/wave'
import { TARGET_CLS } from '../_util/wave/interface.ts'
import { useComponentBaseConfig } from '../config-provider/context'
import { useDisabledContext } from '../config-provider/DisabledContext'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { useFormItemContext, useFormItemInputContext } from '../form/context'
import { useGroupContext } from './GroupContext'
import useStyle from './style'
import useBubbleLock from './useBubbleLock.ts'

export type CheckedValueType = string | number | boolean | object

export interface AbstractCheckboxProps extends ComponentBaseProps {
  defaultChecked?: CheckedValueType
  checked?: CheckedValueType
  disabled?: boolean
  title?: string
  value?: any
  tabIndex?: number
  name?: string
  id?: string
  autoFocus?: boolean
  type?: string
  skipGroup?: boolean
  required?: boolean
  /**
   * 选中时的值
   */
  checkedValue?: CheckedValueType
  /**
   * 非选中时的值
   */
  unCheckedValue?: CheckedValueType
}

export interface CheckboxEmits {
  'change': (checked: CheckboxChangeEvent) => void
  'update:checked': (checked: any) => void
  'update:value': (value: any) => void
  'mouseenter': (event: MouseEvent) => void
  'mouseleave': (event: MouseEvent) => void
  'keypress': (event: KeyboardEvent) => void
  'keydown': (event: KeyboardEvent) => void
  'focus': (event: FocusEvent) => void
  'blur': (event: FocusEvent) => void
  'click': (event: MouseEvent) => void
}
export interface CheckboxSlots {
  default?: () => any
}

export type CheckboxSemanticName = keyof CheckboxSemanticClassNames & keyof CheckboxSemanticStyles

export interface CheckboxSemanticClassNames {
  root?: string
  icon?: string
  label?: string
}

export interface CheckboxSemanticStyles {
  root?: CSSProperties
  icon?: CSSProperties
  label?: CSSProperties
}

export type CheckboxClassNamesType = SemanticClassNamesType<
  CheckboxProps,
  CheckboxSemanticClassNames
>

export type CheckboxStylesType = SemanticStylesType<CheckboxProps, CheckboxSemanticStyles>

export interface CheckboxProps extends AbstractCheckboxProps {
  indeterminate?: boolean
  classes?: CheckboxClassNamesType
  styles?: CheckboxStylesType
}

const defaults = {
  indeterminate: false,
  skipGroup: false,
}

const InternalCheckbox = defineComponent<
  CheckboxProps,
  CheckboxEmits,
  string,
  SlotsType<CheckboxSlots>
>(
  (props = defaults, { slots, emit, attrs, expose }) => {
    const {
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      prefixCls,
    } = useComponentBaseConfig('checkbox', props)
    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')
    const checkboxGroup = useGroupContext()
    const formItemInputContext = useFormItemInputContext()
    const formItemContext = useFormItemContext()
    const contextDisabled = useDisabledContext()
    const mergedDisabled = computed(() => (checkboxGroup?.value?.disabled || props?.disabled) ?? contextDisabled.value)

    // ===================== Checked Value =====================
    // 获取选中和非选中的值，默认为 true/false
    const mergedCheckedValue = computed(() => props.checkedValue ?? true)
    const mergedUnCheckedValue = computed(() => props.unCheckedValue ?? false)

    // 当前值（用于单独使用时，不在 Group 中）
    const currentValue = shallowRef<CheckedValueType>(
      props?.checked ?? props?.defaultChecked ?? mergedUnCheckedValue.value,
    )
    watch(
      () => props.checked,
      (newChecked) => {
        if (newChecked !== undefined) {
          currentValue.value = newChecked
        }
      },
    )

    // 计算是否选中（用于单独使用时）
    const isChecked = computed(() => isValueEqual(currentValue.value, mergedCheckedValue.value))
    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => {
      return {
        ...props,
        disabled: mergedDisabled.value,
      } as CheckboxProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      CheckboxClassNamesType,
      CheckboxStylesType,
      CheckboxProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    const prevValue = shallowRef(props.value)
    const checkboxRef = shallowRef()
    if (isDev) {
      const warning = devUseWarning('Checkbox')

      warning(
        'checked' in props || !!checkboxGroup?.value || !('value' in props),
        'usage',
        '`value` is not a valid prop, do you mean `checked`?',
      )
    }
    checkboxGroup?.value?.registerValue?.(prevValue.value)
    watch(() => props.value, (_n, _o, onCleanup) => {
      if (props.skipGroup) {
        return
      }
      if (prevValue.value !== props.value) {
        checkboxGroup?.value?.cancelValue?.(prevValue.value)
        checkboxGroup?.value?.registerValue?.(props.value)
        prevValue.value = props.value
      }
      onCleanup(() => {
        checkboxGroup?.value?.cancelValue?.(prevValue.value)
      })
    })
    onBeforeUnmount(() => {
      checkboxGroup?.value?.cancelValue?.(prevValue.value)
    })
    watch(() => props.indeterminate, async () => {
      await nextTick()
      if (checkboxRef.value) {
        if (checkboxRef.value?.input) {
          checkboxRef.value.input.indeterminate = props.indeterminate
        }
      }
    })

    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    // ============================ Event Lock ============================
    const [onLabelClick, onInputClick] = useBubbleLock((e) => {
      emit('click', e)
    })
    const keys = [
      'prefixCls',
      'rootClass',
      'indeterminate',
      'skipGroup',
      'disabled',
      'classes',
      'styles',
      'checkedValue',
      'unCheckedValue',
    ] as const
    expose({
      blur: () => checkboxRef.value?.blur?.(),
      focus: () => checkboxRef.value?.focus?.(),
      input: computed(() => checkboxRef.value?.input),
    })
    return () => {
      const { skipGroup, rootClass, indeterminate } = props
      const children = checkRenderNode(filterEmpty(slots?.default?.() ?? []))
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const checkboxProps: any = {
        ...omit(props, keys),
      }

      // 是否在 Group 中使用
      const inGroup = checkboxGroup?.value && !skipGroup

      if (inGroup) {
        checkboxProps.onChange = (...args: any[]) => {
          emit('change', ...args)
          if (checkboxGroup.value.toggleOption) {
            checkboxGroup.value.toggleOption({ label: children, value: props.value })
          }
        }
        checkboxProps.name = checkboxGroup.value?.name
        checkboxProps.checked = checkboxGroup?.value?.value.includes?.(props.value)
      }
      else {
        // 单独使用时，使用 isChecked 判断选中状态
        checkboxProps.checked = isChecked.value
      }

      const classString = clsx(
        `${prefixCls.value}-wrapper`,
        {
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-wrapper-checked`]: checkboxProps.checked,
          [`${prefixCls.value}-wrapper-disabled`]: mergedDisabled.value,
          [`${prefixCls.value}-wrapper-in-form-item`]: formItemInputContext.value?.isFormItemInput,
        },
        contextClassName.value,
        className,
        mergedClassNames.value.root,
        rootClass,
        cssVarCls.value,
        rootCls.value,
        hashId.value,
      )

      const checkboxClass = clsx(
        mergedClassNames.value.icon,
        { [`${prefixCls.value}-indeterminate`]: indeterminate },
        TARGET_CLS,
        hashId.value,
      )
      // ============================== Render ==============================
      return (
        <Wave component="Checkbox" disabled={mergedDisabled.value}>
          <label
            class={classString}
            style={[mergedStyles.value.root, contextStyle.value, style]}
            onMouseenter={e => emit('mouseenter', e)}
            onMouseleave={e => emit('mouseleave', e)}
            onClick={onLabelClick}
            {...restAttrs}
          >
            <VcCheckbox
              {...omit(checkboxProps, ['onChange'])}
              {
                ...{
                  'onChange': (e: any) => {
                    if (!checkboxProps.onChange) {
                      emit('change', e)
                    }
                    checkboxProps?.onChange?.(e)
                  },
                  'onUpdate:checked': (checked: boolean) => {
                    if (inGroup) {
                      // 在 Group 中使用时，保持原有行为
                      emit('update:checked', checked)
                    }
                    else {
                      // 单独使用时，返回自定义值
                      const newValue = checked ? mergedCheckedValue.value : mergedUnCheckedValue.value
                      currentValue.value = newValue
                      emit('update:checked', newValue)
                    }
                  },
                } as any
              }
              onClick={onInputClick}
              prefixCls={prefixCls.value}
              class={checkboxClass}
              style={mergedStyles.value.icon}
              disabled={mergedDisabled.value}
              onBlur={(e: any) => {
                formItemContext?.triggerBlur?.()
                emit('blur', e)
              }}
              ref={checkboxRef}
            />
            {isNonNullable(children) && (
              <span
                class={clsx(`${prefixCls.value}-label`, mergedClassNames.value?.label)}
                style={mergedStyles.value?.label}
              >
                {children}
              </span>
            )}
          </label>
        </Wave>
      )
    }
  },
  {
    name: 'ACheckbox',
    inheritAttrs: false,
  },
)

export default InternalCheckbox
