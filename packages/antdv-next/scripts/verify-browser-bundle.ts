import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

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
