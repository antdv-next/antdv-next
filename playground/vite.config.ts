import type { Plugin } from 'vite'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { defineConfig, loadEnv } from 'vite'
import { tsxResolveTypes } from 'vite-plugin-tsx-resolve-types'

const baseUrl = fileURLToPath(new URL('.', import.meta.url))

// ─── VC_LOCAL mode ──────────────────────────────────────────────────
// Debug @v-c/* packages locally with auto-rebuild on source change.
//
// Usage (pick one):
//   1. VC_LOCAL=1 pnpm dev:play              (CLI, watch input+textarea)
//   2. VC_LOCAL=input,textarea pnpm dev:play  (CLI, specific packages)
//   3. VC_LOCAL=* pnpm dev:play              (CLI, watch ALL packages)
//   4. Add VC_LOCAL=input,textarea to playground/.env.local (persistent)
//
// VC_PATH: path to vue-components repo root (default: ../../antdv-vc)
//   VC_PATH=/path/to/antdv-vc VC_LOCAL=1 pnpm dev:play
//
// Edit @v-c/input src → auto rebuild → Vite full-reload → done.
//
// Limitation: only root imports (@v-c/pkg) are aliased. Subpath imports
// like @v-c/picker/generate/* are NOT covered — add subpath aliases if needed.
// ─────────────────────────────────────────────────────────────────────

const VC_PATH_DEFAULT = '../../antdv-vc'
const PKG_NAME_RE = /^[a-z][\w-]*$/

function resolveVcRoot(vcPath: string | undefined): string {
  const rel = vcPath || VC_PATH_DEFAULT
  return path.resolve(baseUrl, rel, 'packages')
}

function parseVcPackages(vcLocalEnv: string | undefined, pkgDir: string): string[] {
  if (!vcLocalEnv)
    return []
  if (vcLocalEnv === '1')
    return ['input', 'textarea']
  if (vcLocalEnv === '*') {
    try {
      return fs.readdirSync(pkgDir, { withFileTypes: true })
        .filter(d => d.isDirectory() && PKG_NAME_RE.test(d.name))
        .map(d => d.name)
    }
    catch {
      return []
    }
  }
  return vcLocalEnv.split(',').map(s => s.trim()).filter(s => PKG_NAME_RE.test(s))
}

function buildVcAliases(packages: string[], pkgDir: string) {
  return packages.map(pkg => ({
    find: new RegExp(`^@v-c/${pkg}$`),
    replacement: path.resolve(pkgDir, `${pkg}/dist`),
  }))
}

/**
 * Vite plugin: watch @v-c/* source, auto-rebuild on change, full-reload.
 */
function vcAutoRebuild(packages: string[], pkgDir: string): Plugin {
  if (!packages.length)
    return { name: 'vc-auto-rebuild' }

  const vcRoot = path.resolve(pkgDir, '..')
  const watchDirs = packages.map(pkg => path.resolve(pkgDir, `${pkg}/src`))
  const building = new Set<string>()

  return {
    name: 'vc-auto-rebuild',
    configureServer(server) {
      // Startup check: verify dist exists for each package
      for (const pkg of packages) {
        const distDir = path.resolve(pkgDir, `${pkg}/dist`)
        if (!fs.existsSync(distDir)) {
          server.config.logger.warn(
            `[vc-local] @v-c/${pkg}/dist not found. Run: cd ${vcRoot} && pnpm -F @v-c/${pkg} build`,
          )
        }
      }

      const chokidar = server.watcher
      for (const dir of watchDirs) {
        chokidar.add(dir)
      }

      const rebuild = (filePath: string) => {
        const matched = packages.find(pkg =>
          filePath.startsWith(path.resolve(pkgDir, `${pkg}/src`)),
        )
        if (!matched || building.has(matched))
          return

        building.add(matched)
        const label = `@v-c/${matched}`
        server.config.logger.info(`\n[vc-local] ${label} source changed, rebuilding...`, { timestamp: true })

        try {
          execSync(`pnpm -F ${label} build`, {
            cwd: vcRoot,
            stdio: 'pipe',
            timeout: 30_000,
          })
          server.config.logger.info(`[vc-local] ${label} rebuilt, reloading.`, { timestamp: true })
          server.ws.send({ type: 'full-reload' })
        }
        catch (err: any) {
          server.config.logger.error(`[vc-local] ${label} build failed:\n${err.stderr?.toString() || err.message}`)
        }
        finally {
          building.delete(matched)
        }
      }

      chokidar.on('change', rebuild)
      chokidar.on('add', rebuild)
      chokidar.on('unlink', rebuild)

      server.config.logger.info(
        `[vc-local] Watching: ${packages.map(p => `@v-c/${p}`).join(', ')}`,
        { timestamp: true },
      )
    },
  }
}

export default defineConfig(({ mode }) => {
  // loadEnv reads .env / .env.local with the VC_ prefix
  const env = loadEnv(mode, baseUrl, 'VC_')
  const vcLocalEnv = process.env.VC_LOCAL || env.VC_LOCAL
  const vcLocalDir = resolveVcRoot(process.env.VC_PATH || env.VC_PATH)
  const vcPackages = parseVcPackages(vcLocalEnv, vcLocalDir)
  const vcAliases = buildVcAliases(vcPackages, vcLocalDir)

  return {
    server: {
      // Allow serving files from sibling vue-components repo when VC_LOCAL is active
      fs: {
        allow: vcPackages.length
          ? [path.resolve(baseUrl, '..'), path.resolve(vcLocalDir, '..')]
          : undefined,
      },
    },
    resolve: {
      alias: [
        ...vcAliases,
        {
          find: /^antdv-next/,
          replacement: path.resolve(baseUrl, '../packages/antdv-next/src'),
        },
        {
          find: /^@antdv-next\/cssinjs/,
          replacement: path.resolve(baseUrl, '../packages/cssinjs/src'),
        },
        {
          find: '@',
          replacement: '/src',
        },
      ],
    },
    plugins: [
      vcAutoRebuild(vcPackages, vcLocalDir),
      tsxResolveTypes({
        defaultPropsToUndefined: ['Boolean'],
      }),
      vueJsx(),
      vue(),
    ],
  }
})
