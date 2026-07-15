import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
// 复用 vitest 同款插件链（tsx-resolve-types + vue + vueJsx）与 alias，
// 使 build-style 可以直接从组件源码（而非 dist 产物）提取样式。
import baseConfig from '../../../../vitest-plugin.ts'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '../../../..')

async function main() {
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
    const mod = await server.ssrLoadModule(
      path.join(__dirname, 'build-style.ts'),
    )
    await mod.buildStyle()
  }
  finally {
    await server.close()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
