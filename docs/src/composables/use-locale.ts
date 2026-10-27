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

interface LocaleTree {
  [key: string]: string | LocaleTree
}

/** Dot-separated paths to the string leaves of a locale tree, e.g. `'root' | 'group.item'` */
type LocaleKey<T> = {
  [K in keyof T & string]: T[K] extends string
    ? K
    : T[K] extends LocaleTree ? `${K}.${LocaleKey<T[K]>}` : never
}[keyof T & string]

export function useComponentLocale<T extends LocaleTree>(locales: Record<'cn' | 'en', T>) {
  const messages = computed(() => {
    const lang = localeStore.value.startsWith('zh') ? 'cn' : 'en'
    return locales[lang]
  })

  function t(key: LocaleKey<T>): string {
    // Flat keys may contain dots themselves (e.g. `'popup.root'`), so try the key as-is first
    let value: string | LocaleTree | undefined = messages.value[key]
    if (value === undefined) {
      value = messages.value
      for (const part of key.split('.'))
        value = typeof value === 'object' ? value[part] : undefined
    }
    return (typeof value === 'string' && value) || key
  }

  return { t }
}
