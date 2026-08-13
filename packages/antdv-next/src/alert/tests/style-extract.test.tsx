import type { ThemeConfig } from '../../config-provider/context'
import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Alert from '..'
import ConfigProvider from '../../config-provider'

async function extractAlertStyle(theme?: ThemeConfig) {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider as any, { theme: { hashed: false, cssVar: false, ...theme } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(Alert, { message: 'Alert', closable: true }),
          }),
      }),
  })

  await renderToString(app)

  return {
    style: extractStyle(cache, { plain: true, types: 'style' }),
    token: extractStyle(cache, { plain: true, types: 'cssVar' }),
  }
}

describe('alert style extract', () => {
  it('adds focus-visible outline to the close button', async () => {
    const { style } = await extractAlertStyle()

    expect(style).toContain('.ant-alert .ant-alert-close-icon:focus-visible')
    expect(style).toContain('outline:')
  })

  it('supports the borderRadius component token', async () => {
    const { style, token } = await extractAlertStyle({
      components: { Alert: { borderRadius: 3 } },
    })

    // Root radius must read the component token, not the alias token
    expect(style).toContain('border-radius:var(--ant-alert-border-radius)')
    expect(token).toContain('--ant-alert-border-radius:3px')
  })

  it('falls back borderRadius to borderRadiusLG', async () => {
    const { token } = await extractAlertStyle({
      token: { borderRadiusLG: 15 },
    })

    expect(token).toContain('--ant-alert-border-radius:15px')
  })
})
