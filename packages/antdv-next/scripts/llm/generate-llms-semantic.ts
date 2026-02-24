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

function extractLocaleInfo(content: string) {
  const cnMatch = content.match(/cn:\s*\{([\s\S]*?)\}\s*,\s*en\s*:/)
  const enMatch = content.match(/en:\s*\{([\s\S]*?)\}\s*[,}]/)

  if (!cnMatch && !enMatch)
    return null

  return {
    cn: cnMatch?.[1] || '',
    en: enMatch?.[1] || '',
  }
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

async function resolveLocalImportFile(fromFile: string, importPath: string) {
  const basePath = path.resolve(path.dirname(fromFile), importPath)
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.jsx`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.tsx'),
    path.join(basePath, 'index.js'),
    path.join(basePath, 'index.jsx'),
  ]

  for (const candidate of candidates) {
    try {
      await fs.access(candidate)
      return candidate
    }
    catch {}
  }

  return null
}

async function loadLocaleSourceContent(docPath: string, content: string) {
  const inlineLocaleInfo = extractLocaleInfo(content)
  if (inlineLocaleInfo)
    return { content, localeInfo: inlineLocaleInfo }

  const importMatch = content.match(/import\s+\{\s*locales\s*\}\s+from\s+['"]([^'"]+)['"]/)
  const importPath = importMatch?.[1]
  if (!importPath?.startsWith('.'))
    return null

  const localeFilePath = await resolveLocalImportFile(docPath, importPath)
  if (!localeFilePath)
    return null

  const localeFileContent = await fs.readFile(localeFilePath, 'utf-8')
  const localeInfo = extractLocaleInfo(localeFileContent)
  if (!localeInfo)
    return null

  return {
    content: localeFileContent,
    localeInfo,
  }
}

function extractSemanticNameLocaleKeyPairs(content: string) {
  const pairs: Array<{ name: string, localeKey: string }> = []
  const matches = content.matchAll(/\{\s*name\s*:\s*['"]([^'"]+)['"]\s*,\s*desc\s*:\s*t\(\s*['"]([^'"]+)['"]\s*\)[\s\S]*?\}/g)

  for (const match of matches) {
    const [, name, localeKey] = match
    if (!name || !localeKey)
      continue
    pairs.push({ name, localeKey })
  }

  return pairs
}

function pickSemanticEntries(
  localeSemantics: Record<string, string>,
  semanticPairs: Array<{ name: string, localeKey: string }>,
) {
  if (!semanticPairs.length)
    return localeSemantics

  return semanticPairs.reduce<Record<string, string>>((acc, { name, localeKey }) => {
    const desc = localeSemantics[localeKey]
    if (desc)
      acc[name] = desc
    return acc
  }, {})
}

function renderSemanticMarkdown(
  semanticDescriptions: Record<string, any>,
  options: {
    title: string
    intro: string
    totalLabel: string
  },
) {
  let markdownContent = `${options.title}\n\n`
  markdownContent += `${options.intro}\n\n`
  markdownContent += `> ${options.totalLabel.replace('{count}', String(Object.keys(semanticDescriptions).length))}\n\n`
  markdownContent += '## Component List\n\n'

  const sortedComponents = Object.keys(semanticDescriptions).sort()
  sortedComponents.forEach((componentName) => {
    markdownContent += `### ${componentName}\n\n`
    markdownContent += generateMarkdownStructure(semanticDescriptions[componentName])
    markdownContent += '\n'
  })

  return markdownContent
}

async function generateSemanticDesc() {
  const repoRoot = getRepoRoot()
  const componentsDir = path.resolve(repoRoot, 'docs', 'src', 'pages', 'components')
  const siteDir = OUTPUT_DIR
    ? path.resolve(repoRoot, OUTPUT_DIR)
    : path.resolve(repoRoot, 'docs', 'public')

  await fs.mkdir(siteDir, { recursive: true })

  const docs = await glob('**/demo/_semantic*.{vue,tsx,ts,js,jsx}', {
    cwd: componentsDir,
    absolute: true,
  })

  const semanticDescriptionsEn: Record<string, any> = {}
  const semanticDescriptionsCn: Record<string, any> = {}

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

      const localeSource = await loadLocaleSourceContent(docPath, content)
      if (!localeSource)
        continue

      const semanticPairs = extractSemanticNameLocaleKeyPairs(content)
      const cnSemantics = pickSemanticEntries(extractFlatSemantics(localeSource.localeInfo.cn), semanticPairs)
      const enSemantics = pickSemanticEntries(extractFlatSemantics(localeSource.localeInfo.en), semanticPairs)

      if (Object.keys(cnSemantics).length)
        semanticDescriptionsCn[semanticKey] = buildNestedStructure(cnSemantics)

      if (Object.keys(enSemantics).length)
        semanticDescriptionsEn[semanticKey] = buildNestedStructure(enSemantics)
    }
    catch (error) {
      console.error(`Error processing ${docPath}:`, error)
    }
  }

  const markdownContentEn = renderSemanticMarkdown(semanticDescriptionsEn, {
    title: '# Antdv Next Component Semantic Descriptions',
    intro: 'This document contains semantic DOM descriptions for Antdv Next components.',
    totalLabel: 'Total {count} components with semantic descriptions',
  })

  const markdownContentCn = renderSemanticMarkdown(semanticDescriptionsCn, {
    title: '# Antdv Next 组件语义化描述',
    intro: '本文档包含 Antdv Next 组件的语义化 DOM 描述信息。',
    totalLabel: '总计 {count} 个组件包含语义化描述',
  })

  const outputPathEn = path.join(siteDir, 'llms-semantic.md')
  const outputPathCn = path.join(siteDir, 'llms-semantic-cn.md')
  await fs.writeFile(outputPathEn, markdownContentEn, 'utf-8')
  await fs.writeFile(outputPathCn, markdownContentCn, 'utf-8')
  console.log(`Semantic descriptions saved to: ${outputPathEn}, ${outputPathCn}`)
}

async function main() {
  if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1])
    await generateSemanticDesc()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
