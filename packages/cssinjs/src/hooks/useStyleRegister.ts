import type * as CSS from 'csstype'
import type { Ref } from 'vue'
import type Keyframes from '../Keyframes'
import type { Linter } from '../linters'
import type { HashPriority } from '../StyleContext'
import type Theme from '../theme/Theme'
import type { Transformer } from '../transformers/interface.ts'
import type { ExtractStyle } from './useGlobalCache'
import { removeCSS, updateCSS } from '@v-c/util/dist/Dom/dynamicCSS'

import { compile, middleware, prefixer, serialize, stringify } from 'stylis'

import { computed } from 'vue'
import { contentQuotesLinter, hashedAnimationLinter } from '../linters'
import {
  ATTR_CACHE_PATH,
  ATTR_MARK,
  CSS_IN_JS_INSTANCE,
  useStyleContext,
} from '../StyleContext'
import { isClientSide, isNonNullable, toStyleStr, where } from '../util'
import {
  CSS_FILE_STYLE,
  existPath,
  getStyleAndHash,
} from '../util/cacheMapUtil'
import hash from '../util/resolveHash'
import unitless from '../util/resolveUnitless'
import { useGlobalCache } from './useGlobalCache'

// @ts-expect-error // FIXME:
const isDev = process.env.NODE_ENV !== 'production'

const SKIP_CHECK = '_skip_check_'
const MULTI_VALUE = '_multi_value_'

export interface LayerConfig {
  name: string
  dependencies?: string[]
}

export type CSSProperties = Omit<
  CSS.PropertiesFallback<number | string>,
  'animationName'
> & {
  animationName?:
    | CSS.PropertiesFallback<number | string>['animationName']
    | Keyframes
}

export type CSSPropertiesWithMultiValues = {
  [K in keyof CSSProperties]:
    | CSSProperties[K]
    | readonly Extract<CSSProperties[K], string>[]
    | {
      [SKIP_CHECK]?: boolean
      [MULTI_VALUE]?: boolean
      value: CSSProperties[K] | CSSProperties[K][]
    };
}

export type CSSPseudos = { [K in CSS.Pseudos]?: CSSObject }

type ArrayCSSInterpolation = readonly CSSInterpolation[]

export type InterpolationPrimitive
  = | null
    | undefined
    | boolean
    | number
    | string
    | CSSObject

export type CSSInterpolation
  = | InterpolationPrimitive
    | ArrayCSSInterpolation
    | Keyframes

export type CSSOthersObject = Record<string, CSSInterpolation>

export interface CSSObject
  extends CSSPropertiesWithMultiValues,
  CSSPseudos,
  CSSOthersObject {}

// ============================================================================
// ==                                 Parser                                 ==
// ============================================================================
// Preprocessor style content to browser support one
export function normalizeStyle(styleStr: string, autoPrefix: boolean) {
  const serialized = autoPrefix
    ? serialize(compile(styleStr), middleware([prefixer, stringify]))
    : serialize(compile(styleStr), stringify)
  return serialized.replace(/\{%%%:[^;];\}/g, ';')
}

function isCompoundCSSProperty(value: CSSObject[string]) {
  return (
    typeof value === 'object'
    && value
    && (SKIP_CHECK in value || MULTI_VALUE in value)
  )
}

// 注入 hash 值
function injectSelectorHash(
  key: string,
  hashId: string,
  hashPriority: HashPriority = 'high',
) {
  if (!hashId) {
    return key
  }

  const hashSelector = where({ hashCls: hashId, hashPriority })
  // 注入 hashId
  const keys = key.split(',').map((k) => {
    const fullPath = k.trim().split(/\s+/)

    // 如果 Selector 第一个是 HTML Element，那我们就插到它的后面。反之，就插到最前面。
    let firstPath = fullPath[0] || ''
    const htmlElement = firstPath.match(/^\w+/)?.[0] || ''

    firstPath = `${htmlElement}${hashSelector}${firstPath.slice(
      htmlElement.length,
    )}`

    return [firstPath, ...fullPath.slice(1)].join(' ')
  })
  return keys.join(',')
}

export interface ParseConfig {
  hashId?: string
  hashPriority?: HashPriority
  layer?: LayerConfig
  path?: string
  transformers?: Transformer[]
  linters?: Linter[]
}

export interface ParseInfo {
  root?: boolean
  injectHash?: boolean
  parentSelectors: string[]
}

// Parse CSSObject to style content
export function parseStyle(
  interpolation: CSSInterpolation,
  config: ParseConfig = {},
  { root, injectHash, parentSelectors }: ParseInfo = {
    root: true,
    parentSelectors: [],
  },
): [
    parsedStr: string,
    // Style content which should be unique on all of the style (e.g. Keyframes).
    // Firefox will flick with same animation name when exist multiple same keyframes.
    effectStyle: Record<string, string>,
] {
  const {
    hashId,
    layer,
    path,
    hashPriority,
    transformers = [],
    linters = [],
  } = config
  let styleStr = ''
  let effectStyle: Record<string, string> = {}

  function parseKeyframes(keyframes: Keyframes) {
    const animationName = keyframes.getName(hashId)
    if (!effectStyle[animationName]) {
      const [parsedStr] = parseStyle(keyframes.style, config, {
        root: false,
        parentSelectors,
      })

      effectStyle[animationName] = `@keyframes ${keyframes.getName(
        hashId,
      )}${parsedStr}`
    }
  }

  function flattenList(
    list: ArrayCSSInterpolation,
    fullList: CSSObject[] = [],
  ) {
    list.forEach((item) => {
      if (Array.isArray(item)) {
        flattenList(item, fullList)
      }
      else if (item) {
        fullList.push(item as CSSObject)
      }
    })

    return fullList
  }

  const flattenStyleList = flattenList(
    Array.isArray(interpolation) ? interpolation : [interpolation],
  )

  flattenStyleList.forEach((originStyle) => {
    // Only root level can use raw string
    const style: CSSObject = typeof originStyle === 'string' && !root ? {} : originStyle

    if (typeof style === 'string') {
      styleStr += `${style}\n`
    }
    else if ((style as any)._keyframe) {
      // Keyframe
      parseKeyframes(style as unknown as Keyframes)
    }
    else {
      const mergedStyle = transformers.reduce(
        (prev, trans) => trans?.visit?.(prev) || prev,
        style,
      )

      // Normal CSSObject
      Object.keys(mergedStyle).forEach((key) => {
        const value = mergedStyle[key]

        if (
          typeof value === 'object'
          && value
          && (key !== 'animationName' || !(value as Keyframes)._keyframe)
          && !isCompoundCSSProperty(value)
        ) {
          let subInjectHash = false

          // 当成嵌套对象来处理
          let mergedKey = key.trim()
          // Whether treat child as root. In most case it is false.
          let nextRoot = false

          // 拆分多个选择器
          if ((root || injectHash) && hashId) {
            if (mergedKey.startsWith('@')) {
              // 略过媒体查询，交给子节点继续插入 hashId
              subInjectHash = true
            }
            else if (mergedKey === '&') {
              // 抹掉 root selector 上的单个 &
              mergedKey = injectSelectorHash('', hashId, hashPriority)
            }
            else {
              // 注入 hashId
              mergedKey = injectSelectorHash(key, hashId, hashPriority)
            }
          }
          else if (
            root
            && !hashId
            && (mergedKey === '&' || mergedKey === '')
          ) {
            // In case of `{ '&': { a: { color: 'red' } } }` or `{ '': { a: { color: 'red' } } }` without hashId,
            // we will get `&{a:{color:red;}}` or `{a:{color:red;}}` string for stylis to compile.
            // But it does not conform to stylis syntax,
            // and finally we will get `{color:red;}` as css, which is wrong.
            // So we need to remove key in root, and treat child `{ a: { color: 'red' } }` as root.
            mergedKey = ''
            nextRoot = true
          }

          const [parsedStr, childEffectStyle] = parseStyle(
            value as any,
            config,
            {
              root: nextRoot,
              injectHash: subInjectHash,
              parentSelectors: [...parentSelectors, mergedKey],
            },
          )

          effectStyle = {
            ...effectStyle,
            ...childEffectStyle,
          }

          styleStr += `${mergedKey}${parsedStr}`
        }
        else {
          function appendStyle(cssKey: string, cssValue: any) {
            if (
            // @ts-expect-error this is a valid check
              process.env.NODE_ENV !== 'production'
              && (typeof value !== 'object' || !(value as any)?.[SKIP_CHECK])
            ) {
              [contentQuotesLinter, hashedAnimationLinter, ...linters].forEach(
                linter =>
                  linter(cssKey, cssValue, { path, hashId, parentSelectors }),
              )
            }

            // 如果是样式则直接插入
            const styleName = cssKey.replace(
              /[A-Z]/g,
              match => `-${match.toLowerCase()}`,
            )

            // Auto suffix with px
            let formatValue = cssValue
            if (
              !unitless[cssKey]
              && typeof formatValue === 'number'
              && formatValue !== 0
            ) {
              formatValue = `${formatValue}px`
            }

            // handle animationName & Keyframe value
            if (
              cssKey === 'animationName'
              && (cssValue as Keyframes)?._keyframe
            ) {
              parseKeyframes(cssValue as Keyframes)
              formatValue = (cssValue as Keyframes).getName(hashId)
            }

            styleStr += `${styleName}:${formatValue};`
          }

          const actualValue = (value as any)?.value ?? value
          if (
            typeof value === 'object'
            && (value as any)?.[MULTI_VALUE]
            && Array.isArray(actualValue)
          ) {
            actualValue.forEach((item) => {
              appendStyle(key, item)
            })
          }
          else {
            if (isNonNullable(actualValue)) {
              appendStyle(key, actualValue)
            }
          }
        }
      })
    }
  })

  if (!root) {
    styleStr = `{${styleStr}}`
  }
  else if (layer) {
    // fixme: https://github.com/thysultan/stylis/pull/339
    if (styleStr) {
      styleStr = `@layer ${layer.name} {${styleStr}}`
    }

    if (layer.dependencies) {
      effectStyle[`@layer ${layer.name}`] = layer.dependencies
        .map(deps => `@layer ${deps}, ${layer.name};`)
        .join('\n')
    }
  }

  return [styleStr, effectStyle]
}

// ============================================================================
// ==                                Register                                ==
// ============================================================================
export function uniqueHash(path: (string | number)[], styleStr: string) {
  return hash(`${path.join('%')}${styleStr}`)
}

export const STYLE_PREFIX = 'style'

type StyleCacheValue = [
    styleStr: string,
    styleId: string,
    effectStyle: Record<string, string>,
    clientOnly: boolean | undefined,
    order: number,
]
export default function useStyleRegister(
  info: Ref<{
    theme: Theme<any, any>
    token: any
    path: string[]
    hashId?: string
    layer?: LayerConfig
    nonce?: string | (() => string)
    clientOnly?: boolean
    /**
     * Tell cssinjs the insert order of style.
     * It's useful when you need to insert style
     * before other style to overwrite for the same selector priority.
     */
    order?: number
  }>,
  styleFn: () => CSSInterpolation,
) {
  const styleContext = useStyleContext()

  const enableLayer = computed(() => !!styleContext.value.layer)
  const order = computed(() => info.value.order ?? 0)
  const hashId = computed(() => info.value.hashId)

  const fullPath = computed<string []>(() => {
    const path: string[] = [hashId.value || '']
    if (enableLayer.value) {
      path.push('layer')
    }
    path.push(...info.value.path)
    return path
  })

  const isMergedClientSide = computed(() => {
    let merged = isClientSide
    if (isDev && styleContext.value.mock !== undefined) {
      merged = styleContext.value.mock === 'client'
    }
    return merged
  })

  useGlobalCache<StyleCacheValue>(
    computed(() => STYLE_PREFIX),
    fullPath,
    () => {
      const cachePath = fullPath.value.join('|')
      const context = styleContext.value
      const infoValue = info.value

      // Get style from SSR inline style directly
      if (existPath(cachePath)) {
        const [inlineCacheStyleStr, styleHash] = getStyleAndHash(cachePath)
        if (inlineCacheStyleStr) {
          return [
            inlineCacheStyleStr,
            styleHash,
            {},
            infoValue.clientOnly,
            order.value,
          ]
        }
      }

      const styleObj = styleFn()
      const [parsedStyle, effectStyle] = parseStyle(styleObj, {
        hashId: infoValue.hashId,
        hashPriority: context.hashPriority,
        layer: enableLayer.value ? infoValue.layer : undefined,
        path: infoValue.path.join('-'),
        transformers: (context.transformers as any[]) || [],
        linters: context.linters || [],
      })

      const styleStr = normalizeStyle(parsedStyle, styleContext.value.autoPrefix || false)
      const styleId = uniqueHash(fullPath.value, styleStr)

      return [
        styleStr,
        styleId,
        effectStyle,
        infoValue.clientOnly,
        order.value,
      ]
    },
    // Remove cache if no need

    (cacheValue, fromHMR) => {
      const [, styleId] = cacheValue
      if (fromHMR && isClientSide) {
        removeCSS(styleId, { mark: ATTR_MARK })
      }
    },
    // Effect: Inject style here
    (cacheValue) => {
      const [styleStr, styleId, effectStyle, , priority] = cacheValue
      if (!isMergedClientSide.value || styleStr === CSS_FILE_STYLE) {
        return
      }

      const { layer: enableLayer, container, autoPrefix, cache } = styleContext.value
      const { nonce } = info.value

      const mergedCSSConfig: Parameters<typeof updateCSS>[2] = {
        mark: ATTR_MARK,
        prepend: enableLayer ? false : 'queue',
        attachTo: container,
        priority,
      }

      const nonceStr = typeof nonce === 'function' ? nonce() : nonce

      if (nonceStr) {
        mergedCSSConfig.csp = { nonce: nonceStr }
      }

      // ================= Split Effect Style =================
      // We will split effectStyle here since @layer should be at the top level
      const effectLayerKeys: string[] = []
      const effectRestKeys: string[] = []

      Object.keys(effectStyle).forEach((key) => {
        if (key.startsWith('@layer')) {
          effectLayerKeys.push(key)
        }
        else {
          effectRestKeys.push(key)
        }
      })

      // ================= Inject Layer Style =================
      // Inject layer style
      effectLayerKeys.forEach((effectKey) => {
        updateCSS(
          normalizeStyle(effectStyle[effectKey]!, autoPrefix || false),
          `_layer-${effectKey}`,
          { ...mergedCSSConfig, prepend: true },
        )
      })
      // ==================== Inject Style ====================
      // Inject style
      const style = updateCSS(styleStr, styleId, mergedCSSConfig)

      ;(style as any)[CSS_IN_JS_INSTANCE] = cache.instanceId

      if (isDev) {
        style.setAttribute(ATTR_CACHE_PATH, fullPath.value.join('|'))
      }

      // ================ Inject Effect Style =================
      // Inject client side effect style
      effectRestKeys.forEach((effectKey) => {
        updateCSS(
          normalizeStyle(effectStyle[effectKey]!, autoPrefix || false),
          `_effect-${effectKey}`,
          mergedCSSConfig,
        )
      })
    },
  )
}

export const extract: ExtractStyle<StyleCacheValue> = (
  cache,
  effectStyles,
  options,
) => {
  const [styleStr, styleId, effectStyle, clientOnly, order]: StyleCacheValue
    = cache
  const { plain, autoPrefix } = options || {}
  // Skip client only style
  if (clientOnly) {
    return null
  }

  let keyStyleText = styleStr

  // ====================== Share ======================
  // Used for rc-util
  const sharedAttrs = {
    'data-rc-order': 'prependQueue',
    'data-rc-priority': `${order}`,
  }

  // ====================== Style ======================
  keyStyleText = toStyleStr(styleStr, undefined, styleId, sharedAttrs, plain)

  // =============== Create effect style ===============
  if (effectStyle) {
    Object.keys(effectStyle).forEach((effectKey) => {
      // Effect style can be reused
      if (!effectStyles[effectKey]) {
        effectStyles[effectKey] = true
        const effectStyleStr = normalizeStyle(
          effectStyle[effectKey!]!,
          autoPrefix || false,
        )
        const effectStyleHTML = toStyleStr(
          effectStyleStr,
          undefined,
          `_effect-${effectKey}`,
          sharedAttrs,
          plain,
        )

        if (effectKey.startsWith('@layer')) {
          keyStyleText = effectStyleHTML + keyStyleText
        }
        else {
          keyStyleText += effectStyleHTML
        }
      }
    })
  }

  return [order, styleId, keyStyleText]
}
