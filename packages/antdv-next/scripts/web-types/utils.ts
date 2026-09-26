import type { SectionType } from './types'

export function toKebabCase(value: string) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s._:]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
}

/** Lowercase alphanumerics only: `Date-Picker` / `DatePicker` / `date picker` -> `datepicker`. */
export function normalizeKey(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function cleanText(text?: string) {
  if (!text)
    return ''

  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ZeroWidthSpace;|&#8203;/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`/g, '')
    .replace(/<[^>]+>/g, '')
    .trim()
}

export function normalizeHeadingText(text: string) {
  return cleanText(text)
    .replace(/\s*\{#[^}]+\}\s*/g, '')
    .replace(/[：:]\s*$/, '')
    .trim()
}

const SECTION_TITLES: Record<SectionType, Set<string>> = {
  props: new Set(['props', 'prop', 'property', 'properties', 'attributes', '属性']),
  events: new Set(['events', 'event', '事件']),
  slots: new Set(['slots', 'slot', '插槽']),
  methods: new Set(['methods', 'method', 'static methods', '方法', '静态方法']),
}

export function getSectionType(text: string): SectionType | null {
  const normalized = text.trim().toLowerCase()
  for (const section of Object.keys(SECTION_TITLES) as SectionType[]) {
    if (SECTION_TITLES[section].has(normalized))
      return section
  }
  return null
}

export function isApiHeading(text: string) {
  return text.trim().toLowerCase() === 'api'
}
