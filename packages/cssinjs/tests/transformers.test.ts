import { describe, expect, it } from 'vitest'
import autoPrefixTransformer, { AUTO_PREFIX } from '../src/transformers/autoPrefix'
import legacyLogicalPropertiesTransformer from '../src/transformers/legacyLogicalProperties'
import px2remTransformer from '../src/transformers/px2rem'

describe('transformers', () => {
  it('keeps autoPrefix transformer as shared object', () => {
    expect(autoPrefixTransformer).toBe(AUTO_PREFIX)
    expect(autoPrefixTransformer.visit).toBeUndefined()
  })

  it('transforms logical properties into legacy properties', () => {
    const output = legacyLogicalPropertiesTransformer.visit?.({
      inset: '1px 2px 3px',
      marginBlockStart: '4px',
      marginInline: '8px 16px !important',
      paddingInline: 10,
      borderInline: '1px solid red',
      insetInline: 'calc(100% - 10px) 6px',
      color: 'red',
    })

    expect(output).toMatchObject({
      top: { _skip_check_: true, value: '1px' },
      right: { _skip_check_: true, value: '2px' },
      bottom: { _skip_check_: true, value: '3px' },
      left: { _skip_check_: true, value: '2px' },
      marginTop: { _skip_check_: true, value: '4px' },
      marginLeft: { _skip_check_: true, value: '8px !important' },
      marginRight: { _skip_check_: true, value: '16px !important' },
      paddingLeft: { _skip_check_: true, value: 10 },
      paddingRight: { _skip_check_: true, value: 10 },
      borderLeft: { _skip_check_: true, value: '1px solid red' },
      borderRight: { _skip_check_: true, value: '1px solid red' },
      left: { _skip_check_: true, value: 'calc(100% - 10px)' },
      right: { _skip_check_: true, value: '6px' },
      color: 'red',
    })
  })

  it('converts px units to rem with precision and media query support', () => {
    const transformer = px2remTransformer({
      rootValue: 16,
      precision: 4,
      mediaQuery: true,
    })

    const output = transformer.visit?.({
      width: '32px',
      marginTop: 20,
      opacity: 1,
      lineHeight: 1.5,
      transform: 'translateX(0.5px)',
      background: 'url(20px.png) var(--x) 24px',
      '@media screen and (max-width: 320px)': {
        width: '16px',
      },
    })

    expect(output).toMatchObject({
      width: '2rem',
      marginTop: '1.25rem',
      opacity: 1,
      lineHeight: 1.5,
      transform: 'translateX(0.5px)',
      background: 'url(20px.png) var(--x) 1.5rem',
      '@media screen and (max-width: 20rem)': {
        width: '16px',
      },
    })
  })

  it('keeps media query keys when mediaQuery option is disabled', () => {
    const transformer = px2remTransformer({ mediaQuery: false })
    const output = transformer.visit?.({
      '@media (min-width: 160px)': {
        width: '80px',
      },
    })

    expect(output).toHaveProperty('@media (min-width: 160px)')
  })
})
