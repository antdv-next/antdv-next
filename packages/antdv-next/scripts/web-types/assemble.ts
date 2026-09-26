import type { Registry } from './registry'
import type { ApiPart, ApiTableItem, AssembledTag, ComponentApiData, InheritanceRef, SupplementDefinition } from './types'
import { addMissingItems, mergeDescription, mergeLangData } from './merge'
import { toKebabCase } from './utils'

export type ComponentLangMap = Map<string, { zh?: ComponentApiData, en?: ComponentApiData }>

export interface AssembleOptions {
  warn?: (message: string) => void
}

const ALL_PARTS: ApiPart[] = ['attributes', 'events', 'slots']

function normalizeItems(items: ApiTableItem[] | undefined, toKebab: boolean) {
  if (!items)
    return []
  return items.map(item => ({
    ...item,
    name: toKebab ? toKebabCase(item.name) : item.name,
  }))
}

function resolveSupplementDescription(description: SupplementDefinition['description']) {
  if (!description)
    return ''
  if (typeof description === 'string')
    return description
  return mergeDescription(description.zh, description.en)
}

/**
 * Produces one tag per registry entry: merges zh/en doc data, layers curated
 * supplements on top, then resolves `extends` so that e.g. `a-textarea`
 * inherits every `a-input` attribute it does not define itself.
 */
export function assembleTags(
  registry: Registry,
  componentMap: ComponentLangMap,
  supplements: SupplementDefinition[] = [],
  options: AssembleOptions = {},
): AssembledTag[] {
  const warn = options.warn ?? (() => {})
  const tags = new Map<string, AssembledTag>()

  registry.entries.forEach((entry) => {
    const { zh, en } = componentMap.get(entry.name) ?? {}
    tags.set(entry.name, {
      name: entry.name,
      tagName: entry.tagName,
      exportName: entry.exportName,
      description: mergeDescription(zh?.description, en?.description),
      attributes: mergeLangData(zh?.attributes ?? [], en?.attributes ?? []),
      events: mergeLangData(zh?.events ?? [], en?.events ?? []),
      slots: mergeLangData(zh?.slots ?? [], en?.slots ?? []),
    })
  })

  const supplementMap = new Map<string, SupplementDefinition>()
  supplements.forEach((supplement) => {
    const tag = tags.get(supplement.component)
    if (!tag) {
      warn(`Supplement for "${supplement.component}" ignored: not declared in global.d.ts`)
      return
    }
    supplementMap.set(supplement.component, supplement)
    const description = resolveSupplementDescription(supplement.description)
    if (description)
      tag.description = description
    addMissingItems(tag.attributes, normalizeItems(supplement.attributes, true))
    addMissingItems(tag.events, normalizeItems(supplement.events, false))
    addMissingItems(tag.slots, normalizeItems(supplement.slots, false))
  })

  const resolved = new Set<string>()
  const visit = (name: string, stack: string[]) => {
    if (resolved.has(name))
      return
    if (stack.includes(name)) {
      warn(`Circular extends: ${[...stack, name].join(' -> ')}`)
      return
    }
    const tag = tags.get(name)!
    const refs = supplementMap.get(name)?.extends ?? []
    refs.forEach((raw) => {
      const ref: InheritanceRef = typeof raw === 'string' ? { component: raw } : raw
      const parent = tags.get(ref.component)
      if (!parent) {
        warn(`"${name}" extends unknown component "${ref.component}"`)
        return
      }
      visit(ref.component, [...stack, name])
      const omitted = new Set((ref.omit ?? []).flatMap(name => [name, toKebabCase(name)]))
      const parts = ref.pick ?? ALL_PARTS
      parts.forEach(part => addMissingItems(tag[part], parent[part].filter(item => !omitted.has(item.name))))
    })
    resolved.add(name)
  }
  tags.forEach((_, name) => visit(name, []))

  tags.forEach((tag) => {
    if (!tag.description)
      tag.description = `${tag.exportName} component of antdv-next.`
  })

  return Array.from(tags.values())
}
