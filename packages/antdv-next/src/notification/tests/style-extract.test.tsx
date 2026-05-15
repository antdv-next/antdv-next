import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import ConfigProvider from '../../config-provider'
import PurePanel from '../PurePanel'

async function extractNotificationStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider, { theme: { hashed: false, cssVar: { key: 'notification-test' } } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(PurePanel, {
              title: '',
              description: 'Description',
              closable: true,
            }),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('notification style extract', () => {
  it('reserves close spacing when closable notice has no title', async () => {
    const styleText = await extractNotificationStyle()

    expect(styleText).toContain('.ant-notification .ant-notification-notice-description{')
    expect(styleText).toContain('margin-top:0;')
    expect(styleText).toContain('.ant-notification .ant-notification-notice-closable .ant-notification-notice-description{padding-inline-end:var(--ant-padding-lg);}')
    expect(styleText).toContain('.ant-notification .ant-notification-notice-closable .ant-notification-notice-title+.ant-notification-notice-description{padding-inline-end:0;}')
  })
})
