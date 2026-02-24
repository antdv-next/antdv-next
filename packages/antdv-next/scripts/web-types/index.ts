import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'tinyglobby'
import { version } from '../../package.json'
import { applyDefaults } from './apply-defaults'
import { defaultComponents } from './defaults'
import { applyMarkdownHooks, markdownHooks } from './hooks'
import { mergeDescription, mergeLangData } from './merge'
import { parseMarkdownFile } from './parser'

const CONFIG = {
  libraryName: 'antdv-next',
  libraryVersion: version,
  outputWebTypes: 'web-types.json',
  outputVSCode: 'web-tags.json',
}

const markdowns = [
  './src/pages/components/*/index.zh-CN.md',
  './src/pages/components/*/index.en-US.md',
]

const baseUrl = fileURLToPath(new URL('../../../../docs', import.meta.url))
const uiBaseUrl = fileURLToPath(new URL('../../', import.meta.url))

async function run() {
  const files = await glob(markdowns, { cwd: baseUrl, absolute: true })
  console.log(`🚀 Found ${files.length} files. Starting parse...`)

  const componentMap = new Map<string, { zh?: any, en?: any }>()

  const results = await Promise.all(
    files.map(file => parseMarkdownFile(file).catch((error) => {
      console.error(`❌ Error parsing ${file}:`, error)
      return null
    })),
  )

  results.forEach((result) => {
    if (!result)
      return
    const lang = result.source.includes('en-US') ? 'en' : 'zh'
    result.components.forEach((component) => {
      applyMarkdownHooks(component, lang, markdownHooks)
      const entry = componentMap.get(component.tagName) || {}
      entry[lang] = component
      componentMap.set(component.tagName, entry)
    })
  })

  applyDefaults(componentMap, defaultComponents)

  const finalTags = Array.from(componentMap.values())
    .map(({ zh, en }) => {
      const base = en || zh
      if (!base)
        return null

      return {
        name: base.tagName,
        description: mergeDescription(zh?.description, en?.description),
        attributes: mergeLangData(zh?.attributes || [], en?.attributes || []).map(attr => ({
          name: attr.name,
          description: attr.description,
          default: attr.default,
          value: { kind: 'expression', type: attr.type || 'any' },
        })),
        js: {
          events: mergeLangData(zh?.events || [], en?.events || []).map(ev => ({
            name: ev.name,
            description: ev.description,
            arguments: ev.type && ev.type !== 'any' ? [{ name: 'payload', type: ev.type }] : [],
          })),
        },
        slots: mergeLangData(zh?.slots || [], en?.slots || []).map(slot => ({
          name: slot.name,
          description: slot.description,
        })),
      }
    })
    .filter(Boolean)

  const webTypes = {
    '$schema': 'https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json',
    'name': CONFIG.libraryName,
    'version': CONFIG.libraryVersion,
    'js-types-syntax': 'typescript',
    'description-markup': 'markdown',
    'framework': 'vue',
    'contributions': { html: { elements: finalTags } },
  }
  await fs.writeFile(path.resolve(uiBaseUrl, CONFIG.outputWebTypes), JSON.stringify(webTypes, null, 2))

  const vscodeData = {
    version,
    tags: finalTags.map(tag => ({
      name: tag?.name,
      description: tag?.description,
      attributes: tag?.attributes.map(attribute => ({
        name: attribute.name,
        description: `Default: ${attribute.default || '-'}\n\n${attribute.description}`,
      })),
    })),
  }
  await fs.writeFile(path.resolve(uiBaseUrl, CONFIG.outputVSCode), JSON.stringify(vscodeData, null, 2))

  console.log(`✅ Success! \n- Web-Types: ${CONFIG.outputWebTypes}\n- VSCode Data: ${CONFIG.outputVSCode}`)
}

run()
