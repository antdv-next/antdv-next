import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Button from '..'
import ConfigProvider from '../../config-provider'

async function extractButtonStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider as any, { theme: { hashed: false, cssVar: false } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(Button, null, { default: () => 'Button' }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('button style extract', () => {
  // https://github.com/ant-design/ant-design/pull/59886
  it('only transitions visual properties instead of all', async () => {
    const style = await extractButtonStyle()
    const rootRule = style.match(/\.ant-btn\{outline:none;[^}]*\}/)?.[0] ?? ''
    const transition = rootRule.match(/transition:([^;]*);/)?.[1]

    expect(transition).toBe(
      ['color', 'background-color', 'border-color', 'box-shadow', 'opacity']
        .map(prop => `${prop} var(--ant-motion-duration-mid) var(--ant-motion-ease-in-out)`)
        .join(','),
    )
  })
})
