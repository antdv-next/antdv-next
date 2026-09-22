import type { Theme } from '@antdv-next/cssinjs'
import type { InjectionKey, Ref } from 'vue'

import type { AliasToken, MapToken, OverrideToken, SeedToken } from './interface'
import { computed, defineComponent, inject, provide } from 'vue'
import defaultSeedToken from './themes/seed'

export { default as defaultTheme } from './themes/default/theme'

// ================================ Context =================================
// To ensure snapshot stable. We disable hashed in test env.
export const defaultConfig = {
  token: defaultSeedToken,
  override: { override: defaultSeedToken },
  hashed: false,
}

export type ComponentsToken = {
  [key in keyof OverrideToken]?: OverrideToken[key] & {
    theme?: Theme<SeedToken, MapToken>
  };
}

export interface DesignTokenProviderProps {
  token: Partial<AliasToken>
  theme?: Theme<SeedToken, MapToken>
  components?: ComponentsToken
  /** Just merge `token` & `override` at top to save perf */
  override: { override: Partial<AliasToken> } & ComponentsToken
  hashed?: string | boolean
  cssVar?: { prefix?: string, key?: string }
  /**
   * @descCN 开启零运行时模式，不会在运行时产生样式，需要手动引入 CSS 文件。
   * @descEN Enable zero-runtime mode, which will not generate style at runtime, need to import additional CSS file.
   * @default true
   * @example
   * ```tsx
   * import { ConfigProvider } from 'antd';
   * import 'antd/dist/antd.css';
   *
   * const Demo = () => (
   *   <ConfigProvider theme={{ zeroRuntime: true }}>
   *     <App />
   *   </ConfigProvider>
   *);
   * ```
   */
  zeroRuntime?: boolean
}
export const DesignTokenContextKey: InjectionKey<Ref<DesignTokenProviderProps>> = Symbol('DesignTokenContext')

export function useDesignTokenProvide(props: Ref<DesignTokenProviderProps>) {
  provide(DesignTokenContextKey, props)
}

export const DesignTokenProvider = defineComponent(
  (props, { slots }) => {
    const designToken = computed(() => props.value)
    useDesignTokenProvide(designToken)
    return () => {
      return slots?.default?.()
    }
  },
  {
    props: ['value'],
  },
)

export function useDesignToken() {
  return inject(DesignTokenContextKey, computed(() => defaultConfig))
}
