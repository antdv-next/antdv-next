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

    // v2 semantic spacing uses the section flex `gap`, so there's no explicit
    // `margin-top: 0` on description like in the original ant-design#57821 fix.
    // The closable + (description-only) padding rules are what actually keep
    // the description from running under the close button.
    expect(styleText).toContain('.ant-notification .ant-notification-notice-description{')
    expect(styleText).toContain('.ant-notification .ant-notification-notice-closable .ant-notification-notice-description{padding-inline-end:var(--ant-padding-lg);}')
    expect(styleText).toContain('.ant-notification .ant-notification-notice-closable .ant-notification-notice-title+.ant-notification-notice-description{padding-inline-end:0;}')
  })
})
