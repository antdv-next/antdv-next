import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
// 复用 vitest 同款插件链（tsx-resolve-types + vue + vueJsx）与 alias，
// 使脚本可以直接从组件源码（而非 dist 产物）导入 antdv-next / @antdv-next/cssinjs。
import baseConfig from '../../../vitest-plugin.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../..')

// 用法：tsx ./scripts/vite-ssr-run.ts <脚本路径> [导出函数名 = main]
async function run() {
  const [, , entry, exportName = 'main'] = process.argv
  if (!entry) {
    console.error('Usage: tsx ./scripts/vite-ssr-run.ts <module> [exportName]')
    process.exit(1)
  }

  const server = await createServer({
    ...baseConfig,
    configFile: false,
    root: repoRoot,
    logLevel: 'warn',
    // SSR 加载用不到客户端依赖预构建，关闭以避免无谓的解析告警
    optimizeDeps: { noDiscovery: true, include: [] },
    server: {
      middlewareMode: true,
      hmr: false,
      watch: null,
    },
  })

  try {
    const mod = await server.ssrLoadModule(path.resolve(process.cwd(), entry))
    const fn = mod[exportName]
    if (typeof fn !== 'function')
      throw new TypeError(`Export "${exportName}" of ${entry} is not a function`)
    await fn()
  }
  finally {
    await server.close()
  }
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
