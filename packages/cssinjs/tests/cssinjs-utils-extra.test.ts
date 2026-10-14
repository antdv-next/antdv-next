import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import useUniqueMemo from '../src/cssinjs-utils/_util/hooks/useUniqueMemo'
import useCSP from '../src/cssinjs-utils/hooks/useCSP'
import getComponentToken from '../src/cssinjs-utils/util/getComponentToken'
import getDefaultComponentToken from '../src/cssinjs-utils/util/getDefaultComponentToken'
import genMaxMin from '../src/cssinjs-utils/util/maxmin'
import statisticToken, {
  merge,
  statistic,
} from '../src/cssinjs-utils/util/statistic'
import resolveUnitless from '../src/util/resolveUnitless'

const warningSpy = vi.hoisted(() => vi.fn())

vi.mock('@v-c/util/dist/warning', () => ({
  default: warningSpy,
  warning: warningSpy,
}))

describe('cssinjs-utils helpers', () => {
  beforeEach(() => {
    warningSpy.mockReset()
    Object.keys(statistic).forEach((key) => {
      delete statistic[key]
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('returns default csp ref', () => {
    const csp = useCSP()
    expect(csp.value).toEqual({})
  })

  it('gets component token with deprecated token fallback', () => {
    const token = {
      color: 'red',
      Button: {
        legacyColor: '#111',
        color: 'red',
      },
    } as any

    const mergedToken = getComponentToken(
      'Button',
      token,
      {
        color: '#fff',
        size: 12,
      },
      {
        deprecatedTokens: [['legacyColor', 'color']],
      },
    )

    expect(mergedToken).toEqual({
      size: 12,
      legacyColor: '#111',
    })
    expect(warningSpy).toHaveBeenCalledTimes(1)
  })

  it('gets default component token from object and function', () => {
    const token = {
      color: 'red',
      Button: {
        size: 16,
      },
    } as any

    expect(
      getDefaultComponentToken('Button', token, {
        color: 'blue',
      } as any),
    ).toEqual({ color: 'blue' })

    const fromFn = getDefaultComponentToken('Button', token, (merged: any) => ({
      size: merged.size,
      color: merged.color,
    }))

    expect(fromFn).toEqual({
      size: 16,
      color: 'red',
    })
  })

  it('generates max/min helpers for css and js', () => {
    const jsOps = genMaxMin('js')
    const cssOps = genMaxMin('css')

    expect(jsOps.max(1, 2, 3)).toBe(3)
    expect(jsOps.min(1, 2, 3)).toBe(1)
    expect(cssOps.max(1, '2em')).toBe('max(1px,2em)')
    expect(cssOps.min(4, '3rem')).toBe('min(4px,3rem)')
  })

  it('merges tokens with getter semantics', () => {
    const sourceA = { a: 1 }
    const sourceB = { b: 2, a: 5 }
    const merged = merge<any>(sourceA, null as any, sourceB)

    expect(merged.a).toBe(5)
    expect(merged.b).toBe(2)

    sourceB.a = 8
    expect(merged.a).toBe(8)
  })

  it('collects statistic token accesses and flushes component info', () => {
    const token = {
      color: 'red',
      size: 12,
    } as any
    const { token: proxyToken, keys, flush } = statisticToken(token)

    expect(keys).toBeInstanceOf(Set)
    expect(proxyToken.color).toBe('red')
    expect(proxyToken.size).toBe(12)

    flush('Button', { borderRadius: 4 })
    flush('Button', { padding: 8 })

    expect(statistic.Button?.global).toEqual(['color', 'size'])
    expect(statistic.Button?.component).toEqual({
      borderRadius: 4,
      padding: 8,
    })
  })

  it('falls back to no-proxy branch when Proxy is unavailable', () => {
    vi.stubGlobal('Proxy', undefined)

    const { token, keys, flush } = statisticToken({ color: 'red' } as any)
    expect(token.color).toBe('red')
    expect(keys).toBeUndefined()

    flush('Input', { size: 1 })
    expect(statistic.Input).toBeUndefined()
  })

  it('memoizes unique values and cleans stale entries over time', () => {
    const nowSpy = vi.spyOn(Date, 'now')
    let now = 0
    nowSpy.mockImplementation(() => now)

    const dep = {}
    expect(useUniqueMemo(() => 'first', [dep])).toBe('first')

    for (let i = 0; i < 10001; i += 1) {
      useUniqueMemo(() => `cached-${i}`, [dep])
    }

    now = 1000 * 60 * 10 + 1
    useUniqueMemo(() => 'fresh', [{}])
    expect(useUniqueMemo(() => 'recomputed', [dep])).toBe('recomputed')
  })

  it('exports resolved unitless map', () => {
    expect(resolveUnitless.lineHeight).toBe(1)
    expect(resolveUnitless.opacity).toBe(1)
  })
})
