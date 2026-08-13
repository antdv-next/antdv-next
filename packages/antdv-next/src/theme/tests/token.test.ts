import { describe, expect, it } from 'vitest'
import theme from '..'

describe('theme tokens', () => {
  it('derives shadow aliases from the dark theme shadow token', () => {
    const token = theme.getDesignToken({
      algorithm: theme.darkAlgorithm,
    })

    expect(token.boxShadow).toContain('rgba(255,255,255,')
    expect(token.boxShadowPopoverArrow).toContain('rgba(255,255,255,')
    expect(token.boxShadowTabsOverflowLeft).toContain('rgba(255,255,255,')
  })

  it('focusOutline true derives lineWidthFocus from lineWidth', () => {
    const token = theme.getDesignToken()

    expect(token.lineWidthFocus).toBe(token.lineWidth * 3)
  })

  it('focusOutline false token', () => {
    const token = theme.getDesignToken({ token: { focusOutline: false } })

    expect(token.lineWidthFocus).toBe(0)
  })
})
