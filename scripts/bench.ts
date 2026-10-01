/**
 * Browser performance benchmark for antdv-next.
 *
 * Drives headless Chrome over the DevTools protocol against the scenes in
 * playground/src/bench/scenarios.ts and reports, per scene:
 *
 *   cold      first mount on a fresh page (includes CSS-in-JS generation)
 *   hot       median re-mount time after unmount (styles cached)
 *   heap      heap growth while the scene is mounted, after a full GC
 *   retained  heap still held 300ms / 1500ms after unmount (delayed style
 *             removal fires at 500ms, so a large 300ms number means the
 *             unmounted tree is being kept alive)
 *
 * Usage:
 *   pnpm bench                              # all scenes, dev server, full speed
 *   pnpm bench --scenes button,menu         # subset
 *   pnpm bench --build                      # production build + preview server
 *   pnpm bench --cpu 4                      # 4x CPU throttling
 *   pnpm bench --pages 5 --runs 5           # fresh pages per scene / hot runs per page
 *   pnpm bench --out bench-results.json     # also write raw numbers
 *   pnpm bench --build --profile            # CPU profile per scene (unminified build)
 *
 * Requires Google Chrome (override with CHROME_PATH).
 */
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { build, createServer, preview } from 'vite'

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
interface Options {
  scenes: string[]
  build: boolean
  cpu: number
  pages: number
  runs: number
  out?: string
  port: number
  devtoolsPort: number
  /** Record a CPU profile of the first page of each scene and print the hottest functions. */
  profile: boolean
}

function parseArgs(argv: string[]): Options {
  const options: Options = {
    scenes: ['button', 'input', 'select', 'date-picker', 'tooltip', 'menu', 'form', 'table', 'admin'],
    build: false,
    cpu: 1,
    pages: 3,
    runs: 5,
    port: 5199,
    devtoolsPort: 9333,
    profile: false,
  }
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const next = () => argv[++i]
    switch (arg) {
      case '--scenes':
        options.scenes = next()!.split(',').map(s => s.trim()).filter(Boolean)
        break
      case '--build':
        options.build = true
        break
      case '--cpu':
        options.cpu = Number(next())
        break
      case '--pages':
        options.pages = Number(next())
        break
      case '--runs':
        options.runs = Number(next())
        break
      case '--out':
        options.out = next()
        break
      case '--port':
        options.port = Number(next())
        break
      case '--devtools-port':
        options.devtoolsPort = Number(next())
        break
      case '--profile':
        options.profile = true
        break
      default:
        throw new Error(`Unknown argument: ${arg}`)
    }
  }
  return options
}

// ---------------------------------------------------------------------------
// Minimal CDP client on top of Node's global WebSocket
// ---------------------------------------------------------------------------
class CDP {
  private ws!: WebSocket
  private nextId = 1
  private pending = new Map<number, { resolve: (v: any) => void, reject: (e: Error) => void }>()
  private listeners = new Map<string, ((params: any) => void)[]>()

  constructor(private url: string) {}

  connect() {
    return new Promise<void>((resolve, reject) => {
      this.ws = new WebSocket(this.url)
      this.ws.addEventListener('open', () => resolve())
      this.ws.addEventListener('error', () => reject(new Error(`Cannot connect to ${this.url}`)))
      this.ws.addEventListener('message', (event) => {
        const message = JSON.parse(String(event.data))
        if (message.id) {
          const entry = this.pending.get(message.id)
          this.pending.delete(message.id)
          if (!entry)
            return
          if (message.error)
            entry.reject(new Error(`${message.error.message} (${message.error.code})`))
          else
            entry.resolve(message.result)
        }
        else if (message.method) {
          this.listeners.get(message.method)?.forEach(cb => cb(message.params))
        }
      })
    })
  }

  send<T = any>(method: string, params: Record<string, any> = {}) {
    const id = this.nextId++
    this.ws.send(JSON.stringify({ id, method, params }))
    return new Promise<T>((resolve, reject) => this.pending.set(id, { resolve, reject }))
  }

  on(method: string, cb: (params: any) => void) {
    const list = this.listeners.get(method) ?? []
    list.push(cb)
    this.listeners.set(method, list)
  }

  async evaluate<T = any>(expression: string): Promise<T> {
    const { result, exceptionDetails } = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true,
    })
    if (exceptionDetails) {
      throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text)
    }
    return result.value as T
  }

  async gc() {
    await this.send('HeapProfiler.collectGarbage')
  }

  async heapUsed() {
    // Two passes: the first GC can leave short-lived garbage behind.
    await this.gc()
    await this.gc()
    const { usedSize } = await this.send<{ usedSize: number }>('Runtime.getHeapUsage')
    return usedSize
  }

  close() {
    this.ws.close()
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

function median(values: number[]) {
  if (!values.length)
    return Number.NaN
  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2
}

const ms = (value: number) => value.toFixed(1)
const mb = (bytes: number) => (bytes / 1024 / 1024).toFixed(1)

async function waitFor(check: () => Promise<boolean>, timeout = 60_000, interval = 100) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (await check())
      return
    await sleep(interval)
  }
  throw new Error('Timed out while waiting')
}

function findChrome() {
  const candidates = [
    process.env.CHROME_PATH,
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
  ].filter(Boolean) as string[]
  const found = candidates.find(candidate => fs.existsSync(candidate))
  if (!found) {
    throw new Error('Google Chrome not found. Set CHROME_PATH to the Chrome executable.')
  }
  return found
}

// ---------------------------------------------------------------------------
// Server + browser lifecycle
// ---------------------------------------------------------------------------
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const playgroundDir = path.join(rootDir, 'playground')
const configFile = path.join(playgroundDir, 'vite.config.ts')

async function startServer(options: Options) {
  const host = '127.0.0.1'
  if (options.build) {
    const outDir = path.join(playgroundDir, 'dist/bench')
    console.info('[bench] building playground/bench.html (production)...')
    await build({
      configFile,
      root: playgroundDir,
      logLevel: 'warn',
      build: {
        outDir,
        emptyOutDir: true,
        // Keep function names readable in CPU profiles.
        minify: options.profile ? false : undefined,
        rollupOptions: { input: path.join(playgroundDir, 'bench.html') },
      },
    })
    const server = await preview({
      configFile,
      root: playgroundDir,
      logLevel: 'warn',
      build: { outDir },
      preview: { host, port: options.port, strictPort: true },
    })
    return {
      url: `http://${host}:${options.port}/bench.html`,
      close: () => server.close(),
    }
  }

  const server = await createServer({
    configFile,
    root: playgroundDir,
    logLevel: 'warn',
    server: { host, port: options.port, strictPort: true },
  })
  await server.listen()
  return {
    url: `http://${host}:${options.port}/bench.html`,
    close: () => server.close(),
  }
}

async function launchChrome(devtoolsPort: number) {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'antdv-bench-'))
  const child = spawn(findChrome(), [
    '--headless=new',
    `--remote-debugging-port=${devtoolsPort}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--disable-extensions',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--window-size=1280,900',
    'about:blank',
  ], { stdio: 'ignore' })

  const endpoint = `http://127.0.0.1:${devtoolsPort}`
  await waitFor(async () => {
    try {
      const res = await fetch(`${endpoint}/json/version`)
      return res.ok
    }
    catch {
      return false
    }
  }, 20_000, 200)

  return {
    endpoint,
    close: async () => {
      const exited = new Promise<void>((resolve) => {
        child.once('exit', () => resolve())
        setTimeout(resolve, 5000)
      })
      child.kill()
      await exited
      fs.rmSync(userDataDir, { recursive: true, force: true, maxRetries: 5 })
    },
  }
}

// ---------------------------------------------------------------------------
// Measurement
// ---------------------------------------------------------------------------
interface ProfileEntry {
  key: string
  selfMs: number
}

interface ProfileSummary {
  totalMs: number
  byFunction: ProfileEntry[]
  byFile: ProfileEntry[]
}

/**
 * Collapse a CDP CPU profile into self time per function and per file.
 * Self time = samples attributed to the node itself, not to callees.
 */
function summarizeProfile(profile: any): ProfileSummary {
  const { nodes, samples, timeDeltas } = profile as {
    nodes: { id: number, callFrame: { functionName: string, url: string, lineNumber: number } }[]
    samples: number[]
    timeDeltas: number[]
  }
  const selfByNode = new Map<number, number>()
  for (let i = 0; i < samples.length; i += 1) {
    const delta = (timeDeltas[i] ?? 0) / 1000
    selfByNode.set(samples[i]!, (selfByNode.get(samples[i]!) ?? 0) + delta)
  }
  const byFunction = new Map<string, number>()
  const byFile = new Map<string, number>()
  let totalMs = 0
  for (const node of nodes) {
    const self = selfByNode.get(node.id) ?? 0
    if (!self)
      continue
    totalMs += self
    const file = node.callFrame.url ? path.basename(node.callFrame.url.split('?')[0]!) : '(native)'
    const fn = node.callFrame.functionName || '(anonymous)'
    const fnKey = `${fn}  ${file}:${node.callFrame.lineNumber + 1}`
    byFunction.set(fnKey, (byFunction.get(fnKey) ?? 0) + self)
    byFile.set(file, (byFile.get(file) ?? 0) + self)
  }
  const sorted = (map: Map<string, number>) => [...map.entries()]
    .map(([key, selfMs]) => ({ key, selfMs }))
    .sort((a, b) => b.selfMs - a.selfMs)
  return { totalMs, byFunction: sorted(byFunction), byFile: sorted(byFile) }
}

interface PageResult {
  scene: string
  n: number
  cold: number
  hot: number[]
  domNodes: number
  styleTags: number
  cssBytes: number
  heapMounted: number
  retained300: number
  retained1500: number
  errors: string[]
  profile?: ProfileSummary
}

async function measurePage(endpoint: string, url: string, options: Options, profile = false): Promise<PageResult> {
  const tab = await (await fetch(`${endpoint}/json/new?about:blank`, { method: 'PUT' })).json() as { id: string, webSocketDebuggerUrl: string }
  const cdp = new CDP(tab.webSocketDebuggerUrl)
  await cdp.connect()
  const errors: string[] = []

  try {
    await cdp.send('Runtime.enable')
    await cdp.send('Page.enable')
    await cdp.send('HeapProfiler.enable')
    cdp.on('Runtime.exceptionThrown', (params) => {
      errors.push(params.exceptionDetails?.exception?.description ?? params.exceptionDetails?.text ?? 'unknown exception')
    })
    cdp.on('Runtime.consoleAPICalled', (params) => {
      if (params.type === 'error') {
        errors.push(params.args.map((arg: any) => arg.value ?? arg.description).join(' '))
      }
    })
    if (options.cpu > 1) {
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: options.cpu })
    }

    await cdp.send('Page.navigate', { url })
    await waitFor(() => cdp.evaluate<boolean>('!!(window.__bench && window.__bench.ready)').catch(() => false))

    const heapBefore = await cdp.heapUsed()
    if (profile) {
      await cdp.send('Profiler.enable')
      await cdp.send('Profiler.setSamplingInterval', { interval: 100 })
      await cdp.send('Profiler.start')
    }
    const run = await cdp.evaluate<Omit<PageResult, 'heapMounted' | 'retained300' | 'retained1500' | 'errors' | 'profile'>>(
      `window.__bench.run(${options.runs})`,
    )
    let profileSummary: ProfileSummary | undefined
    if (profile) {
      const { profile: raw } = await cdp.send('Profiler.stop')
      profileSummary = summarizeProfile(raw)
    }
    const heapMounted = await cdp.heapUsed() - heapBefore

    await cdp.evaluate('window.__bench.unmount()')
    const unmountedAt = Date.now()

    await sleep(Math.max(0, 300 - (Date.now() - unmountedAt)))
    const retained300 = await cdp.heapUsed() - heapBefore

    await sleep(Math.max(0, 1500 - (Date.now() - unmountedAt)))
    const retained1500 = await cdp.heapUsed() - heapBefore

    return { ...run, heapMounted, retained300, retained1500, errors, profile: profileSummary }
  }
  finally {
    cdp.close()
    await fetch(`${endpoint}/json/close/${tab.id}`).catch(() => {})
  }
}

interface SceneSummary {
  scene: string
  n: number
  cold: number
  hot: number
  heapMounted: number
  retained300: number
  retained1500: number
  domNodes: number
  styleTags: number
  cssBytes: number
  errors: string[]
  pages: PageResult[]
}

function summarize(scene: string, pages: PageResult[], n: number): SceneSummary {
  return {
    scene,
    n,
    cold: median(pages.map(p => p.cold)),
    hot: median(pages.flatMap(p => p.hot)),
    heapMounted: median(pages.map(p => p.heapMounted)),
    retained300: median(pages.map(p => p.retained300)),
    retained1500: median(pages.map(p => p.retained1500)),
    domNodes: pages[0]!.domNodes,
    styleTags: pages[0]!.styleTags,
    cssBytes: pages[0]!.cssBytes,
    errors: Array.from(new Set(pages.flatMap(p => p.errors))),
    pages,
  }
}

function printTable(summaries: SceneSummary[], options: Options) {
  const mode = `${options.build ? 'production build' : 'dev server'}, cpu x${options.cpu}, ${options.pages} pages x ${options.runs} hot runs`
  console.info(`\n### antdv-next bench (${mode})\n`)
  console.info('| scene | n | cold ms | hot ms | heap MB | retained@300ms MB | retained@1.5s MB | DOM nodes | style tags | CSS KB |')
  console.info('|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|')
  for (const s of summaries) {
    console.info(`| ${s.scene} | ${s.n} | ${ms(s.cold)} | ${ms(s.hot)} | ${mb(s.heapMounted)} | ${mb(s.retained300)} | ${mb(s.retained1500)} | ${s.domNodes} | ${s.styleTags} | ${(s.cssBytes / 1024).toFixed(0)} |`)
  }
  console.info('')
  for (const s of summaries) {
    if (s.errors.length) {
      console.warn(`[bench] ${s.scene}: ${s.errors.length} console error(s):`)
      s.errors.slice(0, 5).forEach(err => console.warn(`  - ${err.split('\n')[0]}`))
    }
  }
  for (const s of summaries) {
    const profile = s.pages[0]?.profile
    if (!profile)
      continue
    const pct = (v: number) => `${((v / profile.totalMs) * 100).toFixed(1).padStart(5)}%`
    console.info(`#### ${s.scene}: CPU profile of cold + ${options.runs} hot mounts (${ms(profile.totalMs)} ms sampled)\n`)
    console.info('self time by file:')
    profile.byFile.slice(0, 12).forEach(e => console.info(`  ${pct(e.selfMs)}  ${ms(e.selfMs).padStart(8)} ms  ${e.key}`))
    console.info('\nself time by function:')
    profile.byFunction.slice(0, 40).forEach(e => console.info(`  ${pct(e.selfMs)}  ${ms(e.selfMs).padStart(8)} ms  ${e.key}`))
    console.info('')
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const options = parseArgs(process.argv.slice(2))
  const server = await startServer(options)
  const chrome = await launchChrome(options.devtoolsPort)

  const summaries: SceneSummary[] = []
  try {
    for (const scene of options.scenes) {
      const url = `${server.url}?scene=${encodeURIComponent(scene)}`
      const pages: PageResult[] = []
      for (let i = 0; i < options.pages; i += 1) {
        process.stdout.write(`[bench] ${scene} page ${i + 1}/${options.pages}\r`)
        pages.push(await measurePage(chrome.endpoint, url, options, options.profile && i === 0))
      }
      // `n` is resolved in the page (query string or scene default).
      summaries.push(summarize(scene, pages, pages[0]!.n))
      process.stdout.write(`[bench] ${scene} done            \n`)
    }
  }
  finally {
    await chrome.close()
    await server.close()
  }

  printTable(summaries, options)

  if (options.out) {
    const outPath = path.resolve(process.cwd(), options.out)
    fs.writeFileSync(outPath, `${JSON.stringify({
      date: new Date().toISOString(),
      options,
      node: process.version,
      summaries,
    }, null, 2)}\n`)
    console.info(`[bench] raw results written to ${outPath}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
