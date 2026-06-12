import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import ConfigProvider from '..'

describe('configProvider icon style', () => {
  // https://github.com/ant-design/ant-design/issues/52412
  it('should keep spin animation styles when multiple icon prefixes coexist', async () => {
    const cache = createCache()
    const app = createSSRApp({
      render: () =>
        h(StyleProvider, { cache, mock: 'server' }, {
          default: () => [
            h(ConfigProvider, null, { default: () => h('span') }),
            h(ConfigProvider, { iconPrefixCls: 'customicon' }, { default: () => h('span') }),
          ],
        }),
    })

    await renderToString(app)

    const styleText = extractStyle(cache, { plain: true })

    expect(styleText).toContain('.anticon-spin{animation-name:loadingCircle;')
    expect(styleText).toContain('.customicon-spin{animation-name:loadingCircle;')
  })
})
