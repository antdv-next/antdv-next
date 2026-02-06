import type { InputProps as VcInputProps, InputRef as VcInputRef } from '@v-c/input'
import type { CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { InputStatus } from '../_util/statusUtils'
import type { VueNode } from '../_util/type'
import type { ComponentBaseProps, Variant } from '../config-provider/context'
import type { SizeType } from '../config-provider/SizeContext'
import VcInput from '@v-c/input'
import { clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef } from 'vue'
import { ContextIsolator } from '../_util/ContextIsolator.tsx'
import getAllowClear from '../_util/getAllowClear'
import {
  getAttrStyleAndClass,
  useMergeSemantic,
  useToArr,
  useToProps,
} from '../_util/hooks'
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { devUseWarning, isDev } from '../_util/warning'
import { useComponentBaseConfig } from '../config-provider/context'
import { useDisabledContext } from '../config-provider/DisabledContext.tsx'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { useSize } from '../config-provider/hooks/useSize'
import { useFormItemInputContext } from '../form/context.tsx'
import useVariant from '../form/hooks/useVariant'
import { useCompactItemContext } from '../space/Compact.tsx'
import useRemovePasswordTimeout from './hooks/useRemovePasswordTimeout'
import useStyle, { useSharedStyle } from './style'

export type InputSemanticName = keyof InputSemanticClassNames & keyof InputSemanticStyles

export interface InputSemanticClassNames {
  root?: string
  prefix?: string
  suffix?: string
  input?: string
  count?: string
}

export interface InputSemanticStyles {
  root?: CSSProperties
  prefix?: CSSProperties
  suffix?: CSSProperties
  input?: CSSProperties
  count?: CSSProperties
}

export type InputClassNamesType = SemanticClassNamesType<InputProps, InputSemanticClassNames>

export type InputStylesType = SemanticStylesType<InputProps, InputSemanticStyles>

export type InputRef = VcInputRef

interface BaseVcInputProps {
  value?: any
  defaultValue?: any
  type?: VcInputProps['type']
  showCount?: VcInputProps['showCount']
  autoComplete?: string
  htmlSize?: number
  placeholder?: string
  count?: VcInputProps['count']
  maxlength?: number
  readonly?: boolean
  hidden?: boolean
  dataAttrs?: VcInputProps['dataAttrs']
  components?: VcInputProps['components']
  prefix?: VueNode
  suffix?: VueNode
  allowClear?: VcInputProps['allowClear']
  autoFocus?: boolean
  inputMode?: string
}

export interface InputProps extends ComponentBaseProps, BaseVcInputProps {
  size?: SizeType
  disabled?: boolean
  status?: InputStatus
  /** @deprecated Use `Space.Compact` instead. */
  addonBefore?: VueNode
  /** @deprecated Use `Space.Compact` instead. */
  addonAfter?: VueNode
  /** @deprecated Use `variant="borderless"` instead. */
  bordered?: boolean
  /** @since 5.13.0 */
  variant?: Variant
  classes?: InputClassNamesType
  styles?: InputStylesType
}

export interface InputEmits {
  'pressEnter': NonNullable<VcInputProps['onPressEnter']>
  'clear': () => void
  'change': NonNullable<VcInputProps['onChange']>
  'blur': NonNullable<VcInputProps['onBlur']>
  'focus': NonNullable<VcInputProps['onFocus']>
  'keydown': NonNullable<VcInputProps['onKeyDown']>
  'keyup': NonNullable<VcInputProps['onKeyUp']>
  'compositionstart': NonNullable<VcInputProps['onCompositionStart']>
  'compositionend': NonNullable<VcInputProps['onCompositionEnd']>
  'update:value': (value: VcInputProps['value']) => void
}

export interface InputSlots {
  prefix: () => any
  suffix: () => any
  addonBefore: () => any
  addonAfter: () => any
  default: () => any
  clearIcon: () => any
}

const omitKeys: (keyof InputProps)[] = [
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
  'allowClear',
  'autoComplete',
  'prefix',
  'suffix',
  'maxlength',
  'readonly',
]

const InternalInput = defineComponent<
  InputProps,
  InputEmits,
  string,
  SlotsType<InputSlots>
>(
  (props, { slots, expose, emit, attrs }) => {
    if (isDev) {
      const warning = devUseWarning('Input')
      ;[
        ['bordered', 'variant'],
        ['addonAfter', 'Space.Compact'],
        ['addonBefore', 'Space.Compact'],
      ].forEach(([prop, replacement]) => {
        // @ts-expect-error this is fine
        warning.deprecated(!props[prop], prop, replacement)
      })
    }

    const {
      prefixCls,
      direction,
      allowClear: contextAllowClear,
      autoComplete: contextAutoComplete,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('input', props, ['allowClear', 'autoComplete'])

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

    const inputRef = shallowRef<VcInputRef>()

    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useSharedStyle(prefixCls, rootClass)
    useStyle(prefixCls, rootCls)

    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction)

    const mergedSize = useSize<SizeType>(ctx => (customSize.value ?? compactSize.value ?? ctx) as SizeType)

    const disabledContext = useDisabledContext()
    const mergedDisabled = computed(() => customDisabled.value ?? disabledContext.value)

    const mergedProps = computed(() => {
      return {
        ...props,
        size: mergedSize.value,
        disabled: mergedDisabled.value,
      } as InputProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      InputClassNamesType,
      InputStylesType,
      InputProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    const formItemInputContext = useFormItemInputContext()
    const contextStatus = computed(() => formItemInputContext.value.status)
    const hasFeedback = computed(() => formItemInputContext.value.hasFeedback)
    const feedbackIcon = computed(() => formItemInputContext.value.feedbackIcon)
    const mergedStatus = computed(() => getMergedStatus(contextStatus.value, customStatus.value))

    const [mergedVariant, enableVariantCls] = useVariant('input', customVariant, bordered)

    const removePasswordTimeout = useRemovePasswordTimeout(inputRef, true)

    const mergedAllowClear = computed(() => {
      return getAllowClear(props.allowClear ?? contextAllowClear.value)
    })

    const mergedAutoComplete = computed(() => props.autoComplete ?? contextAutoComplete.value)

    expose({
      focus: (options?: Parameters<NonNullable<VcInputRef['focus']>>[0]) => inputRef.value?.focus?.(options),
      blur: () => inputRef.value?.blur?.(),
      setSelectionRange: (...args: Parameters<NonNullable<VcInputRef['setSelectionRange']>>) =>
        inputRef.value?.setSelectionRange?.(...args),
      select: () => inputRef.value?.select?.(),
      input: computed(() => inputRef.value?.input ?? null),
      nativeElement: computed(() => inputRef.value?.nativeElement ?? null),
    })

    const handlePressEnter: InputEmits['pressEnter'] = (e) => {
      emit('pressEnter', e)
    }

    const triggerChange = (e: any) => {
      const target = e?.target as HTMLInputElement | undefined
      emit('update:value', target?.value)
      emit('change', e)
    }

    const handleClear = () => {
      emit('clear')
    }

    const handleFocus: InputEmits['focus'] = (e) => {
      removePasswordTimeout()
      emit('focus', e)
    }

    const handleBlur: InputEmits['blur'] = (e) => {
      removePasswordTimeout()
      emit('blur', e)
    }

    const handleKeyDown: InputEmits['keydown'] = (e) => {
      emit('keydown', e)
    }

    const handleKeyUp: InputEmits['keyup'] = (e) => {
      emit('keyup', e)
    }

    const handleCompositionStart: InputEmits['compositionstart'] = (e) => {
      emit('compositionstart', e)
    }

    const handleCompositionEnd: InputEmits['compositionend'] = (e) => {
      emit('compositionend', e)
    }

    return () => {
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs, {
        omit: ['onCompositionStart', 'onCompositionEnd'],
      })

      const prefixNode = getSlotPropsFnRun(slots, props, 'prefix')
      const suffixSlotNode = getSlotPropsFnRun(slots, props, 'suffix')
      const addonBeforeNode = getSlotPropsFnRun(slots, props, 'addonBefore')
      const addonAfterNode = getSlotPropsFnRun(slots, props, 'addonAfter')

      const mergedSuffix = (hasFeedback.value || suffixSlotNode)
        ? (
            <>
              {suffixSlotNode}
              {hasFeedback.value ? feedbackIcon.value : null}
            </>
          )
        : undefined

      const wrapAddon = (node?: VueNode) => {
        if (!node) {
          return undefined
        }
        return (
          <ContextIsolator form space>
            {node}
          </ContextIsolator>
        )
      }

      const restProps = omit(props, omitKeys)

      const classesValue = clsx(
        contextClassName.value,
        className,
        rootClass.value,
        compactItemClassnames.value,
        cssVarCls.value,
        rootCls.value,
        mergedClassNames.value.root,
        hashId.value,
      )

      const mergedStyle: any = {
        ...mergedStyles.value.root,
        ...contextStyle.value,
        ...style,
      }

      const variantClassName = clsx(
        {
          [`${prefixCls.value}-${mergedVariant.value}`]: enableVariantCls.value,
        },
        getStatusClassNames(prefixCls.value, mergedStatus.value),
      )

      const classNames = {
        ...mergedClassNames.value,
        input: clsx(
          {
            [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
            [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
            [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          },
          mergedClassNames.value.input,
          hashId.value,
        ),
        affixWrapper: clsx(
          {
            [`${prefixCls.value}-affix-wrapper-sm`]: mergedSize.value === 'small',
            [`${prefixCls.value}-affix-wrapper-lg`]: mergedSize.value === 'large',
            [`${prefixCls.value}-affix-wrapper-rtl`]: direction.value === 'rtl',
          },
          hashId.value,
        ),
        wrapper: clsx(
          {
            [`${prefixCls.value}-group-rtl`]: direction.value === 'rtl',
          },
          hashId.value,
        ),
        groupWrapper: clsx(
          {
            [`${prefixCls.value}-group-wrapper-sm`]: mergedSize.value === 'small',
            [`${prefixCls.value}-group-wrapper-lg`]: mergedSize.value === 'large',
            [`${prefixCls.value}-group-wrapper-rtl`]: direction.value === 'rtl',
            [`${prefixCls.value}-group-wrapper-${mergedVariant.value}`]: enableVariantCls.value,
          },
          getStatusClassNames(`${prefixCls.value}-group-wrapper`, mergedStatus.value, hasFeedback.value),
          hashId.value,
        ),
        variant: variantClassName,
      }

      return (
        <VcInput
          {...restAttrs}
          {...restProps}
          maxLength={props.maxlength}
          readOnly={props.readonly}
          ref={inputRef as any}
          prefixCls={prefixCls.value}
          class={classesValue}
          style={mergedStyle}
          classNames={classNames as any}
          styles={mergedStyles.value as any}
          disabled={mergedDisabled.value}
          allowClear={mergedAllowClear.value}
          autoComplete={mergedAutoComplete.value}
          suffix={mergedSuffix}
          prefix={prefixNode}
          addonBefore={wrapAddon(addonBeforeNode)}
          addonAfter={wrapAddon(addonAfterNode)}
          onPressEnter={handlePressEnter}
          onClear={handleClear}
          onChange={(e) => {
            removePasswordTimeout()
            triggerChange(e)
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
          onCompositionStart={handleCompositionStart}
          onCompositionEnd={handleCompositionEnd}
          dataAttrs={props.dataAttrs}
          components={props.components}
          v-slots={{
            clearIcon: slots.clearIcon,
          }}
        />
      )
    }
  },
  {
    name: 'AInput',
    inheritAttrs: false,
  },
)

export default InternalInput
