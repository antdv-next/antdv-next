import type { AntdvMenuItem } from './interface'
import type { InnerLocale } from '@/utils/locale'
import locales from '@/locales'
import { components } from './components'

// Helper to flatten nested docs locales
function flattenDocsLocales(nestedLocales: typeof locales['zh-CN']['menuDocs']) {
  const vue = nestedLocales.docs.vue
  return {
    '/docs/vue/introduce': vue.introduce,
    '/docs/vue/use': vue.use,
    '/docs/vue/getting-started': vue.gettingStarted,
    '/docs/vue/ai': vue.ai,
    '/docs/vue/llms': vue.llms,
    '/docs/vue/skills': vue.skills,
    '/docs/vue/advanced/use': vue.advancedUse,
    '/docs/vue/customize-theme': vue.customizeTheme,
    '/docs/vue/compatible-style': vue.compatibleStyle,
    '/docs/vue/i18n': vue.i18n,
    '/docs/vue/common-props': vue.commonProps,
    '/docs/vue/migration': vue.migration,
    '/docs/vue/migration-antdv-next': vue.migrationAntdvNext,
    '/docs/vue/other': vue.other,
    '/docs/vue/awesome': vue.awesome,
    '/docs/vue/contributing': vue.contributing,
    '/docs/vue/faq': vue.faq,
  }
}

// Export locale map by converting centralized locales to the expected format
export const docsMenuLocales: Record<string, Record<InnerLocale, string>> = (() => {
  const zhFlat = flattenDocsLocales(locales['zh-CN'].menuDocs)
  const enFlat = flattenDocsLocales(locales['en-US'].menuDocs)

  const result: Record<string, Record<InnerLocale, string>> = {}

  for (const key of Object.keys(zhFlat)) {
    result[key] = {
      'zh-CN': zhFlat[key],
      'en-US': enFlat[key],
    }
  }

  return result
})()

export const docsMenus: Record<string, AntdvMenuItem[]> = {
  '/docs/vue': [
    {
      key: '/docs/vue/introduce',
      label: '/docs/vue/introduce',
    },
    {
      key: '/docs/vue/use',
      label: '/docs/vue/use',
      type: 'group',
      children: [
        {
          key: '/docs/vue/getting-started',
          label: '/docs/vue/getting-started',
        },
      ],
    },
    {
      key: '/docs/vue/ai',
      label: '/docs/vue/ai',
      type: 'group',
      children: [
        {
          key: '/docs/vue/llms',
          label: '/docs/vue/llms',
        },
        {
          key: '/docs/vue/skills',
          label: '/docs/vue/skills',
          tag: 'New',
        },
      ],
    },
    {
      key: '/docs/vue/advanced/use',
      label: '/docs/vue/advanced/use',
      type: 'group',
      children: [
        {
          key: '/docs/vue/customize-theme',
          label: '/docs/vue/customize-theme',
        },
        {
          key: '/docs/vue/compatible-style',
          label: '/docs/vue/compatible-style',
        },
        {
          key: '/docs/vue/i18n',
          label: '/docs/vue/i18n',
        },
        {
          key: '/docs/vue/common-props',
          label: '/docs/vue/common-props',
        },
      ],
    },
    {
      key: '/docs/vue/migration',
      label: '/docs/vue/migration',
      type: 'group',
      children: [
        {
          key: '/docs/vue/migration-antdv-next',
          label: '/docs/vue/migration-antdv-next',
        },
      ],
    },
    {
      key: '/docs/vue/other',
      label: '/docs/vue/other',
      type: 'group',
      children: [
        {
          key: '/docs/vue/awesome',
          label: '/docs/vue/awesome',
        },
        {
          key: '/docs/vue/contributing',
          label: '/docs/vue/contributing',
        },
        {
          key: '/docs/vue/faq',
          label: '/docs/vue/faq',
        },
      ],
    },
  ],
  '/components': components,
  '/blog': [],
}
