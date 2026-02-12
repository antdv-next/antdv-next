import type { ValueType, InputNumberProps as VcInputNumberProps, InputNumberRef as VcInputNumberRef } from '@v-c/input-number'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { InputStatus } from '../_util/statusUtils'
import type { VueNode } from '../_util/type'
import type { ComponentBaseProps, Variant } from '../config-provider/context'
import type { SizeType } from '../config-provider/SizeContext'
import { DownOutlined, MinusOutlined, PlusOutlined, UpOutlined } from '@antdv-next/icons'
import VcInputNumber from '@v-c/input-number'
import { clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef } from 'vue'
import { ContextIsolator } from '../_util/ContextIsolator.tsx'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { devUseWarning, isDev } from '../_util/warning'
import { useComponentBaseConfig } from '../config-provider/context'
import { useDisabledContext } from '../config-provider/DisabledContext.tsx'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { useSize } from '../config-provider/hooks/useSize'
import { useFormItemInputContext } from '../form/context.tsx'
import useVariant from '../form/hooks/useVariant'
import { SpaceAddon, SpaceCompact } from '../space'
import { useCompactItemContext } from '../space/Compact.tsx'
import useStyle from './style'

export type InputNumberSemanticName = keyof InputNumberSemanticClassNames
  & keyof InputNumberSemanticStyles

export interface InputNumberSemanticClassNames {
  root?: string
  prefix?: string
  suffix?: string
  input?: string
  actions?: string
  action?: string
}

export interface InputNumberSemanticStyles {
  root?: CSSProperties
  prefix?: CSSProperties
  suffix?: CSSProperties
  input?: CSSProperties
  actions?: CSSProperties
  action?: CSSProperties
}

export type InputNumberClassNamesType = SemanticClassNamesType<
  InputNumberProps,
  InputNumberSemanticClassNames
>

export type InputNumberStylesType = SemanticStylesType<
  InputNumberProps,
  InputNumberSemanticStyles
>

export interface InputNumberStepContext {
  offset: ValueType
  type: 'up' | 'down'
  emitter: 'handler' | 'keyboard' | 'wheel'
}

export interface InputNumberProps
  extends ComponentBaseProps,
  Omit<VcInputNumberProps, 'class' | 'controls' | 'className' | 'style' | 'prefixCls' | 'classNames' | 'styles' | 'prefix' | 'suffix' | 'onChange' | 'onClick' | 'onInput' | 'onBeforeInput' | 'onBlur' | 'onCompositionEnd' | 'onCompositionStart' | 'onKeyDown' | 'onKeyUp' | 'onMouseDown' | 'onMouseEnter' | 'onPressEnter' | 'onMouseUp' | 'onMouseMove' | 'onFocus'> {
  size?: SizeType
  status?: InputStatus
  disabled?: boolean
  addonBefore?: VueNode
  addonAfter?: VueNode
  prefix?: VueNode
  suffix?: VueNode
  /** @deprecated Use `variant="borderless"` instead. */
  bordered?: boolean
  /**
   * @since 5.13.0
   * @default "outlined"
   */
  variant?: Variant
  classes?: InputNumberClassNamesType
  styles?: InputNumberStylesType
  controls?: boolean | { upIcon?: VueNode, downIcon?: VueNode }
  type?: 'number' | 'text'
}

export interface InputNumberEmits {
  'change': (value: any) => void
  'update:value': (value: any) => void
  'input': (text: string) => void
  'pressEnter': (e: KeyboardEvent) => void
  'step': (value: any, info: InputNumberStepContext) => void
  'mousedown': (e: MouseEvent) => void
  'click': (e: MouseEvent) => void
  'mouseup': (e: MouseEvent) => void
  'mouseleave': (e: MouseEvent) => void
  'mousemove': (e: MouseEvent) => void
  'mouseenter': (e: MouseEvent) => void
  'mouseout': (e: MouseEvent) => void
  'focus': (e: FocusEvent) => void
  'blur': (e: FocusEvent) => void
  'keydown': (e: KeyboardEvent) => void
  'keyup': (e: KeyboardEvent) => void
  'compositionstart': (e: CompositionEvent) => void
  'compositionend': (e: CompositionEvent) => void
  'beforeinput': (e: InputEvent) => void
}

export interface InputNumberSlots {
  prefix?: () => any
  suffix?: () => any
  addonBefore?: () => any
  addonAfter?: () => any
  default?: () => any
}

const omitKeys: string[] = [
  'classes',
  'styles',
  'rootClass',
  'size',
  'status',
  'disabled',
  'addonBefore',
  'addonAfter',
  'bordered',
  'variant',
  'prefixCls',
  'prefix',
  'suffix',
  'controls',
  'onInput',
  'onPressEnter',
  'onStep',
  'onBeforeInput',
  'keyboard',
  'onClick',
  'onFocus',
  'onMouseDown',
  'onMouseUp',
  'onMouseLeave',
  'onMouseMove',
  'onMouseEnter',
  'onMouseOut',
  'value',
  'defaultValue',
  'onChange',
]

const InputNumber = defineComponent<
  InputNumberProps,
  InputNumberEmits,
  string,
  SlotsType<InputNumberSlots>
>(
  (props, { slots, attrs, emit, expose }) => {
    if (isDev) {
      const warning = devUseWarning('InputNumber')
      ;[
        ['bordered', 'variant'],
        ['addonAfter', 'Space.Compact'],
        ['addonBefore', 'Space.Compact'],
      ].forEach(([prop, replacement]) => {
        warning.deprecated(!(props as any)[prop!], prop!, replacement!)
      })
      warning(
        !(props.type === 'number' && props.changeOnWheel),
        'usage',
        'When `type="number"` is used with `changeOnWheel`, the wheel interaction may not work as expected. Remove `type="number"` if not required.',
      )
    }

    const {
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('inputNumber', props, [], 'input-number')

    const {
      classes,
      styles,
      rootClass,
      size: customSize,
      disabled: customDisabled,
      status: customStatus,
      bordered,
      variant: customVariant,
    } = toPropsRefs(
      props,
      'classes',
      'styles',
      'rootClass',
      'size',
      'disabled',
      'status',
      'bordered',
      'variant',
    )

    const inputNumberRef = shallowRef<VcInputNumberRef>()
    expose({
      focus: (...args: Parameters<NonNullable<VcInputNumberRef['focus']>>) => inputNumberRef.value?.focus?.(...args),
      blur: () => inputNumberRef.value?.blur?.(),
      input: computed(() => inputNumberRef.value?.input ?? null),
      nativeElement: computed(() => inputNumberRef.value?.nativeElement ?? null),
    })

    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction)
    const mergedSize = useSize<SizeType>(ctx => (customSize.value ?? compactSize.value ?? ctx) as SizeType)

    const disabledContext = useDisabledContext()
    const mergedDisabled = computed(() => customDisabled.value ?? disabledContext.value)

    const mergedControls = computed(() => {
      const raw = props.controls ?? true
      if (!raw || mergedDisabled.value || props.readOnly) {
        return false
      }
      return raw
    })
    const controlsProp = computed(() => (typeof mergedControls.value === 'boolean' ? mergedControls.value : undefined))

    const formItemInputContext = useFormItemInputContext()
    const mergedStatus = computed(() => {
      return getMergedStatus(formItemInputContext.value.status, customStatus.value)
    })
    const hasFeedback = computed(() => formItemInputContext.value.hasFeedback)
    const feedbackIcon = computed(() => formItemInputContext.value.feedbackIcon)

    const [mergedVariant, enableVariantCls] = useVariant('inputNumber', customVariant, bordered)

    const mergedProps = computed(() => {
      return {
        ...props,
        size: mergedSize.value,
        disabled: mergedDisabled.value,
        controls: mergedControls.value,
      } as InputNumberProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      InputNumberClassNamesType,
      InputNumberStylesType,
      InputNumberProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
    const restProps = omit(props, omitKeys)
    const hasLegacyAddon = computed(() => !!(props.addonBefore || props.addonAfter))
    const upIcon = computed(() => {
      let icon: VueNode = props.mode === 'spinner' ? <PlusOutlined /> : <UpOutlined />
      if (typeof mergedControls.value === 'object' && mergedControls.value?.upIcon) {
        icon = mergedControls.value.upIcon
      }
      return icon
    })
    const downIcon = computed(() => {
      let icon: VueNode = props.mode === 'spinner' ? <MinusOutlined /> : <DownOutlined />
      if (typeof mergedControls.value === 'object' && mergedControls.value?.downIcon) {
        icon = mergedControls.value.downIcon
      }
      return icon
    })

    const appliedRootClass = computed(() => (hasLegacyAddon.value ? undefined : rootClass.value))

    const classesValue = computed(() => {
      return clsx(
        contextClassName.value,
        className,
        appliedRootClass.value,
        cssVarCls.value,
        rootCls.value,
        hashId.value,
        compactItemClassnames.value,
        mergedClassNames.value.root,
        getStatusClassNames(prefixCls.value, mergedStatus.value, hasFeedback.value),
        {
          [`${prefixCls.value}-${mergedVariant.value}`]: enableVariantCls.value,
          [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
          [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-without-controls`]: !mergedControls.value,
          [`${prefixCls.value}-in-form-item`]: formItemInputContext.value.isFormItemInput,
        },
      )
    })

    const mergedStyle = computed(() => ({
      ...mergedStyles.value.root,
      ...contextStyle.value,
      ...style,
    }))

    const renderAddon = (node?: VueNode) => {
      if (!node) {
        return null
      }
      return (
        <SpaceAddon
          class={clsx(`${prefixCls.value}-addon`, cssVarCls.value, hashId.value)}
          variant={mergedVariant.value}
          disabled={mergedDisabled.value}
          status={mergedStatus.value}
        >
          <ContextIsolator form space>
            {node}
          </ContextIsolator>
        </SpaceAddon>
      )
    }

    const handleChange: InputNumberEmits['change'] = (value) => {
      emit('change', value as any)
    }
    const handleUpdateValue: InputNumberEmits['update:value'] = (value) => {
      emit('update:value', value as any)
    }
    const handleInput: InputNumberEmits['input'] = (text) => {
      emit('input', text)
    }
    const handlePressEnter: InputNumberEmits['pressEnter'] = e => emit('pressEnter', e)
    const handleStep: InputNumberEmits['step'] = (value, info) => emit('step', value as any, info as InputNumberStepContext)
    const handleMouseEvent = (eventName: keyof InputNumberEmits) => (e: MouseEvent) => emit(eventName as any, e)
    const handleKeyboardEvent = (eventName: keyof InputNumberEmits) => (e: KeyboardEvent) => emit(eventName as any, e)
    const handleFocusEvent = (eventName: keyof InputNumberEmits) => (e: FocusEvent) => emit(eventName as any, e)
    const handleCompositionEvent = (eventName: keyof InputNumberEmits) => (e: CompositionEvent) => emit(eventName as any, e)
    const handleBeforeInput: InputNumberEmits['beforeinput'] = e => emit('beforeinput', e)

    return () => {
      const { min, max, step } = props
      const prefixNode = getSlotPropsFnRun(slots, props, 'prefix')
      const suffixSlot = getSlotPropsFnRun(slots, props, 'suffix')
      const mergedSuffixFn = () => {
        if (hasFeedback.value) {
          return (
            <>
              {suffixSlot}
              {feedbackIcon.value}
            </>
          )
        }
        return suffixSlot
      }
      const mergedSuffix = mergedSuffixFn()
      const renderInputNode = () => (
        <VcInputNumber
          {...restAttrs}
          {...restProps}
          keyboard={props.keyboard}
          value={props.value}
          ref={inputNumberRef as any}
          prefixCls={prefixCls.value}
          className={classesValue.value}
          style={mergedStyle.value}
          classNames={mergedClassNames.value as any}
          styles={mergedStyles.value as any}
          disabled={mergedDisabled.value}
          controls={controlsProp.value}
          upHandler={upIcon.value}
          downHandler={downIcon.value}
          prefix={prefixNode}
          suffix={mergedSuffix}
          min={min}
          max={max}
          step={step}
          onChange={handleChange}
          {
            ...{
              'onUpdate:value': handleUpdateValue,
            }
          }
          onInput={handleInput}
          onPressEnter={handlePressEnter}
          onStep={handleStep as any}
          onMouseDown={handleMouseEvent('mousedown')}
          onClick={handleMouseEvent('click')}
          onMouseUp={handleMouseEvent('mouseup')}
          onMouseLeave={handleMouseEvent('mouseleave')}
          onMouseMove={handleMouseEvent('mousemove')}
          onMouseEnter={handleMouseEvent('mouseenter')}
          onMouseOut={handleMouseEvent('mouseout')}
          onFocus={handleFocusEvent('focus')}
          onBlur={handleFocusEvent('blur')}
          onKeyDown={handleKeyboardEvent('keydown')}
          onKeyUp={handleKeyboardEvent('keyup')}
          onCompositionStart={handleCompositionEvent('compositionstart')}
          onCompositionEnd={handleCompositionEvent('compositionend')}
          onBeforeInput={handleBeforeInput}
        />
      )

      const inputNode = renderInputNode()

      if (hasLegacyAddon.value) {
        return (
          <SpaceCompact rootClass={rootClass.value}>
            {renderAddon(getSlotPropsFnRun(slots, props, 'addonBefore'))}
            {inputNode}
            {renderAddon(getSlotPropsFnRun(slots, props, 'addonAfter'))}
          </SpaceCompact>
        ) as any
      }

      return inputNode as any
    }
  },
  {
    name: 'AInputNumber',
    inheritAttrs: false,
  },
)

;(InputNumber as any).install = (app: App) => {
  app.component(InputNumber.name, InputNumber)
  return app
}

export type {
  VcInputNumberRef as InputNumberRef,
  ValueType,
}
export default InputNumber
