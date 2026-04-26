import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import ConfigProvider from '../../config-provider'
import Typography from '../index'

async function extractTypographyStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { theme: { hashed: false, cssVar: { key: 'typography-test' } } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(Typography.Link, { disabled: true, copyable: true }, { default: () => 'Link' }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('typography style extract', () => {
  it('keeps action buttons interactive while disabled link is active', async () => {
    const styleText = await extractTypographyStyle()

    expect(styleText).toContain('.ant-typography.ant-typography-link[disabled]:active .ant-typography-actions')
    expect(styleText).toContain('pointer-events:auto;')
  })
})
