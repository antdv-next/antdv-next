import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Radio from '..'
import ConfigProvider from '../../config-provider'

async function extractRadioStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { theme: { hashed: false, cssVar: { key: 'radio-test' } } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(Radio, { disabled: true }, { default: () => 'A' }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('radio style extract', () => {
  it('does not apply hover border color to disabled wrappers', async () => {
    const styleText = await extractRadioStyle()

    expect(styleText).toContain(':hover:not(.ant-radio-wrapper-disabled) .ant-radio')
  })
})
