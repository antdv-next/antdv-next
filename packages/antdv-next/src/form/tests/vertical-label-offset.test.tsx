import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { describe, expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Form, { FormItem } from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/58981
// https://github.com/ant-design/ant-design/issues/51630
describe('form vertical layout labelCol offset', () => {
  it('should preserve labelCol offset classes in vertical layout', () => {
    const wrapper = mount(() => (
      <Form layout="vertical" labelCol={{ span: 24, offset: 6, sm: { span: 24, offset: 3 } }}>
        <FormItem label="Form offset">
          <input />
        </FormItem>
        <FormItem label="Item offset" labelCol={{ offset: 4, md: { offset: 0 } }}>
          <input />
        </FormItem>
      </Form>
    ))

    const labels = wrapper.findAll('.ant-form-item-label')
    expect(labels[0].classes()).toEqual(
      expect.arrayContaining(['ant-col-24', 'ant-col-offset-6', 'ant-col-sm-24', 'ant-col-sm-offset-3']),
    )
    expect(labels[1].classes()).toEqual(
      expect.arrayContaining(['ant-col-offset-4', 'ant-col-md-offset-0']),
    )
  })

  it('should preserve label offset margin in vertical layout', async () => {
    const cache = createCache()
    const app = createSSRApp({
      render: () =>
        h(ConfigProvider, {
          theme: {
            hashed: false,
            components: { Form: { verticalLabelMargin: '1px 2px 3px 4px' } },
          },
        }, {
          default: () =>
            h(StyleProvider, { cache, mock: 'server' }, {
              default: () =>
                h(Form, {
                  layout: 'vertical',
                  labelCol: { span: 24, offset: 6, sm: { span: 24, offset: 3 } },
                }, {
                  default: () => [
                    h(FormItem, { label: 'Form offset' }, { default: () => h('input') }),
                    h(FormItem, { label: 'Item offset', labelCol: { offset: 4, md: { offset: 0 } } }, {
                      default: () => h('input'),
                    }),
                  ],
                }),
            }),
        }),
    })

    await renderToString(app)

    const styleText = extractStyle(cache, { plain: true })

    // Vertical label keeps its margin through a CSS variable so Grid offset
    // (margin-inline-start) can still win over the shorthand.
    const labelMarginRule = '.ant-form-item-label{margin:var(--ant-form-item-label-margin);}'
    expect(styleText).toContain('--ant-form-vertical-label-margin:1px 2px 3px 4px;')
    expect(styleText).toContain('--ant-form-item-label-margin:initial;')
    expect(styleText).toContain('--ant-form-item-label-margin:var(--ant-form-vertical-label-margin);')
    expect(styleText).toContain(labelMarginRule)

    // The single-class Form rule has the same specificity as the Grid offset.
    // Grid styles are emitted later, so margin-inline-start wins while the other margins remain.
    const gridMarginRules = [
      '.ant-col-offset-6{margin-inline-start:25%;}',
      '.ant-col-sm-offset-3{margin-inline-start:12.5%;}',
      '.ant-col-md-offset-0{margin-inline-start:0;}',
    ]
    gridMarginRules.forEach((rule) => {
      expect(styleText).toContain(rule)
      expect(styleText.indexOf(labelMarginRule)).toBeLessThan(styleText.indexOf(rule))
    })
  })
})
