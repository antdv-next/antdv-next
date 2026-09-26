import type { Registry } from './registry'

export type SectionType = 'props' | 'events' | 'slots' | 'methods'

export type MarkdownLang = 'zh' | 'en'

export type ApiPart = 'attributes' | 'events' | 'slots'

export interface ApiTableItem {
  name: string
  description?: string
  type?: string
  default?: string
  deprecated?: boolean
}

export interface RegistryEntry {
  /** Global registration name, e.g. `ATextarea`. */
  name: string
  /** Named export of `antdv-next`, e.g. `TextArea`. */
  exportName: string
  /** Kebab-case tag name, e.g. `a-textarea`. */
  tagName: string
  /** Normalized lookup key (lowercase alphanumerics), e.g. `textarea`. */
  key: string
}

export interface ComponentApiData {
  /** Global registration name, e.g. `ATextarea`. */
  name: string
  tagName: string
  componentName: string
  description: string
  source: string
  attributes: ApiTableItem[]
  events: ApiTableItem[]
  slots: ApiTableItem[]
}

/**
 * Maps a heading inside a doc's `## API` section to one or more registry
 * components when the automatic matching cannot resolve it.
 */
export interface HeadingAlias {
  /** Doc folder name under `docs/src/pages/components`. */
  doc: string
  /** Heading text (compared by normalized key) or a RegExp tested against the raw heading. */
  heading: string | RegExp
  /** Global component name(s), e.g. `ATimeRangePicker`. */
  component: string | string[]
  /** Force the section type of tables placed directly under the heading. */
  section?: Exclude<SectionType, 'methods'>
}

export interface InheritanceRef {
  component: string
  /** Parts to inherit. Defaults to attributes, events and slots. */
  pick?: ApiPart[]
}

export interface SupplementDefinition {
  /** Global component name, e.g. `ATextarea`. */
  component: string
  /** Doc folder used for `doc-url` when the component has no API section of its own. */
  doc?: string
  description?: string | { zh?: string, en?: string }
  /** Components whose attributes/events/slots are inherited (own items win). */
  extends?: Array<string | InheritanceRef>
  attributes?: ApiTableItem[]
  events?: ApiTableItem[]
  slots?: ApiTableItem[]
}

export interface ParseContext {
  source: string
  /** Doc folder name under `docs/src/pages/components`. */
  doc: string
  registry: Registry
  aliases?: HeadingAlias[]
}

export interface ParsedMarkdown {
  title: string
  description: string
  source: string
  /** Global name of the page's main component, if resolved. */
  page?: string
  components: ComponentApiData[]
  /** Level-3 API headings that did not resolve to a component or section. */
  unmatchedHeadings: string[]
}

export interface AssembledTag {
  name: string
  tagName: string
  exportName: string
  description: string
  attributes: ApiTableItem[]
  events: ApiTableItem[]
  slots: ApiTableItem[]
}

export interface MarkdownHookContext {
  componentName: string
  tagName: string
  source: string
  lang: MarkdownLang
}

export interface MarkdownHooks {
  props?: (items: ApiTableItem[], context: MarkdownHookContext) => ApiTableItem[] | void
  events?: (items: ApiTableItem[], context: MarkdownHookContext) => ApiTableItem[] | void
  slots?: (items: ApiTableItem[], context: MarkdownHookContext) => ApiTableItem[] | void
}
