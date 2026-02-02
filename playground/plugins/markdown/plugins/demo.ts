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

export function replaceSrcPath(content: string, id: string, root: string, wrapper = 'demo', examples?: MarkdownItHeader) {
  // Helper function to replace src path in a tag
  function replaceSrcInTag(tagMatch: string, titleContent?: string) {
    return tagMatch.replace(/(\s|^)src=(['"])(.*?)\2/gi, (srcMatch, prefix, quote, srcValue) => {
      if (!srcValue)
        return srcMatch

      // Skip if already an absolute path (already processed)
      if (srcValue.startsWith('/'))
        return srcMatch

      const dir = pathe.dirname(id)
      const filePath = pathe.resolve(dir, srcValue)
      const relative = pathe.relative(root, filePath)
      const componentsArr = filePath.split('/')
      const demoIndex = componentsArr.reverse().findIndex(dir => dir.toLowerCase() === 'demo')
      const componentDemoPathArr = componentsArr.slice(0, demoIndex + 2)
      const componentDemoPath = componentDemoPathArr.reverse().join('/')

      const newSrc = relative.startsWith('/') ? relative : `/${relative}`
      // 如果存在 examples header，则在其 children 中添加 demo 项
      if (examples && titleContent) {
        const slug = componentDemoPath.replace(/\//g, '-').replace('.vue', '')
        const title = titleContent
        const level = examples.level + 1
        const link = `#${slug}`
        const item = {
          level,
          title,
          slug,
          link,
          children: [],
        }
        if (examples.children) {
          examples.children.push(item)
        }
        else {
          examples.children = [item]
        }
      }

      return `${prefix}src=${quote}${newSrc}${quote}`
    })
  }

  // 1. First, match closed tags <demo>Title</demo> to extract title content
  const REGEX_CLOSED_TAG = new RegExp(`(<${wrapper}(?!-)\\b[^>]*>)([\\s\\S]*?)<\\/${wrapper}>`, 'gi')
  let result = content.replace(REGEX_CLOSED_TAG, (tagMatch, openTag, titleContent) => {
    // Replace src in the open tag part, passing titleContent for header generation
    const replacedOpenTag = replaceSrcInTag(openTag, titleContent?.trim())
    return tagMatch.replace(openTag, replacedOpenTag)
  })

  // 2. Then, match self-closing tags <demo ... />
  const REGEX_SELF_CLOSING_TAG = new RegExp(`<${wrapper}(?!-)\\b[^>]*/\\s*>`, 'gi')
  result = result.replace(REGEX_SELF_CLOSING_TAG, (tagMatch) => {
    return replaceSrcInTag(tagMatch)
  })

  // 3. Finally, match standalone open tags <demo ...> (when parsed separately from closing tag)
  const REGEX_OPEN_TAG = new RegExp(`<${wrapper}(?!-)\\b[^>]*>`, 'gi')
  result = result.replace(REGEX_OPEN_TAG, (tagMatch) => {
    return replaceSrcInTag(tagMatch)
  })

  return result
}

export function demoPlugin(md: MarkdownIt, config: { root?: string } = {}) {
  // 保存原始 render 函数
  const originalRender = md.renderer.render

  md.renderer.render = function (tokens, options, env: MarkdownItEnv) {
    const root = config.root ?? process.cwd()
    const currentId = env.id || ''
    const headers = env.headers
    const examples = headers?.find(item => item.slug === 'examples')

    // 递归处理 token 及其 children
    function processToken(token: any) {
      // 1. 处理块级 HTML (html_block)
      if (token.type === 'html_block' && checkWrapper(token.content)) {
        token.content = replaceSrcPath(token.content, currentId, root, undefined, examples)
      }
      // 2. 处理内联 HTML (html_inline)
      else if (token.type === 'html_inline' && checkWrapper(token.content)) {
        token.content = replaceSrcPath(token.content, currentId, root, undefined, examples)
      }

      // 3. 递归处理 children
      if (token.children) {
        for (const child of token.children) {
          processToken(child)
        }
      }
    }

    // 遍历所有 token
    for (const token of tokens) {
      processToken(token)
    }

    return originalRender.call(this, tokens, options, env)
  }
}
