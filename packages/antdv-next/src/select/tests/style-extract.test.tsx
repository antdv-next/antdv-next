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

  it('keeps active option style after selected option style', async () => {
    const styleText = await extractSelectStyle()
    const selectedIndex = styleText.indexOf('.ant-select-item-option-selected:not(.ant-select-item-option-disabled)')
    const activeIndex = styleText.indexOf('.ant-select-item-option-active:not(.ant-select-item-option-disabled)')

    expect(selectedIndex).toBeGreaterThan(-1)
    expect(activeIndex).toBeGreaterThan(selectedIndex)
  })

  it('restores arrow content gap and search label hiding styles', async () => {
    const styleText = await extractSelectStyle()

    expect(styleText).toContain('margin-inline-end:max(calc(var(--ant-select-show-arrow-padding-inline-end) - var(--ant-font-size-icon)),0px);')
    expect(styleText).toContain('.ant-select-content-has-search-value >:not(.ant-select-input)')
    expect(styleText).toContain('opacity:0;')
  })

  it('uses token font family and aligned error status colors', async () => {
    const styleText = await extractSelectStyle()

    expect(styleText).toContain('font-family:')
    expect(styleText).toContain('--ant-select-border-color:var(--ant-color-error-border-hover)')
    expect(styleText).toContain('--ant-select-color:var(--ant-color-error-text)')
  })
})
