import type { SlotsType } from 'vue'
import type { ConfigConsumerProps, ThemeConfig } from './context'
import type {
  ConfigProviderEmits,
  ConfigProviderProps,
  ConfigProviderSlots,
} from './define.ts'
import { createTheme } from '@antdv-next/cssinjs'
import defu from 'defu'
import {
  computed,
  defineComponent,
} from 'vue'
import { defaultTheme, DesignTokenProvider } from '../theme/context.ts'
import defaultSeedToken from '../theme/themes/seed'
import { defaultIconPrefixCls, useConfig, useConfigProvider } from './context'
import { useTheme } from './hooks/useTheme.ts'
import { SizeProvider } from './SizeContext.ts'
import useStyle from './style'

interface ProviderChildrenProps extends ConfigProviderProps {
  parentContext: ConfigConsumerProps
  // legacyLocale: Locale;
}

// These props is used by `useContext` directly in sub component
const PASSED_PROPS: Exclude<
  keyof ConfigConsumerProps,
    'rootPrefixCls' | 'getPrefixCls' | 'warning'
>[] = [
  'getTargetContainer',
  'getPopupContainer',
  'renderEmpty',
  // 'input',
  // 'pagination',
  // 'form',
  // 'select',
  // 'button',
]

const providerDefaultProps: any = {
  componentDisabled: undefined,
}

const ProviderChildren = defineComponent<
  ProviderChildrenProps,
  ConfigProviderEmits,
  string,
  SlotsType<ConfigProviderSlots>
>(
  (props = providerDefaultProps, { slots }) => {
    const theme = computed(() => props.theme)
    const parentTheme = computed(() => props.parentContext?.theme)
    // =================================== Context ===================================
    const getPrefixCls = (suffixCls: string, customizePrefixCls?: string) => {
      const { prefixCls, parentContext } = props

      if (customizePrefixCls) {
        return customizePrefixCls
      }

      const mergedPrefixCls = prefixCls || parentContext.getPrefixCls('')

      return suffixCls ? `${mergedPrefixCls}-${suffixCls}` : mergedPrefixCls
    }
    const iconPrefixCls = computed(() => props.iconPrefixCls ?? props?.parentContext?.iconPrefixCls ?? defaultIconPrefixCls)
    const csp = computed(() => props.csp ?? props?.parentContext?.csp)
    useStyle(iconPrefixCls, csp)

    const mergedTheme = useTheme(
      theme,
      parentTheme,
      computed(() => {
        return {
          prefixCls: getPrefixCls(''),
        }
      }),
    )
    const memoedConfig = computed(() => {
      const parentConfig = {
        ...props.parentContext,
      }
      const baseConfig = {
        csp: csp.value,
        getPrefixCls,
      } as ConfigConsumerProps
      const config = defu(parentConfig, baseConfig)
      // Pass the props used by `useContext` directly with child component.
      // These props should merged into `config`.
      PASSED_PROPS.forEach((propName) => {
        const propValue = (props as any)[propName]
        if (propValue) {
          (config as any)[propName] = propValue
        }
      })

      return config
    })
    // const styleContext = useStyleContext()
    // const layer = computed(() => styleContext.value.layer)

    // Icon Support
    // const memoIconContextValue = computed(() => ({ prefixCls: iconPrefixCls.value, csp: csp.value, layer: layer.value ? 'antd' : undefined }))

    // ================================ Dynamic theme ================================
    const memoTheme = computed(() => {
      const { algorithm, token, components, cssVar, ...rest } = mergedTheme.value ?? {}
      const themeObj = algorithm && (!Array.isArray(algorithm) || algorithm.length > 0) ? createTheme(algorithm) : defaultTheme

      const parsedComponents: any = {}
      Object.entries(components || {}).forEach(([componentName, componentToken]) => {
        const parsedToken: typeof componentToken & { theme?: typeof defaultTheme } = {
          ...componentToken,
        }
        if ('algorithm' in parsedToken) {
          if (parsedToken.algorithm === true) {
            parsedToken.theme = themeObj
          }
          else if (
            Array.isArray(parsedToken.algorithm)
            || typeof parsedToken.algorithm === 'function'
          ) {
            parsedToken.theme = createTheme(parsedToken.algorithm)
          }
          delete parsedToken.algorithm
        }
        parsedComponents[componentName] = parsedToken
      })

      const mergedToken = {
        ...defaultSeedToken,
        ...token,
      }

      return {
        ...rest,
        theme: themeObj,

        token: mergedToken,
        components: parsedComponents,
        override: {
          override: mergedToken,
          ...parsedComponents,
        },
        cssVar: cssVar as Exclude<ThemeConfig['cssVar'], boolean>,
      }
    })

    useConfigProvider(memoedConfig)
    return () => {
      let childNode = slots?.default?.()
      if (iconPrefixCls.value || csp.value) {
        childNode = <>{childNode}</>
      }
      if (props.componentSize) {
        childNode = <SizeProvider size={props.componentSize}>{childNode}</SizeProvider>
      }

      if (props.theme) {
        childNode = <DesignTokenProvider value={memoTheme.value}>{childNode}</DesignTokenProvider>
      }

      // =================================== Render ===================================
      return childNode
    }
  },
  {
    inheritAttrs: false,
  },
)

const ConfigProvider = defineComponent<
  ConfigProviderProps,
  ConfigProviderEmits,
  string,
  SlotsType<ConfigProviderSlots>
>(
  (props = providerDefaultProps, { slots }) => {
    const context = useConfig()
    return () => {
      return <ProviderChildren parentContext={context.value} {...props} v-slots={slots} />
    }
  },
  {
    name: 'AConfigProvider',
    inheritAttrs: false,
  },
)

export default ConfigProvider
