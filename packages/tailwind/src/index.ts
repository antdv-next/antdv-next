/**
 * @antdv-next/tailwind
 *
 * Ant Design Vue Tailwind CSS Plugin
 * 将 Ant Design Vue 的 CSS 变量系统集成到 Tailwind CSS 中
 *
 * 支持两种版本：
 * - Tailwind CSS v3: 使用 JS 插件配置
 * - Tailwind CSS v4: 使用 @theme 指令和 CSS 文件
 */

// Tailwind CSS v3 插件 (JS 配置)
export { createAntdPlugin, default } from './plugin'

// 类型导出
export type { AntdPluginOptions, ColorName } from './types'

// Tailwind CSS v4 主题生成器 (CSS @theme)
export { defaultThemeCSS, generateThemeCSS } from './v4'
