import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Transfer from '..'
import ConfigProvider from '../../config-provider'

async function extractTransferStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { theme: { hashed: false, cssVar: { key: 'transfer-test' } } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () =>
              h(Transfer, {
                oneWay: true,
                dataSource: [{ key: 'b', title: 'b' }],
                targetKeys: ['b'],
              }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('transfer style extract', () => {
  it('keeps disabled remove buttons in disabled colors', async () => {
    const styleText = await extractTransferStyle()

    expect(styleText).toContain('.ant-transfer-list-content-item-remove:disabled')
    expect(styleText).toContain('cursor:not-allowed')
  })
})
