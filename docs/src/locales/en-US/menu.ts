const menuLocales = {
  header: {
    docs: {
      vue: 'Development',
    },
    components: 'Components',
    blog: 'Blog',
    resources: 'Resources',
    sponsor: 'Sponsor',
  },

  docs: {
    vue: {
      introduce: 'Ant Design of Vue',
      use: 'How to Use',
      gettingStarted: 'Getting Started',
      ai: 'AI',
      llms: 'LLMs.txt',
      skills: 'Skills',
      advancedUse: 'Advanced Usage',
      customizeTheme: 'Customize Theme',
      compatibleStyle: 'Compatible Style',
      i18n: 'I18n',
      commonProps: 'Common Props',
      migration: 'Migration',
      migrationAntdvNext: 'Migrating from Antdv to Antdv Next',
      other: 'Others',
      awesome: 'Awesome',
      contributing: 'Contributing',
      faq: 'FAQ',
    },
  },

  blog: {
    antdvNextRelease: 'Antdv Next 1.0 Released',
  },
} as const

export default menuLocales

type DeepStringLeaves<T>
  = T extends string ? string
    : T extends Record<PropertyKey, any>
      ? { [K in keyof T]: DeepStringLeaves<T[K]> }
      : never

export type Menu = DeepStringLeaves<typeof menuLocales>
