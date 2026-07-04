import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Descriptions from '..'
import ConfigProvider from '../../config-provider'

async function extractDescriptionsStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { theme: { hashed: false } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(Descriptions, { items: [{ label: 'a', children: 'b' }] }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('descriptions style extract', () => {
  // antd #58583: `-view` keeps `width: 100%` so it stays measurable in
  // shrink-to-fit containers (Popover, antd #58574), while the inner table
  // carries `min-width: 100%` to avoid oversized intrinsic widths inside
  // max-content ancestors (antd #54268).
  it('keeps view measurable while table preserves the minimum width', async () => {
    const styleText = await extractDescriptionsStyle()

    const viewRules = styleText.match(/\.ant-descriptions-view\{[^}]*\}/g) ?? []
    expect(viewRules.length).toBeGreaterThan(0)
    expect(viewRules.some(rule => rule.includes('width:100%'))).toBeTruthy()
    expect(viewRules.some(rule => rule.includes('width:0'))).toBeFalsy()

    const tableRules = styleText.match(/\.ant-descriptions-view table\{[^}]*\}/g) ?? []
    expect(tableRules.length).toBeGreaterThan(0)
    expect(tableRules.some(rule => rule.includes('min-width:100%'))).toBeTruthy()
  })
})
