import { afterEach, describe, expect, it, vi } from 'vitest'
import { getTargetWaveColor, isValidWaveColor } from '../wave/util'

describe('wave util', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('filters transparent hex colors', () => {
    expect(isValidWaveColor('')).toBe(false)
    expect(isValidWaveColor('#0000')).toBe(false)
    expect(isValidWaveColor('#fff0')).toBe(false)
    expect(isValidWaveColor('#FFF0')).toBe(false)
    expect(isValidWaveColor('#00000000')).toBe(false)
    expect(isValidWaveColor('#ffffff00')).toBe(false)
    expect(isValidWaveColor('#000f')).toBe(true)
    expect(isValidWaveColor('#000000ff')).toBe(true)
    expect(isValidWaveColor('#00000080')).toBe(true)
  })

  it('falls back when the preferred color source is transparent', () => {
    const node = document.createElement('div')

    vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({
      color: '#0000',
      borderTopColor: '#1677ff',
      borderColor: '#52c41a',
      backgroundColor: '#faad14',
    } as CSSStyleDeclaration)

    expect(getTargetWaveColor(node, 'color')).toBe('#1677ff')
  })

  it('skips transparent hex colors in target color order', () => {
    const node = document.createElement('div')

    vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({
      borderTopColor: '#0000',
      borderColor: '#ffffff00',
      backgroundColor: '#faad14',
    } as CSSStyleDeclaration)

    expect(getTargetWaveColor(node)).toBe('#faad14')
  })
})
