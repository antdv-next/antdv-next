import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import ConfigProvider from '../../config-provider'
import PureList from '../PureList'

async function extractMessageStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { theme: { hashed: false, cssVar: { key: 'message-test' } } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(PureList, {
              items: [{ key: 'message-test', content: 'Message', type: 'info' }],
            }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('message style extract', () => {
  it('keeps horizontal centering separate from notice motion transforms', async () => {
    const styleText = await extractMessageStyle()

    expect(styleText).toContain('left:50%;translate:-50% 0;transform:translate3d(0, 0, 0) scale(var(--notification-scale, 1));')
    expect(styleText).toContain('transform:translate3d(0, -64px, 0) scale(var(--notification-scale, 1));')
    expect(styleText).not.toContain('translate3d(-50%,')
  })
})
