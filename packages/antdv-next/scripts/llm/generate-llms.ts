import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'tinyglobby'
import { extractTitle, getRepoRoot, normalizePath, stripFrontmatter } from './utils'

const SITE_URL = process.env.LLM_SITE_URL?.replace(/\/$/, '')
const OUTPUT_DIR = process.env.LLM_OUTPUT_DIR

async function generateLlms() {
  const repoRoot = getRepoRoot()
  const pagesDir = path.resolve(repoRoot, 'docs', 'src', 'pages')
  const siteDir = OUTPUT_DIR
    ? path.resolve(repoRoot, OUTPUT_DIR)
    : path.resolve(repoRoot, 'docs', 'public')

  const docsDirs = ['components', 'vue']
  const matchSuffix = '.en-US.md'

  await fs.mkdir(siteDir, { recursive: true })

  const docs = await glob(docsDirs.map(dir => `${dir}/**/*${matchSuffix}`), {
    cwd: pagesDir,
    absolute: true,
  })

  const docsIndex: Array<{ title: string, url: string }> = []
  const docsBody: string[] = []

  for (const markdown of docs) {
    const mdPath = path.resolve(markdown)
    const fsContent = (await fs.readFile(mdPath, 'utf-8')).trim()

    const title = extractTitle(fsContent)
    if (!title) {
      console.log('MISS title, ignore:', mdPath)
      continue
    }

    const relativePath = normalizePath(path.relative(pagesDir, mdPath))
    let urlPath = `/${relativePath.replace(matchSuffix, '')}`
    if (urlPath.endsWith('/index'))
      urlPath = urlPath.slice(0, -'/index'.length)

    const url = SITE_URL ? `${SITE_URL}${urlPath}` : urlPath

    docsIndex.push({ title, url })

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

    docsBody.push(fullContent)
  }

  const semanticUrl = SITE_URL ? `${SITE_URL}/llms-semantic.md` : '/llms-semantic.md'
  let semanticContent = ''
  try {
    semanticContent = (await fs.readFile(path.join(siteDir, 'llms-semantic.md'), 'utf-8')).trim()
  }
  catch {
    semanticContent = ''
  }

  const docsIndexContent = [
    '# Antdv Next - Vue 3 UI library',
    '',
    '- Antdv Next provides Vue 3 components aligned with Ant Design, focusing on API parity and consistent visual semantics.',
    '',
    '## Semantic Descriptions',
    '',
    `- [Antdv Next Component Semantic Descriptions](${semanticUrl})`,
    '',
    '## Docs',
    '',
    ...docsIndex.map(({ title, url }) => `- [${title}](${url})`),
    '',
  ].join('\n')

  const docsBodyContent = [
    '---',
    'Title: Antdv Next Component Semantic Descriptions',
    `URL: ${semanticUrl}`,
    '---',
    '',
    semanticContent,
    '',
    ...docsBody,
  ].join('\n')

  await fs.writeFile(path.join(siteDir, 'llms.txt'), docsIndexContent)
  await fs.writeFile(path.join(siteDir, 'llms-full.txt'), docsBodyContent)
  console.log('Generated llms.txt and llms-full.txt')
}

async function main() {
  if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1])
    await generateLlms()
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
