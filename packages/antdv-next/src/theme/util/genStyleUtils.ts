import type { GetCompUnitless, UseTokenReturn } from '@antdv-next/cssinjs'
import type { ComputedRef } from 'vue'
import type { AliasToken, ComponentTokenMap, SeedToken } from '../interface'
import { genStyleUtils } from '@antdv-next/cssinjs/cssinjs-utils'
import { computed, effectScope } from 'vue'
import { defaultIconPrefixCls, useConfig } from '../../config-provider/context'
import { genCommonStyle, genIconStyle, genLinkStyle } from '../../style'
import useLocalToken, { unitless } from '../useToken.ts'

/**
 * Derive a computed from the injected config ref once per ref instead of once
 * per component instance. The config ref is stable per ConfigProvider (and a
 * module singleton without one), so the WeakMap entry lives exactly as long
 * as the provider.
 */
function memoByConfig<T>(cache: WeakMap<object, ComputedRef<T>>, create: (config: ReturnType<typeof useConfig>) => T) {
  const config = useConfig()
  let result = cache.get(config)
  if (!result) {
    result = effectScope(true).run(() => computed(() => create(config)))!
    cache.set(config, result)
  }
  return result
}

const prefixCache = new WeakMap<object, ComputedRef<{ rootPrefixCls: string, iconPrefixCls: string }>>()
const cspCache = new WeakMap<object, ComputedRef<{ nonce?: string }>>()

export type StyleTokenResult = UseTokenReturn<ComponentTokenMap, AliasToken, SeedToken>

/**
 * `useToken()` in the shape the cssinjs style hooks consume. Components that
 * need the token themselves (e.g. Wave) call this once and pass the result to
 * their style hook so the token is resolved a single time per instance.
 */
export function useStyleToken(): StyleTokenResult {
  // `hashId` is already '' when not hashed and `cssVar` always carries
  // prefix / key, so the refs can be passed through without extra computeds.
  const [theme, realToken, hashId, token, cssVar, zeroRuntime] = useLocalToken()
  return {
    theme,
    realToken,
    hashId,
    token,
    cssVar,
    zeroRuntime,
  }
}

export const { genComponentStyleHook, genStyleHooks, genSubStyleComponent } = genStyleUtils<
  ComponentTokenMap,
  AliasToken,
  SeedToken
>({
  usePrefix: () => memoByConfig(prefixCache, (configCtx) => {
    const { getPrefixCls, iconPrefixCls } = configCtx.value
    const rootPrefixCls = getPrefixCls()
    return {
      rootPrefixCls,
      iconPrefixCls,
    }
  }),
  useToken: useStyleToken,
  useCSP: () => memoByConfig(cspCache, configCtx => configCtx.value?.csp ?? {}),
  getResetStyles: (token, config) => {
    const linkStyle = genLinkStyle(token)
    const { prefix } = config ?? {}
    return [
      linkStyle,
      { '&': linkStyle },
      genIconStyle(prefix?.value?.iconPrefixCls ?? defaultIconPrefixCls),
    ]
  },
  getCommonStyle: genCommonStyle,
  getCompUnitless: (() => unitless) as GetCompUnitless<ComponentTokenMap, AliasToken>,
})

type CssVarName = (name: string) => `--${string}`
type CssVarRef = (name: string, fallback?: string | number) => `var(--${string})`

export function genCssVar(antCls: string, component: string): readonly [varName: CssVarName, varRef: CssVarRef] {
  const cssPrefix = `--${antCls.replace(/\./g, '')}-${component}-` satisfies `--${string}`
  const varName: CssVarName = (name) => {
    return `${cssPrefix}${name}`
  }
  const varRef: CssVarRef = (name, fallback) => {
    return fallback ? `var(${cssPrefix}${name}, ${fallback})` : `var(${cssPrefix}${name})`
  }
  return [varName, varRef] as const
}
