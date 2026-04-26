import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Input from '..'
import ConfigProvider from '../../config-provider'
import OTP from '../OTP'

async function extractInputStyle(children = h(Input, { disabled: true })) {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { theme: { hashed: false, cssVar: { key: 'input-test' } } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => children,
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('input style extract', () => {
  it('uses colorBorderDisabled for disabled outlined inputs', async () => {
    const styleText = await extractInputStyle()

    expect(styleText).toContain('border-color:var(--ant-color-border-disabled);')
    expect(styleText).toContain('.ant-input-outlined.ant-input-disabled:hover:not([disabled]),.ant-input-outlined[disabled]:hover:not([disabled]){border-color:var(--ant-color-border-disabled);')
  })

  it('keeps OTP masked selection text transparent', async () => {
    const styleText = await extractInputStyle(h(OTP, { mask: true }))

    expect(styleText).toContain('.ant-otp .ant-otp-input-wrapper .ant-otp-mask-input::selection{color:transparent;}')
  })
})
