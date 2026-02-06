import type { DataNode, TreeSelectProps as VcTreeSelectProps } from '@v-c/tree-select'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { SelectCommonPlacement } from '../_util/motion'
import type { InputStatus } from '../_util/statusUtils'
import type { VueNode } from '../_util/type'
import type { Variant } from '../config-provider/context'
import type { SizeType } from '../config-provider/SizeContext'
import type { AntTreeNodeProps, TreeProps } from '../tree'
import type { SwitcherIcon } from '../tree/Tree'
import VcTreeSelect, { SHOW_ALL, SHOW_CHILD, SHOW_PARENT, TreeNode } from '@v-c/tree-select'
import { clsx } from '@v-c/util'
import { getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { getTransitionName } from '@v-c/util/dist/utils/transition'
import { omit } from 'es-toolkit'
import { computed, defineComponent, shallowRef } from 'vue'
import {
  useMergeSemantic,
  useToArr,
  useToProps,
  useZIndex,
} from '../_util/hooks'
import genPurePanel from '../_util/PurePanel.tsx'
import { getMergedStatus, getStatusClassNames } from '../_util/statusUtils'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { devUseWarning, isDev } from '../_util/warning'
import { useComponentBaseConfig, useConfig } from '../config-provider/context'
import { DefaultRenderEmpty } from '../config-provider/defaultRenderEmpty'
import { useDisabledContext } from '../config-provider/DisabledContext'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import { useSize } from '../config-provider/hooks/useSize'
import { useFormItemInputContext } from '../form/context'
import useVariant from '../form/hooks/useVariant'
import mergedBuiltinPlacements from '../select/mergedBuiltinPlacements.ts'
import useSelectStyle from '../select/style'
import useIcons from '../select/useIcons'
import usePopupRender from '../select/usePopupRender'
import useShowArrow from '../select/useShowArrow'
import { useCompactItemContext } from '../space/Compact'
import { useToken } from '../theme/internal'
import SwitcherIconCom from '../tree/utils/iconUtil'
import useStyle from './style'

type RawValue = string | number

export interface LabeledValue {
  key?: string
  value: RawValue
  label: VueNode
}

export type SelectValue = RawValue | RawValue[] | LabeledValue | LabeledValue[]

export type TreeSelectSemanticName = keyof TreeSelectSemanticClassNames
  & keyof TreeSelectSemanticStyles

export interface TreeSelectSemanticClassNames {
  root?: string
  prefix?: string
  input?: string
  suffix?: string
  content?: string
  placeholder?: string
  item?: string
  itemContent?: string
  itemRemove?: string
}

export interface TreeSelectSemanticStyles {
  root?: CSSProperties
  prefix?: CSSProperties
  input?: CSSProperties
  suffix?: CSSProperties
  content?: CSSProperties
  placeholder?: CSSProperties
  item?: CSSProperties
  itemContent?: CSSProperties
  itemRemove?: CSSProperties
}

export type TreeSelectPopupSemanticName = keyof TreeSelectPopupSemanticClassNames
  & keyof TreeSelectPopupSemanticStyles

export interface TreeSelectPopupSemanticClassNames {
  root?: string
  item?: string
  itemTitle?: string
}

export interface TreeSelectPopupSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  itemTitle?: CSSProperties
}

export type TreeSelectClassNamesType = SemanticClassNamesType<
  TreeSelectProps,
  TreeSelectSemanticClassNames
> & {
  popup?: TreeSelectPopupSemanticClassNames
}

export type TreeSelectStylesType = SemanticStylesType<TreeSelectProps, TreeSelectSemanticStyles> & {
  popup?: TreeSelectPopupSemanticStyles
}
interface BaseTreeSelectProps<ValueType = any, OptionType extends DataNode = DataNode>
  extends Omit<
    VcTreeSelectProps<ValueType, OptionType>,
    | 'showTreeIcon'
    | 'treeMotion'
    | 'mode'
    | 'getInputElement'
    | 'backfill'
    | 'treeLine'
    | 'switcherIcon'
    | 'classNames'
    | 'styles'
    | 'style'
    | 'onSelect'
    | 'onTreeExpand'
    | 'onTreeLoad'
    | 'onChange'
    | 'onDeselect'
    | 'onPopupScroll'
    | 'onPopupVisibleChange'
    | 'onSearch'
  > {
  size?: SizeType
  disabled?: boolean
  status?: InputStatus
  variant?: Variant
}

export interface TreeSelectProps<ValueType = any, OptionType extends DataNode = DataNode>
  extends BaseTreeSelectProps<ValueType, OptionType> {
  styles?: TreeSelectStylesType
  classes?: TreeSelectClassNamesType
  suffixIcon?: VueNode
  size?: SizeType
  disabled?: boolean
  placement?: SelectCommonPlacement

  /** @deprecated Please use `classNames.popup.root` instead */
  popupClassName?: string
  /** @deprecated Please use `classNames.popup.root` instead */
  dropdownClassName?: string
  /** @deprecated Please use `popupRender` instead */
  dropdownRender?: (menu: any) => any
  popupRender?: (menu: any) => any
  /** @deprecated Please use `styles.popup.root` instead */
  dropdownStyle?: CSSProperties
  // /** @deprecated Please use `onOpenChange` instead */
  // onDropdownVisibleChange?: (visible: boolean) => void;
  // onOpenChange?: (open: boolean) => void;

  /** @deprecated Use `variant` instead. */
  bordered?: boolean
  treeLine?: TreeProps['showLine']
  status?: InputStatus
  switcherIcon?: SwitcherIcon | VcTreeSelectProps<ValueType, OptionType>['switcherIcon']
  rootClass?: string
  /** @deprecated Please use `popupMatchSelectWidth` instead */
  dropdownMatchSelectWidth?: boolean | number
  popupMatchSelectWidth?: boolean | number
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
}

export interface TreeSelectEmits {
  'openChange': (open: boolean) => void
  'dropdownVisibleChange': (open: boolean) => void
  'select': NonNullable<VcTreeSelectProps['onSelect']>
  'treeExpand': NonNullable<VcTreeSelectProps['onTreeExpand']>
  'treeLoad': NonNullable<VcTreeSelectProps['onTreeLoad']>
  'change': NonNullable<VcTreeSelectProps['onChange']>
  'update:value': (value: any) => void
  'deselect': NonNullable<VcTreeSelectProps['onDeselect']>
  'popupScroll': NonNullable<VcTreeSelectProps['onPopupScroll']>
  'search': NonNullable<VcTreeSelectProps['onSearch']>
}

export interface TreeSelectSlots {
  suffixIcon?: () => any
  tagRender?: (props: any) => any
  notFoundContent?: () => any
  switcherIcon?: () => any
  treeTitleRender?: (nodeData: DataNode) => any
}
const defaults = {
  listHeight: 256,
  choiceTransitionName: '',
  treeIcon: false,
} as any

const omitKeys = [
  'prefixCls',
  'size',
  'disabled',
  'bordered',
  'style',
  'className',
  'rootClassName',
  'treeCheckable',
  'multiple',
  'listHeight',
  'listItemHeight',
  'placement',
  'notFoundContent',
  'switcherIcon',
  'treeLine',
  'getPopupContainer',
  'popupClassName',
  'dropdownClassName',
  'treeIcon',
  'transitionName',
  'choiceTransitionName',
  'status',
  'treeExpandAction',
  'builtinPlacements',
  'dropdownMatchSelectWidth',
  'popupMatchSelectWidth',
  'allowClear',
  'variant',
  'dropdownStyle',
  'dropdownRender',
  'popupRender',
  // 'onDropdownVisibleChange',
  // 'onOpenChange',
  'tagRender',
  'maxCount',
  'showCheckedStrategy',
  'treeCheckStrictly',
  'styles',
  'classes',
]

const InternalTreeSelect = defineComponent<
  TreeSelectProps,
  TreeSelectEmits,
  string,
  SlotsType<TreeSelectSlots>
>(
  (props = defaults, { slots, expose, emit, attrs }) => {
    const {
      prefixCls: treeSelectPrefixCls,
      getPopupContainer: getContextPopupContainer,
      direction,
      styles: contextStyles,
      classes: contextClassNames,
      switcherIcon,
      virtual,
      getPrefixCls,
      rootPrefixCls,
    } = useComponentBaseConfig('treeSelect', props, ['switcherIcon'], 'tree-select')
    const configCtx = useConfig()
    const {
      prefixCls: customizePrefixCls,
      variant: customVariant,
      size: customizeSize,
      disabled: customDisabled,
      status: customStatus,
      classes,
      styles,
    } = toPropsRefs(
      props,
      'prefixCls',
      'variant',
      'size',
      'disabled',
      'status',
      'classes',
      'styles',
    )
    const bordered = computed(() => props?.bordered ?? true)

    const [, token] = useToken()

    const listItemHeight = computed(() => props?.listItemHeight ?? token?.value?.controlHeightSM + token?.value?.paddingXXS)

    if (isDev) {
      const { treeCheckable, multiple } = props
      const warning = devUseWarning('TreeSelect')

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
        warning.deprecated(!((props as any)[oldProp] !== undefined), oldProp, newProp)
      })

      warning(
        multiple !== false || !treeCheckable,
        'usage',
        '`multiple` will always be `true` when `treeCheckable` is true',
      )

      warning(
        !(props.showArrow !== undefined),
        'deprecated',
        '`showArrow` is deprecated which will be removed in next major version. It will be a default behavior, you can hide it by setting `suffixIcon` to null.',
      )
    }

    const prefixCls = computed<string>(() => getPrefixCls('select', customizePrefixCls.value))
    const treePrefixCls = computed(() => getPrefixCls('select-tree', customizePrefixCls.value))
    const { compactSize, compactItemClassnames } = useCompactItemContext(prefixCls, direction)
    const rootCls = useCSSVarCls(prefixCls)
    const treeSelectRootCls = useCSSVarCls(treeSelectPrefixCls)

    const [hashId, cssVarCls] = useSelectStyle(prefixCls, rootCls)
    useStyle(treeSelectPrefixCls, treePrefixCls, treeSelectRootCls)

    const [variant, enableVariantCls] = useVariant('treeSelect', customVariant, bordered)
    // ===================== Size =====================
    const mergedSize = useSize(ctx => customizeSize.value ?? compactSize.value ?? ctx)

    // ===================== Disabled =====================
    const disabled = useDisabledContext()
    const mergedDisabled = computed(() => customDisabled.value ?? disabled.value)

    // ===================== Form =====================
    const formItemInputContext = useFormItemInputContext()

    const mergedStatus = computed(() => getMergedStatus(formItemInputContext.value.status, customStatus.value))

    // =========== Merged Props for Semantic ===========

    const mergedProps = computed(() => ({
      ...props,
      size: mergedSize.value,
      disabled: mergedDisabled.value,
      status: mergedStatus.value,
      variant: variant.value,
    } as TreeSelectProps))

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TreeSelectClassNamesType,
      TreeSelectStylesType,
      TreeSelectProps
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
    const mergedOnOpenChange = (open: boolean) => {
      emit('openChange', open)
      emit('dropdownVisibleChange', open)
    }

    const mergedMaxCount = computed(() => {
      const { maxCount, showCheckedStrategy, treeCheckStrictly } = props
      if (maxCount && ((showCheckedStrategy === 'SHOW_ALL' && !treeCheckStrictly) || showCheckedStrategy === 'SHOW_PARENT')) {
        return undefined
      }
      return maxCount
    })

    // ===================== Placement =====================
    const memoizedPlacement = computed(() => {
      const { placement } = props
      if (placement !== undefined) {
        return placement
      }
      return direction.value === 'rtl' ? 'bottomRight' : 'bottomLeft'
    })

    // ============================ zIndex ============================
    const [zIndex] = useZIndex('SelectLike', computed(() => mergedStyles.value?.root?.zIndex as number))
    const treeSelectRef = shallowRef()
    expose({
      focus: () => treeSelectRef.value?.focus(),
      blur: () => treeSelectRef.value?.blur(),
      scrollTo: (arg: any) => treeSelectRef.value?.scrollTo?.(arg),
    })
    return () => {
      const {
        popupClassName,
        dropdownClassName,
        rootClass,
        popupRender,
        dropdownRender,
        popupMatchSelectWidth,
        dropdownMatchSelectWidth,
        treeCheckable,
        multiple,
        allowClear,
        treeLine,
        listHeight,
        builtinPlacements,
        switcherIcon: customSwitcherIcon,
        treeIcon,
        getPopupContainer,
        choiceTransitionName,
        transitionName,
        treeExpandAction,
        showCheckedStrategy,
        treeCheckStrictly,
      } = props
      const restProps = omit(props, omitKeys)
      const treeTitleRender = slots?.treeTitleRender ?? props.treeTitleRender
      const mergedPopupClassName = clsx(
        popupClassName || dropdownClassName,
        `${treeSelectPrefixCls.value}-dropdown`,
        {
          [`${treeSelectPrefixCls.value}-dropdown-rtl`]: direction.value === 'rtl',
        },
        rootClass,
        mergedClassNames.value.root,
        mergedClassNames.value.popup?.root,
        cssVarCls.value,
        rootCls.value,
        treeSelectRootCls.value,
        hashId.value,
      )
      const { style, className, restAttrs } = getAttrStyleAndClass(attrs)
      const mergedPopupRender = usePopupRender(popupRender || dropdownRender)
      const customSuffixIcon = getSlotPropsFnRun(slots, props, 'suffixIcon', false)
      const showSuffixIcon = useShowArrow(customSuffixIcon, props.showArrow)
      const mergedPopupMatchSelectWidth = popupMatchSelectWidth ?? dropdownMatchSelectWidth ?? configCtx.value?.popupMatchSelectWidth
      const isMultiple = !!(treeCheckable || multiple)
      const {
        hasFeedback,
        feedbackIcon,
        isFormItemInput,
      } = formItemInputContext.value
      // ===================== Icons =====================
      const { suffixIcon, removeIcon, clearIcon } = useIcons({
        ...restProps,
        suffixIcon: customSuffixIcon,
        multiple: isMultiple,
        showSuffixIcon,
        hasFeedback,
        feedbackIcon,
        prefixCls: prefixCls.value,
        componentName: 'TreeSelect',
      } as any)

      const mergedAllowClear = allowClear === true ? { clearIcon } : allowClear
      const notFoundContent = getSlotPropsFnRun(slots, props, 'notFoundContent', false)

      // ===================== Empty =====================
      let mergedNotFound: any
      if (notFoundContent !== undefined) {
        mergedNotFound = notFoundContent
      }
      else {
        mergedNotFound = configCtx?.value?.renderEmpty?.('Select') || <DefaultRenderEmpty componentName="Select" />
      }

      // ==================== Render =====================
      const selectProps = omit(restProps, [
        'suffixIcon',
        'removeIcon',
        'clearIcon',
        'itemIcon',
        'switcherIcon',
        'classes',
        'styles',
      ])

      const mergedClassName = clsx(
        !customizePrefixCls.value && treeSelectPrefixCls.value,
        {
          [`${prefixCls.value}-lg`]: mergedSize.value === 'large',
          [`${prefixCls.value}-sm`]: mergedSize.value === 'small',
          [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          [`${prefixCls.value}-${variant.value}`]: enableVariantCls.value,
          [`${prefixCls.value}-in-form-item`]: isFormItemInput,
        },
        getStatusClassNames(prefixCls.value, mergedStatus.value, hasFeedback),
        compactItemClassnames.value,
        className,
        rootClass,
        mergedClassNames?.value?.root,
        cssVarCls.value,
        rootCls.value,
        treeSelectRootCls.value,
        hashId.value,
      )

      const mergedSwitcherIcon = slots?.switcherIcon ?? customSwitcherIcon ?? switcherIcon.value

      const renderSwitcherIcon = (nodeProps: AntTreeNodeProps) => (
        <SwitcherIconCom
          prefixCls={treePrefixCls.value}
          switcherIcon={mergedSwitcherIcon as SwitcherIcon}
          treeNodeProps={nodeProps}
          showLine={treeLine}
        />
      )
      const popupOverflow = configCtx.value?.popupOverflow

      const tagRender = slots?.tagRender ?? props?.tagRender

      const onAttrs: Partial<VcTreeSelectProps> = {
        onSelect(value, option) {
          emit('select', value, option)
        },
        onChange(value, labelList, extra) {
          emit('change', value, labelList, extra)
          emit('update:value', value)
        },
        onDeselect(value, option) {
          emit('deselect', value, option)
        },
        onTreeExpand(expandedKeys) {
          emit('treeExpand', expandedKeys)
        },
        onTreeLoad(loadedKeys) {
          emit('treeLoad', loadedKeys)
        },
        onPopupScroll(e) {
          emit('popupScroll', e)
        },
        onSearch(value) {
          emit('search', value)
        },
      }
      return (
        <VcTreeSelect
          {...restAttrs}
          {...onAttrs}
          ref={treeSelectRef}
          classNames={mergedClassNames.value}
          styles={mergedStyles.value}
          virtual={virtual.value}
          disabled={mergedDisabled.value}
          {...selectProps as any}
          popupMatchSelectWidth={mergedPopupMatchSelectWidth}
          builtinPlacements={mergedBuiltinPlacements(builtinPlacements, popupOverflow)}
          prefixCls={prefixCls.value}
          className={mergedClassName}
          style={{
            ...mergedStyles.value?.root,
            ...style,
          }}
          listHeight={listHeight}
          listItemHeight={listItemHeight.value}
          treeCheckable={
            treeCheckable ? <span class={`${prefixCls.value}-tree-checkbox-inner`} /> : treeCheckable
          }
          treeLine={!!treeLine}
          suffixIcon={suffixIcon}
          multiple={isMultiple}
          placement={memoizedPlacement.value}
          removeIcon={removeIcon}
          allowClear={mergedAllowClear}
          switcherIcon={renderSwitcherIcon}
          showTreeIcon={treeIcon}
          notFoundContent={mergedNotFound}
          getPopupContainer={getPopupContainer || getContextPopupContainer}
          treeMotion={null}
          popupClassName={mergedPopupClassName}
          popupStyle={{ ...mergedStyles.value.root, ...mergedStyles.value.popup?.root, zIndex: zIndex.value }}
          popupRender={mergedPopupRender}
          onPopupVisibleChange={mergedOnOpenChange}
          choiceTransitionName={getTransitionName(rootPrefixCls.value, '', choiceTransitionName)}
          transitionName={getTransitionName(rootPrefixCls.value, 'slide-up', transitionName)}
          treeExpandAction={treeExpandAction}
          tagRender={isMultiple ? tagRender : undefined}
          maxCount={mergedMaxCount.value}
          showCheckedStrategy={showCheckedStrategy}
          treeCheckStrictly={treeCheckStrictly}
          treeTitleRender={treeTitleRender}
        />
      )
    }
  },
  {
    name: 'ATreeSelect',
    inheritAttrs: false,
  },
)

const TreeSelect = InternalTreeSelect as typeof InternalTreeSelect & {
  install: (app: App) => void
  TreeNode: typeof TreeNode
  SHOW_ALL: typeof SHOW_ALL
  SHOW_PARENT: typeof SHOW_PARENT
  SHOW_CHILD: typeof SHOW_CHILD
  _InternalPanelDoNotUseOrYouWillBeFired: any
}

export const TreeSelectNode = TreeNode
TreeSelect.TreeNode = TreeNode
TreeSelect.SHOW_ALL = SHOW_ALL
TreeSelect.SHOW_PARENT = SHOW_PARENT
TreeSelect.SHOW_CHILD = SHOW_CHILD

TreeSelect.install = (app: App) => {
  app.component(TreeSelect.name, TreeSelect)
  app.component('ATreeSelectOption', TreeSelectNode)
  return app
}

// We don't care debug panel
/* istanbul ignore next */
const PurePanel = genPurePanel(TreeSelect, 'popupAlign', (props: any) => omit(props, ['visible']))

TreeSelect._InternalPanelDoNotUseOrYouWillBeFired = PurePanel

export default TreeSelect
