/**
 * 自动补全模板生成函数
 */

export interface AutocompleteOptions {
  prefix: string
  themeKeys: {
    rounded: 'borderRadius' | 'radius'
    shadow: 'boxShadow' | 'shadow'
    text: 'fontSize' | 'text'
  }
}

/**
 * 创建自动补全模板
 */
export function createAutocompleteTemplates(options: AutocompleteOptions) {
  const { prefix, themeKeys } = options

  return [
    // 颜色类
    `${prefix}-color-$colors`,
    `${prefix}-c-$colors`,
    `${prefix}-bg-$colors`,

    // Border 边框色
    `${prefix}-border`,
    `${prefix}-b`,
    `${prefix}-border-$colors`,
    `${prefix}-b-$colors`,
    // Border 方向性
    `${prefix}-border-t-$colors`,
    `${prefix}-bt-$colors`,
    `${prefix}-border-r-$colors`,
    `${prefix}-br-$colors`,
    `${prefix}-border-b-$colors`,
    `${prefix}-bb-$colors`,
    `${prefix}-border-l-$colors`,
    `${prefix}-bl-$colors`,
    `${prefix}-border-x-$colors`,
    `${prefix}-bx-$colors`,
    `${prefix}-border-y-$colors`,
    `${prefix}-by-$colors`,

    // Margin 类
    `${prefix}-m-$spacing`,
    `${prefix}-mt-$spacing`,
    `${prefix}-mb-$spacing`,
    `${prefix}-ml-$spacing`,
    `${prefix}-mr-$spacing`,
    `${prefix}-mx-$spacing`,
    `${prefix}-my-$spacing`,

    // Padding 类
    `${prefix}-p-$spacing`,
    `${prefix}-pt-$spacing`,
    `${prefix}-pb-$spacing`,
    `${prefix}-pl-$spacing`,
    `${prefix}-pr-$spacing`,
    `${prefix}-px-$spacing`,
    `${prefix}-py-$spacing`,

    // 字体 (使用对应的主题键)
    `${prefix}-text-$${themeKeys.text}`,

    // Rounded 圆角 (使用对应的主题键)
    `${prefix}-rounded`,
    `${prefix}-rd`,
    `${prefix}-rounded-$${themeKeys.rounded}`,
    `${prefix}-rd-$${themeKeys.rounded}`,
    // 角落圆角
    `${prefix}-rounded-tl`,
    `${prefix}-rounded-tl-$${themeKeys.rounded}`,
    `${prefix}-rounded-tr`,
    `${prefix}-rounded-tr-$${themeKeys.rounded}`,
    `${prefix}-rounded-bl`,
    `${prefix}-rounded-bl-$${themeKeys.rounded}`,
    `${prefix}-rounded-br`,
    `${prefix}-rounded-br-$${themeKeys.rounded}`,
    // 边侧圆角
    `${prefix}-rounded-t`,
    `${prefix}-rounded-t-$${themeKeys.rounded}`,
    `${prefix}-rounded-r`,
    `${prefix}-rounded-r-$${themeKeys.rounded}`,
    `${prefix}-rounded-b`,
    `${prefix}-rounded-b-$${themeKeys.rounded}`,
    `${prefix}-rounded-l`,
    `${prefix}-rounded-l-$${themeKeys.rounded}`,

    // Shadow 阴影 (使用对应的主题键)
    `${prefix}-shadow`,
    `${prefix}-shadow-$${themeKeys.shadow}`,
  ]
}
