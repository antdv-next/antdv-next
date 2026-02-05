import type { placements as Placements, TooltipProps as VcTooltipProps } from '@v-c/tooltip'
import type { ActionType, AlignType } from '@v-c/trigger'
import type { LiteralUnion } from '@v-c/util/dist/type'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { PresetColorType } from '../_util/colors.ts'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { AdjustOverflow } from '../_util/placements.ts'
import type { VueNode } from '../_util/type.ts'
import type { ComponentBaseProps } from '../config-provider/context.ts'
import VcTooltip from '@v-c/tooltip'
import { clsx } from '@v-c/util'
import { filterEmpty, removeUndefined } from '@v-c/util/dist/props-util'
import { getTransitionName } from '@v-c/util/dist/utils/transition'
import { computed, createVNode, defineComponent, isVNode, shallowRef, watchEffect } from 'vue'
import { ContextIsolator } from '../_util/ContextIsolator.tsx'
import { useMergeSemantic, useToArr, useToProps, useZIndex } from '../_util/hooks'
import getPlacements from '../_util/placements.ts'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools.ts'
import { ZIndexProvider } from '../_util/zindexContext.ts'
import { useComponentBaseConfig } from '../config-provider/context.ts'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls.ts'
import { useToken } from '../theme/internal.ts'
import useMergedArrow from './hooks/useMergedArrow.ts'
import PurePanel from './PurePanel'
import useStyle from './style'
import UniqueProvider from './UniqueProvider'
import { parseColor } from './util.ts'

export interface TooltipRef {
  /** @deprecated Please use `forceAlign` instead */
  forcePopupAlign: VoidFunction
  forceAlign: VoidFunction
  /** Wrapped dom element. Not promise valid if child not support ref */
  nativeElement: HTMLElement
  /** Popup dom element */
  popupElement: HTMLDivElement
}

export type TooltipPlacement
  = | 'top'
    | 'left'
    | 'right'
    | 'bottom'
    | 'topLeft'
    | 'topRight'
    | 'bottomLeft'
    | 'bottomRight'
    | 'leftTop'
    | 'leftBottom'
    | 'rightTop'
    | 'rightBottom'

// https://github.com/react-component/tooltip
// https://github.com/yiminghe/dom-align
export interface TooltipAlignConfig {
  points?: [string, string]
  offset?: [number | string, number | string]
  targetOffset?: [number | string, number | string]
  overflow?: { adjustX: boolean, adjustY: boolean }
  useCssRight?: boolean
  useCssBottom?: boolean
  useCssTransform?: boolean
}

export type TooltipSemanticName = keyof TooltipSemanticClassNames & keyof TooltipSemanticStyles

export interface TooltipSemanticClassNames {
  root?: string
  container?: string
  arrow?: string
}

export interface TooltipSemanticStyles {
  root?: CSSProperties
  container?: CSSProperties
  arrow?: CSSProperties
}

export type TooltipClassNamesType = SemanticClassNamesType<TooltipProps, TooltipSemanticClassNames>

export type TooltipStylesType = SemanticStylesType<TooltipProps, TooltipSemanticStyles>

export interface TriggerCommonApi extends ComponentBaseProps {
  align?: AlignType
  arrow?: boolean | { pointAtCenter?: boolean }
  autoAdjustOverflow?: boolean | AdjustOverflow
  color?: LiteralUnion<PresetColorType>
  open?: boolean
  defaultOpen?: boolean
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  destroyOnHidden?: boolean
  zIndex?: number
  placement?: TooltipPlacement
  trigger?: ActionType | ActionType[]
  fresh?: boolean
  mouseEnterDelay?: number
  mouseLeaveDelay?: number
  classes?: TooltipClassNamesType
  styles?: TooltipStylesType
  getTooltipContainer?: (node: HTMLElement) => HTMLElement
  motion?: VcTooltipProps['motion']
}

export interface TooltipProps extends TriggerCommonApi {
  afterOpenChange?: (open: boolean) => void
  builtinPlacements?: typeof Placements
  title?: VueNode
  overlay?: VueNode
  openClass?: string
  unique?: boolean
}

export interface TooltipEmits {
  'openChange': (open: boolean) => void
  'update:open': (open: boolean) => void
}

export interface TooltipSlots {
  title: () => any
  default: () => any
}

/**
 * @internal
 * Internal props type with hidden properties
 */
interface InternalTooltipProps extends TooltipProps {
  dataPopoverInject?: boolean
}

const defaults = {
  autoAdjustOverflow: true,
  placement: 'top',
  mouseEnterDelay: 0.1,
  mouseLeaveDelay: 0.1,
} as any
const InternalTooltip = defineComponent<
  InternalTooltipProps,
  TooltipEmits,
  string,
  SlotsType<TooltipSlots>
>(
  (props = defaults, { slots, attrs, expose, emit }) => {
    const [,token] = useToken()
    const {
      prefixCls,
      rootPrefixCls,
      direction,
      arrow: contextArrow,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      trigger: contextTrigger,
      getPopupContainer: getContextPopupContainer,
    } = useComponentBaseConfig('tooltip', props, ['arrow', 'trigger'])
    const {
      arrow: tooltipArrow,
      builtinPlacements,
      autoAdjustOverflow,
      classes,
      styles,
    } = toPropsRefs(props, 'arrow', 'builtinPlacements', 'autoAdjustOverflow', 'classes', 'styles')
    const mergedArrow = useMergedArrow(tooltipArrow, contextArrow)
    const mergedTrigger = computed(() => props?.trigger ?? contextTrigger.value ?? 'hover')
    const mergedShowArrow = computed(() => mergedArrow.value?.show)
    // ============================== Ref ===============================
    const tooltipRef = shallowRef()
    const forceAlign = () => {
      tooltipRef.value?.forceAlign?.()
    }

    expose({
      forceAlign,
      nativeElement: computed(() => tooltipRef.value?.nativeElement),
      popupElement: computed(() => tooltipRef.value?.popupElement),
    })

    // ============================== Open ==============================
    const open = shallowRef(props?.defaultOpen ?? false)
    watchEffect(() => {
      if (props.open !== undefined) {
        open.value = props.open
      }
    })
    let noTitle = false
    const onInternalOpenChange = (vis: boolean) => {
      if (props.open === undefined) {
        open.value = noTitle ? false : vis
      }
      if (!noTitle) {
        emit('openChange', vis)
        emit('update:open', vis)
      }
    }

    const tooltipPlacements = computed(() => {
      return (
        builtinPlacements.value
        || getPlacements({
          arrowPointAtCenter: mergedArrow?.value?.pointAtCenter ?? false,
          autoAdjustOverflow: autoAdjustOverflow.value,
          arrowWidth: mergedShowArrow ? token.value.sizePopupArrow : 0,
          borderRadius: token.value.borderRadius,
          offset: token.value.marginXXS,
          visibleFirst: true,
        })
      )
    })

    // =========== Merged Props for Semantic ===========
    const mergedProps = computed(() => {
      return {
        ...props,
        trigger: mergedTrigger.value,
      } as TooltipProps
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      TooltipClassNamesType,
      TooltipStylesType,
      TooltipProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))
    const injectFromPopover = props.dataPopoverInject

    // Style
    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls, !injectFromPopover)

    // ============================ zIndex ============================
    const [zIndex, contextZIndex] = useZIndex('Tooltip', computed(() => props.zIndex))
    return () => {
      const {
        color,
        rootClass,
        placement,
        mouseLeaveDelay,
        mouseEnterDelay,
        getPopupContainer,
        getTooltipContainer,
        afterOpenChange,
        motion,
        destroyOnHidden,
        openClass,
        ...restProps
      } = props
      const title = getSlotPropsFnRun(slots, props, 'title')
      const overlay = getSlotPropsFnRun(slots, props, 'overlay')
      noTitle = !title && !overlay && title !== 0 // overlay for old version compatibility
      const memoOverlay = title === 0 ? title : (overlay || title || '')
      const memoOverlayWrapper = (
        <ContextIsolator space form>{memoOverlay}</ContextIsolator>
      )
      const children = filterEmpty(slots.default?.())
      let child = children?.[0]
      child = isVNode(child) ? child : <span>{child}</span>
      const childProps = child?.props ?? {}
      const childCls = !childProps?.class || typeof childProps?.class === 'string' ? clsx(childProps.class, openClass || `${prefixCls.value}-open`) : childProps.class

      // Color
      const colorInfo = parseColor(rootPrefixCls.value, prefixCls.value, color)
      const arrowContentStyle = colorInfo.arrowStyle
      const themeCls = clsx(rootCls.value, hashId.value, cssVarCls.value)
      const rootClassNames = clsx(
        { [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
        colorInfo.className,
        rootClass,
        themeCls,
        contextClassName.value,
        mergedClassNames.value.root,
      )
      const containerStyle = {
        ...mergedStyles.value.container,
        ...colorInfo.overlayStyle,
      }

      let tempOpen = open.value
      // Hide tooltip when there is no title
      if (!(props.open !== undefined) && noTitle) {
        tempOpen = false
      }
      const content = (
        <VcTooltip
          unique
          {...removeUndefined(restProps)}
          {...attrs}
          trigger={mergedTrigger.value}
          zIndex={zIndex.value}
          showArrow={mergedShowArrow.value}
          placement={placement}
          mouseLeaveDelay={mouseLeaveDelay}
          mouseEnterDelay={mouseEnterDelay}
          prefixCls={prefixCls.value}
          classNames={{
            root: rootClassNames,
            container: mergedClassNames.value.container,
            arrow: mergedClassNames.value.arrow,
            uniqueContainer: clsx(themeCls, mergedClassNames.value.container),
          }}
          styles={{
            root: {
              ...arrowContentStyle,
              ...mergedStyles.value?.root,
              ...contextStyle.value,
            },
            container: containerStyle,
            uniqueContainer: containerStyle,
            arrow: mergedStyles.value.arrow,
          }}
          getTooltipContainer={getPopupContainer || getTooltipContainer || getContextPopupContainer}
          ref={tooltipRef}
          builtinPlacements={tooltipPlacements.value}
          overlay={memoOverlayWrapper}
          visible={tempOpen}
          onVisibleChange={onInternalOpenChange}
          afterVisibleChange={afterOpenChange}
          arrowContent={<span class={`${prefixCls.value}-arrow-content`} />}
          motion={
            {
              name: getTransitionName(
                rootPrefixCls.value,
                'zoom-big-fast',
                typeof motion?.name === 'string' ? motion?.name : undefined,
              ),
              duration: 1000,
            } as any
          }
          destroyOnHidden={destroyOnHidden}
        >
          {tempOpen ? createVNode(child, { class: childCls }) : child}
        </VcTooltip>
      )
      return <ZIndexProvider value={contextZIndex.value}>{content}</ZIndexProvider>
    }
  },
  {
    name: 'ATooltip',
    inheritAttrs: false,
  },
)

;(InternalTooltip as any).install = (app: App) => {
  app.component(InternalTooltip.name, InternalTooltip)
  app.component('AUniqueProvider', UniqueProvider)
}

;(InternalTooltip as any).UniqueProvider = UniqueProvider
;(InternalTooltip as any)._InternalPanelDoNotUseOrYouWillBeFired = PurePanel

export {
  UniqueProvider,
}

export default InternalTooltip as typeof InternalTooltip & {
  UniqueProvider: typeof UniqueProvider
  _InternalPanelDoNotUseOrYouWillBeFired: typeof PurePanel
}
