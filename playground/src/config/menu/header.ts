import type { MenuItemType } from 'antdv-next'
import type { InnerLocale } from '@/utils/locale'
import locales from '@/locales'

export const headerItems: MenuItemType[] = [
  {
    key: '/docs/vue',
    label: '/docs/vue',
  },
  {
    key: '/components',
    label: '/components',
  },
  {
    key: '/blog',
    label: '/blog',
  },
]

// Helper to flatten nested header locales
function flattenHeaderLocales(nestedLocales: typeof locales['zh-CN']['menuHeader']) {
  return {
    '/docs/vue': nestedLocales.docs.vue,
    '/components': nestedLocales.components,
    '/blog': nestedLocales.blog,
    '/docs/resources': nestedLocales.resources,
  }
}

// Export locale map by converting centralized locales to the expected format
export const headerLocales: Record<string, Record<InnerLocale, string>> = (() => {
  const zhFlat = flattenHeaderLocales(locales['zh-CN'].menuHeader)
  const enFlat = flattenHeaderLocales(locales['en-US'].menuHeader)

  const result: Record<string, Record<InnerLocale, string>> = {}

  for (const key of Object.keys(zhFlat)) {
    result[key] = {
      'zh-CN': zhFlat[key],
      'en-US': enFlat[key],
    }
  }

  return result
})()
