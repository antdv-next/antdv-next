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
  {
    key: '/sponsor',
    label: '/sponsor',
  },
]

// Helper to flatten nested header locales
function flattenHeaderLocales(nestedLocales: typeof locales['zh-CN']['menu']['header']) {
  return {
    '/docs/vue': nestedLocales.docs.vue,
    '/components': nestedLocales.components,
    '/blog': nestedLocales.blog,
    '/docs/resources': nestedLocales.resources,
    '/sponsor': nestedLocales.sponsor,
  }
}

// Export locale map by converting centralized locales to the expected format
export const headerLocales: Record<string, Record<InnerLocale, string>> = (() => {
  const zhFlat = flattenHeaderLocales(locales['zh-CN'].menu.header)
  const enFlat = flattenHeaderLocales(locales['en-US'].menu.header as any)

  const result: Record<string, Record<InnerLocale, string>> = {}

  for (const key of Object.keys(zhFlat)) {
    result[key] = {
      'zh-CN': zhFlat[key as keyof typeof zhFlat],
      'en-US': enFlat[key as keyof typeof enFlat],
    }
  }

  return result
})()
