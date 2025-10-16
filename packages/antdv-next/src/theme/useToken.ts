import type { Theme } from '@antdv-next/cssinjs'
import type { Ref } from 'vue'
import type { DesignTokenProviderProps } from './context'
import type { AliasToken, GlobalToken, SeedToken } from './interface'
import { useCacheToken } from '@antdv-next/cssinjs'
import { computed } from 'vue'
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
export default function useToken(): [
    theme: Ref<Theme<SeedToken, AliasToken>>,
    token: Ref<GlobalToken>,
    hashId: Ref<string>,
    realToken: Ref<GlobalToken>,
    cssVar?: Ref<DesignTokenProviderProps['cssVar']>,
] {
  const designContext = useDesignToken()
  const salt = computed(() => `${version}-${designContext.value.hashed || ''}`)
  const mergedTheme = computed(() => designContext.value?.theme || defaultTheme)
  const cssVar = computed(() => {
    const cssVar = designContext.value.cssVar
    return cssVar && {
      prefix: cssVar.prefix,
      key: cssVar.key,
      unitless,
      ignore,
      preserve,
    }
  })
  const cachedToken = useCacheToken<GlobalToken, SeedToken>(
    mergedTheme,
    computed(() => [defaultSeedToken, designContext.value.token]),
    computed(() => {
      const cssVar = designContext.value.cssVar
      return {
        salt: salt.value,
        override: designContext.value.override,
        getComputedToken,
        // formatToken will not be consumed after 1.15.0 with getComputedToken.
        // But token will break if @ant-design/cssinjs is under 1.15.0 without it
        formatToken,
        cssVar: cssVar && {
          prefix: cssVar.prefix,
          key: cssVar.key,
          unitless,
          ignore,
          preserve,
        },
      }
    }),
  )
  const realToken = computed(() => cachedToken.value[2])
  const hashId = computed(() => designContext.value.hashed ? cachedToken.value[1] : '')
  const token = computed(() => cachedToken.value[0])
  return [mergedTheme, realToken, hashId, token, cssVar]
}
