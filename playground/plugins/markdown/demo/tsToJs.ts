import type { ESLint } from 'eslint'
import { transformWithOxc } from 'vite'

const SCRIPT_BLOCK_REGEX = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
const SCRIPT_LANG_REGEX = /\blang\s*=\s*(['"]?)([\w-]+)\1/i
const TS_LANGS = new Set(['ts', 'tsx', 'mts', 'cts'])

const EXPORT_MARKER_REGEX = /\n?export\s*\{\s*\};?\s*$/u
let eslintPromise: Promise<ESLint | null> | null = null

async function getEslint() {
  if (!eslintPromise) {
    eslintPromise = (async () => {
      try {
        const { ESLint } = await import('eslint')
        return new ESLint({
          fix: true,
          fixTypes: ['layout'],
        })
      }
      catch {
        return null
      }
    })()
  }
  return eslintPromise
}

async function formatScript(code: string, lang: string) {
  try {
    const eslint = await getEslint()
    if (!eslint) {
      return code
    }

    const filePath = `virtual-demo-script.${lang === 'tsx' ? 'jsx' : 'js'}`
    const [result] = await eslint.lintText(code, { filePath })
    return result?.output ?? code
  }
  catch {
    return code
  }
}

async function transpileScript(code: string, lang: string) {
  const oxcLang = lang === 'tsx' ? 'tsx' : 'ts'
  const result = await transformWithOxc(code, `virtual-demo-script.${oxcLang}`, {
    lang: oxcLang,
    sourceType: 'module',
    target: 'es2020',
    jsx: oxcLang === 'tsx' ? 'preserve' : undefined,
    typescript: {
      onlyRemoveTypeImports: true,
    },
    sourcemap: false,
  })

  const output = result.code
  // remove `export {}`
  const withoutExportMarker = output.replace(EXPORT_MARKER_REGEX, '')
  return formatScript(withoutExportMarker, oxcLang)
}

export async function tsToJs(sourceCode: string) {
  let nextSourceCode = ''
  let lastIndex = 0
  SCRIPT_BLOCK_REGEX.lastIndex = 0

  for (const match of sourceCode.matchAll(SCRIPT_BLOCK_REGEX)) {
    const [fullMatch, attrs = '', code = ''] = match
    const startIndex = match.index ?? 0
    nextSourceCode += sourceCode.slice(lastIndex, startIndex)

    const langMatch = attrs.match(SCRIPT_LANG_REGEX)
    if (!langMatch) {
      nextSourceCode += fullMatch
      lastIndex = startIndex + fullMatch.length
      continue
    }

    const [, quote, lang = ''] = langMatch
    const normalizedLang = lang.toLowerCase()
    if (!TS_LANGS.has(normalizedLang)) {
      nextSourceCode += fullMatch
      lastIndex = startIndex + fullMatch.length
      continue
    }

    const nextLang = normalizedLang === 'tsx' ? 'jsx' : 'js'
    const wrappedQuote = quote || '"'
    const nextAttrs = attrs.replace(
      SCRIPT_LANG_REGEX,
      `lang=${wrappedQuote}${nextLang}${wrappedQuote}`,
    )

    try {
      const transpiledCode = await transpileScript(code, normalizedLang)
      const normalizedCode = transpiledCode.trim()
      nextSourceCode += `<script${nextAttrs}>\n${normalizedCode}\n</script>`
    }
    catch {
      nextSourceCode += fullMatch
    }

    lastIndex = startIndex + fullMatch.length
  }

  nextSourceCode += sourceCode.slice(lastIndex)
  return nextSourceCode
}
