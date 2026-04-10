export default {
  themeBtn: {
    system: '跟随系统',
    light: '浅色主题',
    dark: '暗黑主题',
    compact: '紧凑主题',
    happy: '快乐工作特效',
    aiTheme: 'AI 生成主题',
    themeEditor: '主题编辑器',
    aiThemeModal: {
      title: 'AI 主题编辑器',
      content: 'antdv-next 与 Ant Design 使用了相同的主题变量体系，您可以直接使用 Ant Design 的 AI 主题编辑器为 antdv-next 项目定制主题',
      okText: '前往',
      cancelText: '取消',
    },
  },

  codeDemo: {
    type: {
      typescript: 'TypeScript',
      javascript: 'JavaScript',
    },
    action: {
      externalLink: '在新窗口中打开',
      openPlayground: '在 Playground 中打开',
      expandCode: '展开代码',
      expandedCode: '收起代码',
      stackblitz: '在 StackBlitz 中打开',
      copied: '复制成功',
      copy: '复制代码',
    },
  },

  iconSearch: {
    themes: {
      outlined: '线框风格',
      filled: '实底风格',
      twoTone: '双色风格',
    },

    categories: {
      direction: '方向性图标',
      suggestion: '提示建议性图标',
      editor: '编辑类图标',
      data: '数据类图标',
      logo: '品牌和标识',
      other: '网站通用图标',
    },

    searchPlaceholder: '搜索图标',
    copiedMessage: '复制成功 🎉',
  },

  docSearch: {
    placeholder: '输入关键字搜索...',
    emptyText: '暂无匹配结果',
    loadingText: '正在加载索引...',
    sections: {
      components: '组件',
      docs: '文档',
      blog: '博客',
    },
  },

  geoRedirect: {
    title: '访问国内优化通道',
    content: '检测到你正在中国访问，是否切换到 www.antdv-next.cn 国内优化通道？',
    okText: '立即切换',
    cancelText: '继续访问当前站点',
  },
} as const
