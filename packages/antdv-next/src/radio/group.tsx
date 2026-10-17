import type { SlotsType } from 'vue'
import type {
  RadioChangeEvent,
  RadioGroupClassNamesType,
  RadioGroupEmits,
  RadioGroupProps,
  RadioGroupSlots,
  RadioGroupStylesType,
} from './interface'
import { clsx } from '@v-c/util'
import pickAttrs from '@v-c/util/dist/pickAttrs'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, defineComponent, ref, toRef, useId, watch } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useOrientation, useToArr, useToProps } from '../_util/hooks'
import { toPropsRefs } from '../_util/tools.ts'
import { checkRenderNode } from '../_util/vueNode.ts'
import { useComponentBaseConfig } from '../config-provider/context'
import { useDisabledContext } from '../config-provider/DisabledContext'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { useSize } from '../config-provider/hooks/useSize.ts'
import { useFormItemContext, useFormItemInputContext } from '../form/context'
import { toNamePathStr } from '../form/hooks/useForm'
import { useRadioGroupContextProvider } from './context.ts'
import Radio from './radio.tsx'
import useStyle from './style'

const defaults = {
  buttonStyle: 'outline',
  block: false,
} as any

export interface InternalRadioGroupProps extends RadioGroupProps,
  /* @vue-ignore */
  RadioGroupEmitsProps {}

export interface RadioGroupEmitsProps {
  onChange?: RadioGroupEmits['change']
  onMouseenter?: RadioGroupEmits['mouseenter']
  onMouseleave?: RadioGroupEmits['mouseleave']
  onFocus?: RadioGroupEmits['focus']
  onBlur?: RadioGroupEmits['blur']
}

const RadioGroup = defineComponent<
  InternalRadioGroupProps,
  RadioGroupEmits,
  string,
  SlotsType<RadioGroupSlots>
>(
  (props = defaults, { slots, attrs, emit }) => {
    const { prefixCls, direction } = useComponentBaseConfig('radio', props)
    const formItemInputContext = useFormItemInputContext()
    const defaultName = computed(() => toNamePathStr(formItemInputContext.value?.name ?? '') || useId())
    const name = computed(() => props?.name ?? defaultName.value)
    const { size: customizeSize, orientation, vertical } = toPropsRefs(props, 'size', 'orientation', 'vertical')
    const formItemContext = useFormItemContext(true)

    const value = ref(props?.value ?? props?.defaultValue)

    const onRadioChange = (e: RadioChangeEvent) => {
      const lastValue = value.value
      const val = e.target.value
      props?.['onUpdate:value']?.(val)
      if (val !== lastValue) {
        emit('change', e)
      }
      if (props.value === undefined) {
        value.value = val
      }
    }

    watch(
      () => props.value,
      () => {
        value.value = props.value
      },
    )
    const groupPrefixCls = computed(() => `${prefixCls.value}-group`)

    // Style
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    const mergedSize = useSize(customizeSize)
    const [mergedOrientation, mergedVertical] = useOrientation(orientation, vertical)

    // =========== Merged Props for Semantic ==========
    const contextDisabled = useDisabledContext()
    const mergedProps = computed(() => ({
      ...props,
      value: value.value,
      disabled: props.disabled ?? contextDisabled.value,
      size: mergedSize.value,
      buttonStyle: props.buttonStyle,
      block: props.block,
      name: name.value,
      optionType: props.optionType ?? 'default',
      orientation: mergedOrientation.value,
      vertical: mergedVertical.value,
    }) as RadioGroupProps)

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      RadioGroupClassNamesType,
      RadioGroupStylesType,
      RadioGroupProps
    >(
      useToArr(toRef(() => props.classes)),
      useToArr(toRef(() => props.styles)),
      useToProps(mergedProps),
    )

    const memoizedValue = computed(() => {
      return {
        onChange: onRadioChange,
        value: value.value,
        disabled: props?.disabled,
        name: name.value,
        optionType: props?.optionType,
        block: props?.block,
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
      }
    })
    useRadioGroupContextProvider(memoizedValue)

    return () => {
      const { buttonStyle, block, rootClass, id, options, disabled } = props
      const children = checkRenderNode(filterEmpty(slots?.default?.() ?? []))
      const { className, restAttrs, style } = getAttrStyleAndClass(attrs)

      const classString = clsx(
        groupPrefixCls.value,
        `${groupPrefixCls.value}-${buttonStyle}`,
        {
          [`${groupPrefixCls.value}-large`]: mergedSize.value === 'large',
          [`${groupPrefixCls.value}-small`]: mergedSize.value === 'small',
          [`${groupPrefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${groupPrefixCls.value}-block`]: block,
        },
        className,
        rootClass,
        mergedClassNames.value.root,
        hashId.value,
        cssVarCls.value,
        rootCls.value,
      )
      let childrenToRender: any = children

      const labelRender = slots?.labelRender ?? props?.labelRender
      // If exists options, render options
      if (options && options.length) {
        childrenToRender = options.map((option, index) => {
          if (typeof option === 'string' || typeof option === 'number') {
            const _label = labelRender ? labelRender({ item: { label: option, value: option }, index }) : option
            return (
              <Radio
                key={option.toString()}
                prefixCls={prefixCls.value}
                disabled={disabled}
                value={option}
                checked={value.value === option}
              >
                {_label}
              </Radio>
            )
          }
          const _label = labelRender ? labelRender({ item: option, index }) : option.label

          return (
            <Radio
              key={`radio-group-value-options-${option.value}`}
              prefixCls={prefixCls.value}
              disabled={option.disabled || disabled}
              value={option.value}
              checked={value.value === option.value}
              title={option.title}
              style={option.style}
              class={option.class}
              id={option.id}
              required={option.required}
              {
                ...{
                  onChange: option.onChange,
                }
              }
            >
              {_label}
            </Radio>
          )
        })
      }
      return (
        <div
          {...pickAttrs(restAttrs, { aria: true, data: true })}
          class={clsx(classString, {
            [`${prefixCls.value}-group-vertical`]: mergedVertical.value,
          })}
          style={[mergedStyles.value.root, style]}
          onMouseenter={(e) => {
            emit('mouseenter', e)
          }}
          onMouseleave={(e) => {
            emit('mouseleave', e)
          }}
          onFocus={(e) => {
            emit('focus', e)
          }}
          onBlur={(e) => {
            emit('blur', e)
            formItemContext?.triggerBlur?.()
          }}
          id={id}
        >
          {childrenToRender}
        </div>
      )
    }
  },
  {
    name: 'ARadioGroup',
    inheritAttrs: false,
  },
)

export default RadioGroup
