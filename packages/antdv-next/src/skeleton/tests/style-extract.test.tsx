import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Skeleton from '..'
import ConfigProvider from '../../config-provider'

async function extractSkeletonImageStyle() {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(ConfigProvider as any, { theme: { hashed: false, cssVar: false } }, {
        default: () =>
          h(StyleProvider, { cache, mock: 'server' }, {
            default: () => h(Skeleton.Image),
          }),
      }),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true, types: 'style' })
}

describe('skeleton style extract', () => {
  // https://github.com/ant-design/ant-design/pull/59672
  it('does not generate unused image circle styles', async () => {
    const style = await extractSkeletonImageStyle()

    expect(style).toContain('.ant-skeleton-image-svg{')
    expect(style).not.toContain('.ant-skeleton-image.ant-skeleton-image-circle')
    expect(style).not.toContain('.ant-skeleton-image-svg.ant-skeleton-image-svg-circle')
  })
})
