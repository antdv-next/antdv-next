import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ATTR_MARK } from '../src/StyleContext'
import {
  ATTR_CACHE_MAP,
  CSS_FILE_STYLE,
  existPath,
  getStyleAndHash,
  prepare,
  reset,
  serialize,
} from '../src/util/cacheMapUtil'

describe('cacheMapUtil', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    reset(undefined as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
    reset(undefined as any)
  })

  it('serializes cache path map', () => {
    expect(
      serialize({
        a: '1',
        b: '2',
      }),
    ).toBe('a:1;b:2')
  })

  it('returns file style marker when style comes from css file', () => {
    reset({ button: 'hash-btn' }, true)

    expect(existPath('button')).toBe(true)
    expect(getStyleAndHash('button')).toEqual([CSS_FILE_STYLE, 'hash-btn'])
  })

  it('reads inline style content when style exists in head', () => {
    document.head.innerHTML = `<style ${ATTR_MARK}="hash-inline">.x{color:red;}</style>`
    reset({ inline: 'hash-inline' }, false)

    const [style, hash] = getStyleAndHash('inline')
    expect(hash).toBe('hash-inline')
    expect(style).toContain('color:red')
  })

  it('deletes stale cache path when style is missing', () => {
    reset({ stale: 'hash-stale' }, false)

    const [style, hash] = getStyleAndHash('stale')
    expect(style).toBeNull()
    expect(hash).toBe('hash-stale')
    expect(existPath('stale')).toBe(false)
  })

  it('loads cache paths from computed style and removes inline map style', () => {
    document.head.innerHTML = [
      `<style ${ATTR_CACHE_MAP}></style>`,
      `<style ${ATTR_MARK}="hash-a">.a{color:blue;}</style>`,
    ].join('')

    vi.spyOn(window, 'getComputedStyle').mockImplementation((ele) => {
      if ((ele as HTMLElement).className === ATTR_CACHE_MAP) {
        return {
          content: '"alpha:hash-a;beta:hash-b"',
        } as CSSStyleDeclaration
      }
      return {
        content: '',
      } as CSSStyleDeclaration
    })

    prepare()

    expect(document.querySelector(`style[${ATTR_CACHE_MAP}]`)).toBeNull()
    expect(existPath('alpha')).toBe(true)
    expect(existPath('beta')).toBe(true)

    const [style, hash] = getStyleAndHash('alpha')
    expect(hash).toBe('hash-a')
    expect(style).toContain('color:blue')
  })
})
