import type { ComponentToken } from '../style'
import { describe, expect, it } from 'vitest'
import { prepareComponentToken } from '../style'

// `GetDefaultToken` also allows a static token object; Result provides a function.
const getResultToken = prepareComponentToken as (token: any) => ComponentToken

describe('result style extract', () => {
  it('supports string heading font size tokens for derived icon size', async () => {
    const token = getResultToken({
      fontSizeHeading3: '2rem',
      fontSize: 14,
      paddingLG: 24,
    } as any)

    expect(token.iconFontSize).toBe('calc(2rem * 3)')
  })
})
