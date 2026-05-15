import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import ConfigProvider from '..'
import Button from '../../button'

async function extractPrefixedButtonStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { prefixCls: 'ak', theme: { cssVar: true, hashed: false } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(Button, null, { default: () => 'Button' }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('ConfigProvider css variable prefix', () => {
  it('uses prefixCls as default css variable prefix', async () => {
    const styleText = await extractPrefixedButtonStyle()

    expect(styleText).toContain('--ak-color-text')
    expect(styleText).toContain('var(--ak-border-radius)')
    expect(styleText).not.toContain('--ant-color-text')
  })
})
