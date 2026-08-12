import type { VNodeChild } from 'vue'
import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import ConfigProvider from '../../config-provider'
import Input from '../../input'
import Rate from '../../rate'
import Select from '../../select'
import Splitter, { SplitterPanel } from '../../splitter'
import Steps from '../../steps'

async function extractFocusOutlineStyle(children: VNodeChild, focusOutline?: boolean) {
  const cache = createCache()
  const app = createSSRApp({
    render: () =>
      h(
        ConfigProvider,
        {
          theme: {
            hashed: false,
            token: focusOutline === undefined ? {} : { focusOutline },
          },
        },
        {
          default: () =>
            h(StyleProvider, { cache, mock: 'server' }, {
              default: () => children,
            }),
        },
      ),
  })

  await renderToString(app)

  return extractStyle(cache, { plain: true })
}

describe('focusOutline token', () => {
  it('derives lineWidthFocus css var from the focusOutline seed', async () => {
    const enabled = await extractFocusOutlineStyle(h(Input))
    const disabled = await extractFocusOutlineStyle(h(Input), false)

    expect(enabled).toContain('--ant-line-width-focus:3px;')
    expect(disabled).toContain('--ant-line-width-focus:0px;')
  })

  it('keeps borderless input outline at lineWidth and drops it when focusOutline is false', async () => {
    const enabled = await extractFocusOutlineStyle(h(Input, { variant: 'borderless' }))
    const disabled = await extractFocusOutlineStyle(h(Input, { variant: 'borderless' }), false)

    expect(enabled).toContain(
      '.ant-input-borderless:focus-visible,.ant-input-borderless:has(input:focus-visible),.ant-input-borderless:has(textarea:focus-visible){outline:var(--ant-input-line-width-focus) var(--ant-line-type)',
    )
    expect(enabled).toContain('--ant-input-line-width-focus:1px;')
    // Falls back to the (zeroed) global token instead of the 1px component token
    expect(disabled).not.toContain('--ant-input-line-width-focus:1px;')
    expect(disabled).toContain('--ant-line-width-focus:0px;')
  })

  it('keeps borderless select outline at lineWidth and drops it when focusOutline is false', async () => {
    const options = [{ label: 'Bamboo', value: 'bamboo' }]
    const enabled = await extractFocusOutlineStyle(h(Select, { options, variant: 'borderless' }))
    const disabled = await extractFocusOutlineStyle(
      h(Select, { options, variant: 'borderless' }),
      false,
    )

    expect(enabled).toContain(
      '.ant-select.ant-select-borderless:not(.ant-select-disabled):has(input:focus-visible),.ant-select.ant-select-borderless:not(.ant-select-disabled):has(textarea:focus-visible){outline:var(--ant-select-line-width-focus) var(--ant-line-type)',
    )
    expect(enabled).toContain('--ant-select-line-width-focus:1px;')
    expect(disabled).not.toContain('--ant-select-line-width-focus:1px;')
    expect(disabled).toContain('--ant-line-width-focus:0px;')
  })

  it('keeps the rate star outline at lineWidth and drops it when focusOutline is false', async () => {
    const enabled = await extractFocusOutlineStyle(h(Rate))
    const disabled = await extractFocusOutlineStyle(h(Rate), false)

    expect(enabled).toContain(
      '.ant-rate .ant-rate-star >div:focus-visible{outline:var(--ant-rate-line-width-focus) dashed var(--ant-rate-star-color);',
    )
    expect(enabled).toContain('--ant-rate-line-width-focus:1px;')
    expect(disabled).not.toContain('--ant-rate-line-width-focus:1px;')
    expect(disabled).toContain('--ant-line-width-focus:0px;')
  })

  it('applies the shared focus outline to the splitter collapse bar', async () => {
    const styleText = await extractFocusOutlineStyle(
      h(Splitter, null, {
        default: () => [
          h(SplitterPanel, { collapsible: true }, { default: () => 'left' }),
          h(SplitterPanel, null, { default: () => 'right' }),
        ],
      }),
    )

    expect(styleText).toContain(
      '.ant-splitter-bar-collapse-bar:focus-visible{outline:var(--ant-line-width-focus) solid var(--ant-color-primary-border);',
    )
  })

  it('applies the shared focus outline to clickable steps items', async () => {
    const styleText = await extractFocusOutlineStyle(
      h(Steps, {
        current: 0,
        onChange: () => {},
        items: [{ title: 'One' }, { title: 'Two' }],
      }),
    )

    expect(styleText).toContain(
      '.ant-steps-item[role=\'button\']:focus-visible{outline:var(--ant-line-width-focus) solid var(--ant-color-primary-border);',
    )
  })
})
