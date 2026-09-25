import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { umdGlobals } from './umd-globals'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')

// The browser-facing bundles must not reference the `process` global unguarded:
// unpkg/jsdelivr and native ESM users run them where `process` does not exist,
// so a bare `process.env.NODE_ENV` throws `ReferenceError: process is not
// defined` and the whole bundle fails to load (#666). `typeof process` guards
// are fine — they short-circuit to "undefined" in the browser.
const BROWSER_BUNDLES = [
  'antd.js',
  'antd.esm.js',
  'antd-with-locales.js',
  'antd-with-locales.esm.js',
]

// UMD bundles read their externals from globals. Each external in the AMD
// dependency list must be passed the global its CDN build actually defines —
// for dayjs that is read from dayjs's own UMD files (see scripts/umd-globals.ts).
// A missing mapping makes rolldown guess a name from the module id, e.g.
// `dayjs_plugin_weekday_js`, which is undefined in the browser and breaks the
// whole bundle.
const UMD_BUNDLES = new Set(['antd.js', 'antd-with-locales.js'])

function findUmdGlobalMismatches(code: string): string[] {
  const header = code.slice(0, 5000)
  const amd = /define\(\[([^\]]*)\]/.exec(header)
  const globalCall = /\.antd=\{\},([^)]*)\)/.exec(header)
  if (!amd || !globalCall) {
    return ['cannot parse the UMD wrapper']
  }
  const ids = amd[1]!.split(',').map(s => s.trim().replace(/^[`'"]|[`'"]$/g, '')).filter(id => id !== 'exports')
  const globals = globalCall[1]!.split(',').map(s => s.trim().replace(/^\w+\./, ''))
  if (ids.length !== globals.length) {
    return [`${ids.length} externals but ${globals.length} globals`]
  }
  return ids.flatMap((id, i) => {
    const expected = umdGlobals(id)
    return globals[i] === expected ? [] : [`"${id}" reads \`${globals[i]}\` instead of \`${expected}\``]
  })
}

function findUnguardedProcess(code: string): number[] {
  const offsets: number[] = []
  let i = -1
  // eslint-disable-next-line no-cond-assign
  while ((i = code.indexOf('process.env', i + 1)) !== -1) {
    const before = code.slice(Math.max(0, i - 40), i)
    if (!/typeof process\s*[<!=]/.test(before)) {
      offsets.push(i)
    }
  }
  return offsets
}

async function main() {
  const failures: string[] = []

  for (const file of BROWSER_BUNDLES) {
    const filePath = path.join(distDir, file)
    let code: string
    try {
      code = await fs.readFile(filePath, 'utf8')
    }
    catch {
      failures.push(`${file}: missing — build it before running this check`)
      continue
    }

    const offsets = findUnguardedProcess(code)
    if (offsets.length) {
      const sample = code.slice(offsets[0] - 20, offsets[0] + 25).replace(/\n/g, ' ')
      failures.push(`${file}: ${offsets.length} unguarded \`process.env\` reference(s), e.g. ...${sample}...`)
    }
    else {
      console.log(`✓ ${file}: no unguarded process reference`)
    }

    if (UMD_BUNDLES.has(file)) {
      const mismatches = findUmdGlobalMismatches(code)
      if (mismatches.length) {
        failures.push(`${file}: UMD globals do not match their CDN builds: ${mismatches.join('; ')}`)
      }
      else {
        console.log(`✓ ${file}: UMD globals match the CDN builds of their externals`)
      }
    }
  }

  if (failures.length) {
    console.error('\n✗ Browser bundle verification failed:')
    for (const f of failures) {
      console.error(`  - ${f}`)
    }
    console.error('\nAdd `define: { \'process.env.NODE_ENV\': JSON.stringify(\'production\') }` to the offending vite config.')
    process.exit(1)
  }
}

main()
