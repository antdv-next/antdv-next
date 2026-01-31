/**
 * 主题配置生成函数
 */

/**
 * 构建颜色主题
 */
export function buildColorsTheme(antPrefix: string, builtPalettes: Record<string, string>) {
  return {
    ...builtPalettes,
    //  核心品牌色 (Primary)
    'DEFAULT': `var(--${antPrefix}-color-primary)`,
    'primary': `var(--${antPrefix}-color-primary)`,
    'primary-hover': `var(--${antPrefix}-color-primary-hover)`,
    'primary-active': `var(--${antPrefix}-color-primary-active)`,
    'primary-bg': `var(--${antPrefix}-color-primary-bg)`, // 极浅背景
    'primary-bg-hover': `var(--${antPrefix}-color-primary-bg-hover)`,

    // 功能辅助色 (Success, Warning, Error, Info)
    // 包含基础色、背景色(bg)、边框色(border)

    'success': `var(--${antPrefix}-color-success)`,
    'success-bg': `var(--${antPrefix}-color-success-bg)`,
    'success-border': `var(--${antPrefix}-color-success-border)`,
    'success-hover': `var(--${antPrefix}-color-success-hover)`,

    // Warning
    'warning': `var(--${antPrefix}-color-warning)`,
    'warning-bg': `var(--${antPrefix}-color-warning-bg)`,
    'warning-border': `var(--${antPrefix}-color-warning-border)`,
    'warning-hover': `var(--${antPrefix}-color-warning-hover)`,

    // Error
    'error': `var(--${antPrefix}-color-error)`,
    'error-bg': `var(--${antPrefix}-color-error-bg)`,
    'error-border': `var(--${antPrefix}-color-error-border)`,
    'error-hover': `var(--${antPrefix}-color-error-hover)`,

    // Info
    'info': `var(--${antPrefix}-color-info)`,
    'info-bg': `var(--${antPrefix}-color-info-bg)`,
    'info-border': `var(--${antPrefix}-color-info-border)`,

    // Link
    'link': `var(--${antPrefix}-color-link)`,
    'link-hover': `var(--${antPrefix}-color-link-hover)`,
    'link-active': `var(--${antPrefix}-color-link-active)`,

    // 文本色
    'text': `var(--${antPrefix}-color-text)`,
    'text-secondary': `var(--${antPrefix}-color-text-secondary)`,
    'text-tertiary': `var(--${antPrefix}-color-text-tertiary)`,
    'text-quat': `var(--${antPrefix}-color-text-quaternary)`,

    // 4. 中性色 (背景与文字 - 保持之前简化后的 Key)
    'white': `var(--${antPrefix}-color-white)`,

    // 背景 (Background)
    'base': `var(--${antPrefix}-color-bg-base)`,
    'container': `var(--${antPrefix}-color-bg-container)`, // 常用：白色卡片背景
    'layout': `var(--${antPrefix}-color-bg-layout)`, // 常用：灰色页面背景
    'elevated': `var(--${antPrefix}-color-bg-elevated)`, // 浮层背景
    'mask': `var(--${antPrefix}-color-bg-mask)`,

    // 文本 (Text)
    'main': `var(--${antPrefix}-color-text)`,
    'sec': `var(--${antPrefix}-color-text-secondary)`,
    'quat': `var(--${antPrefix}-color-text-quaternary)`,
    'split': `var(--${antPrefix}-color-split)`,

    // 边框 (Border)
    'border': `var(--${antPrefix}-color-border)`,
    'border-sec': `var(--${antPrefix}-color-border-secondary)`,
  }
}

/**
 * 构建间距主题
 */
export function buildSpacingTheme(antPrefix: string) {
  return {
    // 使用 AntD 定义的变量
    xxs: `var(--${antPrefix}-padding-xxs)`, // 4px (AntD通常padding/margin共用一套大小阶梯)
    xs: `var(--${antPrefix}-padding-xs)`, // 8px
    sm: `var(--${antPrefix}-padding-sm)`, // 12px
    DEFAULT: `var(--${antPrefix}-padding)`, // 16px
    md: `var(--${antPrefix}-padding-md)`, // 20px
    lg: `var(--${antPrefix}-padding-lg)`, // 24px
    xl: `var(--${antPrefix}-padding-xl)`, // 32px
  }
}

/**
 * 构建边框圆角主题（Wind3 风格）
 */
export function buildBorderRadiusTheme(antPrefix: string) {
  return {
    xs: `var(--${antPrefix}-border-radius-xs)`,
    sm: `var(--${antPrefix}-border-radius-sm)`,
    DEFAULT: `var(--${antPrefix}-border-radius)`,
    lg: `var(--${antPrefix}-border-radius-lg)`,
  }
}

/**
 * 构建边框圆角主题（Tailwind 4 风格 - radius）
 */
export function buildRadiusTheme(antPrefix: string) {
  return buildBorderRadiusTheme(antPrefix)
}

/**
 * 构建字体大小主题（Wind3 风格）
 */
export function buildFontSizeTheme(antPrefix: string) {
  return {
    sm: `var(--${antPrefix}-font-size-sm)`,
    DEFAULT: `var(--${antPrefix}-font-size)`,
    lg: `var(--${antPrefix}-font-size-lg)`,
    xl: `var(--${antPrefix}-font-size-xl)`,
    h1: `var(--${antPrefix}-font-size-heading-1)`,
    h2: `var(--${antPrefix}-font-size-heading-2)`,
    h3: `var(--${antPrefix}-font-size-heading-3)`,
  }
}

/**
 * 构建文本主题（Tailwind 4 风格 - text）
 */
export function buildTextTheme(antPrefix: string) {
  return {
    sm: {
      fontSize: `var(--${antPrefix}-font-size-sm)`,
    },
    DEFAULT: {
      fontSize: `var(--${antPrefix}-font-size)`,
    },
    lg: {
      fontSize: `var(--${antPrefix}-font-size-lg)`,
    },
    xl: {
      fontSize: `var(--${antPrefix}-font-size-xl)`,
    },
    h1: {
      fontSize: `var(--${antPrefix}-font-size-heading-1)`,
    },
    h2: {
      fontSize: `var(--${antPrefix}-font-size-heading-2)`,
    },
    h3: {
      fontSize: `var(--${antPrefix}-font-size-heading-3)`,
    },
  }
}

/**
 * 构建阴影主题（boxShadow 或 shadow）
 */
export function buildShadowTheme(antPrefix: string) {
  return {
    // DEFAULT 是当用户只写 class="${prefix}-shadow" 时使用的值
    'DEFAULT': `var(--${antPrefix}-box-shadow)`,

    // 对应 class="${prefix}-shadow-sec" 或 "${prefix}-shadow-secondary"
    'sec': `var(--${antPrefix}-box-shadow-secondary)`,
    'secondary': `var(--${antPrefix}-box-shadow-secondary)`,

    // 对应 class="${prefix}-shadow-ter"
    'ter': `var(--${antPrefix}-box-shadow-tertiary)`,
    'tertiary': `var(--${antPrefix}-box-shadow-tertiary)`,

    // 常用组件阴影
    'card': `var(--${antPrefix}-box-shadow-card)`,
    'arrow': `var(--${antPrefix}-box-shadow-popover-arrow)`,

    // 方向性阴影 (抽屉等使用)
    'drawer-r': `var(--${antPrefix}-box-shadow-drawer-right)`,
    'drawer-l': `var(--${antPrefix}-box-shadow-drawer-left)`,
    'drawer-u': `var(--${antPrefix}-box-shadow-drawer-up)`,
    'drawer-d': `var(--${antPrefix}-box-shadow-drawer-down)`,
  }
}
