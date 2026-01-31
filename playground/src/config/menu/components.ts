import type { AntdvMenuItem } from './interface'
import type { InnerLocale } from '@/utils/locale'
import { version } from 'antdv-next'
import locales from '@/locales'

// Helper function to convert nested component locales to flat structure
// e.g., { components: { button: 'Button' } } -> { '/components/button': 'Button', 'general': '通用' }
function flattenComponentLocales(nestedLocales: { components: Record<string, string> }) {
  const flattened: Record<string, string> = {}
  const components = nestedLocales.components

  for (const [key, value] of Object.entries(components)) {
    // Group labels (general, layout, navigation, etc.) don't have /components/ prefix
    if (key === 'general' || key === 'layout' || key === 'navigation'
      || key === 'dataEntry' || key === 'dataDisplay' || key === 'feedback' || key === 'other') {
      // Convert camelCase to kebab-case for consistency
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      flattened[kebabKey] = value
    }
    else {
      // Component paths get /components/ prefix
      const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      flattened[`/components/${kebabKey}`] = value
    }
  }

  return flattened
}

// Export locale map by converting centralized locales to the expected format
export const componentLocales: Record<string, Record<InnerLocale, string>> = (() => {
  const zhFlat = flattenComponentLocales(locales['zh-CN'].menuComponents)
  const enFlat = flattenComponentLocales(locales['en-US'].menuComponents)

  const result: Record<string, Record<InnerLocale, string>> = {}

  for (const key of Object.keys(zhFlat)) {
    const zhValue = zhFlat[key]
    const enValue = enFlat[key]
    if (zhValue && enValue) {
      result[key] = {
        'zh-CN': zhValue,
        'en-US': enValue,
      }
    }
  }

  return result
})()

export const components: AntdvMenuItem[] = [
  { key: '/components/overview', label: '/components/overview' },
  { key: '/components/changelog', label: '/components/changelog', tag: `v${version}` },
  {
    key: 'general',
    label: 'general',
    type: 'group',
    children: [
      { key: '/components/button', label: '/components/button' },
      { key: '/components/float-button', label: '/components/float-button' },
      { key: '/components/icon', label: '/components/icon' },
      { key: '/components/typography', label: '/components/typography' },
    ],
  },
  {
    key: 'layout',
    label: 'layout',
    type: 'group',
    children: [
      { key: '/components/divider', label: '/components/divider' },
      { key: '/components/flex', label: '/components/flex' },
      { key: '/components/grid', label: '/components/grid' },
      { key: '/components/layout-component', label: '/components/layout' },
      { key: '/components/masonry', label: '/components/masonry' },
      { key: '/components/space', label: '/components/space' },
      { key: '/components/splitter', label: '/components/splitter' },
    ],
  },
  {
    key: 'navigation',
    label: 'navigation',
    type: 'group',
    children: [
      { key: '/components/anchor', label: '/components/anchor' },
      { key: '/components/breadcrumb', label: '/components/breadcrumb' },
      { key: '/components/dropdown', label: '/components/dropdown' },
      { key: '/components/menu', label: '/components/menu' },
      { key: '/components/pagination', label: '/components/pagination' },
      { key: '/components/steps', label: '/components/steps' },
      { key: '/components/tabs', label: '/components/tabs' },
    ],
  },
  {
    key: 'data-entry',
    label: 'data-entry',
    type: 'group',
    children: [
      { key: '/components/auto-complete', label: '/components/auto-complete' },
      { key: '/components/cascader', label: '/components/cascader' },
      { key: '/components/checkbox', label: '/components/checkbox' },
      { key: '/components/color-picker', label: '/components/color-picker' },
      { key: '/components/date-picker', label: '/components/date-picker' },
      { key: '/components/form', label: '/components/form' },
      { key: '/components/input', label: '/components/input' },
      { key: '/components/input-number', label: '/components/input-number' },
      { key: '/components/mentions', label: '/components/mentions' },
      { key: '/components/radio', label: '/components/radio' },
      { key: '/components/rate', label: '/components/rate' },
      { key: '/components/select', label: '/components/select' },
      { key: '/components/slider', label: '/components/slider' },
      { key: '/components/switch', label: '/components/switch' },
      { key: '/components/time-picker', label: '/components/time-picker' },
      { key: '/components/transfer', label: '/components/transfer' },
      { key: '/components/tree-select', label: '/components/tree-select' },
      { key: '/components/upload', label: '/components/upload' },
    ],
  },
  {
    key: 'data-display',
    label: 'data-display',
    type: 'group',
    children: [
      { key: '/components/avatar', label: '/components/avatar' },
      { key: '/components/badge', label: '/components/badge' },
      { key: '/components/calendar', label: '/components/calendar' },
      { key: '/components/card', label: '/components/card' },
      { key: '/components/carousel', label: '/components/carousel' },
      { key: '/components/collapse', label: '/components/collapse' },
      { key: '/components/descriptions', label: '/components/descriptions' },
      { key: '/components/empty', label: '/components/empty' },
      { key: '/components/image', label: '/components/image' },
      // { key: '/components/list', label: '/components/list', tag: 'DEPRECATED' },
      { key: '/components/popover', label: '/components/popover' },
      { key: '/components/qr-code', label: '/components/qr-code' },
      { key: '/components/segmented', label: '/components/segmented' },
      { key: '/components/statistic', label: '/components/statistic' },
      { key: '/components/table', label: '/components/table' },
      { key: '/components/tag', label: '/components/tag' },
      { key: '/components/timeline', label: '/components/timeline' },
      { key: '/components/tooltip', label: '/components/tooltip' },
      { key: '/components/tour', label: '/components/tour' },
      { key: '/components/tree', label: '/components/tree' },
    ],
  },
  {
    key: 'feedback',
    label: 'feedback',
    type: 'group',
    children: [
      { key: '/components/alert', label: '/components/alert' },
      { key: '/components/drawer', label: '/components/drawer' },
      { key: '/components/message', label: '/components/message' },
      { key: '/components/modal', label: '/components/modal' },
      { key: '/components/notification', label: '/components/notification' },
      { key: '/components/popconfirm', label: '/components/popconfirm' },
      { key: '/components/progress', label: '/components/progress' },
      { key: '/components/result', label: '/components/result' },
      { key: '/components/skeleton', label: '/components/skeleton' },
      { key: '/components/spin', label: '/components/spin' },
      { key: '/components/watermark', label: '/components/watermark' },
    ],
  },
  {
    key: 'other',
    label: 'other',
    type: 'group',
    children: [
      { key: '/components/affix', label: '/components/affix' },
      { key: '/components/app', label: '/components/app' },
      { key: '/components/config-provider', label: '/components/config-provider' },
    ],
  },
]
