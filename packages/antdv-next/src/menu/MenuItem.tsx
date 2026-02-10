import type { MenuItemType } from '@v-c/menu'
import type { SlotsType } from 'vue'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import type { TooltipProps } from '../tooltip'
import { Item } from '@v-c/menu'
import { clsx } from '@v-c/util'
import { filterEmpty, getAttrStyleAndClass } from '@v-c/util/dist/props-util'
import { omit } from 'es-toolkit'
import { createVNode, defineComponent, isVNode } from 'vue'
import { pureAttrs } from '../_util/hooks'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { useSiderCtx } from '../layout/Sider.tsx'
import Tooltip from '../tooltip'
import { useMenuContext } from './MenuContext.tsx'

export interface MenuItemProps extends Omit<MenuItemType, 'key'> {
  icon?: VueNode
  danger?: boolean
  title?: VueNode
  /** @private Internal filled key. Do not set it directly */
  eventKey?: string

  /** @private Do not use. Private warning empty usage */
  warnKey?: boolean

  /** @deprecated No place to use this. Should remove */
  attribute?: Record<string, string>

  onKeyDown?: (e: KeyboardEvent) => void
  onFocus?: (e: FocusEvent) => void
  role?: string
}

export interface MenuItemSlots {
  default: () => any
  icon: () => any
  title: () => any
  extra: () => any
}

const MenuItem = defineComponent<
  MenuItemProps,
  EmptyEmit,
  string,
  SlotsType<MenuItemSlots>
>(
  (props, { slots, attrs }) => {
    const menuContext = useMenuContext()
    const { siderCollapsed } = useSiderCtx()
    return () => {
      const extra = getSlotPropsFnRun(slots, props, 'extra')
      const icon = getSlotPropsFnRun(slots, props, 'icon')
      const title = getSlotPropsFnRun(slots, props, 'title', false)
      const { className, style } = getAttrStyleAndClass(attrs)
      const { danger } = props
      const { prefixCls, firstLevel, direction, disableMenuItemTitleTooltip, inlineCollapsed: isInlineCollapsed, styles, classes } = menuContext.value
      const children = filterEmpty(slots?.default?.())
      const renderItemChildren = (inlineCollapsed: boolean) => {
        const label = children?.[0]
        const wrapNode = (
          <span
            class={clsx(
              `${prefixCls}-title-content`,
              firstLevel ? classes?.itemContent : classes?.subMenu?.itemContent,
              {
                [`${prefixCls}-title-content-with-extra`]: !!extra || extra === 0,
              },
            )}
            style={firstLevel ? styles?.itemContent : styles?.subMenu?.itemContent}
          >
            {children}
          </span>
        )

        // inline-collapsed.md demo 依赖 span 来隐藏文字,有 icon 属性，则内部包裹一个 span
        // ref: https://github.com/ant-design/ant-design/pull/23456
        const _children = children?.[0]
        if (!icon || (isVNode(_children) && _children.type === 'span')) {
          if (_children && inlineCollapsed && firstLevel && typeof label === 'string') {
            return <div class={`${prefixCls}-inline-collapsed-noicon`}>{label.charAt(0)}</div>
          }
        }
        return wrapNode
      }
      let tooltipTitle = title
      if (typeof title === 'undefined') {
        tooltipTitle = firstLevel ? children : ''
      }
      else if (title === false) {
        tooltipTitle = ''
      }

      const tooltipProps: TooltipProps = { title: tooltipTitle }

      if (!siderCollapsed?.value && !isInlineCollapsed) {
        tooltipProps.title = null
        // Reset `open` to fix control mode tooltip display not correct
        // ref: https://github.com/ant-design/ant-design/issues/16742
        tooltipProps.open = false
      }
      const childrenLength = children.length
      let returnNode = (
        <Item
          {...pureAttrs(attrs) as any}
          {...omit(props, ['title', 'icon', 'danger'])}
          class={clsx(
            firstLevel ? classes?.item : classes?.subMenu?.item,
            {
              [`${prefixCls}-item-danger`]: !!danger,
              [`${prefixCls}-item-only-child`]: (icon ? childrenLength + 1 : childrenLength) === 1,
            },
            className,
          )}
          style={[firstLevel ? styles?.item : styles?.subMenu?.item, style] as any}
          title={typeof title === 'string' ? title : undefined}
        >
          {
            icon
              ? createVNode(icon, {
                  class: clsx(`${prefixCls}-item-icon`, firstLevel ? classes?.itemIcon : classes?.subMenu?.itemIcon),
                  style: firstLevel ? styles?.itemIcon : styles?.subMenu?.itemIcon,
                })
              : null
          }
          {renderItemChildren(isInlineCollapsed)}
        </Item>
      )
      if (!disableMenuItemTitleTooltip) {
        returnNode = (
          <Tooltip
            {...tooltipProps}
            placement={direction === 'rtl' ? 'left' : 'right'}
            classes={{
              root: `${prefixCls}-inline-collapsed-tooltip`,
            }}
          >
            {returnNode}
          </Tooltip>
        )
      }
      return returnNode
    }
  },
  {
    name: 'AMenuItem',
    inheritAttrs: false,
  },
)

export default MenuItem
