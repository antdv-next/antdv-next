import { afterEach, describe, expect, it, vi } from 'vitest'
import { computed, defineComponent, h, nextTick, ref } from 'vue'
import { createTheme } from '../src/theme'
import { mountWithStyleProvider } from './utils'

interface DesignToken {
  colorPrimary: string
  borderRadius: number
}

interface DerivativeToken extends DesignToken {
  colorPrimaryHover: string
}

const theme = ref<any>(createTheme<DesignToken, DerivativeToken>(token => ({
  ...token,
  colorPrimaryHover: `${token.colorPrimary}80`,
})))

describe('ssr style collector', () => {
  let setStyleCollector: ((next: { push: (styleText: string) => void } | null) => void) | null = null

  afterEach(() => {
    setStyleCollector?.(null)
    setStyleCollector = null
    vi.doUnmock('@v-c/util/dist/Dom/canUseDom')
  })

  it('collects css vars from useCacheToken during SSR', async () => {
    vi.resetModules()
    vi.doMock('@v-c/util/dist/Dom/canUseDom', () => ({
      default: () => false,
    }))

    const [{ default: useCacheToken }, ssrCollector] = await Promise.all([
      import('../src/hooks/useCacheToken'),
      import('../src/ssr/styleCollector'),
    ])
    setStyleCollector = ssrCollector.setStyleCollector

    const styles: string[] = []
    setStyleCollector!({
      push: (styleText) => {
        styles.push(styleText)
      },
    })

    const Demo = defineComponent({
      setup() {
        useCacheToken(
          theme,
          computed(() => [
            () => ({ colorPrimary: '#1677ff', borderRadius: 2 }),
          ]),
          computed(() => ({
            cssVar: {
              key: 'ssr-token',
              prefix: 'ssr',
            },
          })),
        )
        return () => h('div')
      },
    })

    const wrapper = mountWithStyleProvider(Demo)
    await nextTick()

    expect(styles.length).toBeGreaterThan(0)
    expect(styles.join('')).toContain('<style')
    expect(styles.join('')).toContain('--ssr-color-primary:#1677ff;')

    wrapper.unmount()
  })

  it('collects css vars from useCSSVarRegister during SSR', async () => {
    vi.resetModules()
    vi.doMock('@v-c/util/dist/Dom/canUseDom', () => ({
      default: () => false,
    }))

    const [{ default: useCSSVarRegister }, ssrCollector] = await Promise.all([
      import('../src/hooks/useCSSVarRegister'),
      import('../src/ssr/styleCollector'),
    ])
    setStyleCollector = ssrCollector.setStyleCollector

    const styles: string[] = []
    setStyleCollector!({
      push: (styleText) => {
        styles.push(styleText)
      },
    })

    const Demo = defineComponent({
      setup() {
        const config = ref({
          path: ['Component'],
          key: 'component',
          prefix: 'comp',
          token: { _tokenKey: 'token-key' },
        })

        useCSSVarRegister(config, () => ({
          primaryColor: '#fff',
          padding: 8,
        }))

        return () => h('div')
      },
    })

    const wrapper = mountWithStyleProvider(Demo)
    await nextTick()

    expect(styles.length).toBeGreaterThan(0)
    expect(styles.join('')).toContain('<style')
    expect(styles.join('')).toContain('--comp-primary-color:#fff;')

    wrapper.unmount()
  })
})
