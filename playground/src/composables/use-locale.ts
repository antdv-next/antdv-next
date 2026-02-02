import type { LocaleMessages } from '@/locales'
import { computed } from 'vue'
import { localeStore } from '@/composables/local-store'
import locales from '@/locales'

/**
 * Generic locale composable that provides reactive access to all translations
 * @returns Reactive locale messages object for the current language
 */
export function useLocale() {
  return computed<LocaleMessages>(() => {
    const currentLocale = localeStore.value
    return locales[currentLocale] || locales['zh-CN']
  })
}

/**
 * Get a specific namespace from the locale
 * @param namespace - The namespace to access (e.g., 'themeBtn', 'home', 'codeDemo')
 * @returns Reactive locale messages for the specified namespace
 */
export function useLocaleNamespace<K extends keyof LocaleMessages>(namespace: K) {
  return computed(() => {
    const currentLocale = localeStore.value
    const localeData = locales[currentLocale] || locales['zh-CN']
    return localeData[namespace]
  })
}

export function useSemanticLocale(locales: Record<'cn' | 'en', Record<string, any>>) {
  return computed(() => {
    const currentLocale = localeStore.value
    const lang = currentLocale.startsWith('zh') ? 'cn' : 'en'
    return locales[lang]
  })
}
