import type { LinterInfo } from '../src/linters/interface'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  contentQuotesLinter,
  hashedAnimationLinter,
  legacyNotSelectorLinter,
  logicalPropertiesLinter,
  NaNLinter,
  parentSelectorLinter,
} from '../src/linters'
import { lintWarning } from '../src/linters/utils'

const warningSpy = vi.hoisted(() => vi.fn())

vi.mock('@v-c/util/dist/warning', () => ({
  default: warningSpy,
  warning: warningSpy,
}))

const info: LinterInfo = {
  path: 'Button',
  hashId: 'hash-123',
  parentSelectors: ['.root', '& .child'],
}

describe('linters', () => {
  beforeEach(() => {
    warningSpy.mockReset()
  })

  it('formats lint warnings with path and selector', () => {
    lintWarning('test warning', info)

    expect(warningSpy).toHaveBeenCalledTimes(1)
    expect(warningSpy).toHaveBeenCalledWith(
      false,
      expect.stringContaining('Error in Button: test warning Selector: .root | & .child'),
    )
  })

  it('handles NaN linter for both string and number', () => {
    NaNLinter('width', 'calc(NaN * 1px)', info)
    NaNLinter('width', Number.NaN, info)
    NaNLinter('width', 12, info)

    expect(warningSpy).toHaveBeenCalledTimes(2)
  })

  it('validates content quotes', () => {
    contentQuotesLinter('content', 'plain-text', info)
    contentQuotesLinter('content', '"quoted"', info)
    contentQuotesLinter('content', 'var(--msg)', info)
    contentQuotesLinter('content', 'attr(data-label)', info)
    contentQuotesLinter('color', 'plain-text', info)

    expect(warningSpy).toHaveBeenCalledTimes(1)
    expect(warningSpy.mock.calls[0]?.[1]).toContain('without quotes')
  })

  it('warns hashed animation when hashId exists and animation is not none', () => {
    hashedAnimationLinter('animation', 'slide 1s', info)
    hashedAnimationLinter('animation', 'none', info)
    hashedAnimationLinter('color', 'slide 1s', info)
    hashedAnimationLinter('animation', 'slide 1s', { ...info, hashId: undefined })

    expect(warningSpy).toHaveBeenCalledTimes(1)
  })

  it('warns for concat :not selectors in legacy mode', () => {
    legacyNotSelectorLinter('color', 'red', {
      ...info,
      parentSelectors: ['.root', '&:not(a#id)'],
    })
    legacyNotSelectorLinter('color', 'red', {
      ...info,
      parentSelectors: ['.root', '&:not(.safe)'],
    })

    expect(warningSpy).toHaveBeenCalledTimes(1)
    expect(warningSpy.mock.calls[0]?.[1]).toContain(`Concat ':not' selector`)
  })

  it('warns for invalid parent selector usage', () => {
    parentSelectorLinter('color', 'red', {
      ...info,
      parentSelectors: ['&& .item'],
    })
    parentSelectorLinter('color', 'red', {
      ...info,
      parentSelectors: ['& .item'],
    })

    expect(warningSpy).toHaveBeenCalledTimes(1)
    expect(warningSpy.mock.calls[0]?.[1]).toContain('Should not use more than one `&`')
  })

  it('checks logical property compatibility for key and value patterns', () => {
    logicalPropertiesLinter('marginLeft', '8px', info)
    logicalPropertiesLinter('margin', '8px 4px 8px 12px', info)
    logicalPropertiesLinter('margin', '8px 4px 8px 4px', info)
    logicalPropertiesLinter('textAlign', 'left', info)
    logicalPropertiesLinter('borderRadius', '4px 8px', info)
    logicalPropertiesLinter('borderRadius', '4px 4px', info)
    logicalPropertiesLinter('color', 'red', info)

    expect(warningSpy).toHaveBeenCalledTimes(4)
    expect(warningSpy.mock.calls.every(call => String(call[1]).includes('RTL mode'))).toBe(true)
  })
})
