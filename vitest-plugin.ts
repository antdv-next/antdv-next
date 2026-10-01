import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig } from 'vite'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

const baseUrl = fileURLToPath(new URL('.', import.meta.url))

// ─── VC_LOCAL mode (same contract as playground/vite.config.ts) ────────
// Run the test suite against unpublished @v-c/* builds:
//   VC_LOCAL=picker,select,util VC_PATH=../vue-components pnpm test
//   VC_LOCAL=* ...                      (every package that has a dist)
// Only root imports (@v-c/pkg) are aliased; build the package dist first.
// VC_PATH is relative to the repository root (default: ../antdv-vc).
// ─────────────────────────────────────────────────────────────────────
const VC_PKG_NAME_RE = /^[a-z][\w-]*$/

function resolveVcLocalAliases() {
  const vcLocal = process.env.VC_LOCAL
  if (!vcLocal)
    return []
  const pkgDir = path.resolve(baseUrl, process.env.VC_PATH || '../antdv-vc', 'packages')
  let packages: string[]
  if (vcLocal === '*') {
    packages = fs.existsSync(pkgDir)
      ? fs.readdirSync(pkgDir, { withFileTypes: true })
          .filter(d => d.isDirectory() && VC_PKG_NAME_RE.test(d.name) && fs.existsSync(path.join(pkgDir, d.name, 'dist')))
          .map(d => d.name)
      : []
  }
  else {
    packages = vcLocal.split(',').map(s => s.trim()).filter(s => VC_PKG_NAME_RE.test(s))
  }
  return packages.map(pkg => ({
    find: new RegExp(`^@v-c/${pkg}$`),
    replacement: path.resolve(pkgDir, `${pkg}/dist`),
  }))
}

const vcLocalAliases = resolveVcLocalAliases()

export default defineConfig({
  plugins: [
    tsxResolveTypes({
      defaultPropsToUndefined: ['Boolean'],
      ignoreTypes: [/EmitsProps$/],
    }),
    vue(),
    vueJsx({
    }),
    {
      name: 'vue-docs-block',
      transform(_code, id) {
        if (id.includes('?vue&type=docs')) {
          return { code: 'export default {}', map: null }
        }
      },
    },
  ],
  optimizeDeps: {
    include: ['@antdv-next/icons', '@antdv-next/icons > @ant-design/icons-svg'],
  },
  resolve: {
    // A locally built @v-c package must share this repository's Vue copy,
    // otherwise its inject() / currentInstance live in a different module.
    dedupe: vcLocalAliases.length ? ['vue'] : undefined,
    alias: [
      ...vcLocalAliases,
      {
        find: /^antdv-next/,
        replacement: path.resolve(baseUrl, './packages/antdv-next/src'),
      },
      {
        find: /^@antdv-next\/cssinjs/,
        replacement: path.resolve(baseUrl, './packages/cssinjs/src'),
      },
      {
        find: /^\/@tests/,
        replacement: path.resolve(baseUrl, './tests'),
      },
      {
        find: '@',
        replacement: path.resolve(baseUrl, './docs/src'),
      },
    ],
  },
  test: {
    env: {
      // Pin the timezone so date-dependent assertions and snapshots do not
      // depend on where the suite happens to run. Several tests build dates
      // from a UTC instant (e.g. `dayjs('2025-06-15T00:00:00Z')`) and assert
      // the rendered day, which shifts by one in any UTC- zone; committed
      // snapshots were recorded at UTC+8.
      TZ: 'Asia/Shanghai',
    },
  },
})
