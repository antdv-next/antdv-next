import { normalizeStyle as vueNormalizeStyle } from 'vue'

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
 * plain style object.
 *
 * Vue passes string styles through `props.style` untouched (a string is a
 * legal vnode style, applied as `cssText`), so components that spread or
 * merge the user style into an object must normalize it first: spreading a
 * string produces numeric keys (`{0:'w', 1:'i', ...}`) which makes Vue's
 * `patchStyle` throw "Failed to set an indexed property [0] on
 * 'CSSStyleDeclaration'".
 *
 * Delegates to Vue's own `normalizeStyle`, which merges arrays (parsing each
 * string entry with its parenthesis-aware cssText split, so values like
 * `background-image: url("data:image/svg+xml;...")` stay intact). The only
 * addition here is parsing a *top-level* string, which Vue intentionally
 * leaves as-is because `patchStyle` can apply it directly as `cssText`.
 */
export function normalizeStyle(style?: unknown): Record<PropertyKey, unknown> | undefined {
  const normalized = vueNormalizeStyle(style as any)
  if (typeof normalized === 'string') {
    return vueNormalizeStyle([normalized]) as Record<PropertyKey, unknown>
  }
  return normalized || undefined
}
