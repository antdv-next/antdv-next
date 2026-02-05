import type { MenuProps as VcMenuProps } from '@v-c/menu'
import type { AlignType } from '@v-c/trigger'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { AdjustOverflow } from '../_util/placements'
import type { ComponentBaseProps } from '../config-provider/context'
import type { MenuEmits, MenuProps, MenuSlots } from '../menu'
import { LeftOutlined, RightOutlined } from '@antdv-next/icons'
import VcDropdown from '@v-c/dropdown'
import { clsx } from '@v-c/util'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { computed, createVNode, defineComponent, isVNode, shallowRef, watch } from 'vue'
import { useMergeSemantic, useToArr, useToProps, useZIndex } from '../_util/hooks'
import getPlacements from '../_util/placements'
import genPurePanel from '../_util/PurePanel.tsx'
import { toPropsRefs } from '../_util/tools'
import { devUseWarning } from '../_util/warning'
import { ZIndexProvider } from '../_util/zindexContext'
import { useComponentBaseConfig } from '../config-provider/context'
import useCSSVarCls from '../config-provider/hooks/useCSSVarCls'
import Menu from '../menu'
import { OverrideProvider } from '../menu/OverrideContext.tsx'
import { useToken } from '../theme/internal'
import useStyle from './style'

const _Placements = [
  'topLeft',
  'topCenter',
  'topRight',
  'bottomLeft',
  'bottomCenter',
  'bottomRight',
  'top',
  'bottom',
] as const

type Placement = (typeof _Placements)[number]

type DropdownPlacement = Exclude<Placement, 'topCenter' | 'bottomCenter'>

export interface DropdownArrowOptions {
  pointAtCenter?: boolean
}

export type DropdownSemanticName = keyof DropdownSemanticClassNames & keyof DropdownSemanticStyles

export interface DropdownSemanticClassNames {
  root?: string
  item?: string
  itemTitle?: string
  itemIcon?: string
  itemContent?: string
}

export interface DropdownSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  itemTitle?: CSSProperties
  itemIcon?: CSSProperties
  itemContent?: CSSProperties
}

export type DropdownClassNamesType = SemanticClassNamesType<
  DropdownProps,
  DropdownSemanticClassNames
>

export type DropdownStylesType = SemanticStylesType<DropdownProps, DropdownSemanticStyles>

export interface DropdownProps extends ComponentBaseProps {
  classes?: DropdownClassNamesType
  styles?: DropdownStylesType
  menu?: MenuProps & { activeKey?: VcMenuProps['activeKey'], onClick?: MenuEmits['click'] }
  autoFocus?: boolean
  arrow?: boolean | DropdownArrowOptions
  trigger?: ('click' | 'hover' | 'contextmenu' | 'contextMenu')[]
  popupRender?: (Vnode: any) => any
  // onOpenChange?: (open: boolean, info: { source: 'trigger' | 'menu' }) => void;
  open?: boolean
  disabled?: boolean

  destroyOnHidden?: boolean
  align?: AlignType
  getPopupContainer?: (triggerNode: HTMLElement) => HTMLElement
  prefixCls?: string

  transitionName?: string
  placement?: Placement
  forceRender?: boolean
  mouseEnterDelay?: number
  mouseLeaveDelay?: number
  openClassName?: string
  // children?: ReactNode;
  autoAdjustOverflow?: boolean | AdjustOverflow
}

export interface DropdownEmits {
  'update:open': (open: boolean) => void
  'openChange': (open: boolean, info: { source: 'trigger' | 'menu' }) => void
  'menuClick': MenuEmits['click']
}

export interface DropdownSlots extends MenuSlots {
  popupRender: (info: { open: boolean, source: 'trigger' | 'menu' }) => any
}

const defaults = {
  mouseEnterDelay: 0.15,
  mouseLeaveDelay: 0.1,
  placement: '',
  autoAdjustOverflow: true,
} as any

const Dropdown = defineComponent<
  DropdownProps,
  DropdownEmits,
  string,
  SlotsType<DropdownSlots>
>(
  (props = defaults, { slots, emit, attrs }) => {
    const {
      getPrefixCls,
      prefixCls,
      direction,
      getPopupContainer: getContextPopupContainer,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
    } = useComponentBaseConfig('dropdown', props)
    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')

    const mergedProps = computed(() => {
      return props
    })

    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      DropdownClassNamesType,
      DropdownStylesType,
      DropdownProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    const memoPlacement = computed(() => {
      const { placement } = props
      if (!placement) {
        return direction.value === 'rtl' ? 'bottomRight' : 'bottomLeft'
      }
      if (placement.includes('Center')) {
        return placement.slice(0, placement.indexOf('Center')) as DropdownPlacement
      }
      return placement as DropdownPlacement
    })

    const rootCls = useCSSVarCls(prefixCls)
    const [hashId, cssVarCls] = useStyle(prefixCls, rootCls)
    const [,token] = useToken()

    // =================== Warning =====================
    const warning = devUseWarning('Dropdown')

    const triggerActions = computed(() => {
      if (props.disabled)
        return []
      // 兼容处理：将 contextMenu 转换为 contextmenu
      if (typeof props.trigger === 'string') {
        if (props.trigger === 'contextmenu') {
          return ['contextMenu']
        }
      }
      if (Array.isArray(props.trigger)) {
        return props.trigger?.map(t => (t === 'contextmenu' ? 'contextMenu' : t) as 'click' | 'hover' | 'contextMenu')
      }
      return props?.trigger
    })

    const alignPoint = computed(() => !!triggerActions.value?.includes?.('contextMenu'))

    // =========================== Open ============================
    const mergedOpen = shallowRef(props.open ?? false)
    watch(
      () => props.open,
      (value) => {
        if (value !== undefined) {
          mergedOpen.value = value
        }
      },
    )
    const onInnerOpenChange = (nextOpen: boolean) => {
      if (props.open === undefined) {
        mergedOpen.value = nextOpen
      }
      emit('openChange', nextOpen, { source: 'trigger' })
      emit('update:open', nextOpen)
    }

    const builtinPlacements = computed(() => getPlacements({
      arrowPointAtCenter: typeof props.arrow === 'object' && props.arrow?.pointAtCenter,
      autoAdjustOverflow: props.autoAdjustOverflow,
      offset: token.value?.marginXXS,
      arrowWidth: props?.arrow ? token?.value.sizePopupArrow : 0,
      borderRadius: token?.value.borderRadius,
    }))

    const onMenuClick = () => {
      const menu = props?.menu
      if (menu?.selectable && menu?.multiple) {
        return
      }
      if (props.open === undefined) {
        mergedOpen.value = false
      }
      emit('update:open', false)
      emit('openChange', false, { source: 'menu' })
    }
    const mergedRootStyles = computed(() => {
      return {
        ...contextStyle.value,
        ...mergedStyles.value.root,
      }
    })
    // =========================== zIndex ============================
    const [zIndex, contextZIndex] = useZIndex('Dropdown', computed(() => mergedRootStyles.value.zIndex as number))

    const memoTransitionName = computed(() => {
      const rootPrefixCls = getPrefixCls()
      if (props.transitionName !== undefined) {
        return props.transitionName
      }
      if (props?.placement?.includes('top')) {
        return `${rootPrefixCls}-slide-down`
      }
      return `${rootPrefixCls}-slide-up`
    })

    return () => {
      const children = filterEmpty(slots?.default?.())
      const child = children.length === 1 ? (isVNode(children[0]) ? children[0] : <span>{children}</span>) : <span>{children}</span>
      const {
        menu,
        popupRender,
        mouseEnterDelay,
        mouseLeaveDelay,
        arrow,
        getPopupContainer,
        rootClass,
        destroyOnHidden,
      } = props
      const mergedPopupRender = slots?.popupRender ?? popupRender

      const popupTrigger = createVNode(child, {
        class: clsx(
          `${prefixCls.value}-trigger`,
          {
            [`${prefixCls.value}-rtl`]: direction.value === 'rtl',
          },
        ),
        disabled: child?.props?.disabled ?? props?.disabled,
      })

      const renderOverlay = () => {
        // @v-c/dropdown already can process the function of overlay, but we have check logic here.
        // So we need render the element to check and pass back to @v-c/dropdown.
        const menuClassNames = omit(mergedClassNames.value, ['root'])
        const menuStyles = omit(mergedStyles.value, ['root'])
        let overlayNode: any
        if (menu?.items) {
          overlayNode = (
            <Menu
              {...menu}
              onClick={(...args) => {
                emit('menuClick', ...args)
              }}
              classes={{
                ...menuClassNames,
                subMenu: {
                  ...menuClassNames,
                },
              }}
              styles={{
                ...menuStyles,
                subMenu: {
                  ...menuStyles,
                },
              }}
              v-slots={omit(slots, ['default', 'popupRender'])}
            />
          )
        }
        if (mergedPopupRender) {
          overlayNode = mergedPopupRender(overlayNode)
        }
        const overlayFiltered = filterEmpty(Array.isArray(overlayNode) ? overlayNode : [overlayNode]).filter(Boolean)
        overlayNode = overlayFiltered.length === 1 ? (typeof overlayFiltered[0] === 'string' ? <span>{overlayFiltered}</span> : overlayFiltered) : overlayFiltered

        return (
          <OverrideProvider
            value={{
              prefixCls: `${prefixCls.value}-menu`,
              rootClass: clsx(cssVarCls.value, rootCls.value),
              expandIcon: (
                <span class={`${prefixCls.value}-menu-submenu-arrow`}>
                  {direction.value === 'rtl'
                    ? (
                        <LeftOutlined class={`${prefixCls.value}-menu-submenu-arrow-icon`}></LeftOutlined>)
                    : <RightOutlined class={`${prefixCls.value}-menu-submenu-arrow-icon`}></RightOutlined>}
                </span>
              ),
              mode: 'vertical',
              selectable: false,
              onClick: onMenuClick,
              validator({ mode }) {
              // Warning if use other mode
                warning(
                  !mode || mode === 'vertical',
                  'usage',
                  `mode="${mode}" is not supported for Dropdown's Menu.`,
                )
              },

            }}
          >
            {overlayNode}
          </OverrideProvider>
        )
      }

      // =========================== Overlay ============================
      const overlayClassNameCustomized = clsx(
        rootClass,
        hashId.value,
        cssVarCls.value,
        rootCls.value,
        contextClassName.value,
        mergedClassNames.value?.root,
        { [`${prefixCls.value}-rtl`]: direction.value === 'rtl' },
      )
      // ============================ Render ============================
      let renderNode = (
        <VcDropdown
          alignPoint={alignPoint.value}
          {...attrs}
          {...omit(props, ['rootClass']) as any}
          mouseEnterDelay={mouseEnterDelay}
          mouseLeaveDelay={mouseLeaveDelay}
          visible={mergedOpen.value}
          builtinPlacements={builtinPlacements.value}
          arrow={!!arrow}
          prefixCls={prefixCls.value}
          getPopupContainer={getPopupContainer || getContextPopupContainer}
          transitionName={memoTransitionName.value}
          trigger={triggerActions.value}
          overlay={renderOverlay}
          placement={memoPlacement.value}
          onVisibleChange={onInnerOpenChange}
          overlayStyle={{ ...mergedStyles.value?.root, zIndex: zIndex.value }}
          overlayClassName={overlayClassNameCustomized}
          autoDestroy={destroyOnHidden}
        >
          {popupTrigger}
        </VcDropdown>
      )
      if (zIndex.value) {
        renderNode = <ZIndexProvider value={contextZIndex.value}>{renderNode}</ZIndexProvider>
      }
      return renderNode
    }
  },
  {
    name: 'ADropdown',
    inheritAttrs: false,
  },
)

// We don't care debug panel
const PurePanel = genPurePanel(Dropdown, 'align', undefined, 'dropdown', prefixCls => prefixCls)

/* istanbul ignore next */
function WrapPurePanel(props: any) {
  return (
    <PurePanel {...props}>
      <span />
    </PurePanel>
  )
}
;(Dropdown as any)._InternalPanelDoNotUseOrYouWillBeFired = WrapPurePanel

;(Dropdown as any).install = (app: App) => {
  app.component(Dropdown.name, Dropdown)
}

export default Dropdown
