import type { DefaultOptionType, FieldNames, SearchConfig, CascaderProps as VcCascaderProps } from '@v-c/cascader'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { SelectCommonPlacement } from '../_util/motion'
import type { InputStatus } from '../_util/statusUtils'
import type { VueNode } from '../_util/type'
import type { Variant } from '../config-provider/context'
import type { SizeType } from '../config-provider/SizeContext'
import type { SelectPopupSemanticClassNames, SelectPopupSemanticStyles } from '../select'
import VcCascader, { SHOW_CHILD, SHOW_PARENT } from '@v-c/cascader'
import { clsx } from '@v-c/util'
import { getTransitionName } from '@v-c/util/dist/utils/transition'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef } from 'vue'
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
import mergedBuiltinPlacements from '../select/mergedBuiltinPlacements'
import useSelectStyle from '../select/style'
import useIcons from '../select/useIcons'
import usePopupRender from '../select/usePopupRender'
import useShowArrow from '../select/useShowArrow'
import { useCompactItemContext } from '../space/Compact'
import useBase from './hooks/useBase'
import useCheckable from './hooks/useCheckable'
import useColumnIcons from './hooks/useColumnIcons'
import CascaderPanel from './Panel'
import useStyle from './style'

export type FieldNamesType = FieldNames

export type FilledFieldNamesType = Required<FieldNamesType>

export type CascaderSemanticName = keyof CascaderSemanticClassNames & keyof CascaderSemanticStyles

export interface CascaderSemanticClassNames {
  root?: string
  prefix?: string
  suffix?: string
  input?: string
  placeholder?: string
  content?: string
  item?: string
  itemContent?: string
  itemRemove?: string
}

export interface CascaderSemanticStyles {
  root?: CSSProperties
  prefix?: CSSProperties
  suffix?: CSSProperties
  input?: CSSProperties
  placeholder?: CSSProperties
  content?: CSSProperties
  item?: CSSProperties
  itemContent?: CSSProperties
  itemRemove?: CSSProperties
}

function highlightKeyword(str: string, lowerKeyword: string, prefixCls?: string) {
  const cells = str
    .toLowerCase()
    .split(lowerKeyword)
    .reduce<string[]>(
      (list, cur, index) => (index === 0 ? [cur] : [...list, lowerKeyword, cur]),
      [],
    )
  const fillCells: any[] = []
  let start = 0

  cells.forEach((cell, index) => {
    const end = start + cell.length
    let originWorld: any = str.slice(start, end)
    start = end

    if (index % 2 === 1) {
      originWorld = (
        <span class={`${prefixCls}-menu-item-keyword`} key={`separator-${index}`}>
          {originWorld}
        </span>
      )
    }

    fillCells.push(originWorld)
  })

  return fillCells
}

const defaultSearchRender: SearchConfig['render'] = (inputValue, path, prefixCls, fieldNames) => {
  const optionList: any[] = []

  // We do lower here to save perf
  const lower = inputValue.toLowerCase()

  path.forEach((node, index) => {
    if (index !== 0) {
      optionList.push(' / ')
    }

    let label = node[fieldNames.label!]
    const type = typeof label
    if (type === 'string' || type === 'number') {
      label = highlightKeyword(String(label), lower, prefixCls)
    }

    optionList.push(label)
  })
  return optionList
}

export type CascaderClassNamesType = SemanticClassNamesType<
  CascaderProps,
  CascaderSemanticClassNames,
  { popup?: SelectPopupSemanticClassNames }
>

export type CascaderStylesType = SemanticStylesType<
  CascaderProps,
  CascaderSemanticStyles,
  { popup?: SelectPopupSemanticStyles }
>

export interface CascaderProps<
  OptionType extends DefaultOptionType = DefaultOptionType,
  ValueField extends keyof OptionType = keyof OptionType,
  Multiple extends boolean = boolean,
> extends Omit<
    VcCascaderProps<OptionType, ValueField, Multiple>,
    | 'checkable'
    | 'className'
    | 'style'
    | 'classNames'
    | 'styles'
    | 'onChange'
    | 'onSearch'
    | 'onPopupVisibleChange'
    | 'multiple'
    | 'value'
  > {
  value?: any
  multiple?: boolean
  size?: SizeType
  /**
   * @deprecated `showArrow` is deprecated which will be removed in next major version. It will be a
   *   default behavior, you can hide it by setting `suffixIcon` to null.
   */
  showArrow?: boolean
  disabled?: boolean
  /** @deprecated Use `variant` instead. */
  bordered?: boolean
  placement?: SelectCommonPlacement
  suffixIcon?: VueNode
  options?: OptionType[]
  status?: InputStatus

  rootClass?: string
  /** @deprecated Please use `classNames.popup.root` instead */
  popupClassName?: string
  /** @deprecated Please use `classNames.popup.root` instead */
  dropdownClassName?: string
  /** @deprecated Please use `styles.popup.root` instead */
  dropdownStyle?: CSSProperties
  /** @deprecated Please use `popupRender` instead */
  dropdownRender?: (menu: any) => any
  popupRender?: (menu: any) => any
  /** @deprecated Please use `popupMenuColumnStyle` instead */
  dropdownMenuColumnStyle?: CSSProperties
  popupMenuColumnStyle?: CSSProperties
  /**
   * @since 5.13.0
   * @default "outlined"
   */
  variant?: Variant
  classes?: CascaderClassNamesType
  styles?: CascaderStylesType
}

export interface CascaderSlots {
  suffixIcon?: () => any
  notFoundContent?: () => any
  popupRender?: (menu: any) => any
  displayRender?: (data: { labels: string[], selectedOptions?: DefaultOptionType[] }) => any
  optionRender?: (option: DefaultOptionType) => any
  expandIcon?: () => any
  default?: () => any
}

export interface CascaderEmits {
  'openChange': (visible: boolean) => void
  'dropdownVisibleChange': (visible: boolean) => void
  'popupVisibleChange': (visible: boolean) => void
  'change': NonNullable<VcCascaderProps['onChange']>
  'update:value': (value: any) => void
  'search': NonNullable<VcCascaderProps['onSearch']>
}

const InternalCascader = defineComponent<
  CascaderProps,
  CascaderEmits,
  string,
  SlotsType<CascaderSlots>
>(
  (props, { attrs, emit, slots, expose }) => {
    const {
      getPopupContainer: getContextPopupContainer,
      popupOverflow,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      getPrefixCls,
    } = useComponentBaseConfig('cascader', props)
    const {
      prefixCls: customizePrefixCls,
      direction: propDirection,
      variant: customizeVariant,
      bordered,
      size: customizeSize,
      disabled: customDisabled,
      status: customStatus,
      classes,
      styles,
    } = toPropsRefs(
      props,
      'prefixCls',
      'direction',
      'variant',
      'bordered',
      'size',
      'disabled',
      'status',
      'classes',
      'styles',
    )

    const { prefixCls, cascaderPrefixCls, direction: mergedDirection, renderEmpty } = useBase(
      customizePrefixCls,
      propDirection,
    )
    const isRtl = computed(() => mergedDirection.value === 'rtl')
    const rootPrefixCls = computed(() => getPrefixCls())

    const rootCls = useCSSVarCls(prefixCls)
    const cascaderRootCls = useCSSVarCls(cascaderPrefixCls)
    const [hashId, cssVarCls] = useSelectStyle(prefixCls, rootCls)
    useStyle(cascaderPrefixCls, cascaderRootCls)

    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, mergedDirection)
    const mergedBordered = computed(() => bordered.value ?? true)
    const [variant, enableVariantCls] = useVariants('cascader', customizeVariant, mergedBordered)

    const mergedSize = useSize(ctx => customizeSize.value ?? compactSize.value ?? ctx)

    const disabled = useDisabledContext()
    const mergedDisabled = computed(() => customDisabled.value ?? disabled.value)

    const formItemInputContext = useFormItemInputContext()
    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.value?.status, customStatus.value))

    const mergedProps = computed(() => {
      return {
        ...props,
        variant: variant.value,
        size: mergedSize.value,
        status: mergedStatus.value,
        disabled: mergedDisabled.value,
      } as CascaderProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      CascaderClassNamesType,
      CascaderStylesType,
      CascaderProps
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

    if (isDev) {
      const warning = devUseWarning('Cascader')
      const deprecatedProps = {
        dropdownClassName: 'classNames.popup.root',
        dropdownStyle: 'styles.popup.root',
        dropdownRender: 'popupRender',
        dropdownMenuColumnStyle: 'popupMenuColumnStyle',
        bordered: 'variant',
      }

      Object.entries(deprecatedProps).forEach(([oldProp, newProp]) => {
        warning.deprecated(!((props as any)[oldProp] !== undefined), oldProp, newProp)
      })

      warning(
        !(props.showArrow !== undefined),
        'deprecated',
        '`showArrow` is deprecated which will be removed in next major version. It will be a default behavior, you can hide it by setting `suffixIcon` to null.',
      )
    }

    const mergedPopupStyle = computed(() => {
      const { popupStyle, dropdownStyle } = props
      return {
        ...mergedStyles.value.popup?.root,
        ...(popupStyle ?? dropdownStyle),
      }
    })

    const [zIndex] = useZIndex(
      'SelectLike',
      computed(() => (mergedStyles.value?.popup?.root?.zIndex as number) ?? (mergedPopupStyle.value?.zIndex as number)),
    )

    const mergedShowSearch = computed(() => {
      if (!props.showSearch) {
        return props.showSearch
      }

      let searchConfig: SearchConfig = {
        render: defaultSearchRender,
        onSearch: (...args: Parameters<NonNullable<SearchConfig['onSearch']>>) => {
          emit('search', ...args)
        },
      }

      if (typeof props.showSearch === 'object') {
        const { onSearch } = props.showSearch
        searchConfig = {
          ...searchConfig,
          ...props.showSearch,
          onSearch: (...args: Parameters<NonNullable<SearchConfig['onSearch']>>) => {
            emit('search', ...args)
            onSearch?.(...args)
          },
        }
      }

      return searchConfig
    })

    const memoPlacement = computed<SelectCommonPlacement>(() => {
      if (props.placement !== undefined) {
        return props.placement
      }
      return isRtl.value ? 'bottomRight' : 'bottomLeft'
    })

    const onPopupVisibleChange = (open: boolean) => {
      emit('openChange', open)
      emit('dropdownVisibleChange', open)
      emit('popupVisibleChange', open)
    }

    const cascaderRef = shallowRef()
    expose({
      focus: () => cascaderRef.value?.focus?.(),
      blur: () => cascaderRef.value?.blur?.(),
    })

    return () => {
      const {
        popupClassName,
        dropdownClassName,
        rootClass,
        dropdownRender,
        popupRender,
        dropdownMenuColumnStyle,
        popupMenuColumnStyle,
        showArrow,
        allowClear,
        expandIcon,
        transitionName,
        choiceTransitionName,
        builtinPlacements,
        getPopupContainer,
        displayRender,
        optionRender,
        multiple,
        prefixCls: _prefixCls,
        direction: _direction,
        size: _size,
        disabled: _disabled,
        status: _status,
        bordered: _bordered,
        variant: _variant,
        classes: _classes,
        styles: _styles,
        ...rest
      } = props
      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)
      const mergedSuffixIcon = getSlotPropsFnRun(slots, props, 'suffixIcon', false)
      const showSuffixIcon = useShowArrow(mergedSuffixIcon, showArrow)
      const {
        hasFeedback,
        isFormItemInput,
        feedbackIcon,
      } = formItemInputContext.value || {}
      const { suffixIcon, removeIcon, clearIcon } = useIcons({
        ...rest,
        multiple,
        hasFeedback,
        feedbackIcon,
        showSuffixIcon,
        suffixIcon: mergedSuffixIcon,
        prefixCls: prefixCls.value,
        componentName: 'Cascader',
      } as any)

      const mergedAllowClear = (allowClear ?? true) === true ? { clearIcon } : allowClear

      const mergedPopupRender = usePopupRender((slots.popupRender ?? popupRender) || dropdownRender)
      const mergedPopupMenuColumnStyle = popupMenuColumnStyle ?? dropdownMenuColumnStyle

      const customExpandIcon = getSlotPropsFnRun(slots, props, 'expandIcon', false) ?? expandIcon
      const [mergedExpandIcon, loadingIcon] = useColumnIcons(isRtl.value, customExpandIcon)

      const checkable = useCheckable(cascaderPrefixCls.value, multiple)

      const slotNotFound = getSlotPropsFnRun(slots, props, 'notFoundContent', false)
      let mergedNotFoundContent = slotNotFound
      if (slotNotFound === undefined) {
        mergedNotFoundContent = renderEmpty.value?.('Cascader') || <DefaultRenderEmpty componentName="Cascader" />
      }

      const mergedDisplayRender = slots.displayRender
        ? (labels: string[], selectedOptions?: DefaultOptionType[]) => slots.displayRender?.({ labels, selectedOptions })
        : displayRender
      const mergedOptionRender = slots.optionRender
        ? (option: DefaultOptionType) => slots.optionRender?.(option)
        : optionRender

      const mergedPopupClassName = clsx(
        popupClassName || dropdownClassName,
        `${cascaderPrefixCls.value}-dropdown`,
        {
          [`${cascaderPrefixCls.value}-dropdown-rtl`]: isRtl.value,
        },
        rootClass,
        mergedClassNames.value?.popup?.root,
        cssVarCls.value,
        rootCls.value,
        cascaderRootCls.value,
        hashId.value,
      )

      const mergedClassName = clsx(
        !customizePrefixCls.value && cascaderPrefixCls.value,
        {
          [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
          [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
          [`${prefixCls.value}-rtl`]: isRtl.value,
          [`${prefixCls.value}-${variant.value}`]: enableVariantCls.value,
          [`${prefixCls.value}-in-form-item`]: isFormItemInput,
        },
        getStatusClassNames(prefixCls.value, mergedStatus.value, hasFeedback),
        compactItemClassnames.value,
        contextClassName.value,
        rootClass,
        mergedClassNames.value?.root,
        rootCls.value,
        cascaderRootCls.value,
        hashId.value,
        cssVarCls.value,
        className,
      )
      return (
        <VcCascader
          {...restAttrs as any}
          {...omit(rest, ['suffixIcon'])}
          ref={cascaderRef}
          classNames={mergedClassNames.value}
          styles={mergedStyles.value as any}
          prefixCls={prefixCls.value}
          popupPrefixCls={customizePrefixCls.value || cascaderPrefixCls.value}
          className={mergedClassName}
          style={{ ...mergedStyles.value.root, ...contextStyle.value, ...style }}
          popupClassName={mergedPopupClassName}
          popupStyle={{ ...mergedPopupStyle.value, zIndex: zIndex.value }}
          popupMenuColumnStyle={mergedPopupMenuColumnStyle}
          placement={memoPlacement.value}
          direction={mergedDirection.value}
          builtinPlacements={mergedBuiltinPlacements(builtinPlacements, popupOverflow.value)}
          allowClear={mergedAllowClear}
          showSearch={mergedShowSearch.value}
          notFoundContent={mergedNotFoundContent}
          expandIcon={mergedExpandIcon}
          loadingIcon={loadingIcon}
          checkable={checkable}
          suffixIcon={suffixIcon}
          removeIcon={removeIcon}
          getPopupContainer={getPopupContainer || getContextPopupContainer}
          popupRender={mergedPopupRender}
          transitionName={getTransitionName(rootPrefixCls.value, 'slide-up', transitionName)}
          choiceTransitionName={getTransitionName(rootPrefixCls.value, '', choiceTransitionName)}
          displayRender={mergedDisplayRender}
          optionRender={mergedOptionRender}
          disabled={mergedDisabled.value}
          onPopupVisibleChange={onPopupVisibleChange}
          onChange={(...args: any[]) => {
            emit('change', ...args)
            emit('update:value', args[0])
          }}
          v-slots={{
            default: slots?.default,
          }}
        />
      )
    }
  },
  {
    name: 'ACascader',
    inheritAttrs: false,
  },
)

const Cascader = InternalCascader as typeof InternalCascader & {
  install: (app: App) => void
  Panel: typeof CascaderPanel
  SHOW_PARENT: typeof SHOW_PARENT
  SHOW_CHILD: typeof SHOW_CHILD
  _InternalPanelDoNotUseOrYouWillBeFired: any
}

Cascader.Panel = CascaderPanel
Cascader.SHOW_PARENT = SHOW_PARENT
Cascader.SHOW_CHILD = SHOW_CHILD

Cascader.install = (app: App) => {
  app.component(Cascader.name, Cascader)
  app.component(CascaderPanel.name, CascaderPanel)
}

// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(Cascader, 'popupAlign', (props: any) => omit(props, ['visible']))
Cascader._InternalPanelDoNotUseOrYouWillBeFired = PurePanel

export { CascaderPanel, SHOW_CHILD, SHOW_PARENT }
export default Cascader
