import type { Ref } from 'vue'
import type { OverrideToken } from '../../theme/interface'
import type { ThemeConfig } from '../context.ts'
import defu from 'defu'
import { computed } from 'vue'
import { defaultConfig } from '../../theme/context.ts'
import useThemeKey from './useThemeKey.ts'

export function useTheme(
  theme?: Ref<ThemeConfig | undefined>,
  parentTheme?: Ref<ThemeConfig | undefined>,
  config?: Ref<{
    prefixCls?: string
  }>,
) {
  const themeConfig = computed(() => theme?.value ?? {})
  const parentThemeConfig = computed<ThemeConfig>(() => {
    if (themeConfig.value.inherit === false || !parentTheme?.value) {
      return defu({
        hashed: parentTheme?.value?.hashed ?? defaultConfig.hashed,
        cssVar: parentTheme?.value?.cssVar,
      }, defaultConfig)
    }
    return parentTheme.value
  })
  const themeKey = useThemeKey()
  return computed(() => {
    if (!theme || !theme.value) {
      return parentTheme?.value
    }

    // Override
    const mergedComponents = {
      ...parentThemeConfig.value?.components,
    }
    const themeComponents = theme?.value?.components ?? {}

    Object.keys(themeComponents as (keyof OverrideToken)[]).forEach((componentName) => {
      (mergedComponents as any)[componentName] = {
        ...(mergedComponents as any)[componentName],
        ...(theme?.value?.components as any)[componentName],
      } as any
    })
    const cssVarKey = `css-var-${themeKey.replace(/:/g, '')}`
    const mergedCssVar = {
      prefix: config?.value?.prefixCls,
      ...(typeof parentThemeConfig.value.cssVar === 'object' && parentThemeConfig.value.cssVar),
      ...(typeof themeConfig.value.cssVar === 'object' && themeConfig.value.cssVar),
      key: (typeof themeConfig.value.cssVar === 'object' && themeConfig.value.cssVar?.key) || cssVarKey,
    }
    // Base token
    return {
      ...parentThemeConfig.value,
      ...themeConfig.value,

      token: {
        ...parentThemeConfig.value.token,
        ...themeConfig.value.token,
      },
      components: mergedComponents,
      cssVar: mergedCssVar,
    }
  })
}
