import type { MarkdownItEnv, MarkdownItHeader } from '@mdit-vue/types'
import type MarkdownIt from 'markdown-it'
import pathe from 'pathe'

declare module '@mdit-vue/types' {
  interface MarkdownItEnv {
    id?: string
  }
}

function checkWrapper(content: string, wrapper = 'demo'): boolean {
  // 匹配 <demo 后面接空格、斜杠或大于号（忽略大小写）
  const REGEX_CHECK = new RegExp(`<${wrapper}(\\s|>|/)`, 'i')
  return REGEX_CHECK.test(content)
}

export function replaceSrcPath(content: string, id: string, root: string, wrapper = 'demo', whenToUse?: MarkdownItHeader) {
  // const REGEX_TAG = new RegExp(`(<${wrapper}\\b[^>]*>)([\\s\\S]*?)<\\/${wrapper}>`, 'gi')
  const REGEX_TAG = new RegExp(`(<${wrapper}(?!-)\\b[^>]*>)([\\s\\S]*?)<\\/${wrapper}>`, 'gi')
  return content.replace(REGEX_TAG, (tagMatch, _, titleContent) => {
    return tagMatch.replace(/(\s|^)src=(['"])(.*?)\2/gi, (srcMatch, prefix, quote, srcValue) => {
      if (!srcValue)
        return srcMatch

      const dir = pathe.dirname(id)
      const filePath = pathe.resolve(dir, srcValue)
      const relative = pathe.relative(root, filePath)
      const componentsArr = filePath.split('/')
      const demoIndex = componentsArr.reverse().findIndex(dir => dir.toLowerCase() === 'demo')
      const componentDemoPathArr = componentsArr.slice(0, demoIndex + 2)
      const componentDemoPath = componentDemoPathArr.reverse().join('/')

      const newSrc = relative.startsWith('/') ? relative : `/${relative}`
      // 如果存在 when-to-use，则在路径后添加查询参数
      if (whenToUse) {
        const slug = componentDemoPath.replace(/\//g, '-').replace('.vue', '')
        const title = titleContent
        const level = whenToUse.level + 1
        const link = `#${slug}`
        const item = {
          level,
          title,
          slug,
          link,
          children: [],
        }
        if (whenToUse.children) {
          whenToUse.children.push(item)
        }
        else {
          whenToUse.children = [item]
        }
      }

      return `${prefix}src=${quote}${newSrc}${quote}`
    })
  })
}

export function demoPlugin(md: MarkdownIt, config: { root?: string } = {}) {
  // 保存原始 render 函数
  const originalRender = md.renderer.render

  md.renderer.render = function (tokens, options, env: MarkdownItEnv) {
    const root = config.root ?? process.cwd()
    const currentId = env.id || ''
    const headers = env.headers
    const whenToUse = headers?.find(item => item.slug === 'examples')
    // 遍历所有 token
    for (const token of tokens) {
      // 1. 处理块级 HTML (html_block)
      if (token.type === 'html_block' && checkWrapper(token.content)) {
        token.content = replaceSrcPath(token.content, currentId, root, undefined, whenToUse)
      }

      else if (token.type === 'inline' && token.children) {
        for (const child of token.children) {
          if (child.type === 'html_inline' && checkWrapper(child.content)) {
            child.content = replaceSrcPath(child.content, currentId, root, undefined, whenToUse)
          }
        }
      }
    }

    return originalRender.call(this, tokens, options, env)
  }
}
