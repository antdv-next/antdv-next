/**
 * Ant Design Vue Next Tailwind CSS Plugin
 *
 * 基于 Ant Design Vue 的 CSS 变量系统生成 Tailwind CSS 主题配置
 */

import type { AntdPluginOptions } from './types'
import plugin from 'tailwindcss/plugin'
import { buildPalettes } from './colors'
import {
  buildBorderRadiusTheme,
  buildColorsTheme,
  buildFontSizeTheme,
  buildShadowTheme,
  buildSpacingTheme,
} from './theme'

/**
 * 创建 Ant Design Vue Tailwind CSS 插件
 *
 * @param options - 插件配置选项
 * @returns Tailwind CSS 插件
 *
 * @example
 * ```js
 * // tailwind.config.js
 * import antdPlugin from '@antdv-next/tailwind'
 *
 * export default {
 *   plugins: [
 *     antdPlugin({
 *       antPrefix: 'ant'
 *     })
 *   ]
 * }
 * ```
 */
export function createAntdPlugin(options: AntdPluginOptions = {}) {
  const { antPrefix = 'ant' } = options

  // 构建调色板
  const builtPalettes = buildPalettes(antPrefix)

  return plugin(
    // 插件函数 - 用于添加自定义 utilities, components 等
    () => {
      // 当前不需要添加额外的 utilities
      // 如果需要添加自定义样式，可以在这里使用 addUtilities, addComponents 等 API
    },
    // 主题配置 - 扩展 Tailwind 的默认主题
    {
      theme: {
        extend: {
          colors: buildColorsTheme(antPrefix, builtPalettes),
          spacing: buildSpacingTheme(antPrefix),
          borderRadius: buildBorderRadiusTheme(antPrefix),
          fontSize: buildFontSizeTheme(antPrefix),
          boxShadow: buildShadowTheme(antPrefix),
        },
      },
    },
  )
}

/**
 * 默认导出：使用默认配置的插件
 */
export default createAntdPlugin()
