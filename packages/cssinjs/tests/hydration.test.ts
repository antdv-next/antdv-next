import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { reset as resetCacheMap } from '../src/util/cacheMapUtil'

describe('cssinjs hydration', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    resetCacheMap(undefined as any)
  })

  afterEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
    resetCacheMap(undefined as any)
    vi.restoreAllMocks()
  })

  it('reuses SSR style during hydration without duplicating style tags', async () => {
    vi.resetModules()
    const actualDynamicCSS = await vi.importActual<typeof import('@v-c/util/dist/Dom/dynamicCSS')>('@v-c/util/dist/Dom/dynamicCSS')
    const updateCSSSpy = vi.fn(actualDynamicCSS.updateCSS)

    vi.doMock('@v-c/util/dist/Dom/dynamicCSS', () => ({
      ...actualDynamicCSS,
      updateCSS: updateCSSSpy,
    }))

    const [{ ATTR_MARK, createCache, StyleProvider }, { default: useStyleRegister }] = await Promise.all([
      import('../src'),
      import('../src/hooks/useStyleRegister'),
    ])

    const theme = {} as any
    const token = { _tokenKey: 'hydration-token' }

    const Demo = defineComponent({
      setup() {
        const info = ref({
          theme,
          token,
          path: ['.hydrate-box'],
        })

        useStyleRegister(info, () => ({
          '.hydrate-box': {
            color: 'purple',
          },
        }))

        return () => h('div', { class: 'hydrate-box' }, 'hydration')
      },
    })

    const ssrCache = createCache()
    const ssrHtml = await renderToString(createSSRApp(() =>
      h(StyleProvider, { cache: ssrCache, mock: 'server' }, () => h(Demo)),
    ))

    const [styleKey] = Array.from(ssrCache.cache.keys()).filter(key => key.startsWith('style%'))
    expect(styleKey).toBeTruthy()

    const styleCacheEntry = ssrCache.cache.get(styleKey!)?.[1] as [string, string]
    const [styleStr, styleId] = styleCacheEntry
    const cachePath = styleKey!.replace(/^style%/, '').replace(/%/g, '|')

    document.head.innerHTML = `<style ${ATTR_MARK}="${styleId}">${styleStr}</style>`
    resetCacheMap({ [cachePath]: styleId }, false)

    const container = document.createElement('div')
    container.innerHTML = ssrHtml
    document.body.appendChild(container)

    const clientCache = createCache()
    const app = createSSRApp(() =>
      h(StyleProvider, { cache: clientCache }, () => h(Demo)),
    )

    app.mount(container)
    await nextTick()
    await nextTick()

    const hydrationWrites = updateCSSSpy.mock.calls.filter(([, currentStyleId]) => currentStyleId === styleId)

    expect(hydrationWrites).toHaveLength(1)
    expect(document.querySelectorAll(`style[${ATTR_MARK}="${styleId}"]`)).toHaveLength(1)
    expect(document.head.innerHTML).toContain('color:purple')

    app.unmount()
  })
})
