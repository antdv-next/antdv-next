import type { RegistryEntry } from './types'
import fs from 'node:fs/promises'
import { normalizeKey, toKebabCase } from './utils'

const GLOBAL_COMPONENT_RE = /^\s*(A[A-Za-z0-9]+)\s*:\s*typeof\s+import\(['"]antdv-next['"]\)\[['"]([\w$]+)['"]\]/gm

function stripPrefix(globalName: string) {
  return globalName.replace(/^A/, '')
}

/** `ATextarea` -> `a-textarea`, `AInputOtp` -> `a-input-otp`. Mirrors Vue's own tag resolution. */
export function toTagName(globalName: string) {
  return `a-${toKebabCase(stripPrefix(globalName))}`
}

export function createRegistryEntry(name: string, exportName = stripPrefix(name)): RegistryEntry {
  return {
    name,
    exportName,
    tagName: toTagName(name),
    key: normalizeKey(stripPrefix(name)),
  }
}

/** Reads the `GlobalComponents` augmentation of `global.d.ts`. */
export function parseGlobalDts(content: string): RegistryEntry[] {
  const entries: RegistryEntry[] = []
  for (const match of content.matchAll(GLOBAL_COMPONENT_RE))
    entries.push(createRegistryEntry(match[1]!, match[2]!))
  return entries
}

/**
 * The set of globally registered components. Only components listed here are
 * emitted, so the generated web-types can never disagree with `global.d.ts`.
 */
export class Registry {
  readonly entries: RegistryEntry[]
  private readonly byName = new Map<string, RegistryEntry>()
  private readonly byKey = new Map<string, RegistryEntry>()

  constructor(entries: RegistryEntry[]) {
    this.entries = entries
    entries.forEach((entry) => {
      this.byName.set(entry.name, entry)
      if (!this.byKey.has(entry.key))
        this.byKey.set(entry.key, entry)
    })
  }

  static fromNames(names: string[]) {
    return new Registry(names.map(name => createRegistryEntry(name)))
  }

  /** Lookup by exact global name, e.g. `ATextarea`. */
  get(name: string) {
    return this.byName.get(name)
  }

  /** Lookup by any spelling of the component name: `TextArea`, `text-area`, `textarea`. */
  lookup(text: string) {
    return this.byKey.get(normalizeKey(text))
  }
}

export async function loadRegistry(file: string) {
  const content = await fs.readFile(file, 'utf-8')
  const entries = parseGlobalDts(content)
  if (!entries.length)
    throw new Error(`No GlobalComponents declarations found in ${file}`)
  return new Registry(entries)
}
