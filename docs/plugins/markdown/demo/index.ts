import type { PluginOption } from 'vite'
import fs from 'node:fs/promises'
import path from 'node:path'
import pm from 'picomatch'
import { normalizePath } from 'vite'
import { parse } from 'vue/compiler-sfc'
import { createMarkdown, loadBaseMd, loadShiki } from '../markdown'
import { tsToJs } from './tsToJs'

interface ParsedDemoFile {
  locales: Record<string, { html: string, title: string }>
  sourceCode: string
  jsSourceCode: string
  extraFiles: DemoExtraFile[]
}

interface DemoExtraFile {
  name: string
  lang: string
  code: string
  html: string
}

const EXT_LANG_MAP: Record<string, string> = {
  '.json': 'json',
  '.ts': 'ts',
  '.tsx': 'tsx',
  '.js': 'js',
  '.jsx': 'jsx',
  '.mjs': 'js',
  '.cjs': 'js',
  '.vue': 'vue',
  '.css': 'css',
  '.less': 'less',
  '.scss': 'scss',
  '.md': 'md',
  '.html': 'html',
}

function extLang(ext: string) {
  return EXT_LANG_MAP[ext.toLowerCase()] ?? 'text'
}

/**
 * 收集 demo 内相对导入的伴生文件（用于多文件代码 tab 展示）。
 * 跳过无扩展名的导入（如目录 index），避免内联无关模块。
 */
async function collectExtraFiles(
  filePath: string,
  sourceCode: string,
  md: ReturnType<ReturnType<typeof createMarkdown>>,
): Promise<DemoExtraFile[]> {
  const dir = path.dirname(filePath)
  const seen = new Set<string>()
  const files: DemoExtraFile[] = []

  // Match `from './xxx'` or side-effect `import './xxx'`.
  const importRegex = /(?:from|import)\s*(?:\(\s*)?["'](\.{1,2}\/[^"']+)["']/g

  // `for` 的 update 表达式在 continue 时也会执行，避免重复/无扩展名导入导致死循环
  for (
    let match = importRegex.exec(sourceCode);
    match !== null;
    match = importRegex.exec(sourceCode)
  ) {
    const rel = match[1]
    const ext = path.extname(rel)
    if (seen.has(rel) || !ext)
      continue
    seen.add(rel)

    const resolved = path.resolve(dir, rel)
    try {
      const content = await fs.readFile(resolved, 'utf-8')
      const lang = extLang(ext)
      const html = await md.renderAsync(`\`\`\`${lang}\n${content}\n\`\`\``)
      files.push({ name: rel, lang, code: content, html })
    }
    catch {
      // ignore non-existent / non-readable files
    }
  }
  return files
}

/**
 * 将绝对路径转换为相对于项目根目录的路径
 */
export function toRelativePath(absolutePath: string, root: string): string {
  const normalizedPath = normalizePath(absolutePath)
  const normalizedRoot = normalizePath(root)
  return normalizedPath.startsWith(normalizedRoot)
    ? normalizedPath.slice(normalizedRoot.length)
    : normalizedPath
}

function isDemoFile(filePath: string, root: string, patterns: string[]) {
  const relativePath = toRelativePath(filePath, root)
  return patterns.some(pattern => pm.isMatch(relativePath, pattern))
}

function toDemoKey(filePath: string, root: string) {
  const relativePath = toRelativePath(filePath, root)
  return relativePath.startsWith('/') ? relativePath : `/${relativePath}`
}

/**
 * 完整解析 demo 文件（用于 build 缓存和 dev source endpoint）
 */
async function parseDemoFile(
  filePath: string,
  md: ReturnType<ReturnType<typeof createMarkdown>>,
): Promise<ParsedDemoFile> {
  const code = await fs.readFile(filePath, 'utf-8')
  const locales = await parseDemoLocales(code, filePath, md)

  const sourceCode = code.replace(/<docs[^>]*>[\s\S]*?<\/docs>/g, '').trim()
  const jsSourceCode = await tsToJs(sourceCode)
  const extraFiles = await collectExtraFiles(filePath, sourceCode, md)

  return {
    locales,
    sourceCode,
    jsSourceCode,
    extraFiles,
  }
}

/**
 * 仅解析 locales（用于 HMR 和 dev module code）
 */
async function parseDemoLocales(
  code: string,
  filePath: string,
  md: ReturnType<ReturnType<typeof createMarkdown>>,
) {
  const { descriptor } = parse(code, {
    filename: filePath,
    sourceMap: false,
  })

  const locales: Record<string, { html: string, title: string }> = {}
  const docsBlocks = descriptor.customBlocks.filter(block => block.type === 'docs')
  await Promise.all(docsBlocks.map(async (block) => {
    const lang = typeof block.attrs.lang === 'string' ? block.attrs.lang : 'zh-CN'
    const env: Record<string, unknown> = {}
    const html = await md.renderAsync(block.content.trim(), env)
    const formatterTitle = (env.formatters as { title?: string } | undefined)?.title
    locales[lang] = {
      html,
      title: formatterTitle || (typeof env.title === 'string' ? env.title : ''),
    }
  }))
  return locales
}

export function demoPlugin(): PluginOption {
  const md = createMarkdown()({
    withPlugin: false,
    config(md) {
      loadBaseMd(md)
      loadShiki(md)
    },
  })
  const VIRTUAL_MODULE_ID = 'virtual:demos'
  const RESOLVED_VIRTUAL_MODULE_ID = `\0${VIRTUAL_MODULE_ID}`
  const DEMO_SUFFIX = 'demo=true'
  const DEMO_GLOB = ['/src/pages/**/demo/*.vue']
  const DEV_SOURCE_PATH = '/__demo_source'
  let isServe = false
  let root = process.cwd()
  let base = '/'

  // Build 解析缓存（每个 demo 只解析一次）
  const buildDemoParseCache = new Map<string, ParsedDemoFile>()
  // Dev 并发去重
  const devDemoParseTasks = new Map<string, Promise<ParsedDemoFile>>()

  async function getBuildParsedDemo(filePath: string) {
    if (!buildDemoParseCache.has(filePath)) {
      buildDemoParseCache.set(filePath, await parseDemoFile(filePath, md))
    }
    return buildDemoParseCache.get(filePath)!
  }

  function getDevParsedDemo(filePath: string) {
    const currentTask = devDemoParseTasks.get(filePath)
    if (currentTask)
      return currentTask

    const task = parseDemoFile(filePath, md).finally(() => {
      if (devDemoParseTasks.get(filePath) === task)
        devDemoParseTasks.delete(filePath)
    })
    devDemoParseTasks.set(filePath, task)
    return task
  }

  return {
    name: 'vite:demo',
    enforce: 'pre',
    configResolved(config) {
      isServe = config.command === 'serve'
      root = config.root
      base = config.base
    },
    configureServer(server) {
      // Dev 模式下按需提供源码的 HTTP 端点
      const sourcePath = `${base === '/' ? '' : base.replace(/\/$/, '')}${DEV_SOURCE_PATH}`
      server.middlewares.use(async (request, response, next) => {
        const url = new URL(request.url ?? '', 'http://vite.local')
        if (url.pathname !== sourcePath)
          return next()

        const id = url.searchParams.get('id')
        const filePath = id ? path.resolve(root, `.${id}`) : ''
        const relativePath = filePath ? path.relative(root, filePath) : '..'
        if (
          !id?.startsWith('/')
          || relativePath.startsWith('..')
          || path.isAbsolute(relativePath)
          || !isDemoFile(filePath, root, DEMO_GLOB)
        ) {
          response.statusCode = 400
          response.end('Invalid demo source path')
          return
        }

        try {
          const parsed = await getDevParsedDemo(filePath)
          response.statusCode = 200
          response.setHeader('Content-Type', 'application/json; charset=utf-8')
          response.setHeader('Cache-Control', 'no-store')
          response.end(
            JSON.stringify({
              source: parsed.sourceCode,
              jsSource: parsed.jsSourceCode,
              extraFiles: parsed.extraFiles,
            }),
          )
        }
        catch (error) {
          server.config.logger.error(
            `Failed to load demo source ${filePath}: ${error instanceof Error ? error.message : String(error)}`,
          )
          response.statusCode = 500
          response.end('Failed to load demo source')
        }
      })
    },
    async resolveId(id, importer) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
      if (id.includes(DEMO_SUFFIX)) {
        const resolved = await this.resolve(id, importer, { skipSelf: true })
        if (resolved) {
          return `\0${resolved.id}`
        }
      }
    },
    async load(id) {
      const [, query] = id.split('?')
      const params = new URLSearchParams(query)
      if (params.get('vue') !== null && params.get('type') === 'docs') {
        return 'export default {}'
      }
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        return `const rawDemos = import.meta.glob(${JSON.stringify(DEMO_GLOB)},{
            query: {demo:'true'},
            eager: true,
            import: 'default'
        })
        export default rawDemos
        `
      }
      if (id.startsWith('\0') && id.includes(DEMO_SUFFIX)) {
        const virtualId = id.slice(1)
        const [filePath] = virtualId.split('?')
        const normalizedFile = normalizePath(filePath)

        // 建立文件依赖关系
        this.addWatchFile(filePath)

        // Dev: 只解析 locales；Build: 完整解析
        const parsed = isServe ? undefined : await getBuildParsedDemo(filePath)
        const locales = parsed
          ? parsed.locales
          : await parseDemoLocales(
              await fs.readFile(filePath, 'utf-8'),
              filePath,
              md,
            )

        // 监听伴生文件，保证多文件 demo 的 HMR 重新解析
        for (const file of parsed?.extraFiles ?? []) {
          this.addWatchFile(path.resolve(path.dirname(filePath), file.name))
        }

        // Build: 生成 JSON asset
        const sourceUrl = isServe
          ? undefined
          : this.getFileName(
              this.emitFile({
                type: 'asset',
                name: `demo-source-${path.basename(filePath, '.vue')}.json`,
                source: JSON.stringify({
                  source: parsed!.sourceCode,
                  jsSource: parsed!.jsSourceCode,
                  extraFiles: parsed!.extraFiles,
                }),
              }),
            )

        return {
          code: isServe
            ? `
import { ref } from 'vue'

const localesRef = ref(${JSON.stringify(locales)})
const sourceVersionRef = ref(0)

const demoData = {
  component: () => import(${JSON.stringify(filePath)}),
  get locales() { return localesRef.value },
  get sourceVersion() { return sourceVersionRef.value },
  async loadSource(signal) {
    const url = new URL(import.meta.env.BASE_URL + ${JSON.stringify(DEV_SOURCE_PATH.slice(1))}, window.location.origin)
    url.searchParams.set('id', ${JSON.stringify(toDemoKey(filePath, root))})
    url.searchParams.set('t', String(sourceVersionRef.value))
    const res = await fetch(url.href, { cache: 'no-store', signal })
    if (!res.ok)
      throw new Error(\`Failed to load demo source: \${res.status} \${res.statusText}\`)
    return res.json()
  }
}

if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.on('vite:beforeUpdate', () => {
    sourceVersionRef.value = Date.now()
  })
  import.meta.hot.on(${JSON.stringify(`demo-update:${normalizedFile}`)}, (data) => {
    if ('locales' in data) localesRef.value = data.locales
    if ('timestamp' in data) sourceVersionRef.value = data.timestamp
  })
}

export default demoData
`
            : `
import { ref } from 'vue'

const localesRef = ref(${JSON.stringify(locales)})

const demoData = {
  component: () => import(${JSON.stringify(filePath)}),
  get locales() { return localesRef.value },
  sourceVersion: 0,
  async loadSource(signal) {
    const url = new URL(import.meta.env.BASE_URL + ${JSON.stringify(sourceUrl)}, import.meta.url)
    const res = await fetch(url.href, { signal })
    if (!res.ok)
      throw new Error(\`Failed to load demo source: \${res.status} \${res.statusText}\`)
    return res.json()
  }
}

if (import.meta.hot) {
  import.meta.hot.accept()
  import.meta.hot.on(${JSON.stringify(`demo-update:${normalizedFile}`)}, (data) => {
    if ('locales' in data) localesRef.value = data.locales
  })
}

export default demoData
`,
          map: null,
        }
      }
    },
    async handleHotUpdate(ctx) {
      if (!isDemoFile(ctx.file, ctx.server.config.root, DEMO_GLOB))
        return

      const normalizedFile = normalizePath(ctx.file)

      // 清除 build 缓存并重新解析 locales
      buildDemoParseCache.delete(ctx.file)
      const locales = await parseDemoLocales(
        await fs.readFile(ctx.file, 'utf-8'),
        ctx.file,
        md,
      )

      ctx.server.ws.send({
        type: 'custom',
        event: `demo-update:${normalizedFile}`,
        data: {
          locales,
          timestamp: Date.now(),
        },
      })

      // 只返回原始 Vue 文件模块，让 Vue 的 HMR 处理组件更新
      return ctx.modules
    },
  }
}
