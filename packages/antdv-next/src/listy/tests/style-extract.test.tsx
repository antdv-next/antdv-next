import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Listy from '..'
import ConfigProvider from '../../config-provider'

const items = [{ id: 1 }]

async function extractListyStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider as any, { theme: { hashed: false, cssVar: false } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () =>
              h(Listy, {
                height: 200,
                items,
                rowKey: 'id',
                itemRender: (item: any) => String(item.id),
              }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('listy style extract', () => {
  it('scopes the row hover style under the root -row-hoverable class', async () => {
    const style = await extractListyStyle()

    expect(style).toContain('.ant-listy-row-hoverable .ant-listy-item:hover')
    expect(style).toContain('background-color')

    // The -row-hoverable class lives on the root element itself, so it must not
    // be nested under a descendant `.ant-listy ` selector.
    expect(style).not.toContain('.ant-listy .ant-listy-row-hoverable')
  })
})
