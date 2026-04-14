import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Image from '..'
import ConfigProvider from '../../config-provider'

async function extractImageStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { theme: { hashed: false, cssVar: { key: 'image-test' } } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(Image, { src: 'https://example.com/test.png' }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('image style extract', () => {
  it('adds keyboard focus-visible styles for cover and preview actions', async () => {
    const styleText = await extractImageStyle()

    expect(styleText).toContain('.ant-image:hover .ant-image-cover,.ant-image:focus-visible .ant-image-cover')
    expect(styleText).toContain('.ant-image-preview-close:focus-visible')
    expect(styleText).toContain('.ant-image-preview-actions-action:focus-visible')
  })
})
