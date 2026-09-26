import type { ComponentLangMap } from './assemble'
import type { AssembledTag, ComponentApiData, MarkdownLang } from './types'
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { glob } from 'tinyglobby'
import { version } from '../../package.json'
import { assembleTags } from './assemble'
import { headingAliases } from './config'
import { supplements } from './defaults'
import { applyMarkdownHooks, markdownHooks } from './hooks'
import { addMissingItems } from './merge'
import { parseMarkdownFile } from './parser'
import { loadRegistry } from './registry'

const CONFIG = {
  libraryName: 'antdv-next',
  libraryVersion: version,
  docsBaseUrl: 'https://antdv-next.com/components',
  outputWebTypes: 'web-types.json',
  outputVSCode: 'web-tags.json',
}

const markdowns = [
  './src/pages/components/*/index.zh-CN.md',
  './src/pages/components/*/index.en-US.md',
]

const baseUrl = fileURLToPath(new URL('../../../../docs', import.meta.url))
const uiBaseUrl = fileURLToPath(new URL('../../', import.meta.url))

function mergeComponentData(target: ComponentApiData, source: ComponentApiData) {
  if (!target.description)
    target.description = source.description
  addMissingItems(target.attributes, source.attributes)
  addMissingItems(target.events, source.events)
  addMissingItems(target.slots, source.slots)
}

function toWebTypesElement(tag: AssembledTag, doc?: string) {
  return {
    'name': tag.tagName,
    'description': tag.description,
    'doc-url': doc ? `${CONFIG.docsBaseUrl}/${doc}` : undefined,
    'source': { module: CONFIG.libraryName, symbol: tag.exportName },
    'attributes': tag.attributes.map(attr => ({
      name: attr.name,
      description: attr.description,
      default: attr.default,
      deprecated: attr.deprecated,
      value: { kind: 'expression', type: attr.type || 'any' },
    })),
    'js': {
      events: tag.events.map(event => ({
        name: event.name,
        description: event.description,
        deprecated: event.deprecated,
        arguments: event.type && event.type !== 'any' ? [{ name: 'payload', type: event.type }] : [],
      })),
    },
    'slots': tag.slots.map(slot => ({
      name: slot.name,
      description: slot.description,
      deprecated: slot.deprecated,
    })),
  }
}

async function run() {
  const registry = await loadRegistry(path.resolve(uiBaseUrl, 'global.d.ts'))
  const files = await glob(markdowns, { cwd: baseUrl, absolute: true })
  console.log(`🚀 Found ${files.length} docs for ${registry.entries.length} global components. Starting parse...`)

  const componentMap: ComponentLangMap = new Map()
  const componentDocs = new Map<string, string>()
  const unmatched = new Map<string, Set<string>>()

  const results = await Promise.all(
    files.map(async (file) => {
      const doc = path.basename(path.dirname(file))
      const lang: MarkdownLang = file.includes('en-US') ? 'en' : 'zh'
      try {
        const parsed = await parseMarkdownFile(file, { doc, registry, aliases: headingAliases })
        return { doc, lang, parsed }
      }
      catch (error) {
        console.error(`❌ Error parsing ${file}:`, error)
        return null
      }
    }),
  )

  results.forEach((result) => {
    if (!result)
      return
    const { doc, lang, parsed } = result

    if (parsed.unmatchedHeadings.length) {
      const set = unmatched.get(doc) ?? new Set<string>()
      parsed.unmatchedHeadings.forEach(heading => set.add(heading))
      unmatched.set(doc, set)
    }

    parsed.components.forEach((component) => {
      applyMarkdownHooks(component, lang, markdownHooks)
      const entry = componentMap.get(component.name) || {}
      if (entry[lang])
        mergeComponentData(entry[lang], component)
      else
        entry[lang] = component
      componentMap.set(component.name, entry)
      if (!componentDocs.has(component.name))
        componentDocs.set(component.name, doc)
    })
  })

  const tags = assembleTags(registry, componentMap, supplements, {
    warn: message => console.warn(`⚠️  ${message}`),
  })
  const supplementDocs = new Map(supplements.filter(item => item.doc).map(item => [item.component, item.doc!]))
  const elements = tags.map(tag => toWebTypesElement(tag, componentDocs.get(tag.name) ?? supplementDocs.get(tag.name)))

  const webTypes = {
    '$schema': 'https://raw.githubusercontent.com/JetBrains/web-types/master/schema/web-types.json',
    'name': CONFIG.libraryName,
    'version': CONFIG.libraryVersion,
    'js-types-syntax': 'typescript',
    'description-markup': 'markdown',
    'framework': 'vue',
    'contributions': { html: { elements } },
  }
  await fs.writeFile(path.resolve(uiBaseUrl, CONFIG.outputWebTypes), JSON.stringify(webTypes, null, 2))

  const vscodeData = {
    version,
    tags: tags.map(tag => ({
      name: tag.tagName,
      description: tag.description,
      attributes: tag.attributes.map(attribute => ({
        name: attribute.name,
        description: `Default: ${attribute.default || '-'}\n\n${attribute.description}`,
      })),
    })),
  }
  await fs.writeFile(path.resolve(uiBaseUrl, CONFIG.outputVSCode), JSON.stringify(vscodeData, null, 2))

  const empty = tags.filter(tag => !tag.attributes.length && !tag.events.length && !tag.slots.length)
  if (empty.length)
    console.warn(`⚠️  ${empty.length} components have no documented API: ${empty.map(tag => tag.tagName).join(', ')}`)
  if (unmatched.size) {
    console.log('ℹ️  API headings ignored (not a global component):')
    unmatched.forEach((headings, doc) => console.log(`   ${doc}: ${Array.from(headings).join(' | ')}`))
  }

  console.log(`✅ Success! ${elements.length} elements\n- Web-Types: ${CONFIG.outputWebTypes}\n- VSCode Data: ${CONFIG.outputVSCode}`)
}

run()
