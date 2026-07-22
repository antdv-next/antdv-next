import type { App, Plugin } from 'vue'
import type { SizeType } from './config-provider/SizeContext'
import { StyleProvider } from '@antdv-next/cssinjs'
import * as components from './components'
import version from './version'

export { useResponsive } from './_util/hooks/useResponsive'

export * from './components'

export type {
  SizeType,
}
export type { ThemeConfig } from './config-provider/context'
let prefix = 'A'
export { useBreakpoint } from './grid'

export function setPrefix(newPrefix: string) {
  prefix = newPrefix
}

export function install(app: App) {
  app.config.globalProperties._ant_prefix = prefix
  Object.keys(components).forEach((key) => {
    const component = (components as any)[key]
    if ('install' in component) {
      app.use(component)
    }
  })
  app.component('AStyleProvider', StyleProvider)
}

// The default export doubles as a Vue plugin. `install` and `setPrefix` are also
// exposed as named exports so the UMD/ESM globals (`window.antd`) carry `install`
// directly, letting `app.use(window.antd)` work without reaching for `.default`.
export default {
  setPrefix,
  install,
  version,
} as Plugin

export type { GlobalToken } from './theme'

export { default as theme } from './theme'

export {
  StyleProvider,
  version,
}
