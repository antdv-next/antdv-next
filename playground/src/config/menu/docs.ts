import type { AntdvMenuItem } from './interface'
import { components } from './components'

export const docsMenuLocales = {
  '/docs/vue/introduce': {
    'zh-CN': 'Ant Design of Vue',
    'en-US': 'Ant Design of Vue',
  },
  '/docs/vue/use': {
    'zh-CN': '如何使用',
    'en-US': 'How to Use',
  },
  '/docs/vue/getting-started': {
    'zh-CN': '快速上手',
    'en-US': 'Getting Started',
  },
  '/blog/antdv-next-release': {
    'en-US': 'Antdv Next Release v1',
    'zh-CN': 'Antdv Next v1 发布啦！',
  },
  '/docs/vue/ai': {
    'zh-CN': 'AI',
    'en-US': 'AI',
  },
  '/docs/vue/llms': {
    'zh-CN': 'LLMs.txt',
    'en-US': 'LLMs.txt',
  },
  '/docs/vue/skills': {
    'zh-CN': '技能',
    'en-US': 'Skills',
  },
  '/docs/vue/advanced/use': {
    'zh-CN': '进阶使用',
    'en-US': 'Advanced Usage',
  },
  '/docs/vue/customize-theme': {
    'zh-CN': '定制主题',
    'en-US': 'Customize Theme',
  },
  '/docs/vue/compatible-style': {
    'zh-CN': '样式兼容',
    'en-US': 'Compatible Style',
  },
  '/docs/vue/i18n': {
    'zh-CN': '国际化',
    'en-US': 'I18n',
  },
  '/docs/vue/common-props': {
    'zh-CN': '通用属性',
    'en-US': 'Common Props',
  },
  '/docs/vue/migration': {
    'zh-CN': '迁移',
    'en-US': 'Migration',
  },
  '/docs/vue/migration-antdv-next': {
    'zh-CN': '从 Antdv 迁移到 Antdv Next',
    'en-US': 'Migrating from Antdv to Antdv Next',
  },
  '/docs/vue/other': {
    'zh-CN': '其他',
    'en-US': 'Others',
  },
  '/docs/vue/awesome': {
    'zh-CN': '社区生态',
    'en-US': 'Awesome',
  },
  '/docs/vue/faq': {
    'zh-CN': '常见问题',
    'en-US': 'FAQ',
  },
  '/docs/vue/contributing': {
    'zh-CN': '贡献指南',
    'en-US': 'Contributing',
  },
}

export const docsMenus: Record<string, AntdvMenuItem[]> = {
  '/docs/vue': [
    {
      key: '/docs/vue/introduce',
      label: '介绍',
    },
    {
      key: '/docs/vue/use',
      label: '如何使用',
      type: 'group',
      children: [
        {
          key: '/docs/vue/getting-started',
          label: '快速上手',
        },
      ],
    },
    {
      key: '/docs/vue/ai',
      label: 'AI',
      type: 'group',
      children: [
        {
          key: '/docs/vue/llms',
          label: 'LLMs.txt',
        },
        {
          key: '/docs/vue/skills',
          label: 'Skills',
          tag: 'New',
        },
      ],
    },
    {
      key: '/docs/vue/advanced/use',
      label: '进阶使用',
      type: 'group',
      children: [
        {
          key: '/docs/vue/customize-theme',
          label: '定制主题',
        },
        {
          key: '/docs/vue/compatible-style',
          label: '样式兼容',
        },
        {
          key: '/docs/vue/i18n',
          label: '国际化',
        },
        {
          key: '/docs/vue/common-props',
          label: '通用属性',
        },
      ],
    },
    {
      key: '/docs/vue/migration',
      label: '迁移',
      type: 'group',
      children: [
        {
          key: '/docs/vue/migration-antdv-next',
          label: '从 Antdv 迁移到 Antdv Next',
        },
      ],
    },
    {
      key: '/docs/vue/other',
      label: '其他',
      type: 'group',
      children: [
        {
          key: '/docs/vue/awesome',
          label: '社区生态',
        },
        {
          key: '/docs/vue/contributing',
          label: '贡献指南',
        },
        {
          key: '/docs/vue/faq',
          label: '常见问题',
        },
      ],
    },
  ],
  '/components': components,
  '/blog': [
    // {
    //   key: '/blog/antdv-next-release',
    //   label: 'Antdv Next Release v1',
    // },
  ],
}
