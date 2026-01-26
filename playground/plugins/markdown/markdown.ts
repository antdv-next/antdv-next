import type { MarkdownItAsync } from 'markdown-it-async'
import { frontmatterPlugin } from '@mdit-vue/plugin-frontmatter'
import { headersPlugin } from '@mdit-vue/plugin-headers'
import { titlePlugin } from '@mdit-vue/plugin-title'
import { tocPlugin } from '@mdit-vue/plugin-toc'
import { slugify } from '@mdit-vue/shared'
import { fromAsyncCodeToHtml } from '@shikijs/markdown-it/async'
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers'
import anchorPlugin from 'markdown-it-anchor'
import MarkdownIt from 'markdown-it-async'
import attrsPlugin from 'markdown-it-attrs'
// @ts-expect-error this is not has types
import { full as emoij } from 'markdown-it-emoji'
import { codeToHtml } from 'shiki'
import { containerPlugin } from './plugins/container'
import { demoPlugin } from './plugins/demo'
import { gitHubAlertsPlugin } from './plugins/github-alerts'
import { imagePlugin } from './plugins/image'
import { preWrapperPlugin } from './plugins/pre-wrapper'
import { stackblitzPlugin } from './plugins/stackblitz'
import { tablePlugin } from './plugins/table'

export function loadShiki(md: MarkdownItAsync, cls: string = 'ant-doc-code') {
  md.use(fromAsyncCodeToHtml(codeToHtml, {
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    defaultColor: false,
    cssVariablePrefix: '--ant-doc-',
    transformers: [
      // transformerTwoslash(),
      transformerMetaHighlight(),
      transformerMetaWordHighlight(),
      transformerNotationDiff(),
      transformerNotationErrorLevel(),
      transformerNotationFocus(),
      transformerNotationHighlight(),
      transformerNotationWordHighlight(),
      {
        name: 'remove:clean-up',
        code(element) {
          if (element.tagName === 'code' && element.properties.class)
            delete element.properties.class
        },
        pre(element) {
          delete element.properties.tabindex
          delete element.properties.style
          this.addClassToHast(element, cls)
        },
      },
    ],
  }))
}

export function loadBaseMd(md: MarkdownItAsync) {
  // 允许在 markdown 中使用
  md.use(frontmatterPlugin)
  // 头部插件
  md.use(headersPlugin, {
    level: [2, 3, 4, 5, 6],
    slugify,
    // ...options.header,
  })
  // 标题插件
  md.use(titlePlugin)
  // 加载emoji表情包
  md.use(emoij)
  // 加载处理器
  md.use(attrsPlugin)
  // 加载容器插件
  md.use(containerPlugin)
  // 加载github警告插件
  md.use(gitHubAlertsPlugin)
}

function withPlugins(md: MarkdownItAsync, options: CreateMarkdownOptions) {
  // 处理demo
  md.use(demoPlugin, {
    root: options.root,
  })
  // 加载基础markdown配置
  loadBaseMd(md)
  // 目录插件
  md.use(tocPlugin)
  // 加载anchor插件
  md.use(anchorPlugin, {
    slugify,
    permalink: anchorPlugin.permalink.linkInsideHeader({
      symbol: '&ZeroWidthSpace;',
      renderAttrs: (slug, state) => {
        // Find `heading_open` with the id identical to slug
        const idx = state.tokens.findIndex((token) => {
          const attrs = token.attrs
          const id = attrs?.find(attr => attr[0] === 'id')
          return id && slug === id[1]
        })
        // Get the actual heading content
        const title = state.tokens[idx + 1].content
        return {
          'aria-label': `Permalink to "${title}"`,
        }
      },
    }),
  })
  // 配置加载高亮配置
  loadShiki(md)
  // 加载图片插件
  md.use(imagePlugin)
  // 加载pre标签包裹插件
  md.use(preWrapperPlugin, {
    hasSingleTheme: false, // 是否只有一个主题
  })
  // 加载表格插件，为 Api 区域的表格添加属性
  md.use(tablePlugin)
  // 加载 StackBlitz 代码块插件
  md.use(stackblitzPlugin)

  // 禁用markdown自动识别链接
  md.linkify.set({ fuzzyLink: false })
}

export interface CreateMarkdownOptions {
  /**
   * 是否加载插件
   * @default true
   */
  withPlugin?: boolean
  /**
   * 自定义插件前的钩子
   */
  preConfig?: (md: MarkdownItAsync) => void
  /**
   * 自定义插件后的钩子
   */
  config?: (md: MarkdownItAsync) => void
  /**
   * 资源路径配置
   */
  root?: string
}

export function createMarkdown() {
  let md: MarkdownItAsync
  return (options: CreateMarkdownOptions = {}) => {
    if (md) {
      return md
    }
    md = MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
    })
    if (options.preConfig) {
      options.preConfig(md)
    }
    if (options.withPlugin !== false) {
      withPlugins(md, options)
    }
    if (options.config) {
      options.config(md)
    }
    return md
  }
}

export const useMarkdown = createMarkdown()
