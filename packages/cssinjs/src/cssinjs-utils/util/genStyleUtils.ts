import type { Ref, UnwrapRef } from 'vue'
import type { AbstractCalculator, CSSInterpolation, CSSObject, TokenType } from '../../index'
import type { UseCSP } from '../hooks/useCSP'
import type { UsePrefix } from '../hooks/usePrefix'

import type { UseToken } from '../hooks/useToken'
import type {
  ComponentTokenKey,
  GlobalTokenWithComponent,
  TokenMap,
  TokenMapKey,
} from '../interface'
import { computed, defineComponent } from 'vue'

import { genCalc, token2CSSVar, useCSSVarRegister, useStyleRegister } from '../../index'
import useUniqueMemo from '../_util/hooks/useUniqueMemo'
import useDefaultCSP from '../hooks/useCSP'

import getComponentToken from './getComponentToken'
import getCompVarPrefix from './getCompVarPrefix'
import getDefaultComponentToken from './getDefaultComponentToken'
import genMaxMin from './maxmin'
import statisticToken, { merge as mergeToken } from './statistic'

type LayerConfig = UnwrapRef<Parameters<typeof useStyleRegister>[0]>['layer']

export interface StyleInfo {
  hashId: string
  prefixCls: string
  rootPrefixCls: string
  iconPrefixCls: string
}

export interface CSSUtil {
  calc: (number: any) => AbstractCalculator
  max: (...values: (number | string)[]) => number | string
  min: (...values: (number | string)[]) => number | string
}

export type TokenWithCommonCls<T> = T & {
  /** Wrap component class with `.` prefix */
  componentCls: string
  /** Origin prefix which do not have `.` prefix */
  prefixCls: string
  /** Wrap icon class with `.` prefix */
  iconCls: string
  /** Wrap ant prefixCls class with `.` prefix */
  antCls: string
} & CSSUtil

export type FullToken<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  C extends TokenMapKey<CompTokenMap>,
> = TokenWithCommonCls<GlobalTokenWithComponent<CompTokenMap, AliasToken, C>>

export type GenStyleFn<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  C extends TokenMapKey<CompTokenMap>,
> = (token: FullToken<CompTokenMap, AliasToken, C>, info: StyleInfo) => CSSInterpolation

export type GetDefaultTokenFn<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  C extends TokenMapKey<CompTokenMap>,
> = (token: AliasToken & Partial<CompTokenMap[C]>) => CompTokenMap[C]

export type GetDefaultToken<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  C extends TokenMapKey<CompTokenMap>,
> = null | CompTokenMap[C] | GetDefaultTokenFn<CompTokenMap, AliasToken, C>

export interface SubStyleComponentProps {
  prefixCls: string
  rootCls?: string
}

export interface CSSVarRegisterProps {
  rootCls: string
  component: string
  cssVar: {
    prefix?: string
    key?: string
  }
}

interface GetResetStylesConfig {
  prefix: ReturnType<UsePrefix>
  csp: ReturnType<UseCSP>
}

export type GetResetStyles<AliasToken extends TokenType> = (token: AliasToken, config?: GetResetStylesConfig) => CSSInterpolation

export type GetCompUnitless<CompTokenMap extends TokenMap, AliasToken extends TokenType> = <
  C extends TokenMapKey<CompTokenMap>,
>(
  component: C | [C, string],
) => Partial<Record<ComponentTokenKey<CompTokenMap, AliasToken, C>, boolean>>

function genStyleUtils<
  CompTokenMap extends TokenMap,
  AliasToken extends TokenType,
  DesignToken extends TokenType,
>(config: {
  usePrefix: UsePrefix
  useToken: UseToken<CompTokenMap, AliasToken, DesignToken>
  useCSP?: UseCSP
  getResetStyles?: GetResetStyles<AliasToken>
  getCommonStyle?: (
    token: AliasToken,
    componentPrefixCls: string,
    rootCls?: string,
    resetFont?: boolean,
  ) => CSSObject
  getCompUnitless?: GetCompUnitless<CompTokenMap, AliasToken>
  layer?: LayerConfig
}) {
  // Dependency inversion for preparing basic config.
  const {
    useCSP = useDefaultCSP,
    useToken,
    usePrefix,
    getResetStyles,
    getCommonStyle,
    getCompUnitless,
  } = config

  function genStyleHooks<C extends TokenMapKey<CompTokenMap>>(
    component: C | [C, string],
    styleFn: GenStyleFn<CompTokenMap, AliasToken, C>,
    getDefaultToken?: GetDefaultToken<CompTokenMap, AliasToken, C>,
    options?: {
      resetStyle?: boolean
      resetFont?: boolean
      deprecatedTokens?: [
        ComponentTokenKey<CompTokenMap, AliasToken, C>,
        ComponentTokenKey<CompTokenMap, AliasToken, C>,
      ][]
      /**
       * Component tokens that do not need unit.
       */
      unitless?: Partial<Record<ComponentTokenKey<CompTokenMap, AliasToken, C>, boolean>>
      /**
       * Only use component style in client side. Ignore in SSR.
       */
      clientOnly?: boolean
      /**
       * Set order of component style.
       * @default -999
       */
      order?: number
      /**
       * Whether generate styles
       * @default true
       */
      injectStyle?: boolean
    },
  ) {
    const componentName = Array.isArray(component) ? component[0] : component

    function prefixToken(key: string) {
      return `${String(componentName)}${key.slice(0, 1).toUpperCase()}${key.slice(1)}`
    }

    // Fill unitless
    const originUnitless = options?.unitless || {}

    const originCompUnitless
      = typeof getCompUnitless === 'function' ? getCompUnitless(component) : {}

    const compUnitless: any = {
      ...originCompUnitless,
      [prefixToken('zIndexPopup')]: true,
    }
    Object.keys(originUnitless).forEach((key) => {
      compUnitless[prefixToken(key)]
        = originUnitless[key as keyof ComponentTokenKey<CompTokenMap, AliasToken, C>]
    })

    // Options
    const mergedOptions = {
      ...options,
      unitless: compUnitless,
      prefixToken,
    }

    // Hooks
    const useStyle = genComponentStyleHook(component, styleFn, getDefaultToken, mergedOptions)

    const useCSSVar = genCSSVarRegister(componentName, getDefaultToken, mergedOptions)

    return (prefixCls: Ref<string>, rootCls: Ref<string | undefined> = prefixCls) => {
      const hashId = useStyle(prefixCls, rootCls)
      const cssVarCls = useCSSVar(rootCls)

      return [hashId, cssVarCls] as const
    }
  }

  function genCSSVarRegister<C extends TokenMapKey<CompTokenMap>>(
    component: C,
    getDefaultToken: GetDefaultToken<CompTokenMap, AliasToken, C> | undefined,
    options: {
      unitless?: Partial<Record<ComponentTokenKey<CompTokenMap, AliasToken, C>, boolean>>
      ignore?: Partial<Record<keyof AliasToken, boolean>>
      deprecatedTokens?: [
        ComponentTokenKey<CompTokenMap, AliasToken, C>,
        ComponentTokenKey<CompTokenMap, AliasToken, C>,
      ][]
      injectStyle?: boolean
      prefixToken: (key: string) => string
    },
  ) {
    const { unitless: compUnitless, prefixToken, ignore } = options
    return (rootCls: Ref<string | undefined>) => {
      const { cssVar, realToken } = useToken()
      useCSSVarRegister(
        computed(() => {
          const _cssVar = cssVar!.value!
          return {
            path: [component],
            prefix: _cssVar?.prefix,
            key: _cssVar.key,
            unitless: compUnitless,
            ignore,
            token: realToken?.value,
            scope: rootCls.value,
          } as any
        }),
        () => {
          const defaultToken = getDefaultComponentToken<CompTokenMap, AliasToken, C>(
            component,
            realToken!.value!,
            getDefaultToken as any,
          )
          const componentToken = getComponentToken<CompTokenMap, AliasToken, C>(
            component,
            realToken!.value!,
            defaultToken as any,
            {
              deprecatedTokens: options?.deprecatedTokens,
            },
          )
          if (defaultToken) {
            Object.keys(defaultToken).forEach((key) => {
              componentToken[prefixToken(key)] = componentToken[key]
              delete componentToken[key]
            })
          }
          return componentToken
        },
      )

      return computed(() => cssVar?.value?.key)
    }
  }

  function genComponentStyleHook<C extends TokenMapKey<CompTokenMap>>(
    componentName: C | [C, string],
    styleFn: GenStyleFn<CompTokenMap, AliasToken, C>,
    getDefaultToken?: GetDefaultToken<CompTokenMap, AliasToken, C>,
    options: {
      resetStyle?: boolean
      resetFont?: boolean
      // Deprecated token key map [["oldTokenKey", "newTokenKey"], ["oldTokenKey", "newTokenKey"]]
      deprecatedTokens?: [
        ComponentTokenKey<CompTokenMap, AliasToken, C>,
        ComponentTokenKey<CompTokenMap, AliasToken, C>,
      ][]
      /**
       * Only use component style in client side. Ignore in SSR.
       */
      clientOnly?: boolean
      /**
       * Set order of component style. Default is -999.
       */
      order?: number
      injectStyle?: boolean
      unitless?: Partial<Record<ComponentTokenKey<CompTokenMap, AliasToken, C>, boolean>>
    } = {},
  ) {
    const cells = (
      Array.isArray(componentName) ? componentName : [componentName, componentName]
    ) as [C, string]

    const [component] = cells
    const concatComponent = cells.join('-')

    const mergedLayer = config.layer || {
      name: 'antd',
    }

    // Return new style hook
    return (prefixCls: Ref<string>, rootCls?: Ref<string | undefined>) => {
      const { theme, hashId, token, realToken, cssVar, zeroRuntime } = useToken()

      // Update of `disabledRuntimeStyle` would cause React hook error, so memoized it and never update.
      const mergedZeroRuntime = computed(() => {
        return zeroRuntime?.value
      })
      if (mergedZeroRuntime.value) {
        return hashId!
      }

      const prefix = usePrefix()
      const csp = useCSP()

      const type = 'css'

      // Use unique memo to share the result across all instances
      const calc = computed(() => {
        return useUniqueMemo(() => {
          const unitlessCssVar = new Set<string>()
          Object.keys(options.unitless || {}).forEach((key) => {
            // Some component proxy the AliasToken (e.g. Image) and some not (e.g. Modal)
            // We should both pass in `unitlessCssVar` to make sure the CSSVar can be unitless.
            unitlessCssVar.add(token2CSSVar(key, cssVar?.value?.prefix))
            unitlessCssVar.add(token2CSSVar(key, getCompVarPrefix(component, cssVar?.value?.prefix)))
          })

          return genCalc(type, unitlessCssVar)
        }, [type, component, cssVar?.value?.prefix])
      })

      const { max, min } = genMaxMin(type)

      // Shared config
      const sharedConfig = computed(() => {
        return {
          theme: theme?.value,
          token: token.value,
          hashId: hashId?.value,
          nonce: () => csp.value.nonce!,
          clientOnly: options.clientOnly,
          layer: mergedLayer,

          // antd is always at top of styles
          order: options.order || -999,
        }
      })

      // This if statement is safe, as it will only be used if the generator has the function. It's not dynamic.
      if (typeof getResetStyles === 'function') {
        // Generate style for all need reset tags.
        useStyleRegister(
          computed(() => ({
            ...sharedConfig.value,
            clientOnly: false,
            path: ['Shared', prefix.value?.rootPrefixCls],
          } as any)),
          () => getResetStyles(
            token.value,
            {
              prefix: computed(() => ({
                rootPrefixCls: prefix.value.rootPrefixCls,
                iconPrefixCls: prefix.value.iconPrefixCls,
              })),
              csp,
            },
          ),
        )
      }
      useStyleRegister(
        computed(() => {
          return {
            ...sharedConfig.value,
            path: [concatComponent, prefixCls.value, prefix.value.iconPrefixCls],
          } as any
        }),
        () => {
          if (options.injectStyle === false) {
            return []
          }

          const { token: proxyToken, flush } = statisticToken(token.value)
          const tokenForCalc = realToken?.value || proxyToken
          const defaultComponentToken = getDefaultComponentToken<CompTokenMap, AliasToken, C>(
            component,
            tokenForCalc,
            getDefaultToken as any,
          )

          const componentCls = `.${prefixCls.value}`
          const componentToken = getComponentToken<CompTokenMap, AliasToken, C>(
            component,
            tokenForCalc,
            defaultComponentToken as any,
            { deprecatedTokens: options.deprecatedTokens },
          )

          if (defaultComponentToken && typeof defaultComponentToken === 'object') {
            Object.keys(defaultComponentToken).forEach((key) => {
              (defaultComponentToken as any)[key] = `var(${token2CSSVar(
                key,
                getCompVarPrefix(component, cssVar?.value?.prefix),
              )})`
            })
          }
          const mergedToken = mergeToken<any>(
            proxyToken,
            {
              componentCls,
              prefixCls: prefixCls.value,
              iconCls: `.${prefix.value.iconPrefixCls}`,
              antCls: `.${prefix.value.rootPrefixCls}`,
              calc: calc.value,
              max,
              min,
            },
            defaultComponentToken,
          )

          const styleInterpolation = styleFn(mergedToken, {
            hashId: hashId!.value!,
            prefixCls: prefixCls.value,
            rootPrefixCls: prefix.value.rootPrefixCls,
            iconPrefixCls: prefix.value.iconPrefixCls,
          })
          flush(component, componentToken)
          const commonStyle
            = typeof getCommonStyle === 'function'
              ? getCommonStyle(mergedToken, prefixCls.value, rootCls?.value, options.resetFont)
              : null
          return [options.resetStyle === false ? null : commonStyle, styleInterpolation]
        },
      )

      return hashId!
    }
  }

  function genSubStyleComponent<C extends TokenMapKey<CompTokenMap>>(
    componentName: C | [C, string],
    styleFn: GenStyleFn<CompTokenMap, AliasToken, C>,
    getDefaultToken?: GetDefaultToken<CompTokenMap, AliasToken, C>,
    options: {
      resetStyle?: boolean
      resetFont?: boolean
      // Deprecated token key map [["oldTokenKey", "newTokenKey"], ["oldTokenKey", "newTokenKey"]]
      deprecatedTokens?: [
        ComponentTokenKey<CompTokenMap, AliasToken, C>,
        ComponentTokenKey<CompTokenMap, AliasToken, C>,
      ][]
      /**
       * Only use component style in client side. Ignore in SSR.
       */
      clientOnly?: boolean
      /**
       * Set order of component style. Default is -999.
       */
      order?: number
      injectStyle?: boolean
      unitless?: Partial<Record<ComponentTokenKey<CompTokenMap, AliasToken, C>, boolean>>
    } = {},
  ) {
    const useStyle = genComponentStyleHook(componentName, styleFn, getDefaultToken, {
      resetStyle: false,

      // Sub Style should default after root one
      order: -998,
      ...options,
    })

    return defineComponent({
      props: {
        prefixCls: String,
        rootCls: String,
      },
      setup(props) {
        useStyle(computed(() => props.prefixCls!), computed(() => props.rootCls ?? props.prefixCls))
        return () => {
          return null
        }
      },
      name: `SubStyle_${String(
        Array.isArray(componentName) ? componentName.join('.') : componentName,
      )}`,
    })
  }

  return { genStyleHooks, genSubStyleComponent, genComponentStyleHook }
}

export default genStyleUtils
