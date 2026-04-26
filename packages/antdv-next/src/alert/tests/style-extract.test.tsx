import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Alert from '..'
import ConfigProvider from '../../config-provider'

async function extractAlertStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { theme: { hashed: false, cssVar: { key: 'alert-test' } } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(Alert, { message: 'Alert', closable: true }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('alert style extract', () => {
  it('adds focus-visible outline to the close button', async () => {
    const styleText = await extractAlertStyle()

    expect(styleText).toContain('.ant-alert .ant-alert-close-icon:focus-visible')
    expect(styleText).toContain('outline:')
  })
})
