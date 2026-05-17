import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { SearchOutlined } from '@antdv-next/icons'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Button from '..'
import ConfigProvider from '../../config-provider'

async function extractButtonStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { theme: { hashed: false, cssVar: { key: 'button-test' } } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(Button, { icon: h(SearchOutlined) }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('button style extract', () => {
  it('vertically centers the icon glyph in icon-only buttons', async () => {
    const styleText = await extractButtonStyle()

    expect(styleText).toContain('.ant-btn-icon-only.ant-btn-compact-item')
    expect(styleText).toContain('.ant-btn .ant-btn-icon{display:inline-flex;align-items:center;justify-content:center;}')
  })
})
