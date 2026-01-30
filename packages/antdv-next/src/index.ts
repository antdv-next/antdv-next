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
export default {
  setPrefix(newPrefix: string) {
    prefix = newPrefix
  },
  install(app: App) {
    app.config.globalProperties._ant_prefix = prefix
    Object.keys(components).forEach((key) => {
      const component = (components as any)[key]
      if ('install' in component) {
        app.use(component)
      }
    })
    app.component('AStyleProvider', StyleProvider)
  },
  version,
} as Plugin

export type { GlobalToken } from './theme'

export { default as theme } from './theme'

export {
  StyleProvider,
  version,
}
