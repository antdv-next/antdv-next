import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Dropdown from '..'
import Button from '../../button'
import ConfigProvider from '../../config-provider'

async function extractDropdownStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { theme: { hashed: false, cssVar: { key: 'dropdown-test' } } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(Dropdown, {
              menu: { items: [{ key: '1', label: h('a', { href: '#' }, 'Link'), extra: '⌘K' }] },
            }, {
              default: () => h(Button, null, { default: () => 'Open' }),
            }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('dropdown style extract', () => {
  it('preserves link color inside menu item label when item has extra content', async () => {
    const styleText = await extractDropdownStyle()

    expect(styleText).toContain('>.ant-dropdown-menu-item-label>a')
    expect(styleText).toContain('color:inherit;')
  })
})
