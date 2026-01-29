import type { Plugin, ResolvedConfig } from 'vite'

const VIRTUAL_ID = 'antd.css'
const RESOLVED_VIRTUAL_ID = `\0${VIRTUAL_ID}`

export interface VirtualAntdCssOptions {
  /**
   * 生产环境实际引入的 css 路径
   * '/src/assets/antd.css'
   */
  cssPath?: string
  /**
   * @desc 默认开发环境也打开
   */
  development?: boolean
}

export default function virtualAntdCss(
  options: VirtualAntdCssOptions,
): Plugin {
  const { cssPath = '/src/assets/antd.css' } = options

  let config: ResolvedConfig

  return {
    name: 'vite-plugin-virtual-antd-css',
    config() {
      if (options.development) {
        return {
          define: {
            'import.meta.env.ANTDV_VIRTUAL_CSS_ENABLED': true,
          },
        }
      }
      return {
        'import.meta.env.ANTDV_VIRTUAL_CSS_ENABLED': false,
      }
    },
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
      if (config?.mode !== 'production' && !options.development) {
        return ''
      }
      return `@import '${cssPath}';`
    },
  }
}
