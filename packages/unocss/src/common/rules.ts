/**
 * 规则生成函数
 */

/**
 * 创建颜色类规则
 */
export function createColorRules(prefix: string) {
  return [
    // ${prefix}-color-primary 或 ${prefix}-c-primary -> color: var(--${antPrefix}-color-primary)
    [new RegExp(`^${prefix}-(?:color|c)-(.+)$`), ([_, c]: [any, any], { theme }: any) => {
      const color = (theme.colors as any)?.[c!]
      if (color)
        return { color }
    }],

    // ${prefix}-bg-container -> background-color: var(--${antPrefix}-color-bg-container)
    [new RegExp(`^${prefix}-bg-(.+)$`), ([_, c]: [any, any], { theme }: any) => {
      const color = (theme.colors as any)?.[c!]
      if (color)
        return { 'background-color': color }
    }],
  ]
}

/**
 * 创建边框颜色规则
 */
export function createBorderRules(prefix: string) {
  return [
    // ${prefix}-border 或 ${prefix}-b -> border-color: var(--${antPrefix}-color-border) (DEFAULT)
    [new RegExp(`^${prefix}-(?:border|b)$`), (_: any, { theme }: any) => {
      return { 'border-color': (theme.colors as any)?.border }
    }],
    // ${prefix}-border-primary 或 ${prefix}-b-primary -> border-color: ...
    [new RegExp(`^${prefix}-(?:border|b)-(.+)$`), ([_, c]: [any, any], { theme }: any) => {
      const color = (theme.colors as any)?.[c!]
      if (color)
        return { 'border-color': color }
    }],
    // 方向性 border: bt/border-t, br/border-r, bb/border-b, bl/border-l
    [new RegExp(`^${prefix}-(?:border-t|bt)-(.+)$`), ([_, c]: [any, any], { theme }: any) => {
      const color = (theme.colors as any)?.[c!]
      if (color)
        return { 'border-top-color': color }
    }],
    [new RegExp(`^${prefix}-(?:border-r|br)-(.+)$`), ([_, c]: [any, any], { theme }: any) => {
      const color = (theme.colors as any)?.[c!]
      if (color)
        return { 'border-right-color': color }
    }],
    [new RegExp(`^${prefix}-(?:border-b|bb)-(.+)$`), ([_, c]: [any, any], { theme }: any) => {
      const color = (theme.colors as any)?.[c!]
      if (color)
        return { 'border-bottom-color': color }
    }],
    [new RegExp(`^${prefix}-(?:border-l|bl)-(.+)$`), ([_, c]: [any, any], { theme }: any) => {
      const color = (theme.colors as any)?.[c!]
      if (color)
        return { 'border-left-color': color }
    }],
    // 双向 border: bx/border-x, by/border-y
    [new RegExp(`^${prefix}-(?:border-x|bx)-(.+)$`), ([_, c]: [any, any], { theme }: any) => {
      const color = (theme.colors as any)?.[c!]
      if (color)
        return { 'border-left-color': color, 'border-right-color': color }
    }],
    [new RegExp(`^${prefix}-(?:border-y|by)-(.+)$`), ([_, c]: [any, any], { theme }: any) => {
      const color = (theme.colors as any)?.[c!]
      if (color)
        return { 'border-top-color': color, 'border-bottom-color': color }
    }],
  ]
}

/**
 * 创建间距规则（Margin / Padding）
 */
export function createSpacingRules(prefix: string) {
  return [
    // --- Margin ---
    // ${prefix}-m-sm -> margin: 12px (var)
    [new RegExp(`^${prefix}-m-(.+)$`), ([_, s]: [any, any], { theme }: any) => {
      const v = (theme.spacing as any)?.[s!]
      if (v)
        return { margin: v }
    }],
    // ${prefix}-mt-lg -> margin-top: 24px (var)
    [new RegExp(`^${prefix}-mt-(.+)$`), ([_, s]: [any, any], { theme }: any) => ({ 'margin-top': (theme.spacing as any)?.[s!] })],
    [new RegExp(`^${prefix}-mb-(.+)$`), ([_, s]: [any, any], { theme }: any) => ({ 'margin-bottom': (theme.spacing as any)?.[s!] })],
    [new RegExp(`^${prefix}-ml-(.+)$`), ([_, s]: [any, any], { theme }: any) => ({ 'margin-left': (theme.spacing as any)?.[s!] })],
    [new RegExp(`^${prefix}-mr-(.+)$`), ([_, s]: [any, any], { theme }: any) => ({ 'margin-right': (theme.spacing as any)?.[s!] })],
    [new RegExp(`^${prefix}-mx-(.+)$`), ([_, s]: [any, any], { theme }: any) => ({ 'margin-left': (theme.spacing as any)?.[s!], 'margin-right': (theme.spacing as any)?.[s!] })],
    [new RegExp(`^${prefix}-my-(.+)$`), ([_, s]: [any, any], { theme }: any) => ({ 'margin-top': (theme.spacing as any)?.[s!], 'margin-bottom': (theme.spacing as any)?.[s!] })],

    // --- Padding ---
    [new RegExp(`^${prefix}-p-(.+)$`), ([_, s]: [any, any], { theme }: any) => ({ padding: (theme.spacing as any)?.[s!] })],
    [new RegExp(`^${prefix}-pt-(.+)$`), ([_, s]: [any, any], { theme }: any) => ({ 'padding-top': (theme.spacing as any)?.[s!] })],
    [new RegExp(`^${prefix}-pb-(.+)$`), ([_, s]: [any, any], { theme }: any) => ({ 'padding-bottom': (theme.spacing as any)?.[s!] })],
    [new RegExp(`^${prefix}-pl-(.+)$`), ([_, s]: [any, any], { theme }: any) => ({ 'padding-left': (theme.spacing as any)?.[s!] })],
    [new RegExp(`^${prefix}-pr-(.+)$`), ([_, s]: [any, any], { theme }: any) => ({ 'padding-right': (theme.spacing as any)?.[s!] })],
    [new RegExp(`^${prefix}-px-(.+)$`), ([_, s]: [any, any], { theme }: any) => ({ 'padding-left': (theme.spacing as any)?.[s!], 'padding-right': (theme.spacing as any)?.[s!] })],
    [new RegExp(`^${prefix}-py-(.+)$`), ([_, s]: [any, any], { theme }: any) => ({ 'padding-top': (theme.spacing as any)?.[s!], 'padding-bottom': (theme.spacing as any)?.[s!] })],
  ]
}

/**
 * 创建文本规则（支持 fontSize 和 text 两种模式）
 * @param prefix class 前缀
 * @param themeKey 主题键名，'fontSize' 或 'text'
 */
export function createTextRules(prefix: string, themeKey: 'fontSize' | 'text' = 'fontSize') {
  return [
    // ${prefix}-text-lg -> font-size: 16px (var)
    [new RegExp(`^${prefix}-text-(.+)$`), ([_, s]: [any, any], { theme }: any) => {
      if (themeKey === 'fontSize') {
        return { 'font-size': (theme.fontSize as any)?.[s!] }
      }
      else {
        const textConfig = (theme.text as any)?.[s!]
        if (textConfig?.fontSize) {
          return { 'font-size': textConfig.fontSize }
        }
      }
    }],
  ]
}

/**
 * 创建圆角规则（支持 borderRadius 和 radius 两种模式）
 * @param prefix class 前缀
 * @param themeKey 主题键名，'borderRadius' 或 'radius'
 */
export function createRoundedRules(prefix: string, themeKey: 'borderRadius' | 'radius' = 'borderRadius') {
  return [
    // ${prefix}-rounded -> border-radius: var(--${antPrefix}-border-radius) (DEFAULT)
    [new RegExp(`^${prefix}-(?:rounded|rd)$`), (_: any, { theme }: any) => {
      return { 'border-radius': (theme[themeKey] as any)?.DEFAULT }
    }],
    // ${prefix}-rounded-sm 或 ${prefix}-rd-sm -> border-radius: 4px (var)
    [new RegExp(`^${prefix}-(?:rounded|rd)-(.+)$`), ([_, s]: [any, any], { theme }: any) => {
      const v = (theme[themeKey] as any)?.[s!]
      if (v)
        return { 'border-radius': v }
    }],
    // 角落圆角: rounded-tl, rounded-tr, rounded-bl, rounded-br (简写: rd-tl, rd-tr, rd-bl, rd-br)
    [new RegExp(`^${prefix}-(?:rounded|rd)-tl(?:-(.+))?$`), ([_, s]: [any, any], { theme }: any) => {
      const v = (theme[themeKey] as any)?.[s || 'DEFAULT']
      if (v)
        return { 'border-top-left-radius': v }
    }],
    [new RegExp(`^${prefix}-(?:rounded|rd)-tr(?:-(.+))?$`), ([_, s]: [any, any], { theme }: any) => {
      const v = (theme[themeKey] as any)?.[s || 'DEFAULT']
      if (v)
        return { 'border-top-right-radius': v }
    }],
    [new RegExp(`^${prefix}-(?:rounded|rd)-bl(?:-(.+))?$`), ([_, s]: [any, any], { theme }: any) => {
      const v = (theme[themeKey] as any)?.[s || 'DEFAULT']
      if (v)
        return { 'border-bottom-left-radius': v }
    }],
    [new RegExp(`^${prefix}-(?:rounded|rd)-br(?:-(.+))?$`), ([_, s]: [any, any], { theme }: any) => {
      const v = (theme[themeKey] as any)?.[s || 'DEFAULT']
      if (v)
        return { 'border-bottom-right-radius': v }
    }],
    // 边侧圆角: rounded-t, rounded-r, rounded-b, rounded-l (简写: rd-t, rd-r, rd-b, rd-l)
    [new RegExp(`^${prefix}-(?:rounded|rd)-t(?:-(.+))?$`), ([_, s]: [any, any], { theme }: any) => {
      const v = (theme[themeKey] as any)?.[s || 'DEFAULT']
      if (v)
        return { 'border-top-left-radius': v, 'border-top-right-radius': v }
    }],
    [new RegExp(`^${prefix}-(?:rounded|rd)-r(?:-(.+))?$`), ([_, s]: [any, any], { theme }: any) => {
      const v = (theme[themeKey] as any)?.[s || 'DEFAULT']
      if (v)
        return { 'border-top-right-radius': v, 'border-bottom-right-radius': v }
    }],
    [new RegExp(`^${prefix}-(?:rounded|rd)-b(?:-(.+))?$`), ([_, s]: [any, any], { theme }: any) => {
      const v = (theme[themeKey] as any)?.[s || 'DEFAULT']
      if (v)
        return { 'border-bottom-left-radius': v, 'border-bottom-right-radius': v }
    }],
    [new RegExp(`^${prefix}-(?:rounded|rd)-l(?:-(.+))?$`), ([_, s]: [any, any], { theme }: any) => {
      const v = (theme[themeKey] as any)?.[s || 'DEFAULT']
      if (v)
        return { 'border-top-left-radius': v, 'border-bottom-left-radius': v }
    }],
  ]
}

/**
 * 创建阴影规则（支持 boxShadow 和 shadow 两种模式）
 * @param prefix class 前缀
 * @param themeKey 主题键名，'boxShadow' 或 'shadow'
 */
export function createShadowRules(prefix: string, themeKey: 'boxShadow' | 'shadow' = 'boxShadow') {
  return [
    [
      new RegExp(`^${prefix}-shadow(?:-(.+))?$`),
      ([_, s]: [any, any], { theme }: any) => {
        // 如果 s 存在(有后缀)，用 s；如果 s 不存在(没后缀)，用 'DEFAULT'
        const key = s || 'DEFAULT'
        const v = (theme[themeKey] as any)?.[key]

        if (v)
          return { 'box-shadow': v }
      },
    ],
  ]
}
