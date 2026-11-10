import { describe, expect, it, vi } from 'vitest'
import Table from '..'
import { mount } from '/@tests/utils'

interface Row { key: string, name: string, price: number, stock: number }

const data: Row[] = [
  { key: 'a', name: 'Apple', price: 20, stock: 1 },
  { key: 'b', name: 'Banana', price: 10, stock: 2 },
]
const priceSorter = (a: Row, b: Row) => a.price - b.price
const stockSorter = (a: Row, b: Row) => a.stock - b.stock

function singleColumns(sorter: any, defaultSortOrder?: 'ascend') {
  return [{ key: 'metric', title: 'Product', dataIndex: 'name', sorter, defaultSortOrder }]
}

function mountTable(columns: any[], extra: Record<string, any> = {}) {
  return mount(Table as any, {
    props: { pagination: false, dataSource: data, columns, ...extra },
  })
}

function names(wrapper: any) {
  return wrapper.findAll('tbody tr[data-row-key]').map((row: any) => row.text())
}

describe('table active sorter after column configuration changes', () => {
  it('uses an updated compare function while retaining the selected order', async () => {
    const wrapper = mountTable(singleColumns(priceSorter))
    await wrapper.find('th').trigger('click')
    expect(names(wrapper)).toEqual(['Banana', 'Apple'])
    await wrapper.setProps({ columns: singleColumns(stockSorter) })
    expect(wrapper.find('th').attributes('aria-sort')).toBe('ascending')
    expect(names(wrapper)).toEqual(['Apple', 'Banana'])
  })

  it('stops locally sorting when the column switches to server-side sorting', async () => {
    const wrapper = mountTable(singleColumns(priceSorter, 'ascend'))
    expect(names(wrapper)).toEqual(['Banana', 'Apple'])
    await wrapper.setProps({ columns: singleColumns(true, 'ascend') })
    expect(names(wrapper)).toEqual(['Apple', 'Banana'])
  })

  it('stops sorting when sorting is removed from the column', async () => {
    const wrapper = mountTable(singleColumns(priceSorter, 'ascend'))
    expect(names(wrapper)).toEqual(['Banana', 'Apple'])
    await wrapper.setProps({ columns: singleColumns(false) })
    expect(wrapper.find('.ant-table-column-sorters').exists()).toBe(false)
    expect(names(wrapper)).toEqual(['Apple', 'Banana'])
  })

  it.each(['metric', '0'])('refreshes a grouped sorter with key %s', async (key) => {
    const columns = (sorter: any) => [
      {
        title: 'Group',
        children: [
          { key, title: 'Product', dataIndex: 'name', sorter, defaultSortOrder: 'ascend' as const },
        ],
      },
    ]
    const wrapper = mountTable(columns(priceSorter))
    expect(names(wrapper)).toEqual(['Banana', 'Apple'])
    await wrapper.setProps({ columns: columns(stockSorter) })
    expect(names(wrapper)).toEqual(['Apple', 'Banana'])
  })

  it('uses updated multiple priorities while preserving active sort orders', async () => {
    const columns = (multiple: number) => [
      {
        key: 'price',
        title: 'Price',
        dataIndex: 'name',
        sorter: { compare: priceSorter, multiple },
        defaultSortOrder: 'ascend',
      },
      {
        key: 'stock',
        title: 'Stock',
        sorter: { compare: stockSorter, multiple: 2 },
        defaultSortOrder: 'ascend',
      },
    ]
    const wrapper = mountTable(columns(1))
    expect(names(wrapper)).toEqual(['Apple', 'Banana'])
    await wrapper.setProps({ columns: columns(3) })
    expect(names(wrapper)).toEqual(['Banana', 'Apple'])
    expect(wrapper.findAll('th[aria-sort="ascending"]')).toHaveLength(2)
  })

  it.each([0, 1])('applies single-sort rules when column %s drops multiple', async (singleIndex) => {
    const columns = (single: boolean) =>
      [priceSorter, stockSorter].map((compare, index) => ({
        key: String(index),
        title: String(index),
        dataIndex: index === 0 ? 'name' : undefined,
        sorter: single && index === singleIndex ? compare : { compare, multiple: index + 1 },
        defaultSortOrder: 'ascend',
      }))
    const wrapper = mountTable(columns(false))
    expect(names(wrapper)).toEqual(['Apple', 'Banana'])
    expect(wrapper.findAll('th[aria-sort="ascending"]')).toHaveLength(2)
    await wrapper.setProps({ columns: columns(true) })
    expect(names(wrapper)).toEqual(['Banana', 'Apple'])
    expect(wrapper.findAll('th[aria-sort="ascending"]')).toHaveLength(1)
    expect(wrapper.find('th').attributes('aria-sort')).toBe('ascending')
  })

  it('retains and refreshes a sorter on the group header itself', async () => {
    const columns = (sorter: any) => [
      {
        key: 'group',
        title: 'Group',
        sorter,
        children: [{ key: 'name', title: 'Product', dataIndex: 'name' }],
      },
    ]
    const wrapper = mountTable(columns(priceSorter))
    await wrapper.find('thead th').trigger('click')
    expect(names(wrapper)).toEqual(['Banana', 'Apple'])
    expect(wrapper.find('thead th').attributes('aria-sort')).toBe('ascending')
    await wrapper.setProps({ columns: columns(stockSorter) })
    expect(names(wrapper)).toEqual(['Apple', 'Banana'])
    expect(wrapper.find('thead th').attributes('aria-sort')).toBe('ascending')
  })

  it('does not let an inactive single sorter block a later multiple sorter', async () => {
    const onChange = vi.fn()
    const columns = (single: boolean) => [
      {
        key: 'price',
        title: 'Price',
        dataIndex: 'name',
        sorter: { compare: priceSorter, multiple: 1 },
        defaultSortOrder: 'ascend',
      },
      {
        key: 'stock',
        title: 'Stock',
        sorter: single ? stockSorter : { compare: stockSorter, multiple: 2 },
        defaultSortOrder: 'ascend',
      },
      { key: 'later', title: 'Later', sorter: { compare: stockSorter, multiple: 3 } },
    ]
    const wrapper = mountTable(columns(false), { onChange })
    expect(wrapper.findAll('th[aria-sort="ascending"]')).toHaveLength(2)
    await wrapper.setProps({ columns: columns(true) })
    expect(names(wrapper)).toEqual(['Banana', 'Apple'])
    expect(wrapper.findAll('th[aria-sort="ascending"]')).toHaveLength(1)

    await wrapper.findAll('thead th')[2]!.trigger('click')
    expect(names(wrapper)).toEqual(['Apple', 'Banana'])
    expect(wrapper.findAll('th[aria-sort="ascending"]')).toHaveLength(2)
    expect(onChange.mock.calls[0]![2]).toEqual([
      expect.objectContaining({ columnKey: 'price', order: 'ascend' }),
      expect.objectContaining({ columnKey: 'later', order: 'ascend' }),
    ])

    await wrapper.findAll('thead th')[0]!.trigger('click')
    expect(names(wrapper)).toEqual(['Apple', 'Banana'])
    expect(onChange.mock.calls[1]![2]).toEqual([
      expect.objectContaining({ columnKey: 'later', order: 'ascend' }),
      expect.objectContaining({ columnKey: 'price', order: 'descend' }),
    ])

    await wrapper.findAll('thead th')[2]!.trigger('click')
    expect(names(wrapper)).toEqual(['Banana', 'Apple'])
    expect(wrapper.findAll('th[aria-sort="descending"]')).toHaveLength(2)
    expect(onChange.mock.calls[2]![2]).toEqual([
      expect.objectContaining({ columnKey: 'price', order: 'descend' }),
      expect.objectContaining({ columnKey: 'later', order: 'descend' }),
    ])
  })
})
