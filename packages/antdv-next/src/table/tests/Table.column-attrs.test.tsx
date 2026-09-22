import { describe, expect, it } from 'vitest'
import { createVNode, h, nextTick } from 'vue'
import Table, { Column } from '..'
import { convertColumnsToColumnProps } from '../utils'
import { mount } from '/@tests/utils'

describe('table column attributes', () => {
  it('converts kebab-case Column attrs to camelCase column fields', () => {
    // A compiled template renders <a-table-column data-index="name" min-width="120" />
    // as a vnode whose raw props keep the kebab-case keys.
    const children = [
      createVNode(Column, { 'data-index': 'name', 'min-width': 120, title: 'Name' }),
    ]
    const columns = convertColumnsToColumnProps(children)
    expect(columns).toHaveLength(1)
    const column = columns[0]!
    expect(column.dataIndex).toBe('name')
    expect(column.minWidth).toBe(120)
    expect(column.title).toBe('Name')
    // The raw kebab keys must not leak into the column object.
    expect(column).not.toHaveProperty('data-index')
    expect(column).not.toHaveProperty('min-width')
  })

  it('keeps already camelCase attrs untouched', () => {
    const children = [createVNode(Column, { dataIndex: 'age', width: 80, title: 'Age' })]
    const columns = convertColumnsToColumnProps(children)
    expect(columns).toHaveLength(1)
    const column = columns[0]!
    expect(column.dataIndex).toBe('age')
    expect(column.width).toBe(80)
  })

  it('renders cell content when columns are declared with kebab-case attrs', async () => {
    const wrapper = mount(Table, {
      props: { dataSource: [{ name: 'Alice', age: 30 }], pagination: false },
      slots: {
        default: () => [
          h(Column, { 'data-index': 'name', title: 'Name' }),
          h(Column, { 'data-index': 'age', title: 'Age' }),
        ],
      },
    })
    await nextTick()
    const cells = wrapper.findAll('.ant-table-tbody .ant-table-cell')
    expect(cells.length).toBeGreaterThanOrEqual(2)
    expect(cells[0]!.text()).toBe('Alice')
    expect(cells[1]!.text()).toBe('30')
  })
})
