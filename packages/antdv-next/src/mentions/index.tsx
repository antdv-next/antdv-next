import type {
  DataDrivenOptionProps as VcMentionsOptionProps,
  MentionsProps as VcMentionsProps,
  MentionsRef as VcMentionsRef,
} from '@v-c/mentions'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { InputStatus } from '../_util/statusUtils'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps, Variant } from '../config-provider/context'
import type { SizeType } from '../config-provider/SizeContext'
import VcMentions, { Option } from '@v-c/mentions'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef } from 'vue'
import getAllowClear from '../_util/getAllowClear'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import genPurePanel from '../_util/PurePanel.tsx'
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils'
import toList from '../_util/toList'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { devUseWarning, isDev } from '../_util/warning'
import { useComponentBaseConfig } from '../config-provider/context'
import { DefaultRenderEmpty } from '../config-provider/defaultRenderEmpty'
import { useDisabledContext } from '../config-provider/DisabledContext'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { useSize } from '../config-provider/hooks/useSize'
import { useFormItemInputContext } from '../form/context'
import useVariant from '../form/hooks/useVariant'
import Spin from '../spin'
import useStyle from './style'

function loadingFilterOption() {
  return true
}

export {
  Option,
}

export type MentionPlacement = 'top' | 'bottom'

export interface OptionProps {
  value: string
  // children: ReactNode;
  content?: VueNode
  [key: string]: any
}

export type MentionSemanticName = keyof MentionSemanticClassNames & keyof MentionSemanticStyles

export interface MentionSemanticClassNames {
  root?: string
  textarea?: string
  popup?: string
  suffix?: string
}

export interface MentionSemanticStyles {
  root?: CSSProperties
  textarea?: CSSProperties
  popup?: CSSProperties
  suffix?: CSSProperties
}

export type MentionsClassNamesType = SemanticClassNamesType<
  MentionProps,
  MentionSemanticClassNames
>

export type MentionsStylesType = SemanticStylesType<MentionProps, MentionSemanticStyles>

export interface MentionsOptionProps extends VcMentionsOptionProps {
  content?: VueNode
}

export interface MentionProps extends
  Omit<VcMentionsProps, 'suffix' | 'classNames' | 'className' | 'styles' | 'onFocus' | 'onChange' | 'onBlur' | 'onSelect' | 'onPopupScroll' | 'onSearch'>,
  ComponentBaseProps {
  loading?: boolean
  status?: InputStatus
  options?: MentionsOptionProps[]
  popupClassName?: string
  /**
   * @since 5.13.0
   * @default "outlined"
   */
  variant?: Variant
  classes?: MentionsClassNamesType
  styles?: MentionsStylesType
  size?: SizeType
  labelRender?: (ctx: { option: MentionsOptionProps, index: number }) => any
  allowClear?: boolean | {
    clearIcon?: VueNode
  }
  disabled?: boolean
}

export interface MentionsEmits {
  'focus': (event: FocusEvent) => void
  'blur': (event: FocusEvent) => void
  'change': (value: string) => void
  'select': (option: MentionsOptionProps, prefix: string) => void
  'popupScroll': (event: Event) => void
  'search': (text: string, prefix: string) => void
  'update:value': (value: string) => void
}

export interface MentionsSlots {
  suffix?: () => any
  default?: () => any
  labelRender?: (ctx: { option: MentionsOptionProps, index: number }) => any
}

export interface MentionsProps extends MentionProps {}

export interface MentionsRef extends VcMentionsRef {}

interface MentionsConfig {
  prefix?: string | string[]
  split?: string
}

interface MentionsEntity {
  prefix: string
  value: string
}

const omitKeys: string[] = [
  'prefixCls',
  'classes',
  'styles',
  'rootClass',
  'size',
  'status',
  'loading',
  'labelRender',
  'contentRender',
  'variant',
  'allowClear',
  'filterOption',
  'popupClassName',
  'options',
  'notFoundContent',
]

const InternalMentions = defineComponent<
  MentionProps,
  MentionsEmits,
  string,
  SlotsType<MentionsSlots>
>(
  (props, { slots, emit, expose, attrs }) => {
    if (isDev) {
      const warning = devUseWarning('Mentions')
      warning.deprecated(!slots.default, 'Mentions.Option', 'options')
    }

    const {
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      renderEmpty,
      getPopupContainer,
    } = useComponentBaseConfig('mentions', props)

    const {
      classes,
      styles,
      rootClass,
      size: customSize,
      disabled: customDisabled,
      status: customStatus,
      variant: customVariant,
    } = toPropsRefs(props, 'classes', 'styles', 'rootClass', 'size', 'disabled', 'status', 'variant')

    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const mergedSize = useSize(customSize)

    const disabledContext = useDisabledContext()
    const mergedDisabled = computed(() => customDisabled.value ?? disabledContext.value)

    const formItemInputContext = useFormItemInputContext()
    const hasFeedback = computed(() => formItemInputContext.value.hasFeedback)
    const feedbackIcon = computed(() => formItemInputContext.value.feedbackIcon)
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.value.status, customStatus.value))

    const mergedProps = computed(() => {
      return {
        ...props,
        disabled: mergedDisabled.value,
        status: mergedStatus.value,
        loading: props.loading,
        options: props.options,
        variant: customVariant.value,
      } as MentionProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      MentionsClassNamesType,
      MentionsStylesType,
      MentionProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    const mergedAllowClear = computed(() => getAllowClear(props.allowClear))

    const [mergedVariant, enableVariantCls] = useVariant('mentions', customVariant)

    const focused = shallowRef(false)

    const setFocusState = (value: boolean) => {
      focused.value = value
    }

    const handleFocus = (event: FocusEvent) => {
      setFocusState(true)
      emit('focus', event)
    }

    const handleBlur = (event: FocusEvent) => {
      setFocusState(false)
      emit('blur', event)
    }

    const handleChange = (value: string) => {
      emit('update:value', value)
      emit('change', value)
    }

    const handleSelect = (option: VcMentionsOptionProps, prefix: string) => {
      emit('select', option as MentionsOptionProps, prefix)
    }

    const handleSearch = (text: string, prefix: string) => {
      emit('search', text, prefix)
    }

    const handlePopupScroll = (event: Event) => {
      emit('popupScroll', event)
    }

    const notFoundContent = computed(() => {
      if (props.notFoundContent !== undefined) {
        return props.notFoundContent
      }
      return renderEmpty?.value?.('Select') || <DefaultRenderEmpty componentName="Select" />
    })

    const mergedFilterOption = computed(() => (props.loading ? loadingFilterOption : props.filterOption))

    const resolveRenderNode = (key: 'labelRender', ctx: { option: MentionsOptionProps, index: number }) => {
      const node = getSlotPropsFnRun(slots, props, key, false, ctx)
      return node === undefined ? undefined : node
    }

    const mergedOptions = computed(() => {
      if (props.loading) {
        return [
          {
            value: 'ANTD_SEARCHING',
            disabled: true,
            label: <Spin size="small" />,
          },
        ]
      }
      if (!props.options) {
        return undefined
      }
      return props.options.map((option, index) => {
        const labelNode = resolveRenderNode('labelRender', { option, index })
        const mergedLabel = labelNode ?? option.label ?? option.value
        return {
          ...option,
          label: mergedLabel,
        }
      })
    })

    const mentionsRef = shallowRef<VcMentionsRef>()
    expose({
      focus: () => mentionsRef.value?.focus?.(),
      blur: () => mentionsRef.value?.blur?.(),
      textarea: computed(() => mentionsRef.value?.textarea || null),
      nativeElement: computed(() => mentionsRef.value?.nativeElement),
    })

    return () => {
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const mergedClassName = clsx(
        {
          [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
          [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
        },
        contextClassName.value,
        mergedClassNames.value.root,
        rootClass.value,
        cssVarCls.value,
        rootCls.value,
        hashId.value,
        className,
      )

      const rootStyle = {
        ...mergedStyles.value.root,
        ...contextStyle.value,
        ...style,
      }

      const suffixNodes = filterEmpty(slots.suffix?.() ?? []).filter(node => node != null)
      if (hasFeedback.value && feedbackIcon.value) {
        suffixNodes.push(feedbackIcon.value)
      }
      const mergedSuffix = suffixNodes.length ? suffixNodes : undefined

      const mentionOptions = props.loading
        ? (
            <Option value="ANTD_SEARCHING" disabled>
              <Spin size="small" />
            </Option>
          )
        : (props.options !== undefined
            ? null
            : filterEmpty(slots.default?.() ?? []).filter(Boolean))

      const mergedPopupClassName = clsx(
        mergedClassNames.value.popup,
        rootClass.value,
        hashId.value,
        cssVarCls.value,
        rootCls.value,
      )

      const classNames = {
        mentions: clsx(
          {
            [`${prefixCls.value}-disabled`]: mergedDisabled.value,
            [`${prefixCls.value}-focused`]: focused.value,
            [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          },
          hashId.value,
        ),
        textarea: clsx(mergedClassNames.value.textarea),
        popup: mergedPopupClassName,
        suffix: mergedClassNames.value.suffix,
        variant: clsx(
          {
            [`${prefixCls.value}-${mergedVariant.value}`]: enableVariantCls.value,
          },
          getStatusClassNames(prefixCls.value, mergedStatus.value),
        ),
        affixWrapper: hashId.value,
      }
      const mergedStylesValue = {
        textarea: mergedStyles.value.textarea,
        popup: mergedStyles.value.popup,
        suffix: mergedStyles.value.suffix,
      }

      const restProps = omit(props, omitKeys as any)
      return (
        <VcMentions
          ref={mentionsRef as any}
          {...restAttrs}
          {...restProps}
          prefixCls={prefixCls.value}
          className={mergedClassName}
          style={rootStyle}
          classNames={classNames as any}
          styles={mergedStylesValue as any}
          popupClassName={props.popupClassName}
          notFoundContent={notFoundContent.value}
          disabled={mergedDisabled.value}
          allowClear={mergedAllowClear.value}
          silent={props.loading}
          filterOption={mergedFilterOption.value as any}
          options={mergedOptions.value as any}
          suffix={mergedSuffix}
          direction={direction.value}
          getPopupContainer={props.getPopupContainer || getPopupContainer}
          onChange={handleChange}
          onSelect={handleSelect}
          onSearch={handleSearch}
          onPopupScroll={handlePopupScroll}
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {mentionOptions}
        </VcMentions>
      )
    }
  },
  {
    name: 'AMentions',
    inheritAttrs: false,
  },
)

const Mentions = InternalMentions as typeof InternalMentions & {
  Option: typeof Option
  getMentions: (value: string, config?: MentionsConfig) => MentionsEntity[]
  install: (app: App) => void
  _InternalPanelDoNotUseOrYouWillBeFired: any
}

Mentions.Option = Option

Mentions.install = (app: App): void => {
  app.component(Mentions.name, Mentions)
  app.component('AMentionsOption', Option)
}

Mentions.getMentions = (value = '', config: MentionsConfig = {}): MentionsEntity[] => {
  const { prefix = '@', split = ' ' } = config
  const prefixList: string[] = toList(prefix)

  return value
    .split(split)
    .map((str = ''): MentionsEntity | null => {
      let hitPrefix: string | null = null

      prefixList.some((prefixStr) => {
        const startStr = str.slice(0, prefixStr.length)
        if (startStr === prefixStr) {
          hitPrefix = prefixStr
          return true
        }
        return false
      })

      if (hitPrefix !== null) {
        return {
          prefix: hitPrefix,
          value: str.slice((hitPrefix as string).length),
        }
      }
      return null
    })
    .filter((entity): entity is MentionsEntity => !!entity && !!entity.value)
}

// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(Mentions, undefined, undefined, 'mentions')
;(Mentions as any)._InternalPanelDoNotUseOrYouWillBeFired = PurePanel

export default Mentions
