import type { HashPriority } from '../StyleContext'
import canUseDom from '@v-c/util/dist/Dom/canUseDom'
import { removeCSS, updateCSS } from '@v-c/util/dist/Dom/dynamicCSS'
import { ATTR_MARK, ATTR_TOKEN } from '../StyleContext'
import { Theme } from '../theme'
import hash from '../util/resolveHash'

export { token2CSSVar } from './css-variables'

// Create a cache for memo concat
type NestWeakMap<T> = WeakMap<object, NestWeakMap<T> | T>
const resultCache: NestWeakMap<object> = new WeakMap()
const RESULT_VALUE = {}

export function memoResult<T extends object, R>(
  callback: () => R,
  deps: T[],
): R {
  let current: WeakMap<any, any> = resultCache
  for (let i = 0; i < deps.length; i += 1) {
    const dep = deps[i]
    if (!current.has(dep)) {
      current.set(dep, new WeakMap())
    }
    current = current.get(dep)!
  }

  if (!current.has(RESULT_VALUE)) {
    current.set(RESULT_VALUE, callback())
  }

  return current.get(RESULT_VALUE)
}

// Create a cache here to avoid always loop generate
const flattenTokenCache = new WeakMap<any, string>()

/**
 * Flatten token to string, this will auto cache the result when token not change
 */
export function flattenToken(token: any) {
  let str = flattenTokenCache.get(token) || ''

  if (!str) {
    Object.keys(token).forEach((key) => {
      const value = token[key]
      str += key
      if (value instanceof Theme) {
        str += value.id
      }
      else if (value && typeof value === 'object') {
        str += flattenToken(value)
      }
      else {
        str += value
      }
    })

    // https://github.com/ant-design/ant-design/issues/48386
    // Should hash the string to avoid style tag name too long
    str = hash(str)

    // Put in cache
    flattenTokenCache.set(token, str)
  }
  return str
}

/**
 * Convert derivative token to key string
 */
export function token2key(token: any, salt: string): string {
  return hash(`${salt}_${flattenToken(token)}`)
}

const randomSelectorKey = `random-${Date.now()}-${Math.random()}`.replace(
  /\./g,
  '',
)

// Magic `content` for detect selector support
const checkContent = '_bAmBoO_'

function supportSelector(
  styleStr: string,
  handleElement: (ele: HTMLElement) => void,
  supportCheck?: (ele: HTMLElement) => boolean,
): boolean {
  if (canUseDom()) {
    updateCSS(styleStr, randomSelectorKey)

    const ele = document.createElement('div')
    ele.style.position = 'fixed'
    ele.style.left = '0'
    ele.style.top = '0'
    handleElement?.(ele)
    document.body.appendChild(ele)

    // @ts-expect-error this is prototype
    if (process.env.NODE_ENV !== 'production') {
      ele.innerHTML = 'Test'
      ele.style.zIndex = '9999999'
    }

    const support = supportCheck
      ? supportCheck(ele)
      : getComputedStyle(ele).content?.includes(checkContent)

    ele.parentNode?.removeChild(ele)
    removeCSS(randomSelectorKey)

    return support
  }

  return false
}

let canLayer: boolean | undefined
export function supportLayer(): boolean {
  if (canLayer === undefined) {
    canLayer = supportSelector(
      `@layer ${randomSelectorKey} { .${randomSelectorKey} { content: "${checkContent}"!important; } }`,
      (ele) => {
        ele.className = randomSelectorKey
      },
    )
  }

  return canLayer!
}

let canWhere: boolean | undefined
export function supportWhere(): boolean {
  if (canWhere === undefined) {
    canWhere = supportSelector(
      `:where(.${randomSelectorKey}) { content: "${checkContent}"!important; }`,
      (ele) => {
        ele.className = randomSelectorKey
      },
    )
  }

  return canWhere!
}

let canLogic: boolean | undefined
export function supportLogicProps(): boolean {
  if (canLogic === undefined) {
    canLogic = supportSelector(
      `.${randomSelectorKey} { inset-block: 93px !important; }`,
      (ele) => {
        ele.className = randomSelectorKey
      },
      ele => getComputedStyle(ele).bottom === '93px',
    )
  }

  return canLogic!
}

export const isClientSide = canUseDom()

export function unit(num: string | number) {
  if (typeof num === 'number') {
    return `${num}px`
  }
  return num
}

export function toStyleStr(
  style: string,
  tokenKey?: string,
  styleId?: string,
  customizeAttrs: Record<string, string> = {},
  plain = false,
) {
  if (plain) {
    return style
  }
  const attrs: Record<string, string | undefined> = {
    ...customizeAttrs,
    [ATTR_TOKEN]: tokenKey,
    [ATTR_MARK]: styleId,
  }

  const attrStr = Object.keys(attrs)
    .map((attr) => {
      const val = attrs[attr]
      return val ? `${attr}="${val}"` : null
    })
    .filter(v => v)
    .join(' ')

  return `<style ${attrStr}>${style}</style>`
}

export function where(options?: {
  hashPriority?: HashPriority
  hashCls?: string
}) {
  const { hashCls, hashPriority = 'low' } = options || {}
  if (!hashCls) {
    return ''
  }
  const hashSelector = `.${hashCls}`
  return hashPriority === 'low' ? `:where(${hashSelector})` : hashSelector
}

export function isNonNullable<T>(val: T): val is NonNullable<T> {
  return val !== undefined && val !== null
}

export { hash }
