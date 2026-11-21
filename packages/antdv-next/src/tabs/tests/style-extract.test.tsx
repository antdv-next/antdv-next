import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Tabs from '..'
import ConfigProvider from '../../config-provider'

async function extractTabsStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { theme: { hashed: false } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(Tabs, {
              type: 'card',
              items: [
                { key: '1', label: 'Tab 1', content: 'Content 1' },
                { key: '2', label: 'Tab 2', content: 'Content 2' },
              ],
            }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('tabs style extract', () => {
  it('does not transition layout properties on card tabs', async () => {
    const styleText = await extractTabsStyle()
    // The card tab rule is the one carrying the card background and secondary border
    const transition = styleText.match(
      /background:var\(--ant-tabs-card-bg\);border:[^;]*var\(--ant-color-border-secondary\);transition:([^;}]*)/,
    )?.[1]

    expect(transition).toBeTruthy()
    expect(transition).not.toMatch(/(?:^|,\s*)all\s/)
    const ease = 'var\\(--ant-motion-duration-slow\\) var\\(--ant-motion-ease-in-out\\)'
    expect(transition).toMatch(new RegExp(`^color ${ease},\\s*background-color ${ease},\\s*border-color ${ease}$`))
  })
})
