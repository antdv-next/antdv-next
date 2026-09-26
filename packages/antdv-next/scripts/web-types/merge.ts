import type { ApiTableItem } from './types'

export function mergeDescription(zh?: string, en?: string) {
  const zhText = zh?.trim() ?? ''
  const enText = en?.trim() ?? ''
  if (zhText && enText)
    return `(ZH) ${zhText}\n\n(EN) ${enText}`
  return zhText || enText
}

/** Appends `items` whose names are not present in `target` yet (first occurrence wins). */
export function addMissingItems(target: ApiTableItem[], items: ApiTableItem[]) {
  const names = new Set(target.map(item => item.name))
  items.forEach((item) => {
    if (names.has(item.name))
      return
    names.add(item.name)
    target.push({ ...item })
  })
  return target
}

export function mergeLangData(zhList: ApiTableItem[], enList: ApiTableItem[]): ApiTableItem[] {
  const map = new Map<string, { zh?: ApiTableItem, en?: ApiTableItem }>()

  zhList.forEach((item) => {
    if (!map.has(item.name))
      map.set(item.name, { zh: item })
  })

  enList.forEach((item) => {
    const entry = map.get(item.name)
    if (!entry)
      map.set(item.name, { en: item })
    else if (!entry.en)
      entry.en = item
  })

  return Array.from(map.values()).map(({ zh, en }) => {
    const base = (en ?? zh)!
    const deprecated = Boolean(en?.deprecated || zh?.deprecated)
    return {
      ...base,
      description: mergeDescription(zh?.description, en?.description),
      type: en?.type ?? zh?.type,
      default: en?.default ?? zh?.default,
      deprecated: deprecated || undefined,
    }
  })
}
