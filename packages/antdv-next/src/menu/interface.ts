import type {
  MenuDividerType as VcMenuDividerType,
  MenuItemGroupType as VcMenuItemGroupType,
  MenuItemType as VcMenuItemType,
  SubMenuType as VcSubMenuType,
} from '@v-c/menu'
import type { Key } from '@v-c/util/dist/type'

export type DataAttributes = {
  [Key in `data-${string}`]: unknown;
}

export interface MenuItemType extends VcMenuItemType, DataAttributes {
  danger?: boolean
  icon?: any
  title?: string
  [key: string]: any
}

export interface SubMenuType<T extends MenuItemType = MenuItemType>
  extends Omit<VcSubMenuType, 'children'> {
  icon?: any
  theme?: 'dark' | 'light'
  children: ItemType<T>[]
  [key: string]: any
}

export interface MenuItemGroupType<T extends MenuItemType = MenuItemType>
  extends Omit<VcMenuItemGroupType, 'children'> {
  children?: ItemType<T>[]
  key?: Key
  [key: string]: any
}

export interface MenuDividerType extends VcMenuDividerType {
  dashed?: boolean
  key?: Key
}

export type ItemType<T extends MenuItemType = MenuItemType>
  = | T
    | SubMenuType<T>
    | MenuItemGroupType<T>
    | MenuDividerType
    | null
