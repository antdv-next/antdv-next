// Publish every package under `packages/` (antdv-next, @antdv-next/cssinjs)
// whose version is tagged but not yet on npm.
//
//   node scripts/release.mjs plan              list what would be published
//   node scripts/release.mjs publish           build, pack and publish it
//   node scripts/release.mjs publish --dry-run same, with `npm publish --dry-run`
//
// A package is published when all of these hold:
// - its `package.json` version is not on the registry yet,
// - the release tag `<name>@<version>` (created by bumpp) exists and is reachable from HEAD,
// - the package directory is unchanged between that tag and HEAD, so the
//   published code is exactly what was tagged.
//
// Runs in CI (.github/workflows/release.yml) through npm trusted publishing,
// and is safe to re-run: published versions are skipped.

import { execFileSync } from 'node:child_process'
import { appendFileSync, mkdtempSync, readdirSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import process from 'node:process'

const root = resolve(import.meta.dirname, '..')
const packagesDir = join(root, 'packages')
const registry = 'https://registry.npmjs.org'

function run(cmd, args, options = {}) {
  return execFileSync(cmd, args, { cwd: root, encoding: 'utf8', ...options })
}

function git(...args) {
  try {
    run('git', args, { stdio: ['ignore', 'pipe', 'ignore'] })
    return true
  }
  catch {
    return false
  }
}

function readPackages() {
  return readdirSync(packagesDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .flatMap((entry) => {
      const dir = join(packagesDir, entry.name)
      let pkg
      try {
        pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'))
      }
      catch {
        return []
      }
      if (pkg.private)
        return []
      return [{ dir, folder: entry.name, name: pkg.name, version: pkg.version, pkg }]
    })
}

async function isPublished(name, version) {
  const url = `${registry}/${name.replace('/', '%2f')}/${version}`
  for (let attempt = 1; ; attempt += 1) {
    const res = await fetch(url)
    if (res.status === 200)
      return true
    if (res.status === 404)
      return false
    if (attempt >= 3)
      throw new Error(`Unexpected ${res.status} from ${url}`)
    await new Promise(r => setTimeout(r, attempt * 2000))
  }
}

/** Order packages so dependencies are published before their dependents. */
function sortByDependencies(list) {
  const byName = new Map(list.map(item => [item.name, item]))
  const sorted = []
  const visiting = new Set()
  const visit = (item) => {
    if (sorted.includes(item) || visiting.has(item))
      return
    visiting.add(item)
    const { dependencies = {}, peerDependencies = {}, optionalDependencies = {} } = item.pkg
    for (const dep of Object.keys({ ...dependencies, ...peerDependencies, ...optionalDependencies })) {
      if (byName.has(dep))
        visit(byName.get(dep))
    }
    visiting.delete(item)
    sorted.push(item)
  }
  list.forEach(visit)
  return sorted
}

/** The package directory, minus files that never reach the tarball. */
function publishedPaths(folder) {
  const dir = `packages/${folder}`
  return [
    dir,
    ...['**/tests/**', '**/__tests__/**', '**/*.test.*', 'vitest.config.ts'].map(path => `:(exclude,glob)${dir}/${path}`),
  ]
}

/** `1.2.0-rc.1` publishes under `rc`, like the earlier manual prereleases. */
function distTag(version) {
  const prerelease = version.split('-')[1]
  return prerelease ? prerelease.split('.')[0] : 'latest'
}

async function plan() {
  const pending = []
  const stale = []
  for (const item of readPackages()) {
    if (await isPublished(item.name, item.version))
      continue
    const tag = `${item.name}@${item.version}`
    if (!git('rev-parse', '-q', '--verify', `refs/tags/${tag}`)) {
      console.log(`skip ${tag}: not on npm but no release tag`)
      continue
    }
    if (!git('merge-base', '--is-ancestor', `refs/tags/${tag}`, 'HEAD')) {
      console.log(`skip ${tag}: tag is not reachable from HEAD`)
      continue
    }
    if (!git('diff', '--quiet', `refs/tags/${tag}`, 'HEAD', '--', ...publishedPaths(item.folder))) {
      stale.push({ tag, folder: item.folder })
      continue
    }
    pending.push({ ...item, tag })
  }
  return { pending: sortByDependencies(pending), stale }
}

function report({ pending, stale }) {
  console.log(pending.length
    ? `to publish (in order): ${pending.map(item => item.tag).join(', ')}`
    : 'nothing to publish')
  for (const { tag, folder } of stale) {
    console.log(`::error::${tag} is not on npm, but packages/${folder} changed after the tag. `
      + `Publish it by running this workflow on the tag ref, or bump a new version.`)
  }
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(process.env.GITHUB_OUTPUT, `count=${pending.length}\n`)
    appendFileSync(process.env.GITHUB_OUTPUT, `packages=${pending.map(item => item.tag).join(' ')}\n`)
    appendFileSync(process.env.GITHUB_OUTPUT, `stale=${stale.length}\n`)
  }
}

async function publish(dryRun) {
  const result = await plan()
  report(result)
  const packDir = mkdtempSync(join(tmpdir(), 'vc-release-'))
  const failed = []

  if (result.pending.length) {
    // A fresh checkout has no `dist` anywhere, and packages import their
    // workspace dependencies from `dist`, so build those too, in topological order.
    console.log('::group::build')
    run('pnpm', ['-r', ...result.pending.flatMap(item => ['--filter', `${item.name}...`]), 'run', 'build'], { stdio: 'inherit' })
    console.log('::endgroup::')
  }

  for (const item of result.pending) {
    console.log(`\n::group::${item.tag}`)
    try {
      // `pnpm pack` rewrites `workspace:` ranges to the real versions.
      run('pnpm', ['pack', '--pack-destination', packDir], { cwd: item.dir, stdio: 'inherit' })
      const tarball = join(packDir, `${item.name.replace('@', '').replace('/', '-')}-${item.version}.tgz`)
      const args = ['publish', tarball, '--access', 'public', '--tag', distTag(item.version)]
      if (dryRun)
        args.push('--dry-run')
      run('npm', args, { stdio: ['ignore', 'inherit', 'pipe'] })
    }
    catch (error) {
      if (error.stderr)
        process.stderr.write(error.stderr)
      // A tag push and a branch push start two runs at once, and the second
      // races npm's delayed visibility of the version the first one published.
      // npm then answers E409 "Cannot publish over previously staged version".
      if (!dryRun && (/\bE409\b/.test(error.stderr ?? '') || await isPublished(item.name, item.version).catch(() => false))) {
        console.log(`${item.tag} is already on npm, skipping`)
      }
      else {
        console.log(`::error::failed to publish ${item.tag}: ${error.message}`)
        failed.push(item.tag)
      }
    }
    console.log('::endgroup::')
  }

  if (failed.length || result.stale.length)
    process.exitCode = 1
}

const [command, ...flags] = process.argv.slice(2)
if (command === 'plan')
  report(await plan())
else if (command === 'publish')
  await publish(flags.includes('--dry-run'))
else
  throw new Error('Usage: node scripts/release.mjs <plan|publish> [--dry-run]')
