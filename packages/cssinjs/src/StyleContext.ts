import type { App, InjectionKey, PropType, Ref } from 'vue'
import type { Linter } from './linters'
import { computed, defineComponent, inject, markRaw, provide, ref } from 'vue'

/**
 * @description Style Context
 * vue3 版本的 Style Context实现
 */

import CacheEntity from './Cache'
import { AUTO_PREFIX } from './transformers/autoPrefix.ts'

export const ATTR_TOKEN = 'data-token-hash'
export const ATTR_MARK = 'data-css-hash'
export const ATTR_CACHE_PATH = 'data-cache-path'

// Mark css-in-js instance in style element
export const CSS_IN_JS_INSTANCE = '__cssinjs_instance__'

export function createCache() {
  const cssinjsInstanceId = Math.random().toString(12).slice(2)

  // Tricky SSR: Move all inline style to the head.
  // PS: We do not recommend tricky mode.
  if (typeof document !== 'undefined' && document.head && document.body) {
    const styles = document.body.querySelectorAll(`style[${ATTR_MARK}]`) || []
    const { firstChild } = document.head

    Array.from(styles).forEach((style) => {
      (style as any)[CSS_IN_JS_INSTANCE]
        = (style as any)[CSS_IN_JS_INSTANCE] || cssinjsInstanceId

      // Not force move if no head
      if ((style as any)[CSS_IN_JS_INSTANCE] === cssinjsInstanceId) {
        document.head.insertBefore(style, firstChild)
      }
    })

    // Deduplicate of moved styles
    const styleHash: Record<string, boolean> = {}
    Array.from(document.querySelectorAll(`style[${ATTR_MARK}]`)).forEach(
      (style) => {
        const hash = style.getAttribute(ATTR_MARK)!
        if (styleHash[hash]) {
          if ((style as any)[CSS_IN_JS_INSTANCE] === cssinjsInstanceId) {
            style.parentNode?.removeChild(style)
          }
        }
        else {
          styleHash[hash] = true
        }
      },
    )
  }

  return markRaw(new CacheEntity(cssinjsInstanceId))
}
const defaultStyleContext: StyleContextProps = {
  defaultCache: true,
  cache: createCache(),
  hashPriority: 'low',
  autoPrefix: false,
}

const StyleContextKey: InjectionKey<Ref<StyleContextProps>> = Symbol('StyleContext')

export function useStyleContextProvide(props: Ref<StyleContextProps>) {
  provide(StyleContextKey, props)
}

export function provideStyleContext(app: App, props: Ref<StyleContextProps>) {
  app.provide(StyleContextKey, props)
}

export function useStyleContext() {
  return inject(StyleContextKey, ref<StyleContextProps>(defaultStyleContext))
}
export type HashPriority = 'low' | 'high'

export interface StyleContextProps {
  autoClear?: boolean
  /** @private Test only. Not work in production. */
  mock?: 'server' | 'client'
  /**
   * Only set when you need ssr to extract style on you own.
   * If not provided, it will auto create <style /> on the end of Provider in server side.
   */
  cache: CacheEntity
  /** Tell children that this context is default generated context */
  defaultCache: boolean
  /** Use `:where` selector to reduce hashId css selector priority */
  hashPriority?: HashPriority
  /** Tell cssinjs where to inject style in */
  container?: Element | ShadowRoot
  /** Component wil render inline  `<style />` for fallback in SSR. Not recommend. */
  ssrInline?: boolean
  /** Transform css before inject in document. Please note that `transformers` do not support dynamic update */
  transformers?: Transformer[]
  /**
   * Linters to lint css before inject in document.
   * Styles will be linted after transforming.
   * Please note that `linters` do not support dynamic update.
   */
  linters?: Linter[]
  /** Wrap css in a layer to avoid global style conflict */
  layer?: boolean

  /** Hardcode here since transformer not support take effect on serialize currently */
  autoPrefix?: boolean
}

export const styleContextProps = {
  autoClear: {
    type: Boolean,
    default: undefined,
  },

  mock: {
    type: String as PropType<'server' | 'client'>,
    default: undefined,
  },

  cache: {
    type: Object as PropType<CacheEntity>,
  },

  defaultCache: {
    type: Boolean,
  },

  hashPriority: {
    type: String as PropType<HashPriority>,
    default: undefined,
  },

  container: {
    type: [Object] as PropType<Element | ShadowRoot>,
    default: undefined,
  },

  ssrInline: {
    type: Boolean,
    default: undefined,
  },

  transformers: {
    type: Array as PropType<Transformer[]>,
    default: undefined,
  },

  linters: {
    type: Array as PropType<Linter[]>,
    default: undefined,
  },

  layer: {
    type: Boolean,
    default: undefined,
  },

  autoPrefix: {
    type: Boolean,
    default: undefined,
  },
}
export type StyleProviderProps = StyleContextProps

export const StyleProvider = defineComponent<Partial<StyleContextProps>>(
  (props, { slots }) => {
    const parentContext = useStyleContext()
    const context = computed(() => {
      const restProps = props
      const mergedContext: StyleContextProps = {
        ...parentContext.value,
      };

      (
        Object.keys(restProps) as (keyof Omit<StyleProviderProps, 'children'>)[]
      ).forEach((key) => {
        const value = restProps[key]
        if (restProps[key] !== undefined) {
          (mergedContext as any)[key] = value
        }
      })

      const { cache, transformers = [] } = restProps
      mergedContext.cache = mergedContext.cache || createCache()
      mergedContext.defaultCache = !cache && parentContext.value?.defaultCache

      // autoPrefix
      if (transformers.includes(AUTO_PREFIX)) {
        mergedContext.autoPrefix = true
      }

      return mergedContext
    })
    useStyleContextProvide(context)
    return () => {
      return slots?.default?.()
    }
  },
  {
    props: styleContextProps,
  },
)
