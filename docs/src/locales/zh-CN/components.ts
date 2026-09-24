export default {
  tokenTable: {
    token: 'Token 名称',
    description: '描述',
    type: '类型',
    value: '默认值',
  },

  componentTokenTable: {
    token: 'Token 名称',
    description: '描述',
    type: '类型',
    value: '默认值',
    componentToken: '组件 Token',
    globalToken: '全局 Token',
    componentComment: '这里是你的组件 token',
    globalComment: '这里是你的全局 token',
    help: '如何定制?',
    customizeTokenLink: '/docs/vue/customize-theme-cn#customize-design-token',
    customizeComponentTokenLink: '/docs/vue/customize-theme-cn#customize-component-token',
  },

  semanticPreview: {
    usage: '使用示例',
  },

  bezierVisualizer: {
    open: '在 cubic-bezier.com 中打开',
  },

  overview: {
    searchPlaceholder: '搜索组件',
  },

  demo: {
    pleaseSelect: '请选择',
    pleaseInput: '请输入',
    search: '搜索',
    input: '在此输入',
    anotherInput: '另一个输入',
    email: '邮箱',
    minimum: '最小值',
    maximum: '最大值',
    selectAddress: '选择地址',
    outlined: '线框',
    outlinedStart: '线框开始',
    outlinedEnd: '线框结束',
    filled: '填充',
    filledStart: '填充开始',
    filledEnd: '填充结束',
    borderless: '无边框',
    borderlessStart: '无边框开始',
    borderlessEnd: '无边框结束',
    underlined: '下划线',
    underlinedStart: '下划线开始',
    underlinedEnd: '下划线结束',
    error: '错误',
    warning: '警告',
    warningMultiple: '警告多选',
    disabled: '禁用',
    customDropdownRender: '自定义下拉渲染',
    pleaseEnterItem: '请输入项目',
    object: '对象',
    function: '函数',
  },
} as const
