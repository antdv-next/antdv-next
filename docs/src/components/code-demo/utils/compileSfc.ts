import * as Vue from 'vue'

let compilerSfc: typeof import('@vue/compiler-sfc') | null = null
let sucraseModule: typeof import('sucrase') | null = null

const modulesMap: Record<string, any> = {
  vue: Vue,
}

let modulesReady = false

async function ensureDependencies() {
  if (!compilerSfc) {
    compilerSfc = await import('@vue/compiler-sfc')
  }
  if (!sucraseModule) {
    sucraseModule = await import('sucrase')
  }
  if (!modulesReady) {
    const [icons, antdv, dayjs] = await Promise.all([
      import('@antdv-next/icons'),
      import('antdv-next'),
      import('dayjs'),
    ])
    modulesMap['@antdv-next/icons'] = icons
    modulesMap['antdv-next'] = antdv
    modulesMap.dayjs = dayjs.default || dayjs
    modulesReady = true
  }
}

function transformCode(code: string): string {
  let result = code

  // Named imports: import { a, b as c } from 'module'
  // Need to convert 'as' to ':' for destructuring syntax
  result = result.replace(
    /import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]\s*;?/g,
    (_, names, source) => {
      const transformedNames = names.replace(/\bas\b/g, ':')
      return `const {${transformedNames}} = (__modules__["${source}"] || {});`
    },
  )

  // Default import: import Name from 'module'
  result = result.replace(
    /import\s+(\w+)\s+from\s*['"]([^'"]+)['"]\s*;?/g,
    (_, name, source) => `const ${name} = (__modules__["${source}"] || {}).default || (__modules__["${source}"] || {});`,
  )

  // Namespace import: import * as Name from 'module'
  result = result.replace(
    /import\s*\*\s*as\s+(\w+)\s+from\s*['"]([^'"]+)['"]\s*;?/g,
    (_, name, source) => `const ${name} = (__modules__["${source}"] || {});`,
  )

  // Side-effect imports: import 'module'
  result = result.replace(
    /^\s*import\s*['"][^'"]+['"]\s*(?:;\s*)?$/gm,
    '',
  )

  // export default → __exports__.default =
  result = result.replace(/export\s+default\s+/g, '__exports__.default = ')

  // export function name → function name + track for later export
  const exportedNames: string[] = []
  result = result.replace(/export\s+function\s+(\w+)/g, (_, name) => {
    exportedNames.push(name)
    return `function ${name}`
  })

  result = result.replace(/export\s+(const|let|var)\s+(\w+)/g, (_, keyword, name) => {
    exportedNames.push(name)
    return `${keyword} ${name}`
  })

  // Append exports for named declarations
  for (const name of exportedNames) {
    result += `\n__exports__["${name}"] = ${name};`
  }

  return result
}

export async function compileSfcSource(source: string): Promise<{ component: any, error: string | null }> {
  await ensureDependencies()

  try {
    const { compileScript, compileTemplate, parse } = compilerSfc!
    const { transform } = sucraseModule!

    const id = `live-${Math.random().toString(36).slice(2, 8)}`
    const { descriptor, errors } = parse(source, { filename: 'Demo.vue' })

    if (errors.length > 0) {
      return { component: null, error: errors.map(e => e.message).join('\n') }
    }

    let jsCode: string

    if (descriptor.scriptSetup) {
      // <script setup> — use inlineTemplate to bake render into setup()
      const compiled = compileScript(descriptor, {
        id,
        inlineTemplate: true,
      })
      jsCode = compiled.content
    }
    else if (descriptor.script) {
      // Options API <script>
      const compiled = compileScript(descriptor, { id })
      jsCode = compiled.content

      if (descriptor.template) {
        const templateResult = compileTemplate({
          source: descriptor.template.content,
          filename: 'Demo.vue',
          id,
          compilerOptions: {
            bindingMetadata: compiled.bindings,
          },
        })
        if (templateResult.errors.length) {
          return {
            component: null,
            error: templateResult.errors
              .map(e => (typeof e === 'string' ? e : e.message))
              .join('\n'),
          }
        }
        jsCode += `\n${templateResult.code}`
      }
    }
    else if (descriptor.template) {
      // Template-only component
      const templateResult = compileTemplate({
        source: descriptor.template.content,
        filename: 'Demo.vue',
        id,
      })
      if (templateResult.errors.length) {
        return {
          component: null,
          error: templateResult.errors
            .map(e => (typeof e === 'string' ? e : e.message))
            .join('\n'),
        }
      }
      jsCode = templateResult.code
    }
    else {
      return { component: null, error: 'No template or script found' }
    }

    // Strip TypeScript type annotations
    try {
      const result = transform(jsCode, {
        transforms: ['typescript'],
        disableESTransforms: true,
      })
      jsCode = result.code
    }
    catch {
      // May already be plain JS — continue
    }

    // Transform imports / exports to work with new Function
    jsCode = transformCode(jsCode)

    // Evaluate the compiled code
    const __exports__: Record<string, any> = {}
    // eslint-disable-next-line no-new-func
    const fn = new Function('__modules__', '__exports__', jsCode)
    fn(modulesMap, __exports__)

    // For options API + separate template, attach the render function
    if (!descriptor.scriptSetup && descriptor.script && descriptor.template) {
      const comp = __exports__.default || {}
      if (__exports__.render) {
        comp.render = __exports__.render
      }
      return { component: comp, error: null }
    }

    // For template-only, create component with render
    if (!descriptor.scriptSetup && !descriptor.script && descriptor.template) {
      return { component: { render: __exports__.render }, error: null }
    }

    return { component: __exports__.default, error: null }
  }
  catch (e: any) {
    return { component: null, error: e.message || String(e) }
  }
}
