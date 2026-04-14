import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Select from '..'
import ConfigProvider from '../../config-provider'

async function extractSelectStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { theme: { hashed: false, cssVar: { key: 'select-test' } } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(Select, {
              options: [{ label: 'Bamboo', value: 'bamboo' }],
              variant: 'underlined',
            }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('select style extract', () => {
  it('uses logical inline border color for underlined variant', async () => {
    const styleText = await extractSelectStyle()

    expect(styleText).toContain('border-inline-color:transparent;')
    expect(styleText).not.toContain('border-right-color:transparent;')
    expect(styleText).not.toContain('border-left-color:transparent;')
  })
})
