import type { PluginOption } from 'vite'
import fs from 'node:fs/promises'
import pm from 'picomatch'
import { normalizePath } from 'vite'
import { parse } from 'vue/compiler-sfc'
import { createMarkdown, loadBaseMd, loadShiki } from '../markdown'
import { tsToJs } from './tsToJs'

/**
 * 将绝对路径转换为相对于项目根目录的路径
 * @param absolutePath 绝对路径
 * @param root 项目根目录
 * @returns 相对路径
 */
export function toRelativePath(absolutePath: string, root: string): string {
  const normalizedPath = normalizePath(absolutePath)
  const normalizedRoot = normalizePath(root)
  return normalizedPath.startsWith(normalizedRoot)
    ? normalizedPath.slice(normalizedRoot.length)
    : normalizedPath
}

/**
 * 解析 demo 文件内容
 */
async function parseDemoFile(filePath: string, md: any) {
  const code = await fs.readFile(filePath, 'utf-8')
  const { descriptor } = parse(code, {
    filename: filePath,
    sourceMap: false,
  })

  const locales: Record<string, any> = {}
  const docsBlock = descriptor.customBlocks.filter(block => block.type === 'docs')
  await Promise.all(docsBlock?.map(async (block) => {
    const lang = block.attrs.lang as string || 'zh-CN'
    const env: any = {}
    const content = block.content.trim()
    const html = await md.renderAsync(content, env)
    const title = env.formatters?.title ?? env?.title ?? ''
    locales[lang] = {
      html,
      title,
    }
  }))

  const sourceCode = code.replace(/<docs[^>]*>[\s\S]*?<\/docs>/g, '').trim()
  const jsSourceCode = await tsToJs(sourceCode)
  const sourceHtml = await md.renderAsync(`\`\`\`vue\n${sourceCode}\n\`\`\``)
  const jsSourceHtml = await md.renderAsync(`\`\`\`vue\n${jsSourceCode}\n\`\`\``)

  return {
    locales,
    sourceCode,
    jsSourceCode,
    sourceHtml,
    jsSourceHtml,
  }
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
  return {
    name: 'vite:demo',
    enforce: 'pre',
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

        // 建立文件依赖关系，确保源文件变化时虚拟模块会被重新加载
        this.addWatchFile(filePath)

        // 解析 demo 文件
        const { locales, sourceCode, jsSourceCode, sourceHtml, jsSourceHtml } = await parseDemoFile(filePath, md)

        // 注入带 HMR 的代码
        return {
          code: `
import { ref } from 'vue'

const localesRef = ref(${JSON.stringify(locales)})
const sourceRef = ref(${JSON.stringify(sourceCode)})
const jsSourceRef = ref(${JSON.stringify(jsSourceCode)})
const htmlRef = ref(${JSON.stringify(sourceHtml)})
const jsHtmlRef = ref(${JSON.stringify(jsSourceHtml)})

const demoData = {
  component: () => import('${filePath}'),
  get locales() { return localesRef.value },
  get source() { return sourceRef.value },
  get jsSource() { return jsSourceRef.value },
  get html() { return htmlRef.value },
  get jsHtml() { return jsHtmlRef.value }
}

// HMR 支持
if (import.meta.hot) {
  import.meta.hot.accept()
  
  import.meta.hot.on('demo-update:${normalizedFile.replace(/\\/g, '/')}', (data) => {
    if ('locales' in data) localesRef.value = data.locales
    if ('source' in data) sourceRef.value = data.source
    if ('jsSource' in data) jsSourceRef.value = data.jsSource
    if ('html' in data) htmlRef.value = data.html
    if ('jsHtml' in data) jsHtmlRef.value = data.jsHtml
  })
}

export default demoData
`,
          map: null,
        }
      }
    },
    async handleHotUpdate(ctx) {
      const relativePath = toRelativePath(ctx.file, ctx.server.config.root)
      const isDemo = DEMO_GLOB.some(pattern => pm.isMatch(relativePath, pattern))
      if (isDemo) {
        const normalizedFile = normalizePath(ctx.file)
        const server = ctx.server

        // 重新解析文件获取最新内容
        const { locales, sourceCode, jsSourceCode, sourceHtml, jsSourceHtml } = await parseDemoFile(ctx.file, md)

        // 发送自定义 HMR 事件更新数据
        server.ws.send({
          type: 'custom',
          event: `demo-update:${normalizedFile.replace(/\\/g, '/')}`,
          data: {
            locales,
            source: sourceCode,
            jsSource: jsSourceCode,
            html: sourceHtml,
            jsHtml: jsSourceHtml,
          },
        })

        // 只返回原始 Vue 文件模块，让 Vue 的 HMR 处理组件更新
        return ctx.modules
      }
    },
  }
}
