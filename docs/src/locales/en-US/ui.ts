export default {
  themeBtn: {
    system: 'Follow System',
    light: 'Light Theme',
    dark: 'Dark Theme',
    compact: 'Compact Theme',
    happy: 'Happy Work Effect',
    aiTheme: 'AI Generated Theme',
    themeEditor: 'Theme Editor',
    aiThemeModal: {
      title: 'AI Theme Editor',
      content: 'antdv-next shares the same theme token system with Ant Design, allowing you to use Ant Design\'s AI Theme Editor to customize themes for your antdv-next projects',
      okText: 'Go',
      cancelText: 'Cancel',
    },
  },

  codeDemo: {
    type: {
      typescript: 'TypeScript',
      javascript: 'JavaScript',
    },
    action: {
      externalLink: 'Open in new window',
      openPlayground: 'Open in Playground',
      expandCode: 'Expand Code',
      expandedCode: 'Collapse Code',
      stackblitz: 'Open in StackBlitz',
      copied: 'Copied Success',
      copy: 'Copy Code',
    },
  },

  iconSearch: {
    themes: {
      outlined: 'Outlined',
      filled: 'Filled',
      twoTone: 'TwoTone',
    },

    categories: {
      direction: 'Directional Icons',
      suggestion: 'Suggested Icons',
      editor: 'Editor Icons',
      data: 'Data Icons',
      logo: 'Brand and Logos',
      other: 'Application Icons',
    },

    searchPlaceholder: 'Search icons',
    copiedMessage: 'copied 🎉',
  },

  docSearch: {
    placeholder: 'Search docs and components...',
    emptyText: 'No results found',
    loadingText: 'Loading search index...',
    sections: {
      components: 'Components',
      docs: 'Docs',
      blog: 'Blog',
    },
  },

  geoRedirect: {
    title: 'Use China optimized site?',
    content: 'We detected you are visiting from China. Would you like to switch to the China-optimized channel on www.antdv-next.cn?',
    okText: 'Switch Now',
    cancelText: 'Stay Here',
  },
} as const
