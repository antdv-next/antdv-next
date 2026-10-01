import type { GlobalCacheEntry, StyleProviderProps, Theme } from '@antdv-next/cssinjs'
import type { Ref } from 'vue'
import type { ConfigConsumerProps } from '../config-provider/context'
import type { DesignTokenProviderProps } from './context'
import type { AliasToken, GlobalToken, SeedToken } from './interface'
import { createCacheToken, useGlobalCacheEntry, useStyleContext } from '@antdv-next/cssinjs'
import { computed, effectScope } from 'vue'
import { useConfig } from '../config-provider/context'
import version from '../version'
import { defaultTheme, useDesignToken } from './context'
import defaultSeedToken from './themes/seed'
import formatToken from './util/alias'

export const unitless: {
  [key in keyof AliasToken]?: boolean;
} = {
  lineHeight: true,
  lineHeightSM: true,
  lineHeightLG: true,
  lineHeightHeading1: true,
  lineHeightHeading2: true,
  lineHeightHeading3: true,
  lineHeightHeading4: true,
  lineHeightHeading5: true,
  opacityLoading: true,
  fontWeightStrong: true,
  zIndexPopupBase: true,
  zIndexBase: true,
  opacityImage: true,
}

export const ignore: {
  [key in keyof AliasToken]?: boolean;
} = {
  motionBase: true,
  motionUnit: true,
}

const preserve: {
  [key in keyof AliasToken]?: boolean;
} = {
  screenXS: true,
  screenXSMin: true,
  screenXSMax: true,
  screenSM: true,
  screenSMMin: true,
  screenSMMax: true,
  screenMD: true,
  screenMDMin: true,
  screenMDMax: true,
  screenLG: true,
  screenLGMin: true,
  screenLGMax: true,
  screenXL: true,
  screenXLMin: true,
  screenXLMax: true,
  screenXXL: true,
  screenXXLMin: true,
  screenXXLMax: true,
  screenXXXL: true,
  screenXXXLMin: true,
}

export function getComputedToken(originToken: SeedToken, overrideToken: DesignTokenProviderProps['components'] & {
  override?: Partial<AliasToken>
}, theme: Theme<any, any>) {
  const derivativeToken = theme.getDerivativeToken(originToken)

  const { override, ...components } = overrideToken

  // Merge with override
  let mergedDerivativeToken = {
    ...derivativeToken,
    override,
  }

  // Format if needed
  mergedDerivativeToken = formatToken(mergedDerivativeToken)

  if (components) {
    Object.entries(components).forEach(([key, value]) => {
      const { theme: componentTheme, ...componentTokens } = value as any
      let mergedComponentToken = componentTokens
      if (componentTheme) {
        mergedComponentToken = getComputedToken(
          {
            ...mergedDerivativeToken,
            ...componentTokens,
          },
          {
            override: componentTokens,
          },
          componentTheme,
        )
      }
      mergedDerivativeToken[key] = mergedComponentToken
    })
  }

  return mergedDerivativeToken
}

// ================================== Hook ==================================
export type UseTokenResult = [
  theme: Ref<Theme<SeedToken, AliasToken>>,
  token: Ref<GlobalToken>,
  hashId: Ref<string>,
  realToken: Ref<GlobalToken>,
  cssVar: Ref<{ prefix: string, key: string }>,
  zeroRuntime: Ref<boolean>,
]

interface SharedToken {
  entry: GlobalCacheEntry<any>
  result: UseTokenResult
}

/**
 * The derived token only depends on the three injected contexts, so compute it
 * once per (design token, config, style context) triple and let every component
 * instance under those providers reuse the same computeds. Each instance only
 * holds a reference on the cache entry (`useGlobalCacheEntry`).
 */
function createSharedToken(
  designContext: Ref<DesignTokenProviderProps>,
  config: Ref<ConfigConsumerProps>,
  styleContext: Ref<StyleProviderProps>,
): SharedToken {
  const salt = computed(() => `${version}-${designContext.value.hashed || ''}`)
  const mergedTheme = computed(() => designContext.value?.theme || defaultTheme)
  const cssVar = computed(() => {
    const cssVar = designContext.value.cssVar
    return {
      prefix: cssVar?.prefix ?? config.value?.getPrefixCls?.() ?? 'ant',
      key: cssVar?.key ?? 'css-var-root',
    }
  })
  const entry = createCacheToken<GlobalToken, SeedToken>(
    styleContext,
    mergedTheme,
    computed(() => [defaultSeedToken, designContext.value.token]),
    computed(() => {
      return {
        salt: salt.value,
        override: designContext.value.override,
        getComputedToken,
        cssVar: {
          ...cssVar.value,
          unitless,
          ignore,
          preserve,
        },
        nonce: (designContext.value as { csp?: { nonce?: string } }).csp?.nonce ?? config.value?.csp?.nonce,
      } as any
    }),
  )
  const cachedToken = entry.value
  const realToken = computed(() => cachedToken.value[2])
  const hashId = computed(() => designContext.value.hashed ? cachedToken.value[1] : '')
  const token = computed(() => cachedToken.value[0])
  const zeroRuntime = computed(() => !!designContext.value?.zeroRuntime)
  return {
    entry,
    result: [mergedTheme, realToken, hashId, token, cssVar, zeroRuntime],
  }
}

type SharedTokenMap = WeakMap<object, WeakMap<object, WeakMap<object, SharedToken>>>
const sharedTokenMap: SharedTokenMap = new WeakMap()

function getSharedToken(
  designContext: Ref<DesignTokenProviderProps>,
  config: Ref<ConfigConsumerProps>,
  styleContext: Ref<StyleProviderProps>,
): SharedToken {
  let byConfig = sharedTokenMap.get(designContext)
  if (!byConfig) {
    byConfig = new WeakMap()
    sharedTokenMap.set(designContext, byConfig)
  }
  let byStyle = byConfig.get(config)
  if (!byStyle) {
    byStyle = new WeakMap()
    byConfig.set(config, byStyle)
  }
  let shared = byStyle.get(styleContext)
  if (!shared) {
    // Detached scope: the shared computeds must outlive the component that
    // happens to create them first.
    shared = effectScope(true).run(() => createSharedToken(designContext, config, styleContext))!
    byStyle.set(styleContext, shared)
  }
  return shared
}

export default function useToken(): UseTokenResult {
  const designContext = useDesignToken()
  const config = useConfig()
  const styleContext = useStyleContext()
  const shared = getSharedToken(designContext, config, styleContext)
  useGlobalCacheEntry(shared.entry)
  return shared.result
}
