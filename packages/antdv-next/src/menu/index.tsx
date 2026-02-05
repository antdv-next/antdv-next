import type { MenuInfo, MenuItemGroupProps, SelectInfo, MenuRef as VcMenuRef } from '@v-c/menu'
import type { App, SlotsType } from 'vue'
import type { ItemType } from './interface.ts'
import type { MenuEmits, MenuProps, MenuSlots } from './menu'
import type { MenuItemProps } from './MenuItem'
import type { SubMenuProps } from './SubMenu'
import { computed, defineComponent, shallowRef } from 'vue'
import { useSiderCtx } from '../layout/Sider.tsx'
import InternalMenu from './menu'
import MenuDivider from './MenuDivider'
import Item from './MenuItem'
import SubMenu from './SubMenu'

export type MenuItemType = ItemType
export type { MenuEmits, MenuItemGroupProps, MenuItemProps, MenuProps, MenuSlots, SubMenuProps }

export interface MenuRef {
  menu: VcMenuRef | null
  focus: (options?: FocusOptions) => void
}

const Menu = defineComponent<
  MenuProps,
  MenuEmits,
  string,
  SlotsType<MenuSlots>
>(
  (props, { slots, attrs, emit, expose }) => {
    const menuRef = shallowRef()
    const { siderCollapsed } = useSiderCtx()
    expose({
      menu: computed(() => menuRef?.value?.menu),
      focus: (options?: FocusOptions) => {
        menuRef.value?.menu?.focus?.(options)
      },
    })
    return () => {
      const events = {
        'onClick': (info: MenuInfo) => emit('click', info),
        'onSelect': (info: SelectInfo) => emit('select', info),
        'onDeselect': (info: SelectInfo) => emit('deselect', info),
        'onOpenChange': (openKeys: string[]) => emit('openChange', openKeys),
        'onUpdate:openKeys': (openKeys: string[]) => emit('update:openKeys', openKeys),
        'onUpdate:selectedKeys': (selectedKeys: string[]) => emit('update:selectedKeys', selectedKeys),
      }
      return (
        <InternalMenu
          ref={menuRef}
          {...attrs}
          {...props}
          {...events}
          siderCollapsed={siderCollapsed?.value as any}
          v-slots={slots}
        />
      )
    }
  },
  {
    name: 'AMenu',
    inheritAttrs: false,
  },
)

;(Menu as any).Item = Item
;(Menu as any).SubMenu = SubMenu
;(Menu as any).Divider = MenuDivider

;(Menu as any).install = (app: App) => {
  app.component(Menu.name, Menu)
  app.component(Item.name, Item)
  app.component(SubMenu.name, SubMenu)
  app.component(MenuDivider.name, MenuDivider)
}

export const MenuItem = Item
export {
  MenuDivider,
  SubMenu,
}

export default Menu as typeof Menu & {
  Item: typeof Item
  SubMenu: typeof SubMenu
  Divider: typeof MenuDivider
}
