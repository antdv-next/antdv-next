import type Token from 'markdown-it/lib/token.d.mts'
import type { ApiTableItem, ComponentApiData, HeadingAlias, ParseContext, ParsedMarkdown, RegistryEntry, SectionType } from './types'
import fs from 'node:fs/promises'
import { resolveTitleFromToken } from '@mdit-vue/shared'
import { createMarkdownParser } from './markdown'
import { addMissingItems } from './merge'
import { parseTable } from './table'
import { getSectionType, isApiHeading, normalizeHeadingText, normalizeKey, toKebabCase } from './utils'

const md = createMarkdownParser()

const PROP_NAME_HEADERS = new Set(['property', 'properties', 'prop', 'props', 'attribute', 'attributes', 'argument', 'arguments', '属性', '参数'])
const EVENT_NAME_HEADERS = new Set(['event', 'events', 'event name', '事件', '事件名', '事件名称'])
const SLOT_NAME_HEADERS = new Set(['slot', 'slots', 'slot name', '插槽', '插槽名', '插槽名称'])
const METHOD_NAME_HEADERS = new Set(['method', 'methods', '方法', '方法名'])
const GENERIC_NAME_HEADERS = new Set(['name', '名称', '名字', '字段'])
const NAME_HEADERS = new Set([
  ...PROP_NAME_HEADERS,
  ...EVENT_NAME_HEADERS,
  ...SLOT_NAME_HEADERS,
  ...METHOD_NAME_HEADERS,
  ...GENERIC_NAME_HEADERS,
])
const DESC_HEADERS = new Set(['description', '说明', '描述'])
const TYPE_HEADERS = new Set(['type', '类型'])
const DEFAULT_HEADERS = new Set(['default', 'default value', '默认值'])
/** Rows such as `loadingIcon | （仅支持全局配置）...` describe ConfigProvider options, not component props. */
const GLOBAL_CONFIG_ONLY_RE = /^[（(]\s*(?:仅支持全局配置|only supports global configuration|global config(?:uration)? only)\s*[）)]/i

type SectionState = SectionType | 'infer' | 'skip'

interface TableColumns {
  name: number
  description: number
  type: number
  default: number
}

interface HeadingResolution {
  kind: 'section' | 'component' | 'skip'
  components: RegistryEntry[]
  section?: SectionType
}

function resolveColumns(headers: string[]): TableColumns {
  const nameIndex = headers.findIndex(header => NAME_HEADERS.has(header))
  return {
    name: nameIndex === -1 ? 0 : nameIndex,
    description: headers.findIndex(header => DESC_HEADERS.has(header)),
    type: headers.findIndex(header => TYPE_HEADERS.has(header)),
    default: headers.findIndex(header => DEFAULT_HEADERS.has(header)),
  }
}

/**
 * Guesses what a table describes from its header row. Used for tables that sit
 * directly under a component heading without a `#### Props` style sub-heading.
 */
export function inferSection(headers: string[], columns: TableColumns = resolveColumns(headers)): SectionType | null {
  const nameHeader = headers[columns.name] ?? ''
  if (EVENT_NAME_HEADERS.has(nameHeader))
    return 'events'
  if (SLOT_NAME_HEADERS.has(nameHeader))
    return 'slots'
  if (METHOD_NAME_HEADERS.has(nameHeader))
    return 'methods'
  if (columns.type >= 0 && (columns.default >= 0 || PROP_NAME_HEADERS.has(nameHeader)))
    return 'props'
  return null
}

function getHeadingText(tokens: Token[], headingIndex: number) {
  const inlineToken = tokens[headingIndex + 1]
  if (!inlineToken || inlineToken.type !== 'inline')
    return ''
  const rawText = resolveTitleFromToken(inlineToken, {
    shouldAllowHtml: false,
    shouldEscapeText: false,
  })
  return normalizeHeadingText(rawText)
}

function resolvePageTitle(tokens: Token[], frontmatter: Record<string, any>) {
  let title = ''
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!
    if (token.type === 'heading_open' && token.tag === 'h1') {
      title = getHeadingText(tokens, i)
      break
    }
  }

  if (!title && typeof frontmatter.title === 'string')
    title = frontmatter.title.trim()

  return title
}

function resolveDescription(frontmatter: Record<string, any>) {
  if (typeof frontmatter.description === 'string')
    return frontmatter.description
  if (typeof frontmatter.subtitle === 'string')
    return frontmatter.subtitle
  return ''
}

/** The component a doc page is about: `date-picker` -> `ADatePicker`. Pages like `grid` have none. */
function resolvePageComponent(ctx: ParseContext, frontmatter: Record<string, any>, title: string) {
  const candidates = [ctx.doc, frontmatter.title, title]
  for (const candidate of candidates) {
    if (typeof candidate !== 'string' || !candidate.trim())
      continue
    const entry = ctx.registry.lookup(candidate)
    if (entry)
      return entry
  }
  return null
}

function matchAlias(alias: HeadingAlias, text: string) {
  if (typeof alias.heading === 'string')
    return normalizeKey(alias.heading) === normalizeKey(text)
  return alias.heading.test(text)
}

/**
 * Resolves a heading fragment to a registry component. Tries, in order:
 * the text itself (`TextArea`), the page component as prefix (`Column` in the
 * table doc -> `TableColumn`), and the page component stripped from the front
 * (`Tag.CheckableTag` -> `CheckableTag`). Lowercase headings such as
 * `pagination` or `showSearch` are config keys, never components.
 */
function matchComponent(text: string, ctx: ParseContext, page: RegistryEntry | null) {
  if (!/^[A-Z]/.test(text))
    return undefined
  const key = normalizeKey(text)
  if (!key)
    return undefined

  const direct = ctx.registry.lookup(key)
  if (direct)
    return direct
  if (!page)
    return undefined

  const prefixed = ctx.registry.lookup(page.key + key)
  if (prefixed)
    return prefixed
  if (key.length > page.key.length && key.startsWith(page.key))
    return ctx.registry.lookup(key.slice(page.key.length))
  return undefined
}

function unique<T>(items: T[]) {
  return Array.from(new Set(items))
}

function resolveHeading(text: string, ctx: ParseContext, page: RegistryEntry | null): HeadingResolution {
  const pageTargets = page ? [page] : []

  const alias = (ctx.aliases ?? []).find(item => item.doc === ctx.doc && matchAlias(item, text))
  if (alias) {
    const names = Array.isArray(alias.component) ? alias.component : [alias.component]
    const components = names
      .map(name => ctx.registry.get(name))
      .filter((entry): entry is RegistryEntry => Boolean(entry))
    return components.length
      ? { kind: 'component', components, section: alias.section }
      : { kind: 'skip', components: [] }
  }

  const pureSection = getSectionType(text)
  if (pureSection)
    return { kind: 'section', components: pageTargets, section: pureSection }

  // `Option props`, `Select 方法`, `TreeSelect Props`
  let base = text
  let hint: SectionType | undefined
  const words = text.split(/\s+/)
  if (words.length > 1) {
    const tail = getSectionType(words[words.length - 1]!)
    if (tail) {
      hint = tail
      base = words.slice(0, -1).join(' ')
    }
  }

  // `DatePicker[picker=year]` documents DatePicker props under a condition.
  base = base.replace(/\[[^\]]*\]\s*$/, '').trim()

  // `Radio/RadioButton` documents two components at once.
  const parts = base.split('/').map(part => part.trim()).filter(Boolean)
  const matched = parts.map(part => matchComponent(part, ctx, page))
  if (parts.length && matched.every(Boolean))
    return { kind: 'component', components: unique(matched as RegistryEntry[]), section: hint }

  const whole = matchComponent(base, ctx, page)
  if (whole)
    return { kind: 'component', components: [whole], section: hint }

  return { kind: 'skip', components: [] }
}

function toItem(row: string[], columns: TableColumns, section: SectionType): ApiTableItem | null {
  let name = (row[columns.name] ?? '').trim()
  let deprecated = false

  const strike = name.match(/^~~(.+)~~$/)
  if (strike) {
    name = strike[1]!.trim()
    deprecated = true
  }

  if (!name || name === '-' || /\s/.test(name))
    return null
  // `showTime.defaultOpenValue` documents a nested config key, not an attribute.
  if (section === 'props' && name.includes('.'))
    return null
  // `class` / `style` are native attributes every element already has.
  if (section === 'props' && /^(?:class|style)$/.test(name))
    return null

  const descRaw = columns.description >= 0 ? row[columns.description] ?? '' : ''
  const typeRaw = columns.type >= 0 ? row[columns.type] : ''
  const defaultRaw = columns.default >= 0 ? row[columns.default] : ''

  if (section === 'props' && GLOBAL_CONFIG_ONLY_RE.test(descRaw))
    return null

  return {
    name: section === 'props' ? toKebabCase(name) : name,
    description: descRaw,
    type: typeRaw && typeRaw !== '-' ? typeRaw : 'any',
    default: defaultRaw && defaultRaw !== '-' ? defaultRaw : undefined,
    deprecated: deprecated || undefined,
  }
}

const SECTION_FIELDS: Record<Exclude<SectionType, 'methods'>, 'attributes' | 'events' | 'slots'> = {
  props: 'attributes',
  events: 'events',
  slots: 'slots',
}

function parseApiSections(
  tokens: Token[],
  ctx: ParseContext,
  page: RegistryEntry | null,
  description: string,
) {
  const components = new Map<string, ComponentApiData>()
  const unmatchedHeadings: string[] = []
  const pageTargets = page ? [page] : []

  let inApi = false
  /** Components receiving the tables that follow. */
  let targets: RegistryEntry[] = []
  /**
   * Components set by the current level-3 heading, receiving level-4 sections.
   * `null` means page-level context, `[]` an unmatched heading whose sub-sections are ignored.
   */
  let h3Targets: RegistryEntry[] | null = null
  let section: SectionState = 'skip'

  const getOrCreate = (entry: RegistryEntry) => {
    const existing = components.get(entry.name)
    if (existing)
      return existing
    const component: ComponentApiData = {
      name: entry.name,
      tagName: entry.tagName,
      componentName: entry.exportName,
      description,
      source: ctx.source,
      attributes: [],
      events: [],
      slots: [],
    }
    components.set(entry.name, component)
    return component
  }

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!

    if (token.type === 'heading_open') {
      const level = Number.parseInt(token.tag.slice(1), 10)
      const headingText = getHeadingText(tokens, i)

      if (level <= 2) {
        inApi = level === 2 && isApiHeading(headingText)
        // Some pages put the main props table right under `## API`.
        targets = inApi ? pageTargets : []
        h3Targets = null
        section = inApi && page ? 'infer' : 'skip'
        continue
      }

      if (!inApi)
        continue

      if (level === 3) {
        const resolution = resolveHeading(headingText, ctx, page)
        if (resolution.kind === 'section') {
          // Level-3 sections (`### Events`) always belong to the page component.
          targets = pageTargets
          h3Targets = null
          section = resolution.section!
        }
        else if (resolution.kind === 'component') {
          targets = resolution.components
          h3Targets = resolution.components
          section = resolution.section ?? 'infer'
        }
        else {
          targets = []
          h3Targets = []
          section = 'skip'
          unmatchedHeadings.push(headingText)
        }
        continue
      }

      // Level 4+: `#### Props` under a component heading, anything else is a type table.
      const subSection = getSectionType(headingText)
      if (subSection) {
        targets = h3Targets ?? pageTargets
        section = subSection
      }
      else {
        section = 'skip'
      }
      continue
    }

    if (token.type === 'table_open' && inApi && section !== 'skip' && targets.length) {
      const { headers, rows, endIndex } = parseTable(tokens, i)
      i = endIndex

      const columns = resolveColumns(headers)
      const resolved = section === 'infer' ? inferSection(headers, columns) : section
      if (!resolved || resolved === 'methods')
        continue

      const items = rows
        .map(row => toItem(row, columns, resolved))
        .filter((item): item is ApiTableItem => Boolean(item))
      const field = SECTION_FIELDS[resolved]
      targets.forEach(target => addMissingItems(getOrCreate(target)[field], items))
    }
  }

  return { components: Array.from(components.values()), unmatchedHeadings }
}

export async function parseMarkdownFile(filePath: string, ctx: Omit<ParseContext, 'source'> & { source?: string }): Promise<ParsedMarkdown> {
  const content = await fs.readFile(filePath, 'utf-8')
  return parseMarkdownContent(content, { ...ctx, source: ctx.source ?? filePath })
}

export function parseMarkdownContent(content: string, ctx: ParseContext): ParsedMarkdown {
  const env: Record<string, any> = {}
  const tokens = md.parse(content, env)
  const frontmatter = env.frontmatter || {}

  const title = resolvePageTitle(tokens, frontmatter)
  const description = resolveDescription(frontmatter)
  const page = resolvePageComponent(ctx, frontmatter, title)
  const { components, unmatchedHeadings } = parseApiSections(tokens, ctx, page, description)

  return {
    title,
    description,
    source: ctx.source,
    page: page?.name,
    components,
    unmatchedHeadings,
  }
}
