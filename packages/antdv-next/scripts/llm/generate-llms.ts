import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'tinyglobby'
import { extractTitle, getRepoRoot, normalizePath, stripFrontmatter } from './utils'

const DEFAULT_SITE_URL = 'https://www.antdv-next.com'

const SITE_URL = process.env.LLM_SITE_URL?.replace(/\/$/, '') || DEFAULT_SITE_URL
const OUTPUT_DIR = process.env.LLM_OUTPUT_DIR
const demoFileCache = new Map<string, Promise<string>>()

type Locale = 'en-US' | 'zh-CN'

interface DocItem {
  title: string
  url: string
  content: string
  pageContent: string
  outputRelativePath: string
}

interface LocaleDocSet {
  docs: DocItem[]
  components: DocItem[]
}

function toStaticMarkdownUrl(outputRelativePath: string) {
  const urlPath = `/${normalizePath(outputRelativePath)}`
  return SITE_URL ? `${SITE_URL}${urlPath}` : urlPath
}

function toMarkdownOutputRelativePath(relativePath: string, suffix: string, locale: Locale) {
  const withoutSuffix = relativePath.replace(suffix, '')
  const basePath = withoutSuffix.endsWith('/index')
    ? withoutSuffix.slice(0, -'/index'.length)
    : withoutSuffix
  const localeSuffix = locale === 'zh-CN' ? '-cn' : ''
  return `${basePath}${localeSuffix}.md`
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function extractDemoEntries(groupContent: string) {
  const entries: Array<{ src: string, title: string }> = []
  const demoRegex = /<demo\b([^>]*)>([\s\S]*?)<\/demo>/g

  for (const match of groupContent.matchAll(demoRegex)) {
    const attrs = match[1] ?? ''
    const srcMatch = attrs.match(/\bsrc\s*=\s*(?:"([^"]+)"|'([^']+)'|([^\s>]+))/)
    const src = srcMatch?.[1] ?? srcMatch?.[2] ?? srcMatch?.[3]
    if (!src)
      continue

    const rawTitle = match[2] ?? ''
    const title = rawTitle.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
    entries.push({
      src,
      title: title || path.basename(src, path.extname(src)).replace(/[-_]/g, ' '),
    })
  }

  return entries
}

function extractLastHeadingLevel(markdown: string) {
  const headingRegex = /^#{1,6}\s+/gm
  let lastLevel = 2
  for (const match of markdown.matchAll(headingRegex))
    lastLevel = match[0].trim().length
  return lastLevel
}

function extractDemoDescription(content: string, locale: Locale) {
  const localePattern = new RegExp(`<docs\\s+lang=["']${escapeRegExp(locale)}["']\\s*>([\\s\\S]*?)<\\/docs>`, 'i')
  const localeMatch = content.match(localePattern)
  const fallbackMatch = content.match(/<docs\b[^>]*>([\s\S]*?)<\/docs>/i)
  const raw = localeMatch?.[1] ?? fallbackMatch?.[1] ?? ''
  return raw.replace(/\r/g, '').trim()
}

function stripDemoDocsBlocks(content: string) {
  return content.replace(/<docs\b[^>]*>[\s\S]*?<\/docs>\s*/gi, '').trim()
}

async function readDemoFile(filePath: string) {
  let task = demoFileCache.get(filePath)
  if (!task) {
    task = fs.readFile(filePath, 'utf-8')
    demoFileCache.set(filePath, task)
  }
  return task
}

async function renderDemoGroupContent(
  groupContent: string,
  docPath: string,
  locale: Locale,
  headingPrefix: string,
) {
  const entries = extractDemoEntries(groupContent)
  if (!entries.length)
    return ''

  const blocks: string[] = []
  for (const entry of entries) {
    const demoPath = path.resolve(path.dirname(docPath), entry.src)
    try {
      const demoSource = await readDemoFile(demoPath)
      const description = extractDemoDescription(demoSource, locale)
      const code = stripDemoDocsBlocks(demoSource)
      const lang = path.extname(entry.src).slice(1) || 'vue'

      const blockParts = [
        `${headingPrefix} ${entry.title}`,
        '',
        description,
        '',
        `\`\`\`${lang}`,
        code,
        '```',
        '',
      ].filter(Boolean)
      blocks.push(blockParts.join('\n'))
    }
    catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      blocks.push([
        `${headingPrefix} ${entry.title}`,
        '',
        `Demo source not found: \`${normalizePath(path.relative(path.dirname(docPath), demoPath))}\``,
        '',
        `> ${message}`,
        '',
      ].join('\n'))
    }
  }

  return blocks.join('\n').trimEnd()
}

async function injectDemoSources(content: string, docPath: string, locale: Locale) {
  const demoGroupRegex = /<demo-group\b[^>]*>([\s\S]*?)<\/demo-group>/g
  let output = ''
  let lastIndex = 0

  for (const match of content.matchAll(demoGroupRegex)) {
    const index = match.index ?? 0
    const before = content.slice(0, index)
    const currentHeadingLevel = extractLastHeadingLevel(before)
    const headingPrefix = '#'.repeat(Math.min(currentHeadingLevel + 1, 6))
    const rendered = await renderDemoGroupContent(match[1] ?? '', docPath, locale, headingPrefix)

    output += content.slice(lastIndex, index)
    output += rendered || match[0]
    lastIndex = index + match[0].length
  }

  output += content.slice(lastIndex)
  return output
}

function buildStandalonePage(title: string, content: string) {
  return [`# ${title}`, '', content, ''].join('\n')
}

async function readSemanticFile(siteDir: string, fileName: string) {
  try {
    return (await fs.readFile(path.join(siteDir, fileName), 'utf-8')).trim()
  }
  catch {
    return ''
  }
}

async function collectDocsByLocale(
  pagesDir: string,
  docsDirs: string[],
  suffix: string,
  locale: Locale,
): Promise<LocaleDocSet> {
  const files = await glob(docsDirs.map(dir => `${dir}/**/*${suffix}`), {
    cwd: pagesDir,
    absolute: true,
  })

  const result: LocaleDocSet = {
    docs: [],
    components: [],
  }

  for (const markdown of files) {
    const mdPath = path.resolve(markdown)
    const fsContent = (await fs.readFile(mdPath, 'utf-8')).trim()

    const title = extractTitle(fsContent)
    if (!title) {
      console.log('MISS title, ignore:', mdPath)
      continue
    }

    const relativePath = normalizePath(path.relative(pagesDir, mdPath))
    const isComponentPage = relativePath.startsWith('components/')
    const outputRelativePath = toMarkdownOutputRelativePath(relativePath, suffix, locale)
    const url = toStaticMarkdownUrl(outputRelativePath)
    const rawContent = stripFrontmatter(fsContent)
    const parsedContent = isComponentPage
      ? await injectDemoSources(rawContent, mdPath, locale)
      : rawContent

    const fullContent = [
      '---',
      `Title: ${title}`,
      `URL: ${url}`,
      '---',
      '',
      parsedContent,
      '',
    ].join('\n')

    const item: DocItem = {
      title,
      url,
      content: fullContent,
      pageContent: buildStandalonePage(title, parsedContent),
      outputRelativePath,
    }
    if (isComponentPage)
      result.components.push(item)
    else
      result.docs.push(item)
  }

  result.docs.sort((a, b) => a.title.localeCompare(b.title))
  result.components.sort((a, b) => a.title.localeCompare(b.title))
  return result
}

async function generateLlms() {
  const repoRoot = getRepoRoot()
  const pagesDir = path.resolve(repoRoot, 'docs', 'src', 'pages')
  const siteDir = OUTPUT_DIR
    ? path.resolve(repoRoot, OUTPUT_DIR)
    : path.resolve(repoRoot, 'docs', 'public')

  const docsDirs = ['components', 'docs']
  await fs.mkdir(siteDir, { recursive: true })

  const semanticUrl = SITE_URL ? `${SITE_URL}/llms-semantic.md` : '/llms-semantic.md'
  const semanticUrlCn = SITE_URL ? `${SITE_URL}/llms-semantic-cn.md` : '/llms-semantic-cn.md'

  const [enSet, cnSet, semanticContentEn, semanticContentCn] = await Promise.all([
    collectDocsByLocale(pagesDir, docsDirs, '.en-US.md', 'en-US'),
    collectDocsByLocale(pagesDir, docsDirs, '.zh-CN.md', 'zh-CN'),
    readSemanticFile(siteDir, 'llms-semantic.md'),
    readSemanticFile(siteDir, 'llms-semantic-cn.md'),
  ])

  const fullContent = [
    '---',
    'Title: Antdv Next Component Semantic Descriptions',
    `URL: ${semanticUrl}`,
    '---',
    '',
    semanticContentEn,
    '',
    ...enSet.docs.map(item => item.content),
    ...enSet.components.map(item => item.content),
  ].join('\n')

  const fullContentCn = [
    '---',
    'Title: Antdv Next 组件语义化描述',
    `URL: ${semanticUrlCn}`,
    '---',
    '',
    semanticContentCn,
    '',
    ...cnSet.docs.map(item => item.content),
    ...cnSet.components.map(item => item.content),
  ].join('\n')

  const llmsNavContent = [
    '# Antdv Next - Vue 3 UI library',
    '',
    '- Antdv Next provides Vue 3 components aligned with Ant Design, focusing on API parity and consistent visual semantics.',
    '',
    '## Navigation',
    '',
    '- [Full Documentation (EN)](./llms-full.txt)',
    '- [Full Documentation (CN)](./llms-full-cn.txt)',
    '- [Semantic Documentation (EN)](./llms-semantic.md)',
    '- [Semantic Documentation (CN)](./llms-semantic-cn.md)',
    '',
    '## Docs (EN)',
    '',
    ...enSet.docs.map(({ title, url }) => `- [${title}](${url})`),
    '',
    '## Docs (CN)',
    '',
    ...cnSet.docs.map(({ title, url }) => `- [${title}](${url})`),
    '',
    '## Component Docs (EN)',
    '',
    ...enSet.components.map(({ title, url }) => `- [${title}](${url})`),
    '',
    '## Component Docs (CN)',
    '',
    ...cnSet.components.map(({ title, url }) => `- [${title}](${url})`),
    '',
    '## Semantic (EN)',
    '',
    `- [Antdv Next Component Semantic Descriptions](${semanticUrl})`,
    '',
    '## Semantic (CN)',
    '',
    `- [Antdv Next 组件语义化描述](${semanticUrlCn})`,
    '',
  ].join('\n')

  const allMarkdownPages = [
    ...enSet.docs,
    ...enSet.components,
    ...cnSet.docs,
    ...cnSet.components,
  ]

  const markdownPageWriteTasks = allMarkdownPages.map(async (item) => {
    const filePath = path.join(siteDir, item.outputRelativePath)
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    await fs.writeFile(filePath, item.pageContent)
  })

  await Promise.all([
    fs.writeFile(path.join(siteDir, 'llms.txt'), llmsNavContent),
    fs.writeFile(path.join(siteDir, 'llms-full.txt'), fullContent),
    fs.writeFile(path.join(siteDir, 'llms-full-cn.txt'), fullContentCn),
    ...markdownPageWriteTasks,
  ])
  console.log(`Generated llms files and ${markdownPageWriteTasks.length} markdown pages`)
}

async function main() {
  if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1])
    await generateLlms()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
