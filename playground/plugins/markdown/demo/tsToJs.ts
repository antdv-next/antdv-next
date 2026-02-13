import * as ts from 'typescript'

const SCRIPT_BLOCK_REGEX = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi
const SCRIPT_LANG_REGEX = /\blang\s*=\s*(['"]?)([\w-]+)\1/i
const TS_LANGS = new Set(['ts', 'tsx', 'mts', 'cts'])

function transpileScript(code: string) {
  const output = ts.transpileModule(code, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2020,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.Preserve,
      esModuleInterop: true,
      verbatimModuleSyntax: true,
      removeComments: false,
      isolatedModules: true,
      declaration: false,
      noEmitHelpers: true,
      importHelpers: false,
      downlevelIteration: false,
    },
  }).outputText

  // TypeScript may append this marker when type-only imports are erased.
  return output.replace(/\n?export\s*\{\s*\};?\s*$/u, '')
}

export function tsToJs(sourceCode: string) {
  return sourceCode.replace(SCRIPT_BLOCK_REGEX, (fullMatch, attrs: string, code: string) => {
    const langMatch = attrs.match(SCRIPT_LANG_REGEX)
    if (!langMatch) {
      return fullMatch
    }

    const [, quote, lang = ''] = langMatch
    const normalizedLang = lang.toLowerCase()
    if (!TS_LANGS.has(normalizedLang)) {
      return fullMatch
    }

    const nextLang = normalizedLang === 'tsx' ? 'jsx' : 'js'
    const wrappedQuote = quote || '"'
    const nextAttrs = attrs.replace(
      SCRIPT_LANG_REGEX,
      `lang=${wrappedQuote}${nextLang}${wrappedQuote}`,
    )

    try {
      const transpiledCode = transpileScript(code)
      const normalizedCode = transpiledCode.trim()
      return `<script${nextAttrs}>\n${normalizedCode}\n</script>`
    }
    catch {
      return fullMatch
    }
  })
}
