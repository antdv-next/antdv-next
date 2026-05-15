import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import DatePicker from '..'
import ConfigProvider from '../../config-provider'

async function extractDatePickerStyle(children = h(DatePicker, { status: 'error' })) {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { theme: { hashed: false, cssVar: { key: 'date-picker-test' } } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => children,
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('date-picker style extract', () => {
  it('uses affix color variables for status prefix icons', async () => {
    const styleText = await extractDatePickerStyle()

    expect(styleText).toContain('--ant-date-picker-affix-color:inherit;')
    expect(styleText).toContain('color:var(--ant-date-picker-affix-color);')
    expect(styleText).toContain('--ant-date-picker-affix-color:var(--ant-color-error-affix);')
    expect(styleText).toContain('--ant-date-picker-affix-color:var(--ant-color-warning-affix);')
  })
})
