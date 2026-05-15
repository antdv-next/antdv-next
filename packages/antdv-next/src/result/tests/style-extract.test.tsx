import { describe, expect, it } from 'vitest'
import { prepareComponentToken } from '../style'

describe('result style extract', () => {
  it('supports string heading font size tokens for derived icon size', async () => {
    const token = prepareComponentToken({
      fontSizeHeading3: '2rem',
      fontSize: 14,
      paddingLG: 24,
    } as any)

    expect(token.iconFontSize).toBe('calc(2rem * 3)')
  })
})
