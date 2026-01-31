/**
 * Tailwind CSS v4 主题生成器
 *
 * Tailwind CSS v4 使用 @theme 指令在 CSS 中定义主题变量
 * 这个模块生成对应的 CSS 内容，可以通过以下方式使用：
 *
 * 1. 直接导入 CSS 文件：@import "@antdv-next/tailwind/v4"
 * 2. 使用 generateThemeCSS() 函数动态生成
 */

import type { AntdPluginOptions } from './types'
import { colorNames } from './types'

/**
 * 生成 Tailwind CSS v4 主题 CSS 内容
 *
 * Tailwind v4 使用 @theme 指令定义主题变量，变量命名约定：
 * - --color-*: 颜色工具类 (bg-*, text-*, border-*)
 * - --spacing-*: 间距工具类 (p-*, m-*, gap-*)
 * - --radius-*: 圆角工具类 (rounded-*)
 * - --text-*: 字体大小工具类 (text-sm, text-lg)
 * - --shadow-*: 阴影工具类 (shadow-*)
 *
 * @param options 配置选项
 * @returns 生成的 CSS 字符串
 */
export function generateThemeCSS(options: AntdPluginOptions = {}): string {
  const { antPrefix = 'ant' } = options

  const lines: string[] = []

  lines.push('@theme inline {')

  // 颜色变量 --color-*
  lines.push('  /* Ant Design Palette Colors */')
  for (const color of colorNames) {
    // 基础色
    lines.push(`  --color-${color}: var(--${antPrefix}-${color});`)
    // 1-10 色阶
    for (let i = 1; i <= 10; i++) {
      lines.push(`  --color-${color}-${i}: var(--${antPrefix}-${color}-${i});`)
    }
  }

  lines.push('')
  lines.push('  /* Brand / Primary Colors */')
  lines.push(`  --color-primary: var(--${antPrefix}-color-primary);`)
  lines.push(`  --color-primary-hover: var(--${antPrefix}-color-primary-hover);`)
  lines.push(`  --color-primary-active: var(--${antPrefix}-color-primary-active);`)
  lines.push(`  --color-primary-bg: var(--${antPrefix}-color-primary-bg);`)
  lines.push(`  --color-primary-bg-hover: var(--${antPrefix}-color-primary-bg-hover);`)

  lines.push('')
  lines.push('  /* Functional Colors - Success */')
  lines.push(`  --color-success: var(--${antPrefix}-color-success);`)
  lines.push(`  --color-success-bg: var(--${antPrefix}-color-success-bg);`)
  lines.push(`  --color-success-border: var(--${antPrefix}-color-success-border);`)
  lines.push(`  --color-success-hover: var(--${antPrefix}-color-success-hover);`)

  lines.push('')
  lines.push('  /* Functional Colors - Warning */')
  lines.push(`  --color-warning: var(--${antPrefix}-color-warning);`)
  lines.push(`  --color-warning-bg: var(--${antPrefix}-color-warning-bg);`)
  lines.push(`  --color-warning-border: var(--${antPrefix}-color-warning-border);`)
  lines.push(`  --color-warning-hover: var(--${antPrefix}-color-warning-hover);`)

  lines.push('')
  lines.push('  /* Functional Colors - Error */')
  lines.push(`  --color-error: var(--${antPrefix}-color-error);`)
  lines.push(`  --color-error-bg: var(--${antPrefix}-color-error-bg);`)
  lines.push(`  --color-error-border: var(--${antPrefix}-color-error-border);`)
  lines.push(`  --color-error-hover: var(--${antPrefix}-color-error-hover);`)

  lines.push('')
  lines.push('  /* Functional Colors - Info */')
  lines.push(`  --color-info: var(--${antPrefix}-color-info);`)
  lines.push(`  --color-info-bg: var(--${antPrefix}-color-info-bg);`)
  lines.push(`  --color-info-border: var(--${antPrefix}-color-info-border);`)

  lines.push('')
  lines.push('  /* Link Colors */')
  lines.push(`  --color-link: var(--${antPrefix}-color-link);`)
  lines.push(`  --color-link-hover: var(--${antPrefix}-color-link-hover);`)
  lines.push(`  --color-link-active: var(--${antPrefix}-color-link-active);`)

  lines.push('')
  lines.push('  /* Text Colors */')
  lines.push(`  --color-text: var(--${antPrefix}-color-text);`)
  lines.push(`  --color-text-secondary: var(--${antPrefix}-color-text-secondary);`)
  lines.push(`  --color-text-tertiary: var(--${antPrefix}-color-text-tertiary);`)
  lines.push(`  --color-text-quaternary: var(--${antPrefix}-color-text-quaternary);`)

  lines.push('')
  lines.push('  /* Background Colors */')
  lines.push(`  --color-white: var(--${antPrefix}-color-white);`)
  lines.push(`  --color-base: var(--${antPrefix}-color-bg-base);`)
  lines.push(`  --color-container: var(--${antPrefix}-color-bg-container);`)
  lines.push(`  --color-layout: var(--${antPrefix}-color-bg-layout);`)
  lines.push(`  --color-elevated: var(--${antPrefix}-color-bg-elevated);`)
  lines.push(`  --color-mask: var(--${antPrefix}-color-bg-mask);`)
  lines.push(`  --color-split: var(--${antPrefix}-color-split);`)

  lines.push('')
  lines.push('  /* Border Colors */')
  lines.push(`  --color-border: var(--${antPrefix}-color-border);`)
  lines.push(`  --color-border-secondary: var(--${antPrefix}-color-border-secondary);`)

  // 间距变量 --spacing-*
  lines.push('')
  lines.push('  /* Spacing */')
  lines.push(`  --spacing-xxs: var(--${antPrefix}-padding-xxs);`)
  lines.push(`  --spacing-xs: var(--${antPrefix}-padding-xs);`)
  lines.push(`  --spacing-sm: var(--${antPrefix}-padding-sm);`)
  lines.push(`  --spacing-md: var(--${antPrefix}-padding-md);`)
  lines.push(`  --spacing-lg: var(--${antPrefix}-padding-lg);`)
  lines.push(`  --spacing-xl: var(--${antPrefix}-padding-xl);`)

  // 圆角变量 --radius-*
  lines.push('')
  lines.push('  /* Border Radius */')
  lines.push(`  --radius-xs: var(--${antPrefix}-border-radius-xs);`)
  lines.push(`  --radius-sm: var(--${antPrefix}-border-radius-sm);`)
  lines.push(`  --radius-DEFAULT: var(--${antPrefix}-border-radius);`)
  lines.push(`  --radius-lg: var(--${antPrefix}-border-radius-lg);`)

  // 字体大小变量 --text-*
  lines.push('')
  lines.push('  /* Font Size */')
  lines.push(`  --text-sm: var(--${antPrefix}-font-size-sm);`)
  lines.push(`  --text-DEFAULT: var(--${antPrefix}-font-size);`)
  lines.push(`  --text-lg: var(--${antPrefix}-font-size-lg);`)
  lines.push(`  --text-xl: var(--${antPrefix}-font-size-xl);`)
  lines.push(`  --text-h1: var(--${antPrefix}-font-size-heading-1);`)
  lines.push(`  --text-h2: var(--${antPrefix}-font-size-heading-2);`)
  lines.push(`  --text-h3: var(--${antPrefix}-font-size-heading-3);`)

  // 阴影变量 --shadow-*
  lines.push('')
  lines.push('  /* Box Shadow */')
  lines.push(`  --shadow-DEFAULT: var(--${antPrefix}-box-shadow);`)
  lines.push(`  --shadow-secondary: var(--${antPrefix}-box-shadow-secondary);`)
  lines.push(`  --shadow-tertiary: var(--${antPrefix}-box-shadow-tertiary);`)
  lines.push(`  --shadow-card: var(--${antPrefix}-box-shadow-card);`)
  lines.push(`  --shadow-arrow: var(--${antPrefix}-box-shadow-popover-arrow);`)
  lines.push(`  --shadow-drawer-right: var(--${antPrefix}-box-shadow-drawer-right);`)
  lines.push(`  --shadow-drawer-left: var(--${antPrefix}-box-shadow-drawer-left);`)
  lines.push(`  --shadow-drawer-up: var(--${antPrefix}-box-shadow-drawer-up);`)
  lines.push(`  --shadow-drawer-down: var(--${antPrefix}-box-shadow-drawer-down);`)

  lines.push('}')

  return lines.join('\n')
}

/**
 * 生成预构建的主题 CSS（使用默认配置）
 */
export const defaultThemeCSS = generateThemeCSS()
