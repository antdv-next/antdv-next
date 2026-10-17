import type { Locale } from './index'
import { computed, ref } from 'vue'
import defaultLocaleData from './en_US'
import { useLocaleContext } from './index'

export type LocaleComponentName = Exclude<keyof Locale, 'locale'>

function useLocale<C extends LocaleComponentName = LocaleComponentName>(
  componentName: C,
  defaultLocale?: Locale[C] | (() => Locale[C]),
) {
  const { locale: fullLocale } = useLocaleContext() ?? {
    locale: ref(defaultLocaleData),
  }
  const getLocale = computed(() => {
    const locale = defaultLocale || defaultLocaleData[componentName]
    const localeFromContext = fullLocale.value?.[componentName] ?? {}
    return {
      ...(typeof locale === 'function' ? (locale as any)() : locale),
      ...(localeFromContext || {}),
    }
  })

  const getLocaleCode = computed(() => {
    const localeCode = fullLocale.value?.locale
    // Had use LocaleProvide but didn't set locale
    if (fullLocale.value?.exist && !localeCode) {
      return defaultLocaleData.locale
    }
    return localeCode!
  })

  return [getLocale, getLocaleCode] as const
}

/**
 * Lightweight variant of `useLocale` that allocates no computed: returns a getter
 * to read merged locale data during render. Prefer it in high-instance-count components.
 */
export function useLocaleGetter<C extends LocaleComponentName = LocaleComponentName>(componentName: C) {
  const { locale: fullLocale } = useLocaleContext()
  return (): NonNullable<Locale[C]> => ({
    ...(defaultLocaleData[componentName] as any),
    ...(fullLocale.value?.[componentName] as any),
  })
}

export default useLocale
