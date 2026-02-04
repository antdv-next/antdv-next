import type { App, AppContext, SlotsType, VNodeChild } from 'vue'
import type { Locale } from '../locale'
import type { ConfigConsumerProps, Theme, ThemeConfig } from './context'
import type { ConfigProviderEmits, ConfigProviderProps, ConfigProviderSlots } from './define'
import { createTheme, useStyleContext } from '@antdv-next/cssinjs'
import { IconContextProvider } from '@antdv-next/icons'
import defu from 'defu'
import { computed, defineComponent, shallowReactive } from 'vue'
import { useWarningProvider } from '../_util/warning.ts'
import { ANT_MARK, LocaleProvider, useLocaleContext } from '../locale'
import { defaultTheme, DesignTokenProvider } from '../theme/context.ts'
import defaultSeedToken from '../theme/themes/seed'
import { UniqueProvider } from '../tooltip'
import { defaultIconPrefixCls, defaultPrefixCls, useConfig, useConfigProvider } from './context'
import { DisabledContextProvider } from './DisabledContext.tsx'
import { useExportConfig } from './hooks/useConfig.ts'
import { useTheme } from './hooks/useTheme.ts'
import { SizeProvider } from './SizeContext'
import useStyle from './style'

export type { CSPConfig } from './context'

export type {
  ConfigProviderProps,
}

interface ProviderChildrenProps extends ConfigProviderProps {
  parentContext: ConfigConsumerProps
  legacyLocale?: Locale
}

// These props is used by `useContext` directly in sub component
const PASSED_PROPS: Exclude<
  keyof ConfigConsumerProps,
    'rootPrefixCls' | 'getPrefixCls' | 'warning'
>[] = [
  'getTargetContainer',
  'getPopupContainer',
  'renderEmpty',
  'wave',
  'input',
  'pagination',
  'transfer',
  'mentions',
  'form',
  'select',
  'button',
  'alert',
  'transformCellText',
]

const providerDefaultProps: any = {
  componentDisabled: undefined,
}

type holderRenderType = (children: VNodeChild) => VNodeChild

let globalPrefixCls: string
let globalIconPrefixCls: string
let globalTheme: Theme | ThemeConfig
let globalHolderRender: holderRenderType | undefined

export interface GlobalConfigProps {
  prefixCls?: string
  iconPrefixCls?: string
  theme?: Theme | ThemeConfig
  holderRender?: holderRenderType
  appContext?: AppContext
}

const globalConfigData = shallowReactive<GlobalConfigProps>({})

function getGlobalPrefixCls() {
  return globalConfigData.prefixCls || globalPrefixCls || defaultPrefixCls
}

function getGlobalIconPrefixCls() {
  return globalConfigData.iconPrefixCls || globalIconPrefixCls || defaultIconPrefixCls
}

function setGlobalConfig(props: GlobalConfigProps) {
  const { prefixCls, iconPrefixCls, theme, holderRender, appContext } = props
  if (prefixCls !== undefined) {
    globalPrefixCls = prefixCls
    globalConfigData.prefixCls = prefixCls
  }
  if (iconPrefixCls !== undefined) {
    globalIconPrefixCls = iconPrefixCls
    globalConfigData.iconPrefixCls = iconPrefixCls
  }
  if (appContext) {
    globalConfigData.appContext = appContext
  }
  if ('holderRender' in props) {
    globalHolderRender = holderRender
    globalConfigData.holderRender = holderRender
  }
  if (theme) {
    globalTheme = theme
    globalConfigData.theme = theme
  }
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
        theme: mergedTheme.value,
        direction: props.direction,
        locale: props.locale || props.legacyLocale,
        space: props.space,
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
    const styleContext = useStyleContext()
    const layer = computed(() => styleContext.value.layer)

    // Icon Support
    const memoIconContextValue = computed(() => ({ prefixCls: iconPrefixCls.value, csp: csp.value, layer: layer.value ? 'antd' : undefined }))

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
    // warning provider
    const strict = computed(() => memoedConfig.value?.warning?.strict)
    useWarningProvider({
      strict,
    })
    return () => {
      let childNode = slots?.default?.()

      if (props.locale) {
        childNode = (
          <LocaleProvider locale={props.locale} _ANT_MARK__={ANT_MARK}>
            {childNode}
          </LocaleProvider>
        )
      }

      if (iconPrefixCls.value || csp.value) {
        childNode = <IconContextProvider {...memoIconContextValue.value}>{childNode}</IconContextProvider>
      }
      if (props.componentSize) {
        childNode = <SizeProvider size={props.componentSize}>{childNode}</SizeProvider>
      }

      // ================================ Tooltip Unique ===============================
      if (props?.tooltip?.unique) {
        childNode = <UniqueProvider>{childNode}</UniqueProvider>
      }

      if (props.theme) {
        childNode = <DesignTokenProvider value={memoTheme.value}>{childNode}</DesignTokenProvider>
      }

      // =================================== Render ===================================
      if (props?.componentDisabled !== undefined) {
        childNode = <DisabledContextProvider disabled={props.componentDisabled}>{childNode}</DisabledContextProvider>
      }

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
    const { locale } = useLocaleContext() ?? {}
    return () => {
      const renderEmpty = slots?.renderEmpty ?? props?.renderEmpty
      const transformCellText = slots?.transformCellText ?? props?.transformCellText

      return (
        <ProviderChildren
          parentContext={context.value}
          {...props}
          renderEmpty={renderEmpty}
          transformCellText={transformCellText}
          legacyLocale={locale?.value}
          v-slots={slots}
        />
      )
    }
  },
  {
    name: 'AConfigProvider',
    inheritAttrs: false,
  },
)

;(ConfigProvider as any).config = setGlobalConfig
;(ConfigProvider as any).useConfig = useExportConfig

;(ConfigProvider as any).install = (app: App) => {
  app.component(ConfigProvider.name, ConfigProvider)
}

export default ConfigProvider as typeof ConfigProvider & {
  config: (props: GlobalConfigProps) => void
  useConfig: ReturnType<typeof useExportConfig>
}

export function globalConfig() {
  return {
    getPrefixCls: (suffixCls?: string, customizePrefixCls?: string) => {
      if (customizePrefixCls) {
        return customizePrefixCls
      }
      return suffixCls ? `${getGlobalPrefixCls()}-${suffixCls}` : getGlobalPrefixCls()
    },
    getIconPrefixCls: getGlobalIconPrefixCls,
    getRootPrefixCls: () => {
      // If Global prefixCls provided, use this
      if (globalConfigData.prefixCls || globalPrefixCls) {
        return globalConfigData.prefixCls || globalPrefixCls
      }

      // Fallback to default prefixCls
      return getGlobalPrefixCls()
    },
    getTheme: () => globalTheme,
    theme: computed(() => globalConfigData.theme || globalTheme),
    holderRender: globalHolderRender,
    get appContext() {
      return globalConfigData.appContext
    },
  }
}

export { useConfig, useExportConfig }
