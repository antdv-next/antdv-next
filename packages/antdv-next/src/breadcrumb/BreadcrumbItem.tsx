import type { Key } from '@v-c/util/dist/type'
import type { CSSProperties } from 'vue'
import type { VueNode } from '../_util/type'
import type { DropdownProps } from '../dropdown'
import type { ItemType } from './Breadcrumb'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { defineComponent } from 'vue'
import isNonNullable from '../_util/isNonNullable'
import { getSlotPropsFnRun } from '../_util/tools'
import { checkRenderNode } from '../_util/vueNode'
import { useBaseConfig } from '../config-provider/context'
import Dropdown from '../dropdown'
import { useBreadcrumbContext } from './BreadcrumbContext'
import BreadcrumbSeparator from './BreadcrumbSeparator'
import { renderItem } from './useItemRender'

export interface SeparatorType {
  separator?: any
  key?: Key
}

type MenuType = NonNullable<DropdownProps['menu']>
export interface MenuItem {
  key?: Key
  title?: VueNode
  label?: VueNode
  path?: string
  href?: string
}

export interface BreadcrumbItemProps extends SeparatorType {
  prefixCls?: string
  href?: string
  menu?: Omit<MenuType, 'items'> & {
    items?: MenuItem[]
  }
  dropdownProps?: DropdownProps
  dropdownIcon?: VueNode
  onClick?: (event: MouseEvent) => void
  class?: string
  style?: CSSProperties
  // children?: VueNode
}

export const InternalBreadcrumbItem = defineComponent<
  Omit<BreadcrumbItemProps, 'key'>
>(
  (props, { slots }) => {
    const breadcrumbContext = useBreadcrumbContext()

    /** If overlay is have Wrap a Dropdown */
    const renderBreadcrumbNode = (breadcrumbItem: any) => {
      const { prefixCls, menu, dropdownProps, href } = props
      const dropdownIcon = getSlotPropsFnRun({}, props, 'dropdownIcon')
      if (menu) {
        const mergeDropDownProps: DropdownProps = {
          ...dropdownProps,
        }

        if (menu) {
          const { items, ...menuProps } = menu || {}
          mergeDropDownProps.menu = {
            ...menuProps,
            items: items?.map(({ key, title, label, path, ...itemProps }, index) => {
              let mergedLabel: any = getSlotPropsFnRun({ label: title }, { label }, 'label')

              if (path) {
                mergedLabel = <a href={`${href}${path}`}>{mergedLabel}</a>
              }

              return {
                ...itemProps,
                key: key ?? index,
                label: mergedLabel,
              }
            }),
          }
        }

        return (
          <Dropdown placement="bottom" {...mergeDropDownProps}>
            <span class={`${prefixCls}-overlay-link`}>
              {breadcrumbItem}
              {dropdownIcon}
            </span>
          </Dropdown>
        )
      }
      return breadcrumbItem
    }
    return () => {
      const { separator = '/' } = props
      const children = checkRenderNode(filterEmpty(slots?.default?.() ?? []))
      const { classes: mergedClassNames, styles: mergedStyles } = breadcrumbContext.value
      // wrap to dropDown
      const link = renderBreadcrumbNode(children)

      if (isNonNullable(link)) {
        return (
          <>
            <li class={mergedClassNames?.item} style={mergedStyles?.item}>
              {link}
            </li>
            {!!separator && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
          </>
        )
      }
      return null
    }
  },
  {
    name: 'InternalBreadcrumbItem',
    inheritAttrs: false,
  },
)

const BreadcrumbItem = defineComponent<Omit<BreadcrumbItemProps, 'key'>>(
  (props, { slots }) => {
    const { prefixCls } = useBaseConfig('breadcrumb', props)
    return () => {
      const { href, ...restProps } = props

      const children = checkRenderNode(filterEmpty(slots?.default?.() ?? []))

      return (
        <InternalBreadcrumbItem {...restProps}>
          {renderItem(prefixCls.value, restProps as ItemType, children, href)}
        </InternalBreadcrumbItem>
      )
    }
  },
  {
    name: 'ABreadcrumbItem',
    inheritAttrs: false,
  },
)

;(BreadcrumbItem as any).__ANT_BREADCRUMB_ITEM = true

export default BreadcrumbItem as typeof BreadcrumbItem & {
  /** @internal */
  __ANT_BREADCRUMB_ITEM: boolean
}
