import { describe, expect, it } from 'vitest'
import { createVNode, h, nextTick } from 'vue'
import Table, { Column } from '..'
import { convertColumnsToColumnProps } from '../utils'
import { mount } from '/@tests/utils'

describe('table column attributes', () => {
  it('converts kebab-case Column attrs to camelCase column fields', () => {
    // A compiled template renders <a-table-column data-index="name" min-width="120" />
    // as a vnode whose raw props keep the kebab-case keys. Static template
    // attributes compile to strings, so minWidth arrives as '120' (numeric
    // values need the `:min-width="120"` binding).
    const children = [
      createVNode(Column, { 'data-index': 'name', 'min-width': '120', title: 'Name' }),
    ]
    const columns = convertColumnsToColumnProps(children)
    expect(columns).toHaveLength(1)
    const column = columns[0]!
    expect(column.dataIndex).toBe('name')
    expect(column.minWidth).toBe('120')
    expect(column.title).toBe('Name')
    // The raw kebab keys must not leak into the column object.
    expect(column).not.toHaveProperty('data-index')
    expect(column).not.toHaveProperty('min-width')
  })

  it('casts bare boolean attributes the way Vue does for declared props', () => {
    // <a-table-column ellipsis fixed hidden sorter /> compiles to
    // { ellipsis: '', fixed: '', hidden: '', sorter: '' } — without casting
    // these no-ops silently (the table only acts on real booleans).
    const children = [
      createVNode(Column, { 'data-index': 'name', ellipsis: '', fixed: '', hidden: '', sorter: '' }),
    ]
    const columns = convertColumnsToColumnProps(children)
    expect(columns).toHaveLength(1)
    const column = columns[0]!
    expect(column.ellipsis).toBe(true)
    expect(column.hidden).toBe(true)
    expect(column.sorter).toBe(true)
    // Bare `fixed` means left-fixed by antd convention (its type is
    // FixedType, where '' would not be boolean-cast by Vue's rules).
    expect(column.fixed).toBe('left')
  })

  it('does not cast string values of non-boolean column attrs', () => {
    const children = [createVNode(Column, { title: '', 'data-index': 'name' })]
    const columns = convertColumnsToColumnProps(children)
    expect(columns).toHaveLength(1)
    expect(columns[0]!.title).toBe('')
    expect(columns[0]!.dataIndex).toBe('name')
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
