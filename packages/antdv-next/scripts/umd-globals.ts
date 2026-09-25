import fs from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

// UMD bundles keep `vue` and `dayjs` external and read them from the globals
// their CDN builds define. For dayjs (and its plugins / locales) the global
// name is read from dayjs's own UMD file, e.g. `plugin/weekday.js` ends its
// wrapper with `...).dayjs_plugin_weekday=t()}(this` and `locale/zh-cn.js` with
// `...).dayjs_locale_zh_cn=_(e.dayjs)}(this`, so the bundle always
// agrees with the files users load from the CDN. Dependencies may import the
// same module with or without `.js` (`@v-c/picker` adds it for native Node
// ESM); both resolve to the same file. Unknown externals fail the build:
// rolldown would otherwise guess a global such as `dayjs_plugin_weekday_js`
// that does not exist in the browser.
const UMD_GLOBAL_ASSIGNMENT = /\)\.([A-Z_$][\w$]*)=[A-Z_$][\w$]*\([^)]*\)\}\(this/i

const dayjsGlobals = new Map<string, string>()

function readDayjsGlobal(id: string): string {
  const file = require.resolve(id === 'dayjs' || id.endsWith('.js') ? id : `${id}.js`)
  const cached = dayjsGlobals.get(file)
  if (cached) {
    return cached
  }
  const match = UMD_GLOBAL_ASSIGNMENT.exec(fs.readFileSync(file, 'utf8'))
  if (!match) {
    throw new Error(`Cannot read the UMD global name from ${file} (external module "${id}")`)
  }
  dayjsGlobals.set(file, match[1]!)
  return match[1]!
}

export function umdGlobals(id: string): string {
  if (id === 'vue') {
    return 'Vue'
  }
  if (id === 'dayjs' || id.startsWith('dayjs/')) {
    return readDayjsGlobal(id)
  }
  throw new Error(`No UMD global configured for external module "${id}" (see scripts/umd-globals.ts)`)
}
