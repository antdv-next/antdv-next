import { describe, expect, it } from 'vitest'
import { normalizeStyle } from '../styleUtils'

describe('normalizeStyle', () => {
  it('keeps undefined/null as-is', () => {
    expect(normalizeStyle(undefined)).toBeUndefined()
    expect(normalizeStyle(null)).toBeUndefined()
  })

  it('keeps plain objects unchanged (camelCase preserved)', () => {
    expect(normalizeStyle({ color: 'red', fontSize: 14 })).toEqual({ color: 'red', fontSize: 14 })
  })

  it('passes object styles through untouched (Vue already normalizes object keys)', () => {
    expect(normalizeStyle({ color: 'red', fontSize: 14 })).toEqual({ color: 'red', fontSize: 14 })
  })

  it('parses a cssText string into a camelCased object', () => {
    expect(normalizeStyle('width: 40px; font-size: 14px; color: red')).toEqual({
      width: '40px',
      fontSize: '14px',
      color: 'red',
    })
  })

  it('skips malformed cssText items', () => {
    expect(normalizeStyle('width:; color: red; ;background:blue')).toEqual({ color: 'red', background: 'blue' })
  })

  it('merges an array of styles in order', () => {
    expect(normalizeStyle([{ color: 'red' }, 'width: 40px', { fontSize: 14 }])).toEqual({
      color: 'red',
      width: '40px',
      fontSize: 14,
    })
  })

  it('returns a spreadable object for a string (no numeric index keys)', () => {
    const normalized = normalizeStyle('width: 40px')
    // Spreading a raw string produces numeric keys ({0:'w',...}) which makes
    // Vue patchStyle throw "Failed to set an indexed property [0] on
    // 'CSSStyleDeclaration'"; normalized output must never do that.
    expect(Object.keys({ ...normalized })).not.toContain('0')
    expect(Object.keys({ ...normalized })).toEqual(['width'])
  })
})
