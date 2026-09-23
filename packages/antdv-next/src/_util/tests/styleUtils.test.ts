import { describe, expect, it } from 'vitest'
import { normalizeStyle } from '../styleUtils'

describe('normalizeStyle', () => {
  it('keeps undefined/null/falsy as-is', () => {
    expect(normalizeStyle(undefined)).toBeUndefined()
    expect(normalizeStyle(null)).toBeUndefined()
    expect(normalizeStyle(false)).toBeUndefined()
  })

  it('passes object styles through untouched', () => {
    expect(normalizeStyle({ color: 'red', fontSize: 14 })).toEqual({ color: 'red', fontSize: 14 })
  })

  it('parses a cssText string into an object', () => {
    // Parsed keys are kept as written (Vue camelizes them when applying the
    // style object to the DOM, so kebab-case here is safe).
    expect(normalizeStyle('width: 40px; font-size: 14px; color: red')).toEqual({
      width: '40px',
      'font-size': '14px',
      color: 'red',
    })
  })

  it('keeps data URIs containing semicolons intact', () => {
    expect(normalizeStyle('background-image: url("data:image/svg+xml;utf8,<svg></svg>"); color: red')).toEqual({
      'background-image': 'url("data:image/svg+xml;utf8,<svg></svg>")',
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
