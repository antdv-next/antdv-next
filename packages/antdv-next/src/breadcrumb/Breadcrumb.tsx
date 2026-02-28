import type { Key } from '@v-c/util/dist/type'
import type { App, CSSProperties, SlotsType } from 'vue'
import type { SemanticClassNamesType, SemanticStylesType } from '../_util/hooks'
import type { AnyObject, VueNode } from '../_util/type'
import type { DropdownProps } from '../dropdown'
import type { BreadcrumbItemProps, MenuItem } from './BreadcrumbItem'
import { DownOutlined } from '@antdv-next/icons'
import { clsx } from '@v-c/util'
import pickAttrs from '@v-c/util/dist/pickAttrs'
import { filterEmpty } from '@v-c/util/dist/props-util'
import { computed, createVNode, defineComponent, isVNode } from 'vue'
import { getAttrStyleAndClass, useMergeSemantic, useToArr, useToProps } from '../_util/hooks'
import { getSlotPropsFnRun, toPropsRefs } from '../_util/tools'
import { useComponentBaseConfig } from '../config-provider/context'

import { useBreadcrumbProvider } from './BreadcrumbContext.ts'
import BreadcrumbItem, { InternalBreadcrumbItem } from './BreadcrumbItem'
import BreadcrumbSeparator from './BreadcrumbSeparator'
import useStyle from './style'
import useItemRender from './useItemRender'

export interface BreadcrumbItemType {
  key?: Key
  /**
   * Different with `path`. Directly set the link of this item.
   */
  href?: string
  /**
   * Different with `href`. It will concat all prev `path` to the current one.
   */
  path?: string
  title?: VueNode
  menu?: BreadcrumbItemProps['menu']
  class?: string
  style?: CSSProperties
  dropdownProps?: DropdownProps
  onClick?: (event: MouseEvent) => void

  [key: `data-${string}`]: string
}

export interface BreadcrumbSeparatorType {
  type: 'separator'
  separator?: VueNode
}

export type ItemType = Partial<BreadcrumbItemType & BreadcrumbSeparatorType>

export type InternalRouteType = Partial<BreadcrumbItemType & BreadcrumbSeparatorType>

export type BreadcrumbSemanticName = keyof BreadcrumbSemanticClassNames & keyof BreadcrumbSemanticStyles

export interface BreadcrumbSemanticClassNames {
  root?: string
  item?: string
  separator?: string
}

export interface BreadcrumbSemanticStyles {
  root?: CSSProperties
  item?: CSSProperties
  separator?: CSSProperties
}

export type BreadcrumbClassNamesType<T extends AnyObject = AnyObject> = SemanticClassNamesType<
  BreadcrumbProps<T>,
  BreadcrumbSemanticClassNames
>

export type BreadcrumbStylesType<T extends AnyObject = AnyObject> = SemanticStylesType<
  BreadcrumbProps<T>,
  BreadcrumbSemanticStyles
>

export interface BreadcrumbProps<T extends AnyObject = AnyObject> extends
  /* @vue-ignore */
  BreadcrumbEmitsProps {
  prefixCls?: string
  params?: T
  separator?: any
  rootClass?: string

  items?: ItemType[]
  classes?: BreadcrumbClassNamesType<T>
  styles?: BreadcrumbStylesType<T>

  dropdownIcon?: VueNode
  itemRender?: (route: ItemType, params: T, routes: ItemType[], paths: string[]) => any
  titleRender?: (params: { item: ItemType, index: number }) => any
  // render by menu
  menuLabelRender?: (params: { item: ItemType, index: number, menu: MenuItem }) => any
  menuExtraRender?: (params: { item: ItemType, index: number, menu: MenuItem }) => any
}

export interface BreadcrumbEmits {
  clickItem: (item: ItemType, event: MouseEvent) => void
  [keys: string]: (...args: any[]) => any
}
export interface BreadcrumbEmitsProps {
  onClickItem?: BreadcrumbEmits['clickItem']
}

export interface BreadcrumbSlots {
  itemRender: (route: ItemType, params: AnyObject, routes: ItemType[], paths: string[]) => any
  titleRender: (params: { item: ItemType, index: number }) => any
  separator: () => any
  default: () => any
  // render by menu
  dropdownIcon: () => any
  menuLabelRender?: (params: { item: ItemType, index: number, menu: MenuItem }) => any
  menuExtraRender?: (params: { item: ItemType, index: number, menu: MenuItem }) => any
}

function getPath<T extends AnyObject = AnyObject>(params: T, path?: string) {
  if (path === undefined) {
    return path
  }
  let mergedPath = (path || '').replace(/^\//, '')
  Object.keys(params).forEach((key) => {
    mergedPath = mergedPath.replace(`:${key}`, params[key]!)
  })
  return mergedPath
}

const Breadcrumb = defineComponent<
  BreadcrumbProps,
  BreadcrumbEmits,
  string,
  SlotsType<BreadcrumbSlots>
>(
  (props, { slots, attrs, emit }) => {
    const {
      prefixCls,
      direction,
      class: contextClassName,
      style: contextStyle,
      classes: contextClassNames,
      styles: contextStyles,
      separator: contextSeparator,
      dropdownIcon: contextDropdownIcon,
    } = useComponentBaseConfig('breadcrumb', props, ['separator', 'dropdownIcon'])
    const { classes, styles } = toPropsRefs(props, 'classes', 'styles')
    const mergedSeparator = computed(() => {
      const separator = getSlotPropsFnRun(slots, props, 'separator')
      const contextSep = getSlotPropsFnRun({}, { separator: contextSeparator.value }, 'separator')
      return separator ?? contextSep ?? '/'
    })

    const [hashId, cssVarCls] = useStyle(prefixCls)

    const mergedItems = computed(() => props.items ?? [])

    // =========== Merged Props for Semantic ==========
    const mergedProps = computed(() => {
      return {
        ...props,
        separator: mergedSeparator.value,
      } as BreadcrumbProps
    })
    // ========================= Style ==========================
    const [mergedClassNames, mergedStyles] = useMergeSemantic<
      BreadcrumbClassNamesType,
      BreadcrumbStylesType,
      BreadcrumbProps
    >(useToArr(contextClassNames, classes), useToArr(contextStyles, styles), useToProps(mergedProps))

    const contextValue = computed(() => {
      return {
        classes: mergedClassNames.value,
        styles: mergedStyles.value,
      }
    })

    useBreadcrumbProvider(contextValue)
    return () => {
      const {
        params = {},
        rootClass,
      } = props
      const itemRender = slots?.itemRender ?? props?.itemRender
      const mergedDropdownIcon = getSlotPropsFnRun(slots, props, 'dropdownIcon') ?? contextDropdownIcon.value ?? <DownOutlined />

      const children = filterEmpty(slots?.default?.() ?? [])
      let crumbs: any

      const titleRender = slots?.titleRender ?? props?.titleRender

      const mergedItemRender = useItemRender(prefixCls.value, itemRender, titleRender)

      if (mergedItems.value && mergedItems.value.length > 0) {
        // generated by route
        const paths: string[] = []
        const itemRenderRoutes = props?.items
        crumbs = mergedItems.value.map((item, index) => {
          const {
            path,
            key,
            type,
            menu,
            onClick,
            class: itemClassName,
            style,
            dropdownProps,
          } = item

          const handleClick = (event: MouseEvent) => {
            onClick?.(event)
            emit('clickItem', item, event)
          }
          const itemSeparator = getSlotPropsFnRun({}, { separator: item.separator }, 'separator')
          const mergedPath = getPath(params || {}, path)

          if (mergedPath !== undefined) {
            paths.push(mergedPath)
          }

          const mergedKey = key ?? index

          if (type === 'separator') {
            return <BreadcrumbSeparator key={mergedKey}>{itemSeparator}</BreadcrumbSeparator>
          }

          const itemProps: BreadcrumbItemProps = {}
          const isLastItem = index === mergedItems.value.length - 1
          if (menu) {
            const menuLabelRender = slots?.menuLabelRender ?? props.menuLabelRender
            if (menuLabelRender) {
              menu.labelRender = menuItem => menuLabelRender({ item, index, menu: menuItem })
            }
            const menuExtraRender = slots?.menuExtraRender ?? props.menuExtraRender
            if (menuExtraRender) {
              menu.extraRender = menuItem => menuExtraRender({ item, index, menu: menuItem })
            }
            itemProps.menu = menu
          }

          let { href } = item

          if (paths.length && mergedPath !== undefined) {
            href = `#/${paths.join('/')}`
          }

          return (
            <InternalBreadcrumbItem
              key={mergedKey}
              {...itemProps}
              {...pickAttrs(item, { data: true, aria: true })}
              class={itemClassName}
              style={style}
              dropdownProps={dropdownProps}
              dropdownIcon={mergedDropdownIcon}
              href={href}
              separator={isLastItem ? '' : mergedSeparator.value}
              onClick={handleClick}
              prefixCls={prefixCls.value}
            >
              {mergedItemRender(item, params, itemRenderRoutes!, paths, href, index)}
            </InternalBreadcrumbItem>
          )
        })
      }
      else {
        const childrenLength = children.length
        crumbs = children.map((element: any, index) => {
          if (!element || !isVNode(element)) {
            return element
          }

          const isLastItem = index === childrenLength - 1
          return createVNode(element, {
            separator: isLastItem ? '' : mergedSeparator.value,
            key: index,
          })
        })
      }

      const { className, style, restAttrs } = getAttrStyleAndClass(attrs)

      const breadcrumbClassName = clsx(
        prefixCls.value,
        contextClassName.value,
        { [`${prefixCls}-rtl`]: direction.value === 'rtl' },
        className,
        rootClass,
        mergedClassNames.value?.root,
        hashId.value,
        cssVarCls.value,
      )
      const mergedStyle: CSSProperties = {
        ...mergedStyles.value?.root,
        ...contextStyle.value,
        ...style,
      }

      return (
        <nav class={breadcrumbClassName} style={mergedStyle} {...restAttrs}>
          <ol>{crumbs}</ol>
        </nav>
      )
    }
  },
  {
    name: 'ABreadcrumb',
    inheritAttrs: false,
  },
)

;(Breadcrumb as any).Item = BreadcrumbItem
;(Breadcrumb as any).Separator = BreadcrumbSeparator
;(Breadcrumb as any).install = (app: App) => {
  app.component(Breadcrumb.name, Breadcrumb)
  app.component(BreadcrumbItem.name, BreadcrumbItem)
  app.component(BreadcrumbSeparator.name, BreadcrumbSeparator)
}

export default Breadcrumb
