import type { ThemeConfig } from 'antdv-next'
import { theme as antdvTheme } from 'antdv-next'

/** Minimal imports for default/dark theme copy */
const MINIMAL_THEME_IMPORTS = `import { ConfigProvider, theme } from 'antdv-next'`

/** Extract hook name and source from raw theme file content */
function getThemeFileContent(source: string): { content: string, hookName: string } {
  const hookNameMatch = source.match(/export\s+default\s+(\w+)/)
  const hookName = hookNameMatch?.[1] ?? 'useTheme'
  const content = source.trim()
  return { content, hookName }
}

/** useGlassTheme → glassTheme */
function hookNameToFileName(hookName: string): string {
  if (hookName.length <= 3)
    return hookName
  return hookName.slice(3, 4).toLowerCase() + hookName.slice(4)
}

/** Generate App.vue that imports the theme hook and wraps ConfigProvider */
function getConfigFileContent(hookName: string, fileName: string): string {
  return `<script setup lang="ts">
import { ConfigProvider } from 'antdv-next'
import ${hookName} from './${fileName}'

const configProps = ${hookName}()
</script>

<template>
  <ConfigProvider v-bind="configProps">
    <!-- Your App -->
  </ConfigProvider>
</template>
`
}

/**
 * Generate full copyable code.
 * - If copyCode is provided (custom theme), exports two files: hook file + App.vue
 * - Otherwise (default/dark theme), exports a minimal App.vue
 */
export function generateFullCopyFile(params: {
  themeConfig?: ThemeConfig
  copyCode?: string
}): string {
  const { themeConfig, copyCode } = params

  if (copyCode?.trim()) {
    const { content: themeFileContent, hookName } = getThemeFileContent(copyCode)
    const fileName = hookNameToFileName(hookName)
    const configContent = getConfigFileContent(hookName, fileName)
    return [
      `// ========== ${fileName}.ts ==========`,
      '',
      themeFileContent,
      '',
      '// ========== App.vue ==========',
      '',
      configContent,
    ].join('\n')
  }

  const configPropsStr = !themeConfig
    ? '{ theme: { algorithm: theme.defaultAlgorithm } }'
    : (() => {
        const themeProps: string[] = []
        const algorithmStr = getAlgorithmStr(themeConfig.algorithm)
        if (algorithmStr)
          themeProps.push(`algorithm: ${algorithmStr}`)
        if (themeConfig.token && Object.keys(themeConfig.token).length > 0) {
          themeProps.push(`token: ${stringifyValue(themeConfig.token, 1)}`)
        }
        if (themeConfig.components && Object.keys(themeConfig.components).length > 0) {
          themeProps.push(`components: ${stringifyValue(themeConfig.components, 1)}`)
        }
        if (themeProps.length === 0)
          themeProps.push('algorithm: theme.defaultAlgorithm')
        return `{ theme: { ${themeProps.join(', ')} } }`
      })()

  return [
    '// ========== App.vue ==========',
    '',
    '<script setup lang="ts">',
    MINIMAL_THEME_IMPORTS,
    '',
    `const configProps = ${configPropsStr}`,
    '</script>',
    '',
    '<template>',
    '  <ConfigProvider v-bind="configProps">',
    '    <!-- Your App -->',
    '  </ConfigProvider>',
    '</template>',
  ].join('\n')
}

/** Generate a minimal theme code snippet (no file comments) */
export function generateThemeCode(themeConfig?: ThemeConfig): string {
  if (!themeConfig) {
    return [
      '<script setup lang="ts">',
      MINIMAL_THEME_IMPORTS,
      '',
      '</script>',
      '',
      '<template>',
      '  <ConfigProvider theme={{ algorithm: theme.defaultAlgorithm }}>',
      '    <!-- Your App -->',
      '  </ConfigProvider>',
      '</template>',
    ].join('\n')
  }

  const { algorithm, token, components } = themeConfig

  const themeProps: string[] = []

  const algorithmStr = getAlgorithmStr(algorithm)
  if (algorithmStr)
    themeProps.push(`    algorithm: ${algorithmStr},`)

  if (token && Object.keys(token).length > 0)
    themeProps.push(`    token: ${stringifyValue(token, 2)},`)

  if (components && Object.keys(components).length > 0)
    themeProps.push(`    components: ${stringifyValue(components, 2)},`)

  return [
    '<script setup lang="ts">',
    MINIMAL_THEME_IMPORTS,
    '',
    '</script>',
    '',
    '<template>',
    '  <ConfigProvider',
    '    :theme="{',
    ...themeProps,
    '    }"',
    '  >',
    '    <!-- Your App -->',
    '  </ConfigProvider>',
    '</template>',
  ].join('\n')
}

function getAlgorithmStr(algorithm: ThemeConfig['algorithm']): string | null {
  if (!algorithm)
    return null

  if (Array.isArray(algorithm)) {
    const algoStrs = algorithm.map(getAlgorithmStr).filter(Boolean) as string[]
    if (algoStrs.length === 0)
      return null
    if (algoStrs.length === 1)
      return algoStrs[0]!
    return `[${algoStrs.join(', ')}]`
  }

  if (algorithm === antdvTheme.defaultAlgorithm)
    return 'theme.defaultAlgorithm'
  if (algorithm === antdvTheme.darkAlgorithm)
    return 'theme.darkAlgorithm'
  if (algorithm === antdvTheme.compactAlgorithm)
    return 'theme.compactAlgorithm'

  return null
}

function stringifyValue(value: unknown, depth = 0): string {
  const indent = '  '.repeat(depth + 1)
  const closingIndent = '  '.repeat(depth)

  if (value === undefined)
    return 'undefined'
  if (value === null)
    return 'null'
  if (typeof value === 'boolean')
    return String(value)
  if (typeof value === 'number')
    return String(value)
  if (typeof value === 'string')
    return `'${value}'`

  if (typeof value === 'function') {
    const algoStr = getAlgorithmStr(value as ThemeConfig['algorithm'])
    return algoStr ?? '/* function */'
  }

  if (Array.isArray(value)) {
    if (value.length === 0)
      return '[]'
    const items = value.map(item => `${indent}${stringifyValue(item, depth + 1)}`)
    return `[\n${items.join(',\n')},\n${closingIndent}]`
  }

  if (typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>).filter(
      ([, v]) => v !== undefined && typeof v !== 'function',
    )
    if (entries.length === 0)
      return '{}'
    const items = entries.map(([k, v]) => `${indent}${k}: ${stringifyValue(v, depth + 1)}`)
    return `{\n${items.join(',\n')},\n${closingIndent}}`
  }

  return String(value)
}
