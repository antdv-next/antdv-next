import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import useCSSVarRegister, { extract } from '../src/hooks/useCSSVarRegister'
import { ATTR_MARK } from '../src/StyleContext'
import { mountWithStyleProvider } from './utils'

// 延迟移除的时间，需要与 useGlobalCache.ts 中的 REMOVE_STYLE_DELAY 保持一致
const REMOVE_STYLE_DELAY = 500

describe('useCSSVarRegister', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    document
      .querySelectorAll(`style[${ATTR_MARK}]`)
      .forEach(style => style.parentNode?.removeChild(style))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('registers css vars and cleans up on unmount', async () => {
    let cacheRef: any

    const TestComponent = defineComponent({
      setup() {
        const config = ref({
          path: ['Component'],
          key: 'component',
          prefix: 'comp',
          token: { _tokenKey: 'token-key' },
        })

        cacheRef = useCSSVarRegister(config, () => ({
          primaryColor: '#fff',
          padding: 8,
        }))

        return () => h('div')
      },
    })

    const wrapper = mountWithStyleProvider(TestComponent)

    await nextTick()

    const cacheValue = cacheRef.value
    expect(cacheValue[0].primaryColor).toBe('var(--comp-primary-color)')
    expect(cacheValue[0].padding).toBe('var(--comp-padding)')

    const styleId = cacheValue[2]
    const style = document.querySelector(`style[${ATTR_MARK}="${styleId}"]`)
    expect(style).toBeTruthy()
    expect(style?.innerHTML).toContain('--comp-primary-color:#fff;')
    expect(style?.innerHTML).toContain('--comp-padding:8px;')

    wrapper.unmount()
    await nextTick()

    // 样式延迟移除，需要等待延迟时间
    vi.advanceTimersByTime(REMOVE_STYLE_DELAY)
    await nextTick()

    expect(document.querySelector(`style[${ATTR_MARK}="${styleId}"]`)).toBeNull()
  })

  it('extract serializes css var style', () => {
    const cacheValue: any = [
      { primary: 'var(--t-primary)' },
      '.component{--t-primary:#000;}',
      'style-id',
      'component',
    ]

    const result = extract(cacheValue, {})
    expect(result).toBeTruthy()
    expect(result?.[0]).toBe(-999)
    expect(result?.[1]).toBe('style-id')
    expect(result?.[2]).toContain('--t-primary:#000;')
  })
})
