import type { Plugin, ResolvedConfig } from 'vite'

const VIRTUAL_ID = 'virtual:antd.css'
const RESOLVED_VIRTUAL_ID = `\0${VIRTUAL_ID}`

export interface VirtualAntdCssOptions {
  /**
   * 生产环境实际引入的 css 路径
   * '/src/assets/antd.css'
   */
  cssPath?: string
}

export default function virtualAntdCss(
  options: VirtualAntdCssOptions,
): Plugin {
  const { cssPath = '/src/assets/antd.css' } = options

  let config: ResolvedConfig

  return {
    name: 'vite-plugin-virtual-antd-css',
    configResolved(_config) {
      config = _config
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) {
        return RESOLVED_VIRTUAL_ID
      }
    },
    load(id) {
      if (id !== RESOLVED_VIRTUAL_ID)
        return
      if (config?.mode !== 'production') {
        return ''
      }
      return `import '${cssPath}'`
    },
  }
}
