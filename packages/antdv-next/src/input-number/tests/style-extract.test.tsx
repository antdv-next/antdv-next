import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import InputNumber from '..'
import ConfigProvider from '../../config-provider'

async function extractInputNumberStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { theme: { hashed: false, cssVar: { key: 'input-number-test' } } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(InputNumber, { disabled: true, controls: true }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('input-number style extract', () => {
  it('prevents hover and active styles on disabled handlers', async () => {
    const styleText = await extractInputNumberStyle()

    expect(styleText).toContain(':active:not(.ant-input-number-action-up-disabled):not(.ant-input-number-action-down-disabled)')
    expect(styleText).toContain(':hover:not(.ant-input-number-action-up-disabled):not(.ant-input-number-action-down-disabled)')
    expect(styleText).toContain('.ant-input-number-action.ant-input-number-action-up-disabled')
  })

  it('removes the inner input border radius', async () => {
    const styleText = await extractInputNumberStyle()

    expect(styleText).toMatch(/\.ant-input-number \.ant-input-number-input\{[^}]*border-radius:0;/)
  })
})
