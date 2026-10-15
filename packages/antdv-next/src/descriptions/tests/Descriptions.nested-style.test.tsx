import { createCache, extractStyle, StyleProvider } from '@antdv-next/cssinjs'
import { afterEach, describe, expect, it } from 'vitest'
import { h } from 'vue'
import Descriptions from '..'
import ConfigProvider from '../../config-provider'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59547
describe('descriptions nested styles', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('keeps static styles compatible with the distribution CSS check', () => {
    const cache = createCache()
    mount(() => (
      <StyleProvider cache={cache}>
        <ConfigProvider theme={{ hashed: false }}>
          <Descriptions
            bordered
            size="small"
            items={[{ key: 'name', label: 'Name', content: 'Alice' }]}
          />
        </ConfigProvider>
      </StyleProvider>
    ))
    const css = extractStyle(cache, { plain: true, types: 'style' })
    expect(css).toContain('.ant-descriptions-row')
    expect(css).not.toContain(':where(')
  })

  describe.each(['horizontal', 'vertical'] as const)('nested %s descriptions', (layout) => {
    it.each([
      { outerBordered: true, innerBordered: false, outerSize: 'small' as const },
      { outerBordered: true, innerBordered: false, outerSize: 'medium' as const },
      { outerBordered: false, innerBordered: true, outerSize: 'small' as const },
      { outerBordered: false, innerBordered: true, outerSize: 'medium' as const },
      { outerBordered: true, innerBordered: true, outerSize: 'small' as const },
      { outerBordered: true, innerBordered: true, outerSize: 'medium' as const },
    ])(
      'preserves inner styles (outer bordered: $outerBordered, inner bordered: $innerBordered, outer size: $outerSize)',
      ({ outerBordered, innerBordered, outerSize }) => {
        const items = [
          { key: 'name', label: 'Name', content: 'Alice' },
          { key: 'phone', label: 'Phone', content: '12345' },
        ]
        const wrapper = mount(() => (
          <div>
            <Descriptions
              data-testid="reference"
              bordered={innerBordered}
              size="large"
              layout={layout}
              column={1}
              items={items}
            />
            <Descriptions
              bordered={outerBordered}
              size={outerSize}
              column={1}
              items={[
                {
                  key: 'nested',
                  label: 'Nested',
                  content: h(Descriptions, {
                    'data-testid': 'nested',
                    'bordered': innerBordered,
                    'size': 'large',
                    layout,
                    'column': 1,
                    items,
                  }),
                },
              ]}
            />
          </div>
        ), { attachTo: document.body })

        const readStyles = (root: HTMLElement) => {
          const selectors = [
            '.ant-descriptions-row',
            'td',
            '.ant-descriptions-item-label',
            '.ant-descriptions-item-content',
          ]
          const properties = [
            'paddingTop',
            'paddingRight',
            'paddingBottom',
            'paddingLeft',
            'borderBottomStyle',
            'borderBottomWidth',
            'borderInlineEndStyle',
            'display',
            'backgroundColor',
          ] as const
          return selectors.map((selector) => {
            const style = getComputedStyle(root.querySelector(selector)!)
            return Object.fromEntries(properties.map(property => [property, style[property]]))
          })
        }
        const getRoot = (id: string) =>
          wrapper.element.querySelector(`[data-testid="${id}"]`) as HTMLElement

        const nestedStyles = readStyles(getRoot('nested'))
        expect(nestedStyles).toEqual(readStyles(getRoot('reference')))
        expect(nestedStyles[1]).toMatchObject(
          innerBordered
            ? {
                display: 'table-cell',
                paddingBottom: 'var(--ant-descriptions-item-padding-bottom)',
              }
            : { display: 'table-cell' },
        )
        expect(nestedStyles[2]).toMatchObject({
          display: innerBordered ? 'table-cell' : 'inline-flex',
          backgroundColor: innerBordered ? 'var(--ant-descriptions-label-bg)' : 'rgba(0, 0, 0, 0)',
        })
        expect(nestedStyles[3]!.display).toBe(innerBordered ? 'table-cell' : 'inline-flex')
      },
    )
  })
})
