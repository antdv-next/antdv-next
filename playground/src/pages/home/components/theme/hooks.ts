import type { CSSObject } from '@antdv-next/cssinjs'
import type { GlobalToken } from 'antdv-next'
import { hash, useStyleRegister } from '@antdv-next/cssinjs'
import { useToken } from 'antdv-next/theme/internal'
import { computed, reactive, watchEffect } from 'vue'

export function createStyles(
  styleFn: (args: {
    realToken: GlobalToken
    css: (style: CSSObject) => CSSObject
    cssVar: GlobalToken
  }) => Record<string, CSSObject>,
) {
  const scopeId = `acss-${hash(styleFn.toString())}`

  return () => {
    const [theme, , hashId, realToken] = useToken()
    const stylesInfo = computed(() => {
      const styles = styleFn({
        realToken: realToken.value,
        css: (s: CSSObject) => s,
        cssVar: realToken.value,
      })
      return styles
    })

    const parsedStyles = computed(() => {
      const styles = stylesInfo.value
      const classNames: Record<string, string> = {}
      const cssObj: Record<string, CSSObject> = {}

      Object.keys(styles).forEach((key) => {
        const cls = `acss-${hash(`${scopeId}-${key}`)}`
        classNames[key] = cls
        cssObj[`.${cls}`] = styles[key]!
      })

      return { classNames, cssObj }
    })

    useStyleRegister(
      computed(() => ({
        theme: theme.value,
        token: realToken.value,
        hashId: hashId.value,
        path: [scopeId],
      })),
      () => parsedStyles.value.cssObj,
    )

    const styles = reactive<Record<string, string>>({})

    watchEffect(() => {
      const newClassNames = parsedStyles.value.classNames
      for (const key in styles) {
        if (!(key in newClassNames)) {
          delete styles[key]
        }
      }
      Object.assign(styles, newClassNames)
    })

    return {
      styles,
      theme,
      realToken,
      hashId,
    }
  }
}
