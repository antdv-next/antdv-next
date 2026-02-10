import type { SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type {
  RadioChangeEvent,
  RadioEmits,
  RadioProps,
  RadioSemanticClassNames,
  RadioSemanticStyles,
  RadioSlots,
} from './interface'
import VcCheckbox from '@v-c/checkbox'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { toPropsRefs } from '../_util/tools'
import { checkRenderNode } from '../_util/vueNode.ts'
import { devUseWarning, isDev } from '../_util/warning'
import Wave from '../_util/wave'
import { TARGET_CLS } from '../_util/wave/interface.ts'
import useBubbleLock from '../checkbox/useBubbleLock.ts'
import { useComponentBaseConfig } from '../config-provider/context'
import { useDisabledContext } from '../config-provider/DisabledContext.tsx'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { useFormItemInputContext } from '../form/context.tsx'
import { useRadioGroupContext, useRadioOptionTypeContext } from './context'
import useStyle from './style'

const InternalRadio = defineComponent<
  RadioProps,
  RadioEmits,
  string,
  SlotsType<RadioSlots>
>(
  (props, { slots, expose, attrs, emit }) => {
    const groupContext = useRadioGroupContext()
    const radioOptionTypeContext = useRadioOptionTypeContext()
    const {
      prefixCls: radioPrefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('radio', props)
    const innerRef = shallowRef()
    const formItemInputContext = useFormItemInputContext()
    if (isDev) {
      const warning = devUseWarning('Radio')

      warning(!props.optionType, 'usage', '`optionType` is only support in RadioGroup.')
    }

    const onChange = (e: RadioChangeEvent) => {
      emit('change', e as any)
      groupContext?.value?.onChange?.(e)
    }

    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')

    const isButtonType = computed(() => (groupContext?.value?.optionType || radioOptionTypeContext?.value) === 'button')
    const prefixCls = computed(() => isButtonType.value ? `${radioPrefixCls.value}-button` : radioPrefixCls.value)

    // Style
    const rootCls = useCSSVarCls(radioPrefixCls)
    const [hashId, cssVarCls] = useStyle(radioPrefixCls, rootCls)

    // ===================== Disabled =====================
    const disabled = useDisabledContext()

    const radioProps = computed(() => {
      const _radioProps: any = {
        ...omit(props, ['prefixCls', 'classes', 'styles', 'title', 'rootClass']),
      }
      _radioProps.onChange = onChange
      if (groupContext?.value) {
        _radioProps.name = groupContext.value.name
        _radioProps.checked = props.value === groupContext.value.value
        _radioProps.disabled = _radioProps.disabled ?? groupContext.value.disabled
      }
      _radioProps.disabled = _radioProps.disabled ?? disabled.value

      return _radioProps
    })

    const mergedChecked = computed(() => {
      if (groupContext?.value) {
        return props.value === groupContext.value?.value
      }
      return radioProps.value.checked
    })
    // =========== Merged Props for Semantic ===========
    const mergedProps = computed(() => {
      return {
        ...props,
        ...radioProps.value,
        disabled: mergedChecked.value,
      }
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      SemanticClassNamesType<RadioProps, RadioSemanticClassNames>,
      SemanticStylesType<RadioProps, RadioSemanticStyles>,
      RadioProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    // ============================ Event Lock ============================
    const [onLabelClick, onInputClick] = useBubbleLock((e) => {
      emit('click', e as MouseEvent)
    })
    expose({
      blur: () => innerRef.value?.blur?.(),
      focus: () => innerRef.value?.focus?.(),
      input: computed(() => innerRef.value?.input),
    })
    return () => {
      const { rootClass, title } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const wrapperClassString = clsx(
        `${prefixCls.value}-wrapper`,
        {
          [`${prefixCls.value}-wrapper-checked`]: mergedChecked.value,
          [`${prefixCls.value}-wrapper-disabled`]: radioProps.value.disabled,
          [`${prefixCls.value}-wrapper-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-wrapper-in-form-item`]: formItemInputContext?.value?.isFormItemInput,
          [`${prefixCls.value}-wrapper-block`]: !!groupContext?.value?.block,
        },
        contextClassName.value,
        className,
        rootClass,
        mergedClassNames.value.root,
        hashId.value,
        cssVarCls.value,
        rootCls.value,
      )
      const children = checkRenderNode(filterEmpty(slots?.default?.() ?? []))
      // ============================== Render ==============================
      return (
        <Wave component="Radio" disabled={radioProps.value.disabled}>
          <label
            {...restAttrs}
            class={wrapperClassString}
            style={{ ...mergedStyles.value.root, ...contextStyle.value, ...style }}
            onMouseenter={(e) => {
              emit('mouseenter', e)
            }}
            onMouseleave={(e) => {
              emit('mouseleave', e)
            }}
            title={title}
            onClick={onLabelClick}
          >
            <VcCheckbox
              {...radioProps.value}
              class={clsx(mergedClassNames.value.icon, {
                [TARGET_CLS]: !isButtonType.value,
              })}
              checked={mergedChecked.value}
              style={mergedStyles.value.icon}
              type="radio"
              prefixCls={prefixCls.value}
              ref={innerRef}
              onClick={onInputClick}
              {
                ...{
                  'onUpdate:checked': (checked: boolean) => {
                    emit('update:checked', checked)
                  },
                }
              }
            />
            {children
              ? (
                  <span
                    class={clsx(`${prefixCls.value}-label`, mergedClassNames.value.label)}
                    style={mergedStyles.value.label}
                  >
                    {children}
                  </span>
                )
              : null}
          </label>
        </Wave>
      )
    }
  },
  {
    name: 'ARadio',
    inheritAttrs: false,
  },
)

export default InternalRadio
