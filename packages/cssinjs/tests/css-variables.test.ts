import type { InjectionKey, PropType, Ref } from 'vue'
import hash from '@emotion/hash'
import { beforeEach, describe, expect, it } from 'vitest'
import {
  computed,
  defineComponent,
  h,
  inject,
  nextTick,
  provide,
  ref,
} from 'vue'
import extractStyle from '../src/extractStyle'
import useCSSVarRegister from '../src/hooks/useCSSVarRegister'
import useStyleRegister from '../src/hooks/useStyleRegister'
import { ATTR_MARK, createCache } from '../src/StyleContext'
import { createTheme } from '../src/theme'
import { token2key, unit } from '../src/util'
import { mountWithStyleProvider } from './utils'

interface DesignToken {
  primaryColor: string
  textColor: string
  borderRadius: number
  borderColor: string
  borderWidth: number
  lineHeight: number
  lineHeightBase: number
  smallScreen: number
}

interface DerivativeToken extends DesignToken {
  primaryColorDisabled: string
}

interface CSSVarConfig {
  key: string
  prefix?: string
  unitless?: Record<string, boolean>
  ignore?: Record<string, boolean>
  preserve?: Record<string, boolean>
}

interface DesignTokenContextValue {
  token: DesignToken
  hashed: boolean
  cssVar?: CSSVarConfig
}

const defaultDesignToken: DesignToken = {
  primaryColor: '#1890ff',
  textColor: '#333333',
  borderRadius: 2,
  borderColor: 'black',
  borderWidth: 1,
  lineHeight: 1.5,
  lineHeightBase: 1.5,
  smallScreen: 800,
}

function derivative(designToken: DesignToken): DerivativeToken {
  return {
    ...designToken,
    primaryColorDisabled: designToken.primaryColor,
  }
}

const theme = createTheme<DesignToken, DerivativeToken>(derivative)

function createDefaultContext(): DesignTokenContextValue {
  return {
    token: { ...defaultDesignToken },
    hashed: true,
  }
}

const DesignTokenSymbol: InjectionKey<Ref<DesignTokenContextValue>>
  = Symbol('DesignTokenContext')

const DesignTokenProvider = defineComponent({
  name: 'DesignTokenProvider',
  props: {
    theme: {
      type: Object as PropType<{
        token?: Partial<DesignToken>
        hashed?: boolean
        cssVar?: CSSVarConfig
      }>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    const parent = inject(DesignTokenSymbol, ref(createDefaultContext()))

    const merged = computed<DesignTokenContextValue>(() => {
      const nextToken: DesignToken = {
        ...parent.value.token,
        ...(props.theme.token || {}),
      }

      return {
        token: nextToken,
        hashed: props.theme.hashed ?? parent.value.hashed,
        cssVar: props.theme.cssVar,
      }
    })

    provide(DesignTokenSymbol, merged)

    return () => slots.default?.()
  },
})

function useDesignTokenContext() {
  return inject(DesignTokenSymbol, ref(createDefaultContext()))
}

function getComponentToken() {
  return {
    boxColor: '#5c21ff',
  }
}

function useStyle(componentScope?: string | string[]) {
  const context = useDesignTokenContext()

  const mergedToken = computed<DesignToken>(() => ({
    ...defaultDesignToken,
    ...context.value.token,
  }))

  const rawDerivative = computed<DerivativeToken>(() =>
    theme.getDerivativeToken(mergedToken.value),
  )
  const cssVarConfig = computed(() => context.value.cssVar)
  const tokenKey = computed(() => token2key(rawDerivative.value, cssVarConfig?.value?.prefix ?? 'rc'))

  const cssVarKey = computed(() => cssVarConfig.value?.key ?? '')
  const cssVarPrefix = computed(() => cssVarConfig.value?.prefix ?? 'rc')

  const baseToken = computed(() => ({
    ...rawDerivative.value,
    _tokenKey: tokenKey.value,
  })) as Ref<DerivativeToken & { _tokenKey: string }>

  const globalCssVars = useCSSVarRegister(
    computed(() => ({
      path: ['Token'],
      key: cssVarKey.value,
      prefix: cssVarPrefix.value,
      unitless: {
        lineHeight: true,
        ...(cssVarConfig.value?.unitless || {}),
      },
      ignore: {
        lineHeightBase: true,
        ...(cssVarConfig.value?.ignore || {}),
      },
      preserve: {
        smallScreen: true,
        ...(cssVarConfig.value?.preserve || {}),
      },
      token: baseToken.value,
    })),
    () => (cssVarKey.value ? { ...rawDerivative.value } : {} as any),
  )

  const componentCssVars = useCSSVarRegister(
    computed(() => ({
      path: ['Box'],
      key: cssVarKey.value,
      prefix: 'rc-box',
      token: baseToken.value,
      scope: componentScope ?? 'box',
    })),
    () => (cssVarKey.value ? getComponentToken() : {}),
  )

  const styleToken = computed(() => {
    if (cssVarKey.value) {
      const [varToken] = globalCssVars.value
      return {
        ...varToken,
        _tokenKey: tokenKey.value,
      } as DerivativeToken & { _tokenKey: string }
    }
    return baseToken.value
  })

  const hashId = computed(() => (
    context.value.hashed ? `hash-${hash(tokenKey.value)}` : ''
  ))

  useStyleRegister(
    computed(() => ({
      theme,
      token: styleToken.value,
      hashId: hashId.value,
      path: ['Box'],
    })),
    () => {
      const [componentToken] = cssVarKey.value
        ? componentCssVars.value
        : [getComponentToken()]

      const merged = {
        ...styleToken.value,
        ...componentToken,
      } as DerivativeToken & {
        boxColor: string
        _tokenKey: string
      }

      return {
        '.box': {
          lineHeight: merged.lineHeight,
          border: `${unit(merged.borderWidth)} solid ${merged.borderColor}`,
          color: merged.boxColor,
          backgroundColor: merged.primaryColor,
          content: `"${merged.smallScreen}"`,
        },
      }
    },
  )

  const cls = computed(() => {
    const classes = ['box']
    if (hashId.value) {
      classes.push(hashId.value)
    }
    if (cssVarKey.value) {
      classes.push(cssVarKey.value)
    }
    return classes.join(' ')
  })

  return {
    cls,
  }
}

const Box = defineComponent({
  name: 'Box',
  props: {
    className: {
      type: String,
      default: '',
    },
    componentScope: {
      type: [String, Array] as PropType<string | string[]>,
      default: undefined,
    },
  },
  setup(props) {
    const { cls } = useStyle(props.componentScope)
    return () =>
      h('div', {
        class: [cls.value, props.className].filter(Boolean).join(' '),
      })
  },
})

describe('css variables', () => {
  beforeEach(() => {
    document
      .querySelectorAll(`style[${ATTR_MARK}]`)
      .forEach(style => style.parentNode?.removeChild(style))
  })

  it('should register css vars with theme key', async () => {
    const App = defineComponent({
      setup() {
        return () =>
          h(DesignTokenProvider, { theme: { cssVar: { key: 'apple' } } }, () =>
            h(Box, { className: 'target' }))
      },
    })

    const wrapper = mountWithStyleProvider(App)
    await nextTick()

    const styles = Array.from(
      document.querySelectorAll(`style[${ATTR_MARK}]`),
    )

    expect(styles.length).toBe(3)
    expect(styles.some(style => style.innerHTML.includes('.apple{'))).toBe(true)
    expect(styles.some(style => style.innerHTML.includes('--rc-line-height:1.5;')))
      .toBe(true)
    expect(styles.some(style => style.innerHTML.includes('--rc-box-box-color:#5c21ff')))
      .toBe(true)
    expect(styles.some(style => style.innerHTML.includes('line-height:var(--rc-line-height);')))
      .toBe(true)

    const box = wrapper.find('.target').element as HTMLElement
    expect(box.className).toContain('apple')
    expect(box.className).toMatch(/hash-/)
    expect(box).toHaveStyle('--rc-line-height: 1.5')
    expect(box).toHaveStyle('line-height: var(--rc-line-height)')

    wrapper.unmount()
  })

  it('mixes css var and non css var scopes', async () => {
    const App = defineComponent({
      setup() {
        return () => [
          h(Box, { className: 'non-css-var' }),
          h(DesignTokenProvider, {
            theme: {
              token: { primaryColor: '#1677ff' },
              cssVar: { key: 'apple' },
            },
          }, () => [
            h(Box, { className: 'css-var' }),
            h(DesignTokenProvider, {
              theme: {
                token: { borderWidth: 2 },
                cssVar: { key: 'banana' },
              },
            }, () => h(Box, { className: 'css-var-2' })),
            h(DesignTokenProvider, {
              theme: {
                token: { borderWidth: 3 },
              },
            }, () => h(Box, { className: 'non-css-var-2' })),
          ]),
        ]
      },
    })

    const wrapper = mountWithStyleProvider(App)
    await nextTick()

    const styles = Array.from(
      document.querySelectorAll(`style[${ATTR_MARK}]`),
    )
    expect(styles.length).toBeGreaterThanOrEqual(7)

    const nonCssVarBox = wrapper.find('.non-css-var').element as HTMLElement
    expect(nonCssVarBox.className).not.toContain('apple')
    expect(window.getComputedStyle(nonCssVarBox).lineHeight).toBe('1.5')

    const cssVarBox = wrapper.find('.css-var').element as HTMLElement
    expect(cssVarBox.className).toContain('apple')
    expect(window.getComputedStyle(cssVarBox).getPropertyValue('--rc-line-height')).toBe('1.5')

    const cssVarBox2 = wrapper.find('.css-var-2').element as HTMLElement
    expect(cssVarBox2.className).toContain('banana')
    expect(cssVarBox2.className).not.toContain('apple')
    expect(window.getComputedStyle(cssVarBox2).getPropertyValue('--rc-border-width')).toBe('2px')

    const nonCssVarBox2 = wrapper.find('.non-css-var-2').element as HTMLElement
    expect(nonCssVarBox2.className).not.toContain('banana')
    expect(nonCssVarBox2.className).not.toContain('apple')

    wrapper.unmount()
  })

  it('reacts to token changes', async () => {
    const overrideToken = ref<Partial<DesignToken>>({})

    const App = defineComponent({
      setup() {
        return () =>
          h(DesignTokenProvider, {
            theme: {
              token: overrideToken.value,
              cssVar: { key: 'apple' },
            },
          }, () => h(Box, { className: 'target' }))
      },
    })

    const wrapper = mountWithStyleProvider(App)
    await nextTick()

    const boxWrapper = wrapper.find('.target')
    const initialHash = boxWrapper.classes().find(cls => cls.startsWith('hash-'))

    let styles = Array.from(document.querySelectorAll(`style[${ATTR_MARK}]`))
    expect(styles.length).toBe(3)
    const initialStyleContent = styles.map(style => style.innerHTML).join('\n')
    expect(initialStyleContent).toMatch(/--rc-line-height:1\.5/)

    overrideToken.value = { lineHeight: 2 }
    await nextTick()

    styles = Array.from(document.querySelectorAll(`style[${ATTR_MARK}]`))
    expect(styles.length).toBeGreaterThanOrEqual(3)
    const updatedHash = boxWrapper.classes().find(cls => cls.startsWith('hash-'))
    expect(updatedHash).not.toBe(initialHash)
    const updatedStyleContent = styles.map(style => style.innerHTML).join('\n')
    expect(updatedStyleContent).toMatch(/--rc-line-height:2/)

    wrapper.unmount()
  })

  it('keeps styles when autoClear is enabled', async () => {
    const App = defineComponent({
      setup() {
        const show = ref(true)
        const toggle = () => {
          show.value = !show.value
        }
        return {
          show,
          toggle,
        }
      },
      render() {
        return h(DesignTokenProvider, { theme: { cssVar: { key: 'apple' } } }, () =>
          this.show ? h(Box, { className: 'target' }) : h('div'))
      },
    })

    const wrapper = mountWithStyleProvider(App, { autoClear: true })
    await nextTick()

    let styles = Array.from(document.querySelectorAll(`style[${ATTR_MARK}]`))
    expect(styles.length).toBe(3)

    const appVm = wrapper.findComponent(App).vm as any
    appVm.toggle()
    await nextTick()

    styles = Array.from(document.querySelectorAll(`style[${ATTR_MARK}]`))
    expect(styles.length).toBeGreaterThan(0)

    wrapper.unmount()
  })

  it('supports ssr extraction', async () => {
    const cache = createCache()

    const App = defineComponent({
      setup() {
        return () =>
          h(DesignTokenProvider, { theme: { cssVar: { key: 'apple' } } }, () =>
            h(Box, { className: 'target' }))
      },
    })

    const wrapper = mountWithStyleProvider(App, { cache, mock: 'server' })
    await nextTick()

    const extracted = extractStyle(cache, { plain: true })
    expect(extracted).toContain('--rc-line-height:1.5;')
    expect(extracted).toContain('line-height:var(--rc-line-height)')

    wrapper.unmount()
  })

  it('generates new style when css var prefix changes', async () => {
    const config = ref({
      cssVar: { key: 'apple', prefix: 'app' as string },
    })

    const App = defineComponent({
      setup() {
        return () =>
          h(DesignTokenProvider, { theme: config.value }, () =>
            h(Box, { className: 'target' }))
      },
    })

    const wrapper = mountWithStyleProvider(App)
    await nextTick()

    let styles = Array.from(document.querySelectorAll(`style[${ATTR_MARK}]`))
    const initialPrefixContent = styles.map(style => style.innerHTML).join('\n')
    expect(styles.length).toBe(3)
    expect(initialPrefixContent).toMatch(/var\(--app-/)
    expect(initialPrefixContent).not.toMatch(/var\(--bank-/)

    config.value = { cssVar: { key: 'apple', prefix: 'bank' } }
    await nextTick()
    styles = Array.from(document.querySelectorAll(`style`))
    const updatedPrefixContent = styles.map(style => style.textContent).join('\n')
    expect(styles.length).toBe(4)
    expect(updatedPrefixContent).toMatch(/var\(--app-/)
    expect(updatedPrefixContent).toMatch(/var\(--bank-/)

    wrapper.unmount()
  })

  it('extracts css var independently', async () => {
    const cache = createCache()

    const App = defineComponent({
      setup() {
        return () =>
          h(DesignTokenProvider, { theme: { cssVar: { key: 'apple' } } }, () =>
            h(Box, { className: 'target' }))
      },
    })

    const wrapper = mountWithStyleProvider(App, { cache, mock: 'server' })
    await nextTick()

    const cssVarStyle = extractStyle(cache, {
      types: ['cssVar', 'token'],
      plain: true,
    })
    const styleStyle = extractStyle(cache, { types: 'style', plain: true })

    expect(cssVarStyle).toContain('--rc-line-height:1.5;')
    expect(cssVarStyle).not.toContain('line-height:var(--rc-line-height)')
    expect(styleStyle).toContain('line-height:var(--rc-line-height)')

    wrapper.unmount()
  })

  it('supports multiple scope', async () => {
    const App = defineComponent({
      setup() {
        return () =>
          h(DesignTokenProvider, { theme: { cssVar: { key: 'apple' } } }, () =>
            h(Box, { className: 'target', componentScope: ['box', 'container'] }))
      },
    })

    const wrapper = mountWithStyleProvider(App)
    await nextTick()

    const styles = Array.from(document.querySelectorAll(`style[${ATTR_MARK}]`))
    expect(styles.length).toBe(3)

    const cssVarStyle = styles.find(style => style.innerHTML.includes('--rc-box-box-color'))
    const cssVarText = cssVarStyle?.innerHTML ?? ''

    expect(cssVarStyle).toBeDefined()
    expect(cssVarText).toContain('--rc-box-box-color:#5c21ff')
    expect(cssVarText).toMatch(/\.apple\.box/)
    expect(cssVarText).toMatch(/\.apple\.container/)
    expect(cssVarText).toMatch(/\.apple\.box\s*,[^{}]*\.apple\.container/)

    wrapper.unmount()
  })

  it('filters empty scopes', async () => {
    const App = defineComponent({
      setup() {
        return () =>
          h(DesignTokenProvider, { theme: { cssVar: { key: 'orange' } } }, () =>
            h(Box, { className: 'target', componentScope: ['box', '', 'container'] }))
      },
    })

    const wrapper = mountWithStyleProvider(App)
    await nextTick()

    const styles = Array.from(document.querySelectorAll(`style[${ATTR_MARK}]`))
    const cssVarStyle = styles.find(style => style.innerHTML.includes('--rc-box-box-color'))
    const cssVarText = cssVarStyle?.innerHTML ?? ''

    expect(cssVarStyle).toBeDefined()
    expect(cssVarText).not.toMatch(/\.orange\.\{/)
    expect(cssVarText).toMatch(/\.orange\.box/)
    expect(cssVarText).toMatch(/\.orange\.container/)
    expect(cssVarText).toMatch(/\.orange\.box\s*,[^{}]*\.orange\.container/)

    wrapper.unmount()
  })
})
