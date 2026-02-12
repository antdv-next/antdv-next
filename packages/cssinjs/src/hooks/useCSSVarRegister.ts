import type { Ref } from 'vue'
import type { TokenWithCSSVar } from '../util/css-variables'
import type { ExtractStyle } from './useGlobalCache'
import canUseDom from '@v-c/util/dist/Dom/canUseDom'
import { removeCSS, updateCSS } from '@v-c/util/dist/Dom/dynamicCSS'
import { computed } from 'vue'
import { collectStyleText } from '../ssr/styleCollector'
import { ATTR_MARK, ATTR_TOKEN, CSS_IN_JS_INSTANCE, useStyleContext } from '../StyleContext'
import { isClientSide, toStyleStr } from '../util'
import { transformToken } from '../util/css-variables'
import { useGlobalCache } from './useGlobalCache'
import { uniqueHash } from './useStyleRegister'

export const CSS_VAR_PREFIX = 'cssVar'

export type CSSVarCacheValue<V, T extends Record<string, V> = Record<string, V>> = [
    cssVarToken: TokenWithCSSVar<V, T>,
    cssVarStr: string,
    styleId: string,
    cssVarKey: string,
]

export interface CSSVarRegisterConfig {
  path: string[]
  key: string
  prefix?: string
  unitless?: Record<string, boolean>
  ignore?: Record<string, boolean>
  scope?: string | string[]
  token: any
  hashId?: string
}

export const extract: ExtractStyle<CSSVarCacheValue<any>> = (
  cache,
  _effectStyles,
  options,
) => {
  const [, styleStr, styleId, cssVarKey] = cache
  const { plain } = options || {}

  if (!styleStr) {
    return null
  }

  const order = -999

  // ====================== Style ======================
  // Used for rc-util
  const sharedAttrs = {
    'data-rc-order': 'prependQueue',
    'data-rc-priority': `${order}`,
  }

  const styleText = toStyleStr(
    styleStr,
    cssVarKey,
    styleId,
    sharedAttrs,
    plain,
  )

  return [order, styleId, styleText]
}

export default function useCSSVarRegister<V, T extends Record<string, V>>(
  config: Ref<CSSVarRegisterConfig>,
  fn: () => T,
) {
  const styleContext = useStyleContext()

  const stylePath = computed<any[]>(() => {
    const { key, scope, token } = config.value
    const tokenKey = token?._tokenKey
    const scopeKey = Array.isArray(scope) ? scope.join('@@') : scope
    return [
      ...config.value.path,
      key,
      scopeKey,
      tokenKey,
    ]
  })

  return useGlobalCache<CSSVarCacheValue<V, T>>(
    computed(() => CSS_VAR_PREFIX),
    stylePath,
    () => {
      const originToken = fn()
      const { key, prefix, unitless, ignore, hashId, scope } = config.value
      const hashPriority = styleContext.value.hashPriority!
      const [mergedToken, cssVarsStr] = transformToken<V, T>(originToken, key, {
        prefix,
        unitless,
        ignore,
        scope,
        hashPriority,
        hashCls: hashId,
      })
      const styleId = uniqueHash(stylePath.value, cssVarsStr)
      return [mergedToken, cssVarsStr, styleId, key]
    },
    ([, , styleId]) => {
      if (isClientSide) {
        removeCSS(styleId, { mark: ATTR_MARK, attachTo: styleContext.value.container })
      }
    },
    (cacheValue) => {
      const [, cssVarsStr, styleId] = cacheValue
      if (!canUseDom()) {
        const extracted = extract(cacheValue, {}, { plain: false })
        if (extracted) {
          const [, , styleText] = extracted
          collectStyleText(styleText)
        }
        return
      }
      if (!cssVarsStr) {
        return
      }

      const context = styleContext.value
      const style = updateCSS(cssVarsStr, styleId, {
        mark: ATTR_MARK,
        prepend: 'queue',
        attachTo: context.container,
        priority: -999,
      })

      ;(style as any)[CSS_IN_JS_INSTANCE] = context.cache.instanceId
      // Used for `useCacheToken` to remove on batch when token removed
      style.setAttribute(ATTR_TOKEN, config.value.key)
    },
  )
}
