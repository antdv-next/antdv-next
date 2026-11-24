import { describe, expect, it } from 'vitest'
import { h } from 'vue'
import Table from '..'
import { mount } from '/@tests/utils'

// https://github.com/ant-design/ant-design/pull/59963
describe('table scrollbar header cell style', () => {
  it('removes inline padding from the header scrollbar cell', () => {
    mount(() => h(Table, {
      columns: [{ title: 'Name', dataIndex: 'name' }],
      dataSource: [{ key: 1, name: 'Jack' }],
      scroll: { x: 1000, y: 100 },
    }), { attachTo: document.body })

    const css = Array.from(document.querySelectorAll('style'))
      .map(style => style.innerHTML)
      .join('\n')
    expect(css).toMatch(/\.ant-table-thead\s*>\s*tr\s*>\s*\.ant-table-cell-scrollbar\{padding-inline:0;?\}/)
  })
})
