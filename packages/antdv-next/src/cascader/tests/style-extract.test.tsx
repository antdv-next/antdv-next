import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Cascader from '..'
import ConfigProvider from '../../config-provider'

const options = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
      },
    ],
  },
]

async function extractCascaderStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { theme: { hashed: false, cssVar: { key: 'cascader-test' } } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(Cascader, { options, open: true }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('cascader style extract', () => {
  it('moves ellipsis styles to the content container', async () => {
    const styleText = await extractCascaderStyle()

    expect(styleText).toContain('.ant-cascader-menu-item-content')
    expect(styleText).toContain('min-width:0')
    expect(styleText).toContain('max-width:400px')
  })
})
