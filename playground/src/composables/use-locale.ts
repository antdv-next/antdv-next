import type { LocaleMessages } from '@/locales'
import { computed } from 'vue'
import { localeStore } from '@/composables/local-store'
import locales from '@/locales'

/**
 * Generic locale composable that provides reactive access to all translations
 * @returns Reactive locale messages object for the current language and a t function
 */
export function useLocale() {
  const messages = computed<LocaleMessages>(() => {
    const currentLocale = localeStore.value
    return locales[currentLocale] || locales['zh-CN']
  })

  /**
   * Get a nested value from locale messages using dot notation
   * @param path - The path to the locale message (e.g., 'iconSearch.themes.outlined')
   * @returns The locale message value
   */
  function t(path: string): string {
    const keys = path.split('.')
    let value: any = messages.value

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key]
      }
      else {
        return path
      }
    }

    return typeof value === 'string' ? value : path
  }

  return { messages, t }
}

export function useSemanticLocale(locales: Record<'cn' | 'en', Record<string, any>>) {
  return computed(() => {
    const currentLocale = localeStore.value
    const lang = currentLocale.startsWith('zh') ? 'cn' : 'en'
    return locales[lang]
  })
}

export function useComponentLocale<T extends Record<string, string>>(locales: Record<'cn' | 'en', T>) {
  const messages = computed(() => {
    const lang = localeStore.value.startsWith('zh') ? 'cn' : 'en'
    return locales[lang]
  })

  function t(key: keyof T): string {
    return messages.value[key] || String(key)
  }

  return { t }
}
