import type { SwitchChangeEventHandler, SwitchClickEventHandler } from '@v-c/switch'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { VueNode } from '../_util/type'
import type { ComponentBaseProps } from '../config-provider/context'
import { LoadingOutlined } from '@antdv-next/icons'
import VcSwitch from '@v-c/switch'
import { clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef, watch } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { isValueEqual } from '../_util/isEqual'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import Wave from '../_util/wave'
import { useComponentBaseConfig } from '../config-provider/context'
import { useDisabledContext } from '../config-provider/DisabledContext.tsx'
import { useSize } from '../config-provider/hooks/useSize.ts'
import useStyle from './style'

export type SwitchSize = 'small' | 'default'

export type SwitchSemanticName = keyof SwitchSemanticClassNames & keyof SwitchSemanticStyles

export interface SwitchSemanticClassNames {
  root?: string
  content?: string
}

export interface SwitchSemanticStyles {
  root?: CSSProperties
  content?: CSSProperties
}

export type SwitchClassNamesType = SemanticClassNamesType<SwitchProps, SwitchSemanticClassNames>

export type SwitchStylesType = SemanticStylesType<SwitchProps, SwitchSemanticStyles>

export type CheckedValueType = string | number | boolean | object

export interface SwitchProps extends ComponentBaseProps {
  size?: SwitchSize
  checked?: CheckedValueType
  defaultChecked?: CheckedValueType
  /**
   * Alias for `checked`.
   * @since 5.12.0
   */
  value?: CheckedValueType
  /**
   * Alias for `defaultChecked`.
   * @since 5.12.0
   */
  defaultValue?: CheckedValueType
  /**
   * 选中时的值
   */
  checkedValue?: CheckedValueType
  /**
   * 非选中时的值
   */
  unCheckedValue?: CheckedValueType
  // 这两个给插槽
  checkedChildren?: VueNode
  unCheckedChildren?: VueNode
  disabled?: boolean
  loading?: boolean
  autoFocus?: boolean
  title?: string
  tabIndex?: number
  id?: string
  classes?: SwitchClassNamesType
  styles?: SwitchStylesType
}

export interface SwitchEmits {
  'change': SwitchChangeEventHandler
  'click': SwitchClickEventHandler
  'update:checked': (checked: CheckedValueType) => void
  'update:value': (checked: CheckedValueType) => void
}

export interface SwitchSlots {
  checkedChildren: () => any
  unCheckedChildren: () => any
}

const keys = [
  'prefixCls',
  'size',
  'disabled',
  'loading',
  'rootClass',
  'style',
  'checked',
  'value',
  'defaultChecked',
  'defaultValue',
  'checkedValue',
  'unCheckedValue',
  'styles',
  'classes',
  'checkedChildren',
  'unCheckedChildren',
]

const Switch = defineComponent<
  SwitchProps,
  SwitchEmits,
  string,
  SlotsType<SwitchSlots>
>(
  (props, { slots, emit, attrs }) => {
    // 获取选中和非选中的值，默认为 true/false
    const mergedCheckedValue = computed(() => props.checkedValue ?? true)
    const mergedUnCheckedValue = computed(() => props.unCheckedValue ?? false)

    // 获取当前值
    const currentValue = shallowRef<CheckedValueType>(
      props?.checked ?? props?.value ?? props?.defaultChecked ?? props?.defaultValue ?? mergedUnCheckedValue.value,
    )
    watch(
      [() => props.checked, () => props.value],
      ([newChecked, newValue]) => {
        if (newChecked !== undefined) {
          currentValue.value = newChecked
        }
        else if (newValue !== undefined) {
          currentValue.value = newValue
        }
      },
    )

    // 计算是否选中（用于传递给底层 VcSwitch）
    const isChecked = computed(() => isValueEqual(currentValue.value, mergedCheckedValue.value))

    const {
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('switch', props)
    const { classes, styles, size: customizeSize } = toPropsRefs(props, 'size', 'classes', 'styles')
    // ===================== Disabled =====================
    const disabled = useDisabledContext()
    const mergedDisabled = computed(() => (props.disabled ?? disabled.value) || props.loading)
    // const formItemContext = useFormItemContext()

    // Style
    const [hashId, cssVarCls] = useStyle(prefixCls)

    const mergedSize = useSize(customizeSize)

    const mergedProps = computed(() => {
      return {
        ...props,
        size: mergedSize.value,
        disabled: mergedDisabled.value,
      } as SwitchProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      SwitchClassNamesType,
      SwitchStylesType,
      SwitchProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    const changeHandler: SwitchChangeEventHandler = (...args) => {
      emit('change', ...args)
    }
    const handleVMHandler = (checked: boolean) => {
      // 根据 checked 状态返回对应的自定义值
      const newValue = checked ? mergedCheckedValue.value : mergedUnCheckedValue.value
      currentValue.value = newValue
      emit('update:checked', newValue)
      emit('update:value', newValue)
    }
    return () => {
      const {
        loading,
        rootClass,
      } = props
      const checkedChildren = getSlotPropsFnRun(slots, props, 'checkedChildren')
      const unCheckedChildren = getSlotPropsFnRun(slots, props, 'unCheckedChildren')
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const loadingIcon = (
        <div class={`${prefixCls.value}-handle`}>
          {loading && <LoadingOutlined class={`${prefixCls.value}-loading-icon`} />}
        </div>
      )

      const classes = clsx(
        contextClassName.value,
        {
          [`${prefixCls.value}-small`]: mergedSize.value === 'small',
          [`${prefixCls.value}-loading`]: loading,
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
        },
        className,
        rootClass,
        mergedClassNames.value.root,
        hashId.value,
        cssVarCls.value,
      )

      const mergedStyle: any = {
        ...mergedStyles.value.root,
        ...contextStyle.value,
        ...style,
      }

      const restProps = omit(props, keys)
      return (
        <Wave component="Switch" disabled={mergedDisabled.value}>
          <VcSwitch
            {...restAttrs}
            {...restProps as any}
            classNames={mergedClassNames.value}
            styles={mergedStyles.value}
            checked={isChecked.value}
            onChange={changeHandler}
            prefixCls={prefixCls.value}
            className={classes}
            style={mergedStyle}
            disabled={mergedDisabled.value}
            loadingIcon={loadingIcon}
            unCheckedChildren={unCheckedChildren}
            checkedChildren={checkedChildren}
            {
              ...{
                'onUpdate:checked': handleVMHandler,
              }
            }
          />
        </Wave>
      )
    }
  },
  {
    name: 'ASwitch',
    inheritAttrs: false,
  },
)

;(Switch as any).install = (app: App) => {
  app.component(Switch.name, Switch)
}

export default Switch
