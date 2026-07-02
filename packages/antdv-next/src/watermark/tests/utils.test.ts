import type { WatermarkFont } from '..'
import { describe, expect, it } from 'vitest'
import { getCanvasFont, getContentLines, getFontSize } from '../utils'

const baseFont: Required<WatermarkFont> = {
  color: 'rgba(0,0,0,.15)',
  fontSize: 16,
  fontWeight: 'normal',
  fontStyle: 'normal',
  fontFamily: 'sans-serif',
  textAlign: 'center',
}

// https://github.com/ant-design/ant-design/pull/57886
describe('watermark content lines', () => {
  it('normalizes string content into a single line using the base font', () => {
    expect(getContentLines('Ant Design', baseFont)).toEqual([
      { text: 'Ant Design', font: baseFont },
    ])
  })

  it('skips empty content', () => {
    expect(getContentLines(undefined, baseFont)).toEqual([])
  })

  it('merges per-line font over the base font and ignores undefined overrides', () => {
    const lines = getContentLines(
      [
        { text: 'Ant Design', font: { fontSize: 20, fontWeight: 'bold' } },
        { text: 'Happy Working', font: { fontFamily: 'serif', fontSize: 12, fontStyle: 'italic' } },
        { text: 'Fallback', font: { fontFamily: 'monospace', fontSize: undefined } },
        'Plain',
      ],
      baseFont,
    )

    expect(lines.map(line => getCanvasFont(line.font))).toEqual([
      'normal normal bold 20px sans-serif',
      'italic normal normal 12px serif',
      'normal normal normal 16px monospace',
      'normal normal normal 16px sans-serif',
    ])
    // undefined override falls back to base font size
    expect(lines[2]!.font.fontSize).toBe(16)
  })

  it('getCanvasFont applies ratio and line height', () => {
    expect(getCanvasFont(baseFont, 2, 64)).toBe('normal normal normal 32px/64px sans-serif')
    expect(getFontSize(baseFont, 2)).toBe(32)
  })
})
