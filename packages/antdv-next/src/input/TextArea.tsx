import type { InputProps } from '@v-c/input'
import type { TextAreaProps as VcTextAreaProps } from '@v-c/textarea'
import type { CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { InputStatus } from '../_util/statusUtils'
import type { ComponentBaseProps, Variant } from '../config-provider/context'
import type { SizeType } from '../config-provider/SizeContext'
import VcTextArea from '@v-c/textarea'
import { clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, onBeforeUnmount, shallowRef } from 'vue'
import getAllowClear from '../_util/getAllowClear'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils'
import { toPropsRefs } from '../_util/tools'
import { devUseWarning, isDev } from '../_util/warning'
import { useComponentBaseConfig } from '../config-provider/context'
import { useDisabledContext } from '../config-provider/DisabledContext.tsx'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { useSize } from '../config-provider/hooks/useSize'
import { useFormItemInputContext } from '../form/context.tsx'
import useVariant from '../form/hooks/useVariant'
import { useCompactItemContext } from '../space/Compact.tsx'
import { useSharedStyle } from './style'
import useStyle from './style/textarea'

export type TextAreaSemanticName = keyof TextAreaSemanticClassNames & keyof TextAreaSemanticStyles

export interface TextAreaSemanticClassNames {
  root?: string
  textarea?: string
  count?: string
}

export interface TextAreaSemanticStyles {
  root?: CSSProperties
  textarea?: CSSProperties
  count?: CSSProperties
}

export type TextAreaClassNamesType = SemanticClassNamesType<
  TextAreaProps,
  TextAreaSemanticClassNames
>

export type TextAreaStylesType = SemanticStylesType<TextAreaProps, TextAreaSemanticStyles>

export interface TextAreaRef {
  resizableTextArea?: any
  focus: (...args: any[]) => void
  blur: () => void
  nativeElement: HTMLElement | null
}

export interface TextAreaProps
  extends ComponentBaseProps,
  Omit<
    VcTextAreaProps,
    | 'classNames'
    | 'styles'
    | 'onChange'
    | 'onFocus'
    | 'onBlur'
    | 'onCompositionStart'
    | 'onCompositionEnd'
    | 'onKeydown'
    | 'onPressEnter'
    | 'onResize'
    | 'maxLength'
    | 'readOnly'
    | 'minLength'
  > {
  /** @deprecated Use `variant` instead */
  bordered?: boolean
  size?: SizeType
  status?: InputStatus
  /** @since 5.13.0 */
  variant?: Variant
  classes?: TextAreaClassNamesType
  styles?: TextAreaStylesType
  rows?: number
  maxlength?: number
  minlength?: number
  readonly?: boolean
  showCount?: InputProps['showCount']
}

export interface TextAreaEmits {
  'pressEnter': NonNullable<VcTextAreaProps['onPressEnter']>
  'change': NonNullable<VcTextAreaProps['onChange']>
  'focus': (e: FocusEvent) => void
  'blur': (e: FocusEvent) => void
  'resize': NonNullable<VcTextAreaProps['onResize']>
  'keydown': (e: KeyboardEvent) => void
  'compositionstart': (e: CompositionEvent) => void
  'compositionend': (e: CompositionEvent) => void
  'mousedown': (e: MouseEvent) => void
  'update:value': (value?: string | number) => void
}

export interface TextAreaSlots {
  default?: () => any
}

const omitKeys: string[] = [
  'classes',
  'styles',
  'rootClass',
  'size',
  'status',
  'disabled',
  'bordered',
  'variant',
  'prefixCls',
  'allowClear',
  'onKeydown',
]

const InternalTextArea = defineComponent<
  TextAreaProps,
  TextAreaEmits,
  string,
  SlotsType<TextAreaSlots>
>(
  (props, { attrs, emit, expose }) => {
    if (isDev) {
      const warning = devUseWarning('TextArea')
      warning.deprecated(props.bordered === undefined, 'bordered', 'variant')
    }

    const {
      prefixCls,
      direction,
      allowClear: contextAllowClear,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('textArea', props, ['allowClear'], 'input')

    const {
      classes,
      styles,
      rootClass,
      size: customizeSize,
      disabled: customDisabled,
      status: customStatus,
      bordered,
      variant: customVariant,
    } = toPropsRefs(props, 'classes', 'styles', 'rootClass', 'size', 'disabled', 'status', 'bordered', 'variant')

    const textAreaRef = shallowRef()
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useSharedStyle(prefixCls, rootClass)
    useStyle(prefixCls, rootCls)

    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction)
    const mergedSize = useSize<SizeType>(ctx => (customizeSize.value ?? compactSize.value ?? ctx) as SizeType)

    const disabledContext = useDisabledContext()
    const mergedDisabled = computed(() => customDisabled.value ?? disabledContext.value)

    const mergedProps = computed(() => {
      return {
        ...props,
        size: mergedSize.value,
        disabled: mergedDisabled.value,
      } as TextAreaProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TextAreaClassNamesType,
      TextAreaStylesType,
      TextAreaProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
    )

    const formItemInputContext = useFormItemInputContext()
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.value.status, customStatus.value))
    const hasFeedback = computed(() => formItemInputContext.value.hasFeedback)
    const feedbackIcon = computed(() => formItemInputContext.value.feedbackIcon)

    const [mergedVariant, enableVariantCls] = useVariant('textArea', customVariant, bordered)

    const mergedAllowClear = computed(() => getAllowClear(props.allowClear ?? contextAllowClear.value))

    const isMouseDown = shallowRef(false)
    const resizeDirty = shallowRef(false)

    const handleMouseDown = (e: MouseEvent) => {
      isMouseDown.value = true
      emit('mousedown', e)
      const onMouseUp = () => {
        isMouseDown.value = false
        document.removeEventListener('mouseup', onMouseUp)
      }
      document.addEventListener('mouseup', onMouseUp)
    }

    onBeforeUnmount(() => {
      isMouseDown.value = false
    })

    const handleResize: NonNullable<VcTextAreaProps['onResize']> = (size) => {
      emit('resize', size)
      if (isMouseDown.value && typeof getComputedStyle === 'function') {
        const ele = textAreaRef.value?.resizableTextArea?.textArea
        if (ele && getComputedStyle(ele).resize === 'both') {
          resizeDirty.value = true
        }
      }
    }

    expose({
      resizableTextArea: computed(() => textAreaRef.value?.resizableTextArea),
      focus: () => textAreaRef.value?.focus?.(),
      blur: () => textAreaRef.value?.blur?.(),
      nativeElement: computed(() => textAreaRef.value?.nativeElement),
    })

    const handlePressEnter: TextAreaEmits['pressEnter'] = (e) => {
      emit('pressEnter', e)
    }

    const handleChange: TextAreaEmits['change'] = (e) => {
      const target = e?.target as HTMLTextAreaElement | undefined
      emit('update:value', target?.value)
      emit('change', e)
    }

    const handleFocus: TextAreaEmits['focus'] = e => emit('focus', e)
    const handleBlur: TextAreaEmits['blur'] = e => emit('blur', e)
    const handleKeyDown: TextAreaEmits['keydown'] = (e) => {
      emit('keydown', e)
    }
    const handleCompositionStart: TextAreaEmits['compositionstart'] = e => emit('compositionstart', e)
    const handleCompositionEnd: TextAreaEmits['compositionend'] = e => emit('compositionend', e)

    return () => {
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const restProps = omit(props, omitKeys)

      const textareaAttrs = {
        ...restAttrs,
        maxLength: props.maxlength,
        minLength: props.minlength,
        readOnly: props.readonly,
      }

      const classesValue = clsx(
        cssVarCls.value,
        rootCls.value,
        className,
        rootClass.value,
        compactItemClassnames.value,
        contextClassName.value,
        mergedClassNames.value.root,
        hashId.value,
        {
          [`${prefixCls.value}-textarea-affix-wrapper-resize-dirty`]: resizeDirty.value,
        },
      )

      const mergedStyle: any = {
        ...mergedStyles.value.root,
        ...contextStyle.value,
        ...style,
      }

      const classNames = {
        ...mergedClassNames.value,
        textarea: clsx(
          {
            [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
            [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
          },
          hashId.value,
          mergedClassNames.value.textarea,
          isMouseDown.value && `${prefixCls.value}-mouse-active`,
        ),
        variant: clsx(
          {
            [`${prefixCls.value}-${mergedVariant.value}`]: enableVariantCls.value,
          },
          getStatusClassNames(prefixCls.value, mergedStatus.value),
        ),
        affixWrapper: clsx(
          `${prefixCls.value}-textarea-affix-wrapper`,
          {
            [`${prefixCls.value}-affix-wrapper-rtl`]: direction.value === 'rtl',
            [`${prefixCls.value}-affix-wrapper-sm`]: mergedSize.value === 'small',
            [`${prefixCls.value}-affix-wrapper-lg`]: mergedSize.value === 'large',
            [`${prefixCls.value}-textarea-show-count`]: props.showCount || props.count?.show,
          },
          hashId.value,
        ),
      }
      return (
        <VcTextArea
          {...textareaAttrs}
          {...restProps}
          ref={textAreaRef as any}
          prefixCls={prefixCls.value}
          class={classesValue}
          style={mergedStyle}
          classNames={classNames as any}
          styles={mergedStyles.value as any}
          disabled={mergedDisabled.value}
          allowClear={mergedAllowClear.value}
          onPressEnter={handlePressEnter}
          onResize={handleResize}
          {
            ...{
              onMousedown: handleMouseDown,
              onKeydown: handleKeyDown,
              onFocus: handleFocus,
              onBlur: handleBlur,
              onCompositionstart: handleCompositionStart,
              onCompositionend: handleCompositionEnd,
            }
          }
          onChange={handleChange}
          suffix={hasFeedback.value ? <span class={`${prefixCls.value}-textarea-suffix`}>{feedbackIcon.value}</span> : undefined}
          showCount={props.showCount}
        />
      )
    }
  },
  {
    name: 'ATextarea',
    inheritAttrs: false,
  },
)

export default InternalTextArea
