import type { SlotsType } from 'vue'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import type { SubMenuType } from './interface.ts'
import { useFullPath, SubMenu as VcSubMenu } from '@v-c/menu'
import { clsx } from '@v-c/util'
import { omit } from 'es-toolkit'
import { computed, createVNode, defineComponent } from 'vue'
import { pureAttrs, useZIndex } from '../_util/hooks'
import { getSlotPropsFnRun } from '../_util/tools.ts'
import { useMenuContext, useMenuContextProvider } from './MenuContext.tsx'

export interface SubMenuProps extends Omit<SubMenuType, 'key' | 'label' | 'children'> {
  title?: VueNode
}

export interface SubMenuSlots {
  title: () => any
  icon: () => any
  default: () => any
}

const SubMenu = defineComponent<
  SubMenuProps,
  EmptyEmit,
  string,
  SlotsType<SubMenuSlots>
>(
  (props, { slots, attrs }) => {
    const menuContext = useMenuContext()
    const parentPath = useFullPath()

    const contextValue = computed(() => {
      return {
        ...menuContext.value,
        firstLevel: false,
      }
    })

    useMenuContextProvider(contextValue)

    // ============================ zIndex ============================
    const [zIndex] = useZIndex('Menu')
    return () => {
      const { popupClassName, theme: customTheme } = props

      const { inlineCollapsed, prefixCls, theme: contextTheme, classes, styles = {} as any } = menuContext.value
      let titleNode: any
      const title = getSlotPropsFnRun(slots, props, 'title')
      const icon = getSlotPropsFnRun(slots, props, 'icon')
      if (!icon) {
        titleNode = inlineCollapsed && !parentPath.value?.length && title && typeof title === 'string'
          ? (
              <div class={`${prefixCls}-inline-collapsed-noicon`}>{title.charAt(0)}</div>
            )
          : (<span class={`${prefixCls}-title-content`}>{title}</span>)
      }
      else {
        // inline-collapsed.md demo 依赖 span 来隐藏文字,有 icon 属性，则内部包裹一个 span
        // ref: https://github.com/ant-design/ant-design/pull/23456
        const titleIsSpan = typeof title === 'object' && (title as any).type === 'span'
        titleNode = (
          <>
            {
              createVNode(icon, {
                class: clsx(`${prefixCls}-item-icon`, classes?.itemIcon),
                style: styles.itemIcon,
              })
            }
            {titleIsSpan ? title : <span class={`${prefixCls}-title-content`}>{title}</span>}
          </>
        )
      }
      return (
        <VcSubMenu
          {...pureAttrs(attrs)}
          {...omit(props, ['icon'])}
          title={titleNode}
          classes={{
            list: classes?.subMenu?.list,
            listTitle: classes?.subMenu?.itemTitle,
          }}
          styles={{
            list: styles?.subMenu?.list,
            listTitle: styles?.subMenu?.itemTitle,
          }}
          popupClassName={
            clsx(prefixCls, popupClassName, classes?.popup?.root, `${prefixCls}-${customTheme || contextTheme}`)
          }
          popupStyle={{
            zIndex: zIndex.value,
            ...props?.popupStyle,
            ...styles?.popup?.root,
          }}
        >
          {slots?.default?.()}
        </VcSubMenu>
      )
    }
  },
  {
    name: 'ASubMenu',
    inheritAttrs: false,
  },
)

export default SubMenu
