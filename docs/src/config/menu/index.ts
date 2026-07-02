import type { AntdvMenuItem } from './interface'
import { componentLocales } from './components'
import { docsMenuLocales, docsMenus } from './docs'

type MenuLocales = Record<string, Record<string, string>>

const allLocales: MenuLocales = {
  ...docsMenuLocales,
  ...componentLocales,
}

function collectMenuKeys(items: AntdvMenuItem[]) {
  const result = new Set<string>()
  items.forEach((item) => {
    if (!item)
      return
    if (typeof item.key === 'string')
      result.add(item.key)
    if (item.children) {
      collectMenuKeys(item.children).forEach(key => result.add(key))
    }
  })
  return result
}

function pickLocales(keys: Set<string>) {
  return Array.from(keys).reduce<MenuLocales>((acc, key) => {
    if (allLocales[key])
      acc[key] = allLocales[key]
    return acc
  }, {})
}

export const menusMap: Record<string, {
  locales: MenuLocales
  menus: AntdvMenuItem[]
}> = Object.keys(docsMenus).reduce((acc, prefix) => {
  const menus = docsMenus[prefix] || []
  const menuKeys = collectMenuKeys(menus)
  acc[prefix] = {
    locales: pickLocales(menuKeys),
    menus,
  }
  return acc
}, {} as Record<string, { locales: MenuLocales, menus: AntdvMenuItem[] }>)
