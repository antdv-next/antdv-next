import type { SelectProps as VcSelectProps } from '@v-c/select'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { SelectCommonPlacement } from '../_util/motion'
import type { InputStatus } from '../_util/statusUtils'
import type { VueNode } from '../_util/type'
import type { ComponentBaseProps, Variant } from '../config-provider/context'
import type { SizeType } from '../config-provider/SizeContext'
import VcSelect, { OptGroup, Option } from '@v-c/select'
import { clsx } from '@v-c/util'
import { getTransitionName } from '@v-c/util/dist/utils/transition'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef, watch } from 'vue'
import {
  getAttrStyleAndClass,
  useMergeSemantic,
  useToArr,
  useToProps,
  useZIndex,
} from '../_util/hooks'
import genPurePanel from '../_util/PurePanel.tsx'
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { devUseWarning, isDev } from '../_util/warning'
import { useComponentBaseConfig } from '../config-provider/context'
import { DefaultRenderEmpty } from '../config-provider/defaultRenderEmpty'
import { useDisabledContext } from '../config-provider/DisabledContext'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { useSize } from '../config-provider/hooks/useSize'
import { useFormItemInputContext } from '../form/context'
import { useVariants } from '../form/hooks/useVariant'
import { useCompactItemContext } from '../space/Compact'
import { useToken } from '../theme/internal'
import mergedBuiltinPlacements from './mergedBuiltinPlacements'
import useStyle from './style'
import useIcons from './useIcons'
import usePopupRender from './usePopupRender'
import useShowArrow from './useShowArrow'

type RawValue = string | number

export interface LabeledValue {
  key?: string
  value: RawValue
  label: VueNode
}

export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[] | undefined

export interface InternalSelectProps
  extends ComponentBaseProps, Omit<VcSelectProps, 'mode' | 'classNames' | 'className' | 'style' | 'prefix' | 'styles'> {
  prefix?: VueNode
  suffixIcon?: VueNode
  size?: SizeType
  disabled?: boolean
  mode?: 'multiple' | 'tags' | 'SECRET_COMBOBOX_MODE_DO_NOT_USE' | 'combobox'
  /** @deprecated Use `variant` instead. */
  bordered?: boolean
  /**
   * @deprecated `showArrow` is deprecated which will be removed in next major version. It will be a
   *   default behavior, you can hide it by setting `suffixIcon` to null.
   */
  showArrow?: boolean
  /**
   * @since 5.13.0
   * @default "outlined"
   */
  variant?: Variant
  styles?: SelectStylesType
  classes?: SelectClassNamesType
}

export interface SelectSemanticClassNames {
  root?: string
  prefix?: string
  suffix?: string
  input?: string
  placeholder?: string
  content?: string
  item?: string
  itemContent?: string
  itemRemove?: string
  clear?: string
}

export interface SelectSemanticStyles {
  root?: CSSProperties
  prefix?: CSSProperties
  suffix?: CSSProperties
  input?: CSSProperties
  placeholder?: CSSProperties
  content?: CSSProperties
  item?: CSSProperties
  itemContent?: CSSProperties
  itemRemove?: CSSProperties
  clear?: CSSProperties
}

export interface SelectPopupSemanticClassNames {
  root?: string
  listItem?: string
  list?: string
}

export interface SelectPopupSemanticStyles {
  root?: CSSProperties
  listItem?: CSSProperties
  list?: CSSProperties
}

export type SelectClassNamesType = SemanticClassNamesType<
  SelectProps,
  SelectSemanticClassNames,
  { popup?: SelectPopupSemanticClassNames }
>

export type SelectStylesType = SemanticStylesType<
  SelectProps,
  SelectSemanticStyles,
  { popup?: SelectPopupSemanticStyles }
>

type RcEventKeys
  = | 'onClear'
    | 'onKeyUp'
    | 'onKeyDown'
    | 'onBlur'
    | 'onClick'
    | 'onActive'
    | 'onChange'
    | 'onDeselect'
    | 'onInputKeyDown'
    | 'onMouseDown'
    | 'onMouseLeave'
    | 'onMouseEnter'
    | 'onFocus'
    | 'onPopupScroll'
    | 'onPopupVisibleChange'
    | 'onSelect'
    | 'optionRender'

export interface SelectProps
  extends Omit<InternalSelectProps, 'mode'
    | 'getInputElement'
    | 'getRawInputElement'
    | 'backfill'
    | 'placement'
    | 'dropdownClassName'
    | 'dropdownStyle'
    | 'classes'
    | 'styles'
    | RcEventKeys>
{
  placement?: SelectCommonPlacement
  mode?: 'multiple' | 'tags'
  status?: InputStatus
  /** @deprecated Please use `classNames.popup.root` instead */
  popupClassName?: string
  /** @deprecated Please use `classNames.popup.root` instead */
  dropdownClassName?: string
  /** @deprecated Please use `styles.popup` instead */
  dropdownStyle?: CSSProperties
  /** @deprecated Please use `popupRender` instead */
  dropdownRender?: SelectProps['popupRender']
  // /** @deprecated Please use `onOpenChange` instead */
  // onDropdownVisibleChange?: SelectProps['onPopupVisibleChange']
  /** @deprecated Please use `popupMatchSelectWidth` instead */
  dropdownMatchSelectWidth?: boolean | number
  popupMatchSelectWidth?: boolean | number
  styles?: SelectStylesType
  classes?: SelectClassNamesType
  optionRender?: (params: { option: OptionParams[0], info: OptionParams[1] }) => any
}

const omitKeys = [
  'onClear',
  'onKeyUp',
  'onKeyDown',
  'onBlur',
  'onClick',
  'onActive',
  'onChange',
  'onDeselect',
  'onInputKeyDown',
  'onMouseDown',
  'onMouseLeave',
  'onMouseEnter',
  'onFocus',
  'onPopupScroll',
  'onPopupVisibleChange',
  'onSelect',
  'popupRender',
  'labelRender',
  'optionRender',
  'maxTagPlaceholder',
  'notFoundContent',
]

export interface SelectEmits {
  'openChange': (open: boolean) => void
  'dropdownVisibleChange': (open: boolean) => void
  'clear': NonNullable<VcSelectProps['onClear']>
  'keydown': NonNullable<VcSelectProps['onKeyDown']>
  'keyup': NonNullable<VcSelectProps['onKeyUp']>
  'blur': NonNullable<VcSelectProps['onBlur']>
  'update:value': (value: SelectValue) => void
  'click': NonNullable<VcSelectProps['onClick']>
  'active': NonNullable<VcSelectProps['onActive']>
  'change': NonNullable<VcSelectProps['onChange']>
  'deselect': NonNullable<VcSelectProps['onDeselect']>
  'inputKeydown': NonNullable<VcSelectProps['onInputKeyDown']>
  'mousedown': NonNullable<VcSelectProps['onMouseDown']>
  'mouseleave': NonNullable<VcSelectProps['onMouseLeave']>
  'mouseenter': NonNullable<VcSelectProps['onMouseEnter']>
  'focus': NonNullable<VcSelectProps['onFocus']>
  'popupScroll': NonNullable<VcSelectProps['onPopupScroll']>
  'select': NonNullable<VcSelectProps['onSelect']>
}

type OptionParams = Parameters<NonNullable<VcSelectProps['optionRender']>>

export interface SelectSlots {
  suffixIcon?: () => any
  prefix?: () => any
  tagRender?: SelectProps['tagRender']
  labelRender?: SelectProps['labelRender']
  popupRender?: SelectProps['popupRender']
  optionRender?: (params: { option: OptionParams[0], info: OptionParams[1] }) => any
  maxTagPlaceholder?: (data: any[]) => any
  notFoundContent?: () => any
}

const SECRET_COMBOBOX_MODE_DO_NOT_USE = 'SECRET_COMBOBOX_MODE_DO_NOT_USE'

const defaults = {
  listHeight: 256,
} as any
const Select = defineComponent<
  SelectProps,
  SelectEmits,
  string,
  SlotsType<SelectSlots>
>(
  (props = defaults, { slots, emit, expose, attrs }) => {
    const {
      getTargetContainer: getContextPopupContainer,
      getPrefixCls,
      renderEmpty,
      direction: contextDirection,
      virtual,
      popupMatchSelectWidth: contextPopupMatchSelectWidth,
      popupOverflow,
      showSearch,
      style: contextStyle,
      styles: contextStyles,
      class: contextClassName,
      classes: contextClassNames,
      prefixCls,
    } = useComponentBaseConfig('select', props, ['showSearch'])
    const {
      listItemHeight: customListItemHeight,
      direction: propDirection,
      variant: customizeVariant,
      bordered,
      size: customizeSize,
      classes,
      styles,
    } = toPropsRefs(props, 'listItemHeight', 'direction', 'variant', 'bordered', 'size', 'classes', 'styles')
    const [,token] = useToken()

    const value = shallowRef(props.value ?? props?.defaultValue)
    watch(
      () => props.value,
      () => {
        value.value = props.value
      },
    )

    const listItemHeight = computed(() => customListItemHeight.value ?? token?.value?.controlHeight)
    const rootPrefixCls = computed(() => getPrefixCls())
    const direction = computed(() => propDirection.value ?? contextDirection.value)

    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction)

    const [variant, enableVariantCls] = useVariants('select', customizeVariant, bordered)
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)

    const mode = computed(() => {
      const { mode: m } = props as InternalSelectProps
      if (m === 'combobox') {
        return undefined
      }
      if (m === SECRET_COMBOBOX_MODE_DO_NOT_USE) {
        return 'combobox'
      }
      return m
    })

    const isMultiple = computed(() => mode.value === 'multiple' || mode.value === 'tags')

    const mergedOnOpenChange = (open: boolean) => {
      emit('openChange', open)
      emit('dropdownVisibleChange', open)
    }

    // ===================== Form Status =====================
    const formItemInputContext = useFormItemInputContext()

    const mergedSize = useSize(ctx => customizeSize.value ?? compactSize.value ?? ctx)

    // ===================== Disabled =====================
    const disabled = useDisabledContext()

    const mergedDisabled = computed(() => props.disabled ?? disabled.value)

    // ========== Merged Props for Semantic ==================
    const mergedProps = computed(() => {
      return {
        ...props,
        variant: variant.value,
        disabled: mergedDisabled.value,
        size: mergedSize.value,
      } as SelectProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      SelectClassNamesType,
      SelectStylesType,
      SelectProps
    >(
      useToArr(contextClassNames, classes),
      useToArr(contextStyles, styles),
      useToProps(mergedProps),
      computed(() => {
        return {
          popup: {
            _default: 'root',
          },
        }
      }),
    )

    // ===================== Placement =====================
    const memoPlacement = computed(() => {
      const { placement } = props
      if (placement !== undefined) {
        return placement
      }
      return direction.value === 'rtl' ? 'bottomRight' : 'bottomLeft'
    })

    // ====================== Warning ======================
    if (isDev) {
      const maxCount = props.maxCount
      const warning = devUseWarning('Select')
      const deprecatedProps = {
        dropdownMatchSelectWidth: 'popupMatchSelectWidth',
        dropdownStyle: 'styles.popup.root',
        dropdownClassName: 'classNames.popup.root',
        popupClassName: 'classNames.popup.root',
        dropdownRender: 'popupRender',
        onDropdownVisibleChange: 'onOpenChange',
        bordered: 'variant',
      }

      Object.entries(deprecatedProps).forEach(([oldProp, newProp]) => {
        warning.deprecated(!((props as any)[oldProp]), oldProp, newProp)
      })

      warning(
        !(props.showArrow),
        'deprecated',
        '`showArrow` is deprecated which will be removed in next major version. It will be a default behavior, you can hide it by setting `suffixIcon` to null.',
      )

      warning(
        !(typeof maxCount !== 'undefined' && !isMultiple.value),
        'usage',
        '`maxCount` only works with mode `multiple` or `tags`',
      )
    }

    const mergedPopupStyle = computed(() => {
      const { popupStyle, dropdownStyle } = props
      return {
        ...mergedStyles.value.popup?.root,
        ...(popupStyle ?? dropdownStyle),
      }
    })

    // ====================== zIndex =========================
    const [zIndex] = useZIndex('SelectLike', computed(() => (mergedStyles.value?.popup?.root?.zIndex as number) ?? (mergedPopupStyle.value?.zIndex as number)))

    expose({

    })
    return () => {
      const {
        popupMatchSelectWidth,
        dropdownMatchSelectWidth,
        showArrow,
        dropdownRender,
        status: customStatus,
        allowClear,
        popupClassName,
        dropdownClassName,
        rootClass,
        popupStyle,
        dropdownStyle,
        transitionName,
        builtinPlacements,
        listHeight,
        getPopupContainer,
        maxCount,
        ...rest
      } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const mergedSuffixIcon = getSlotPropsFnRun(slots, props, 'suffixIcon', false)
      const showSuffixIcon = useShowArrow(mergedSuffixIcon, showArrow)
      const tagRender = slots?.tagRender ?? props?.tagRender
      const mergedPopupMatchSelectWidth = popupMatchSelectWidth ?? dropdownMatchSelectWidth ?? contextPopupMatchSelectWidth.value
      const popupRender = slots?.popupRender ?? props?.popupRender
      const mergedPopupRender = usePopupRender(popupRender || dropdownRender)
      const notFoundContent = getSlotPropsFnRun(slots, props, 'notFoundContent', false)
      const {
        status: contextStatus,
        hasFeedback,
        isFormItemInput,
        feedbackIcon,
      } = formItemInputContext.value || {}
      const mergedStatus = getMergedStatus(contextStatus, customStatus)
      // ===================== Empty =====================
      let mergedNotFound: any
      if (notFoundContent !== undefined) {
        mergedNotFound = notFoundContent
      }
      else if (mode.value === 'combobox') {
        mergedNotFound = null
      }
      else {
        mergedNotFound = renderEmpty?.value?.('Select') || <DefaultRenderEmpty componentName="Select" />
      }

      // ===================== Icons =====================
      const { suffixIcon, itemIcon, removeIcon, clearIcon } = useIcons({
        ...rest,
        multiple: isMultiple.value,
        hasFeedback,
        feedbackIcon,
        showSuffixIcon,
        suffixIcon: mergedSuffixIcon,
        prefixCls: prefixCls.value,
        componentName: 'Select',
      } as any)

      const mergedAllowClear = allowClear === true ? { clearIcon } : allowClear

      const selectProps: Record<string, any> = omit(rest, ['suffixIcon', 'itemIcon', 'value', ...omitKeys])
      const mergedPopupClassName = clsx(
        mergedClassNames.value?.popup?.root,
        popupClassName,
        dropdownClassName,
        {
          [`${prefixCls.value}-dropdown-${direction.value}`]: direction.value === 'rtl',
        },
        rootClass,
        cssVarCls.value,
        rootCls.value,
        hashId.value,
      )

      const mergedClassName = clsx(
        {
          [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
          [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-${variant.value}`]: enableVariantCls.value,
          [`${prefixCls.value}-in-form-item`]: isFormItemInput,
        },
        getStatusClassNames(prefixCls.value, mergedStatus, hasFeedback),
        compactItemClassnames.value,
        contextClassName.value,
        className,
        mergedClassNames.value?.root,
        rootClass,
        cssVarCls.value,
        rootCls.value,
        hashId.value,
      )
      // ====================== Render =======================
      const prefix = getSlotPropsFnRun(slots, props, 'prefix')
      const onAttrs = {
        onSelect: (...args: any[]) => {
          emit('select', ...args)
        },
        onClear: (...args: any[]) => {
          emit('clear', ...args)
        },
        onKeyDown: (...args: any[]) => {
          emit('keydown', ...args)
        },
        onKeyUp: (...args: any[]) => {
          emit('keyup', ...args)
        },
        onBlur: (...args: any[]) => {
          emit('blur', ...args)
        },
        onFocus: (...args: any[]) => {
          emit('focus', ...args)
        },
        onClick: (...args: any[]) => {
          emit('click', ...args)
        },
        onActive: (...args: any[]) => {
          emit('active', ...args)
        },
        onChange: (...args: any[]) => {
          emit('update:value', args[0])
          emit('change', ...args)
        },
        onDeselect: (...args: any[]) => {
          emit('deselect', ...args)
        },
        onInputKeyDown: (...args: any[]) => {
          emit('inputKeydown', ...args)
        },
        onMouseDown: (...args: any[]) => {
          emit('mousedown', ...args)
        },
        onMouseLeave: (...args: any[]) => {
          emit('mouseleave', ...args)
        },
        onMouseEnter: (...args: any[]) => {
          emit('mouseenter', ...args)
        },
        onPopupScroll: (...args: any[]) => {
          emit('popupScroll', ...args)
        },
      }
      const labelRender = slots?.labelRender ?? props?.labelRender
      const optionRender = slots?.optionRender ?? props?.optionRender
      if (optionRender) {
        selectProps.optionRender = (option: OptionParams[0], info: OptionParams[1]) => {
          return optionRender({ option, info })
        }
      }
      if (mergedNotFound !== undefined) {
        selectProps.notFoundContent = mergedNotFound
      }
      return (
        <VcSelect
          {...restAttrs as any}
          {...onAttrs}
          virtual={virtual.value}
          classNames={mergedClassNames.value}
          styles={mergedStyles.value as any}
          showSearch={showSearch.value}
          {...selectProps}
          maxTagPlaceholder={slots.maxTagPlaceholder}
          labelRender={labelRender}
          style={{ ...mergedStyles.value.root, ...contextStyle.value, ...style }}
          popupMatchSelectWidth={mergedPopupMatchSelectWidth}
          transitionName={getTransitionName(rootPrefixCls.value, 'slide-up', transitionName)}
          builtinPlacements={mergedBuiltinPlacements(builtinPlacements, popupOverflow.value)}
          listHeight={listHeight!}
          listItemHeight={listItemHeight.value}
          mode={mode.value}
          prefixCls={prefixCls.value}
          placement={memoPlacement.value}
          direction={direction.value}
          prefix={prefix}
          value={value.value}
          suffixIcon={suffixIcon}
          menuItemSelectedIcon={itemIcon}
          removeIcon={removeIcon}
          allowClear={mergedAllowClear}
          notFoundContent={mergedNotFound}
          className={mergedClassName}
          getPopupContainer={getPopupContainer || getContextPopupContainer}
          popupClassName={mergedPopupClassName}
          disabled={mergedDisabled.value}
          popupStyle={{ ...mergedStyles.value?.popup?.root, ...mergedPopupStyle.value, zIndex: zIndex.value }}
          maxCount={isMultiple.value ? maxCount : undefined}
          tagRender={isMultiple.value ? tagRender : undefined}
          popupRender={mergedPopupRender}
          onPopupVisibleChange={mergedOnOpenChange}
        />
      )
    }
  },
  {
    name: 'ASelect',
    inheritAttrs: false,
  },
)

;(Select as any).install = (app: App) => {
  app.component(Select.name, Select)
  app.component('ASelectOption', Option as any)
  app.component('ASelectOptGroup', OptGroup as any)
}

;(Select as any).SECRET_COMBOBOX_MODE_DO_NOT_USE = SECRET_COMBOBOX_MODE_DO_NOT_USE
;(Select as any).Option = Option
;(Select as any).OptGroup = OptGroup
export default Select

// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(Select, 'popupAlign')
;(Select as any)._InternalPanelDoNotUseOrYouWillBeFired = PurePanel

export const SelectOption = Option
export const SelectOptGroup = OptGroup
