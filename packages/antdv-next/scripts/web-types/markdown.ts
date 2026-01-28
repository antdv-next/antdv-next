import { frontmatterPlugin } from '@mdit-vue/plugin-frontmatter'
import MarkdownIt from 'markdown-it'

export function createMarkdownParser() {
  const md = MarkdownIt({ html: true })
  md.use(frontmatterPlugin, {
    grayMatterOptions: {
      excerpt: false,
      format: 'yaml',
    },
  })
  return md
}
