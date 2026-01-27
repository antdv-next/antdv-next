import type MarkdownIt from 'markdown-it'

export function stackblitzPlugin(md: MarkdownIt) {
  const fence = md.renderer.rules.fence!
  md.renderer.rules.fence = (...args) => {
    const [tokens, idx] = args
    const token = tokens[idx]
    const info = token.info.trim()

    if (info.startsWith('stackblitz')) {
      const code = token.content
      // Extract title from {title="..."}
      const titleMatch = info.match(/\{[^}]*title\s*=\s*"([^"]*)"[^}]*\}/)
      const title = titleMatch ? titleMatch[1] : ''

      // Encode the code for safe HTML attribute usage
      const encodedCode = encodeURIComponent(code)

      return `<stackblitz code="${encodedCode}" title="${escapeHtml(title)}"></stackblitz>`
    }

    return fence(...args)
  }
}

function escapeHtml(str: string) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}