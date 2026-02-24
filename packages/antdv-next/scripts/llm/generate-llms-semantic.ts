import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'tinyglobby'
import { getRepoRoot } from './utils'

const OUTPUT_DIR = process.env.LLM_OUTPUT_DIR

const ConvertMap: Record<string, string> = {
  'badge:ribbon': 'ribbon',
  'floatButton:group': 'floatButtonGroup',
  'input:input': 'input',
  'input:otp': 'otp',
  'input:search': 'inputSearch',
  'input:textarea': 'textArea',
}

function toCamelCase(value: string) {
  return value.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

function buildNestedStructure(flatSemantics: Record<string, string>) {
  const result: Record<string, any> = {}
  const nestedKeys = new Set<string>()

  Object.keys(flatSemantics).forEach((key) => {
    if (key.includes('.'))
      nestedKeys.add(key.split('.')![0]!)
  })

  Object.entries(flatSemantics).forEach(([key, value]) => {
    if (key.includes('.')) {
      const parts = key.split('.')
      let current = result

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i]!
        if (!current[part] || typeof current[part] === 'string')
          current[part] = {}
        current = current[part]
      }

      current[parts[parts.length - 1]!]! = value
    }
    else if (!nestedKeys.has(key)) {
      result[key] = value
    }
    else if (!result[key]) {
      result[key] = {}
    }
  })

  return result
}

function generateMarkdownStructure(obj: Record<string, any>, indent = 0): string {
  let result = ''
  Object.entries(obj).forEach(([key, value]) => {
    const indentStr = '  '.repeat(indent)
    if (typeof value === 'string')
      result += `${indentStr}- \`${key}\`: ${value}\n`
    else result += `${indentStr}- \`${key}\`:\n${generateMarkdownStructure(value, indent + 1)}`
  })
  return result
}

function extractLocaleBlock(content: string, locale: string) {
  const localesMatch = content.match(/const\s+locales\s*=\s*\{([\s\S]*?)\};/)
  if (!localesMatch)
    return ''

  const match = content.match(new RegExp(`${locale}:\\s*\\{([\\s\\S]*?)\\}\\s*,?\\s*(en:|cn:|$)`))
  return match?.[1] || ''
}

function extractFlatSemantics(localeContent: string) {
  const flat: Record<string, string> = {}
  const matches = localeContent.matchAll(/['"]?([^'":\s]+)['"]?\s*:\s*['"]([^'"]+)['"],?/g)
  for (const match of matches) {
    const [, key, value] = match
    // @ts-expect-error this
    flat[key] = value
  }
  return flat
}

async function generateSemanticDesc() {
  const repoRoot = getRepoRoot()
  const componentsDir = path.resolve(repoRoot, 'docs', 'src', 'pages', 'components')
  const siteDir = OUTPUT_DIR
    ? path.resolve(repoRoot, OUTPUT_DIR)
    : path.resolve(repoRoot, 'docs', 'dist')

  await fs.mkdir(siteDir, { recursive: true })

  const docs = await glob('**/demo/_semantic*.{vue,tsx,ts,js,jsx}', {
    cwd: componentsDir,
    absolute: true,
  })

  const semanticDescriptions: Record<string, any> = {}

  for (const docPath of docs) {
    try {
      const content = await fs.readFile(docPath, 'utf-8')
      const componentName = path.basename(path.dirname(path.dirname(docPath)))
      const ext = path.extname(docPath)
      const fileName = path.basename(docPath, ext)

      let semanticKey = toCamelCase(componentName)
      if (fileName !== '_semantic') {
        const variant = fileName.replace(/^_semantic_?/, '')
        if (variant)
          semanticKey = `${semanticKey}:${variant}`
      }

      if (ConvertMap[semanticKey])
        semanticKey = ConvertMap[semanticKey]!

      const cnContent = extractLocaleBlock(content, 'cn')
      const localeContent = cnContent || extractLocaleBlock(content, 'en')
      if (!localeContent)
        continue

      const flatSemantics = extractFlatSemantics(localeContent)
      if (!Object.keys(flatSemantics).length)
        continue

      semanticDescriptions[semanticKey] = buildNestedStructure(flatSemantics)
    }
    catch (error) {
      console.error(`Error processing ${docPath}:`, error)
    }
  }

  let markdownContent = '# Antdv Next Component Semantic Descriptions\n\n'
  markdownContent += 'This document contains semantic DOM descriptions for Antdv Next components.\n\n'
  markdownContent += `> Total ${Object.keys(semanticDescriptions).length} components with semantic descriptions\n\n`
  markdownContent += '## Component List\n\n'

  const sortedComponents = Object.keys(semanticDescriptions).sort()
  sortedComponents.forEach((componentName) => {
    markdownContent += `### ${componentName}\n\n`
    markdownContent += generateMarkdownStructure(semanticDescriptions[componentName])
    markdownContent += '\n'
  })

  const outputPath = path.join(siteDir, 'llms-semantic.md')
  await fs.writeFile(outputPath, markdownContent, 'utf-8')
  console.log(`Semantic descriptions saved to: ${outputPath}`)
}

async function main() {
  if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1])
    await generateSemanticDesc()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
