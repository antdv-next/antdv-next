import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import createTheme from '../src/theme/createTheme'
import Theme from '../src/theme/Theme'
import ThemeCache, { sameDerivativeOption } from '../src/theme/ThemeCache'

const warningSpy = vi.hoisted(() => vi.fn())

vi.mock('@v-c/util/dist/warning', () => ({
  default: warningSpy,
  warning: warningSpy,
}))

function createDerivative(seed = 1) {
  return (token: { base: number }, prev?: Record<string, number>) => ({
    ...(prev || {}),
    value: token.base + seed,
  })
}

describe('theme and theme cache', () => {
  let maxSize: number
  let maxOffset: number

  beforeEach(() => {
    warningSpy.mockReset()
    maxSize = ThemeCache.MAX_CACHE_SIZE
    maxOffset = ThemeCache.MAX_CACHE_OFFSET
  })

  afterEach(() => {
    ThemeCache.MAX_CACHE_SIZE = maxSize
    ThemeCache.MAX_CACHE_OFFSET = maxOffset
  })

  it('compares derivative options', () => {
    const fn1 = createDerivative(1)
    const fn2 = createDerivative(2)

    expect(sameDerivativeOption([fn1], [fn1])).toBe(true)
    expect(sameDerivativeOption([fn1], [fn2])).toBe(false)
    expect(sameDerivativeOption([fn1, fn2], [fn1])).toBe(false)
  })

  it('warns when derivative function has zero args', () => {
    const theme = new Theme(() => ({ ready: 1 } as any))
    expect(theme.getDerivativeToken({} as any)).toEqual({ ready: 1 })
    expect(warningSpy).toHaveBeenCalledTimes(1)
  })

  it('derives token with derivative chain', () => {
    const first = (token: { base: number }) => ({ a: token.base + 1 })
    const second = (token: { base: number }, prev?: { a: number }) => ({
      ...prev,
      b: (prev?.a || 0) + token.base,
    })

    const theme = new Theme([first, second])
    expect(theme.getDerivativeToken({ base: 2 })).toEqual({
      a: 3,
      b: 5,
    })
  })

  it('stores, gets and deletes nested cache values', () => {
    const cache = new ThemeCache()
    const fnA = createDerivative(1)
    const fnB = createDerivative(2)
    const fnC = createDerivative(3)
    const themeA = new Theme(fnA)
    const themeB = new Theme(fnB)

    cache.set([fnA, fnB], themeA)
    cache.set([fnA, fnC], themeB)

    expect(cache.has([fnA, fnB])).toBe(true)
    expect(cache.get([fnA, fnB])).toBe(themeA)
    expect(cache.delete([fnA, fnB])).toBe(themeA)
    expect(cache.has([fnA, fnB])).toBe(false)
    expect(cache.has([fnA, fnC])).toBe(true)
    expect(cache.delete([fnB, fnC])).toBeUndefined()
  })

  it('evicts least recently used entries when exceeding limits', () => {
    ThemeCache.MAX_CACHE_SIZE = 1
    ThemeCache.MAX_CACHE_OFFSET = 0

    const cache = new ThemeCache()
    const fnA = createDerivative(1)
    const fnB = createDerivative(2)
    const themeA = new Theme(fnA)
    const themeB = new Theme(fnB)

    cache.set([fnA], themeA)
    cache.set([fnB], themeB)

    expect(cache.size()).toBe(1)
    expect(cache.has([fnA])).toBe(false)
    expect(cache.get([fnB])).toBe(themeB)
  })

  it('reuses cached theme instances in createTheme', () => {
    const derivative = createDerivative(1)
    const another = createDerivative(2)

    const themeA = createTheme(derivative)
    const themeB = createTheme([derivative])
    const themeC = createTheme([another])

    expect(themeA).toBe(themeB)
    expect(themeA).not.toBe(themeC)
  })
})
