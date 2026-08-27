import { access, mkdir, readdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Octokit } from '@octokit/rest'
import cliProgress from 'cli-progress'

type LocaleSuffix = 'en-US' | 'zh-CN'
type ModuleName = 'components' | 'blog' | 'docs/vue'

interface DocumentFile {
  module: ModuleName
  key: string
  filePath: string
}

interface ContributorData {
  logins: string[]
  components: Record<string, number[]>
  blog: Record<string, number[]>
  'docs/vue': Record<string, number[]>
}

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(scriptDir, '..')
const owner = 'antdv-next'
const repo = 'antdv-next'
const defaultOutputFile = path.join(repoRoot, 'docs', 'src', 'assets', 'contributors.json')
const botExcludes = new Set([
  'github-actions',
  'github-actions[bot]',
  'copilot',
  'renovate',
  'renovate[bot]',
  'dependabot',
  'dependabot[bot]',
  'dependabot-preview',
  'dependabot-preview[bot]',
  'depfu[bot]',
  'gemini-code-assist[bot]',
])
const locales: LocaleSuffix[] = ['en-US', 'zh-CN']

function parseOutputFile(args: string[]) {
  const outputIndex = args.indexOf('--output')
  if (outputIndex >= 0) {
    const output = args[outputIndex + 1]
    if (!output) {
      throw new Error('Missing output path after --output.')
    }
    return path.resolve(repoRoot, output)
  }

  const outputArgument = args.find(arg => arg.startsWith('--output='))
  if (outputArgument) {
    const output = outputArgument.slice('--output='.length)
    if (!output) {
      throw new Error('Missing output path after --output=.')
    }
    return path.resolve(repoRoot, output)
  }

  const positionalOutput = args.find(arg => !arg.startsWith('-'))
  return positionalOutput ? path.resolve(repoRoot, positionalOutput) : defaultOutputFile
}

function toGitHubPath(filePath: string) {
  return path.relative(repoRoot, filePath).split(path.sep).join(path.posix.sep)
}

async function pathExists(filePath: string) {
  try {
    await access(filePath)
    return true
  }
  catch {
    return false
  }
}

async function getFlatDocumentFiles(
  dir: string,
  module: ModuleName,
  suffix: LocaleSuffix,
): Promise<DocumentFile[]> {
  const entries = await readdir(dir, { withFileTypes: true })
  return entries
    .filter(entry => entry.isFile() && entry.name.endsWith(`.${suffix}.md`))
    .map(entry => ({
      module,
      key: entry.name.replace(`.${suffix}.md`, ''),
      filePath: path.join(dir, entry.name),
    }))
}

async function getComponentDocumentFiles(suffix: LocaleSuffix): Promise<DocumentFile[]> {
  const componentsDir = path.join(repoRoot, 'docs', 'src', 'pages', 'components')
  const entries = await readdir(componentsDir, { withFileTypes: true })
  const files: DocumentFile[] = []

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue
    }

    const filePath = path.join(componentsDir, entry.name, `index.${suffix}.md`)
    if (await pathExists(filePath)) {
      files.push({ module: 'components', key: entry.name, filePath })
    }
  }

  return files
}

async function collectDocumentFiles() {
  const documents: DocumentFile[] = []
  for (const suffix of locales) {
    documents.push(...await getComponentDocumentFiles(suffix))
    documents.push(...await getFlatDocumentFiles(path.join(repoRoot, 'docs', 'src', 'pages', 'blog'), 'blog', suffix))
    documents.push(...await getFlatDocumentFiles(path.join(repoRoot, 'docs', 'src', 'pages', 'docs', 'vue'), 'docs/vue', suffix))
  }
  return documents
}

function isBotAuthor(author: { login?: string | null, type?: string | null } | null | undefined) {
  if (author?.type === 'Bot') {
    return true
  }
  const login = author?.login?.toLowerCase() ?? ''
  return botExcludes.has(login) || Array.from(botExcludes).some(item => login.includes(item))
}

function addCommitAuthor(counts: Map<string, number>, author: { login?: string | null, type?: string | null } | null | undefined) {
  const login = author?.login
  if (!login || isBotAuthor(author)) {
    return
  }
  counts.set(login, (counts.get(login) ?? 0) + 1)
}

async function getFileContributorCounts(octokit: Octokit, filePath: string) {
  const commits = await octokit.paginate(octokit.rest.repos.listCommits, {
    owner,
    repo,
    path: toGitHubPath(filePath),
    per_page: 100,
  })
  const counts = new Map<string, number>()

  for (const commit of commits) {
    addCommitAuthor(counts, commit.author)
  }

  return counts
}

function mergeContributorCounts(target: Map<string, number>, source: Map<string, number>) {
  for (const [login, count] of source) {
    target.set(login, (target.get(login) ?? 0) + count)
  }
}

function createEmptyData(): ContributorData {
  return {
    logins: [],
    components: {},
    blog: {},
    'docs/vue': {},
  }
}

async function execute() {
  const outputFile = parseOutputFile(process.argv.slice(2))
  const token = process.env.GITHUB_ACCESS_TOKEN || process.env.GITHUB_TOKEN

  if (!token) {
    console.warn('GITHUB_ACCESS_TOKEN or GITHUB_TOKEN is not set; skipping contributors generation.')
    return
  }

  const documents = await collectDocumentFiles()
  const octokit = new Octokit({ auth: token })
  const progressBar = new cliProgress.SingleBar(
    {
      format: 'Generate contributors [{bar}] {value}/{total} {module}/{key}',
      clearOnComplete: true,
    },
    cliProgress.Presets.shades_classic,
  )
  const documentCounts = new Map<string, Map<string, number>>()
  const loginIndexes = new Map<string, number>()
  const logins: string[] = []

  progressBar.start(documents.length, 0, { module: '', key: '' })
  try {
    for (const document of documents) {
      progressBar.update({ module: document.module, key: document.key })
      const documentKey = `${document.module}/${document.key}`
      const counts = documentCounts.get(documentKey) ?? new Map<string, number>()
      mergeContributorCounts(counts, await getFileContributorCounts(octokit, document.filePath))
      documentCounts.set(documentKey, counts)
      progressBar.increment()
    }
  }
  finally {
    progressBar.stop()
    process.stdout.write('\n')
  }

  const output = createEmptyData()
  for (const [documentKey, counts] of documentCounts) {
    const contributors = Array.from(counts, ([login, count]) => ({ login, count }))
      .sort((a, b) => b.count - a.count)
    const module = (documentKey.startsWith('docs/vue/')
      ? 'docs/vue'
      : documentKey.split('/')[0]) as ModuleName
    const key = documentKey.slice(module.length + 1)
    const indexes: number[] = []

    for (const contributor of contributors) {
      let index = loginIndexes.get(contributor.login)
      if (index === undefined) {
        index = logins.length
        logins.push(contributor.login)
        loginIndexes.set(contributor.login, index)
      }
      indexes.push(index)
    }

    output[module][key] = indexes
  }
  output.logins = logins

  await mkdir(path.dirname(outputFile), { recursive: true })
  await writeFile(outputFile, `${JSON.stringify(output, null, 2)}\n`, 'utf8')
  console.log(`Generated contributors data: ${path.relative(repoRoot, outputFile).split(path.sep).join(path.posix.sep)}`)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  execute().catch((error: unknown) => {
    console.error('Failed to generate contributors data:', error)
    process.exitCode = 1
  })
}

export {
  addCommitAuthor,
  createEmptyData,
  isBotAuthor,
  mergeContributorCounts,
  parseOutputFile,
}
