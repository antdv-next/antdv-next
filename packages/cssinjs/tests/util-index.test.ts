import { afterEach, describe, expect, it, vi } from 'vitest'
import resolveHash from '../src/util/resolveHash'

describe('util/index', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.resetModules()
    document.body.innerHTML = ''
    document.head.innerHTML = ''
  })

  it('returns false support checks when DOM is unavailable', async () => {
    const updateCSS = vi.fn()
    const removeCSS = vi.fn()

    vi.doMock('@v-c/util/dist/Dom/canUseDom', () => ({
      default: () => false,
    }))
    vi.doMock('@v-c/util/dist/Dom/dynamicCSS', () => ({
      updateCSS,
      removeCSS,
    }))

    const util = await import('../src/util/index')

    expect(util.isClientSide).toBe(false)
    expect(util.supportLayer()).toBe(false)
    expect(util.supportWhere()).toBe(false)
    expect(util.supportLogicProps()).toBe(false)
    expect(updateCSS).not.toHaveBeenCalled()
    expect(removeCSS).not.toHaveBeenCalled()
  })

  it('checks selector support once and caches the result', async () => {
    const updateCSS = vi.fn()
    const removeCSS = vi.fn()

    vi.doMock('@v-c/util/dist/Dom/canUseDom', () => ({
      default: () => true,
    }))
    vi.doMock('@v-c/util/dist/Dom/dynamicCSS', () => ({
      updateCSS,
      removeCSS,
    }))

    vi.spyOn(window, 'getComputedStyle').mockImplementation(() => ({
      content: '"_bAmBoO_"',
      bottom: '93px',
    }) as CSSStyleDeclaration)

    const util = await import('../src/util/index')

    expect(util.supportLayer()).toBe(true)
    expect(util.supportLayer()).toBe(true)
    expect(util.supportWhere()).toBe(true)
    expect(util.supportWhere()).toBe(true)
    expect(util.supportLogicProps()).toBe(true)
    expect(util.supportLogicProps()).toBe(true)

    expect(updateCSS).toHaveBeenCalledTimes(3)
    expect(removeCSS).toHaveBeenCalledTimes(3)
  })

  it('memoizes results and handles token/hash helpers', async () => {
    const util = await import('../src/util/index')
    const { default: Theme } = await import('../src/theme/Theme')

    const dep = {}
    let called = 0
    const callback = () => ++called

    expect(util.memoResult(callback, [dep])).toBe(1)
    expect(util.memoResult(callback, [dep])).toBe(1)
    expect(called).toBe(1)

    const theme = new Theme((token: any) => token)
    const token = {
      color: 'red',
      nested: { size: 12 },
      theme,
    }

    const flattened = util.flattenToken(token)
    token.color = 'blue'
    expect(util.flattenToken(token)).toBe(flattened)
    expect(util.token2key(token, 'salt')).toBe(resolveHash(`salt_${flattened}`))
  })

  it('formats style tags and helper outputs', async () => {
    const util = await import('../src/util/index')

    expect(util.unit(12)).toBe('12px')
    expect(util.unit('1em')).toBe('1em')

    expect(
      util.toStyleStr('.a{color:red}', 'tk', 'sid', { nonce: 'abc' }),
    ).toContain('nonce="abc"')
    expect(util.toStyleStr('raw-style', undefined, undefined, {}, true)).toBe(
      'raw-style',
    )

    expect(util.where()).toBe('')
    expect(util.where({ hashCls: 'hash', hashPriority: 'low' })).toBe(
      ':where(.hash)',
    )
    expect(util.where({ hashCls: 'hash', hashPriority: 'high' })).toBe('.hash')

    expect(util.isNonNullable(0)).toBe(true)
    expect(util.isNonNullable('')).toBe(true)
    expect(util.isNonNullable(null)).toBe(false)
    expect(util.isNonNullable(undefined)).toBe(false)
    expect(util.hash('abc')).toBe(resolveHash('abc'))
  })
})
