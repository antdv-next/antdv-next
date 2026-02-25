import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'tinyglobby'
import { extractTitle, getRepoRoot, normalizePath, stripFrontmatter } from './utils'

const SITE_URL = process.env.LLM_SITE_URL?.replace(/\/$/, '')
const OUTPUT_DIR = process.env.LLM_OUTPUT_DIR

interface DocItem {
  title: string
  url: string
  content: string
}

interface LocaleDocSet {
  docs: DocItem[]
  components: DocItem[]
}

function toDocUrl(relativePath: string, suffix: string) {
  let urlPath = `/${relativePath.replace(suffix, '')}`
  if (urlPath.endsWith('/index'))
    urlPath = urlPath.slice(0, -'/index'.length)
  return SITE_URL ? `${SITE_URL}${urlPath}` : urlPath
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
    const url = toDocUrl(relativePath, suffix)
    const parsedContent = stripFrontmatter(fsContent)

    const fullContent = [
      '---',
      `Title: ${title}`,
      `URL: ${url}`,
      '---',
      '',
      parsedContent,
      '',
    ].join('\n')

    const item: DocItem = { title, url, content: fullContent }
    if (relativePath.startsWith('components/'))
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
    collectDocsByLocale(pagesDir, docsDirs, '.en-US.md'),
    collectDocsByLocale(pagesDir, docsDirs, '.zh-CN.md'),
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

  await Promise.all([
    fs.writeFile(path.join(siteDir, 'llms.txt'), llmsNavContent),
    fs.writeFile(path.join(siteDir, 'llms-full.txt'), fullContent),
    fs.writeFile(path.join(siteDir, 'llms-full-cn.txt'), fullContentCn),
  ])
  console.log('Generated llms.txt, llms-full.txt and llms-full-cn.txt')
}

async function main() {
  if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1])
    await generateLlms()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
