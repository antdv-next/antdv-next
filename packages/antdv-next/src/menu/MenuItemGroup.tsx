import type { MenuItemGroupProps as VcMenuItemGroupProps } from '@v-c/menu'
import type { SlotsType } from 'vue'
import type { EmptyEmit, VueNode } from '../_util/type.ts'
import { MenuItemGroup as VcMenuItemGroup } from '@v-c/menu'
import { omit } from 'es-toolkit'
import { defineComponent } from 'vue'
import { pureAttrs } from '../_util/hooks'
import { getSlotPropsFnRun } from '../_util/tools.ts'

export interface MenuItemGroupProps extends Omit<VcMenuItemGroupProps, 'title' | 'children'> {
  title?: VueNode
}

export interface MenuItemGroupSlots {
  default?: () => any
  title?: () => any
}

const MenuItemGroup = defineComponent<
  MenuItemGroupProps,
  EmptyEmit,
  string,
  SlotsType<MenuItemGroupSlots>
>(
  (props, { slots, attrs }) => {
    return () => {
      const title = getSlotPropsFnRun(slots, props, 'title')
      return (
        <VcMenuItemGroup
          {...pureAttrs(attrs)}
          {...omit(props, ['title'])}
          title={title}
        >
          {slots?.default?.()}
        </VcMenuItemGroup>
      )
    }
  },
  {
    name: 'AMenuItemGroup',
    inheritAttrs: false,
  },
)

export default MenuItemGroup
