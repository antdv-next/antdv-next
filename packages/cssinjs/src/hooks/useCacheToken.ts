import type { Ref } from 'vue'
import type { StyleContextProps } from '../StyleContext'
import type Theme from '../theme/Theme'
import type { Nonce } from '../util'
import type { ExtractStyle, GlobalCacheEntry, OnCacheRemove } from './useGlobalCache'
import canUseDom from '@v-c/util/dist/Dom/canUseDom'
import { updateCSS } from '@v-c/util/dist/Dom/dynamicCSS'
import { computed } from 'vue'
import { collectStyleText } from '../ssr/styleCollector'
import { ATTR_MARK, ATTR_TOKEN, CSS_IN_JS_INSTANCE, useStyleContext } from '../StyleContext'
import { flattenToken, injectCSPNonce, memoResult, token2key, toStyleStr } from '../util'
import { transformToken } from '../util/css-variables'
import hash from '../util/resolveHash'
import { createGlobalCache, useGlobalCacheEntry } from './useGlobalCache'

const EMPTY_OVERRIDE = {}

// @ts-expect-error fix this
const hashPrefix = process.env.NODE_ENV !== 'production'
  ? 'css-dev-only-do-not-override'
  : 'css'

export interface Option<DerivativeToken, DesignToken> {
  /**
   * Generate token with salt.
   * This is used to generate different hashId even same derivative token for different version.
   */
  salt?: string
  override?: object
  /**
   * Format token as you need. Such as:
   *
   * - rename token
   * - merge token
   * - delete token
   *
   * This should always be the same since it's one time process.
   * It's ok to useMemo outside but this has better cache strategy.
   */
  formatToken?: (mergedToken: any) => DerivativeToken
  /**
   * Get final token with origin token, override token and theme.
   * The parameters do not contain formatToken since it's passed by user.
   * @param origin The original token.
   * @param override Extra tokens to override.
   * @param theme Theme instance. Could get derivative token by `theme.getDerivativeToken`
   */
  getComputedToken?: (
    origin: DesignToken,
    override: object,
    theme: Theme<any, any>,
  ) => DerivativeToken

  /**
   * Transform token to css variables.
   */
  cssVar: {
    hashed?: boolean
    /** Prefix for css variables */
    prefix?: string
    /** Tokens that should not be appended with unit */
    unitless?: Record<string, boolean>
    /** Tokens that should not be transformed to css variables */
    ignore?: Record<string, boolean>
    /** Tokens that preserves origin value */
    preserve?: Record<string, boolean>
    /** Key for current theme. Useful for customizing and should be unique */
    key: string
  }
  nonce?: Nonce
}

const tokenKeys = new Map<string, number>()

function recordCleanToken(tokenKey: string) {
  tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) + 1)
}

function removeStyleTags(key: string, instanceId: string) {
  if (typeof document !== 'undefined') {
    const styles = document.querySelectorAll(`style[${ATTR_TOKEN}="${key}"]`)
    styles.forEach((style) => {
      if ((style as any)[CSS_IN_JS_INSTANCE] === instanceId) {
        style.parentNode?.removeChild(style)
      }
    })
  }
}

const TOKEN_THRESHOLD = -1

function cleanTokenStyle(tokenKey: string, instanceId: string) {
  tokenKeys.set(tokenKey, (tokenKeys.get(tokenKey) || 0) - 1)

  const cleanableKeyList = new Set<string>()
  tokenKeys.forEach((value, key) => {
    if (value <= 0) {
      cleanableKeyList.add(key)
    }
  })

  if (tokenKeys.size - cleanableKeyList.size > TOKEN_THRESHOLD) {
    cleanableKeyList.forEach((key) => {
      removeStyleTags(key, instanceId)
      tokenKeys.delete(key)
    })
  }
}

export function getComputedToken<
  DerivativeToken = object,
  DesignToken = DerivativeToken,
>(
  originToken: DesignToken,
  overrideToken: object,
  theme: Theme<any, any>,
  format?: (token: DesignToken) => DerivativeToken,
) {
  const derivativeToken = theme.getDerivativeToken(originToken)

  // Merge with override
  let mergedDerivativeToken = {
    ...derivativeToken,
    ...overrideToken,
  }

  // Format if needed
  if (format) {
    mergedDerivativeToken = format(mergedDerivativeToken)
  }

  return mergedDerivativeToken
}

export const TOKEN_PREFIX = 'token'

type TokenCacheValue<DerivativeToken> = [
  token: DerivativeToken,
  hashId: string,
  realToken: DerivativeToken,
  cssVarStr: string,
  cssVarKey: string,
]

// Module-level on purpose: see `OnCacheRemove` in useGlobalCache.ts.
const removeTokenCache: OnCacheRemove<TokenCacheValue<any>> = (cacheValue, _fromHMR, context) => {
  const [, , , , themeKey] = cacheValue
  cleanTokenStyle(themeKey, context.cache.instanceId)
}

export const extract: ExtractStyle<TokenCacheValue<any>> = (
  cache,
  _effectStyles,
  options,
) => {
  const [, , realToken, styleStr, cssVarKey] = cache
  const { plain } = options || {}

  if (!styleStr) {
    return null
  }

  const styleId = realToken._tokenKey
  const order = -999

  const sharedAttrs = {
    'data-vc-order': 'prependQueue',
    'data-vc-priority': `${order}`,
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

/**
 * Create the derivative-token cache entry without binding it to a component.
 *
 * Everything in here is plain reactive state, so the returned entry can be
 * shared by every component under the same theme / config context; each
 * component then only registers a reference via `useGlobalCacheEntry`.
 * @param styleContext Style context the cache lives in
 * @param theme Theme entity
 * @param tokens List of tokens, used for cache. Please do not dynamic generate object directly
 * @param option Additional config
 */
export function createCacheToken<
  DerivativeToken = Record<string, any>,
  DesignToken = DerivativeToken,
>(
  styleContext: Ref<StyleContextProps>,
  theme: Ref<Theme<any, any>>,
  tokens: Ref<(Partial<DesignToken> | (() => Partial<DesignToken>))[]>,
  option: Ref<Option<DerivativeToken, DesignToken>>,
): GlobalCacheEntry<TokenCacheValue<DerivativeToken>> {
  const mergedToken = computed(() => {
    const resolvedTokens = tokens.value.map(token => (typeof token === 'function' ? token() : token))
    return memoResult(() => Object.assign({}, ...resolvedTokens), resolvedTokens)
  })

  const keyPath = computed(() => {
    const { salt = '', override, cssVar } = option.value
    return [
      salt,
      theme.value.id,
      flattenToken(mergedToken.value),
      flattenToken(override || EMPTY_OVERRIDE),
      flattenToken(cssVar),
    ]
  })

  return createGlobalCache<TokenCacheValue<DerivativeToken>>(
    styleContext,
    TOKEN_PREFIX,
    keyPath,
    () => {
      const { salt = '', formatToken, getComputedToken: compute, cssVar } = option.value
      const override = option.value.override || EMPTY_OVERRIDE
      const mergedDerivativeToken = compute
        ? compute(mergedToken.value as DesignToken, override, theme.value)
        : getComputedToken(mergedToken.value as DesignToken, override, theme.value, formatToken)

      const actualToken = { ...mergedDerivativeToken }
      // Optimize for `useStyleRegister` performance
      const mergedSalt = `${salt}_${cssVar.prefix || ''}`
      const hashId = hash(mergedSalt)
      const hashCls = `${hashPrefix}-${hashId}`
      actualToken._tokenKey = token2key(actualToken, mergedSalt)

      const [tokenWithCssVar, cssVarsStr] = transformToken(
        mergedDerivativeToken,
        cssVar.key,
        {
          prefix: cssVar.prefix,
          ignore: cssVar.ignore,
          unitless: cssVar.unitless,
          preserve: cssVar.preserve,
          hashPriority: styleContext.value.hashPriority,
          hashCls: cssVar.hashed ? hashCls : undefined,
        },
      ) as [any, string]
      tokenWithCssVar._hashId = hashId
      recordCleanToken(cssVar.key)
      return [
        tokenWithCssVar,
        hashCls,
        actualToken,
        cssVarsStr,
        cssVar.key,
      ]
    },
    removeTokenCache,
    (cacheValue) => {
      const [, , , cssVarsStr, themeKey] = cacheValue
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
      let mergedCSSConfig: Parameters<typeof updateCSS>[2] = {
        mark: ATTR_MARK,
        prepend: 'queue',
        attachTo: styleContext.value.container,
        priority: -999,
      }

      mergedCSSConfig = injectCSPNonce(mergedCSSConfig, option.value.nonce)

      const style = updateCSS(
        cssVarsStr,
        hash(`css-var-${themeKey}`),
        mergedCSSConfig,
      )

      ;(style as any)[CSS_IN_JS_INSTANCE] = styleContext.value.cache.instanceId
      // Used for `useCacheToken` to remove on batch when token removed
      style.setAttribute(ATTR_TOKEN, themeKey)
    },
  )
}

/**
 * Cache theme derivative token as global shared one
 * @param theme Theme entity
 * @param tokens List of tokens, used for cache. Please do not dynamic generate object directly
 * @param option Additional config
 * @returns Call Theme.getDerivativeToken(tokenObject) to get token
 */
export default function useCacheToken<
  DerivativeToken = Record<string, any>,
  DesignToken = DerivativeToken,
>(
  theme: Ref<Theme<any, any>>,
  tokens: Ref<(Partial<DesignToken> | (() => Partial<DesignToken>))[]>,
  option: Ref<Option<DerivativeToken, DesignToken>>,
) {
  const styleContext = useStyleContext()
  return useGlobalCacheEntry(createCacheToken(styleContext, theme, tokens, option))
}
