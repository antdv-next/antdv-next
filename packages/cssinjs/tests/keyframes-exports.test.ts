import { describe, expect, it } from 'vitest'
import * as cssinjsUtils from '../src/cssinjs-utils'
import * as cssinjs from '../src/index'
import Keyframes from '../src/Keyframes'
import * as theme from '../src/theme'

describe('keyframes and exports', () => {
  it('handles keyframe names with and without hash', () => {
    const keyframe = new Keyframes('fade-in', {
      from: { opacity: 0 },
      to: { opacity: 1 },
    })

    expect(keyframe._keyframe).toBe(true)
    expect(keyframe.getName()).toBe('fade-in')
    expect(keyframe.getName('hash')).toBe('hash-fade-in')
  })

  it('exposes cssinjs runtime exports', () => {
    expect(typeof cssinjs.createCache).toBe('function')
    expect(typeof cssinjs.useStyleRegister).toBe('function')
    expect(typeof cssinjs._experimental.supportModernCSS).toBe('function')
    expect(typeof cssinjs._experimental.supportModernCSS()).toBe('boolean')
  })

  it('exposes cssinjs-utils runtime exports', () => {
    expect(typeof cssinjsUtils.genStyleUtils).toBe('function')
    expect(typeof cssinjsUtils.mergeToken).toBe('function')
    expect(typeof cssinjsUtils.statisticToken).toBe('function')
    expect(cssinjsUtils.statistic).toBeTypeOf('object')
  })

  it('exposes theme module runtime exports', () => {
    expect(typeof theme.Theme).toBe('function')
    expect(typeof theme.ThemeCache).toBe('function')
    expect(typeof theme.createTheme).toBe('function')
    expect(typeof theme.genCalc).toBe('function')
  })
})
