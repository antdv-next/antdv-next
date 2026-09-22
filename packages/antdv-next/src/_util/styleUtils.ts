import { camelize } from 'vue'

export function formatUnit(value: string | number | undefined | null): string | undefined {
  if (value === undefined || value === null) {
    return undefined
  }
  if (typeof value === 'number') {
    return `${value}px`
  }
  if (typeof value === 'string' && !value.endsWith('px') && !Number.isNaN(Number(value))) {
    return `${value}px`
  }
  return value
}

/**
 * Normalize a user-provided `style` (string | object | array of them) into a
 * plain camelCase style object.
 *
 * Vue passes string styles through `props.style` untouched (a string is a
 * legal vnode style, applied as `cssText`), so components that spread or
 * merge the user style into an object must normalize it first: spreading a
 * string produces numeric keys (`{0:'w', 1:'i', ...}`) which makes Vue's
 * `patchStyle` throw "Failed to set an indexed property [0] on
 * 'CSSStyleDeclaration'".
 */
export function normalizeStyle(style?: unknown): Record<PropertyKey, unknown> | undefined {
  if (style === undefined || style === null || style === false) {
    return undefined
  }
  if (typeof style === 'string') {
    const ret: Record<PropertyKey, unknown> = {}
    for (const item of style.split(';')) {
      const idx = item.indexOf(':')
      if (idx <= 0)
        continue
      const key = item.slice(0, idx).trim()
      const val = item.slice(idx + 1).trim()
      if (key && val)
        ret[camelize(key)] = val
    }
    return ret
  }
  if (Array.isArray(style)) {
    const ret: Record<PropertyKey, unknown> = {}
    for (const item of style) {
      const normalized = normalizeStyle(item)
      if (normalized)
        Object.assign(ret, normalized)
    }
    return ret
  }
  if (typeof style === 'object') {
    return style as Record<PropertyKey, unknown>
  }
  return undefined
}
