import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import Table from '..'
import { mount } from '/@tests/utils'

const data = [
  { key: '1', name: 'John', age: 32 },
  { key: '2', name: 'Jim', age: 42 },
  { key: '3', name: 'Joe', age: 22 },
  { key: '4', name: 'Jerry', age: 18 },
]

describe('table sorter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('should render sorter icon when column has sorter', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age', sorter: (a: any, b: any) => a.age - b.age },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    expect(wrapper.find('.ant-table-column-sorter').exists()).toBe(true)
    expect(wrapper.find('.ant-table-column-has-sorters').exists()).toBe(true)
  })

  it('should sort data when clicking sorter column header', async () => {
    const columns = [
      { title: 'Age', dataIndex: 'age', key: 'age', sorter: (a: any, b: any) => a.age - b.age },
    ]
    const onChange = vi.fn()
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false, onChange },
    })

    // Click header to sort ascending
    await wrapper.find('.ant-table-column-has-sorters').trigger('click')
    await nextTick()
    expect(onChange).toHaveBeenCalled()

    const sortedCells = wrapper.findAll('tbody tr td')
    // After ascending sort: 18, 22, 32, 42
    expect(sortedCells[0]!.text()).toBe('18')
    expect(sortedCells[1]!.text()).toBe('22')
    expect(sortedCells[2]!.text()).toBe('32')
    expect(sortedCells[3]!.text()).toBe('42')
  })

  it('should toggle sort order: ascend -> descend -> cancel', async () => {
    const columns = [
      { title: 'Age', dataIndex: 'age', key: 'age', sorter: (a: any, b: any) => a.age - b.age },
    ]
    const onChange = vi.fn()
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false, onChange },
    })
    const header = wrapper.find('.ant-table-column-has-sorters')

    // Click 1: ascend
    await header.trigger('click')
    await nextTick()
    expect(wrapper.find('.ant-table-column-sorter-up.active').exists()).toBe(true)

    // Click 2: descend
    await header.trigger('click')
    await nextTick()
    expect(wrapper.find('.ant-table-column-sorter-down.active').exists()).toBe(true)

    // Click 3: cancel sort
    await header.trigger('click')
    await nextTick()
    expect(wrapper.find('.ant-table-column-sorter-up.active').exists()).toBe(false)
    expect(wrapper.find('.ant-table-column-sorter-down.active').exists()).toBe(false)
  })

  it('should support controlled sortOrder', async () => {
    const sortOrder = ref<'ascend' | 'descend' | null>('ascend')
    const columns = () => [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        sorter: (a: any, b: any) => a.age - b.age,
        sortOrder: sortOrder.value,
      },
    ]
    const wrapper = mount(() => (
      <Table columns={columns()} dataSource={data} pagination={false} />
    ))

    expect(wrapper.find('.ant-table-column-sorter-up.active').exists()).toBe(true)
    let cells = wrapper.findAll('tbody tr td')
    expect(cells[0]!.text()).toBe('18')

    sortOrder.value = 'descend'
    await nextTick()
    expect(wrapper.find('.ant-table-column-sorter-down.active').exists()).toBe(true)
    cells = wrapper.findAll('tbody tr td')
    expect(cells[0]!.text()).toBe('42')
  })

  it('should support defaultSortOrder', () => {
    const columns = [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        sorter: (a: any, b: any) => a.age - b.age,
        defaultSortOrder: 'descend' as const,
      },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    expect(wrapper.find('.ant-table-column-sorter-down.active').exists()).toBe(true)
    const cells = wrapper.findAll('tbody tr td')
    expect(cells[0]!.text()).toBe('42')
  })

  it('should support sortDirections', async () => {
    // Only descend allowed
    const columns = [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        sorter: (a: any, b: any) => a.age - b.age,
        sortDirections: ['descend'] as any,
      },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    const header = wrapper.find('.ant-table-column-has-sorters')

    // Click 1: descend (only direction)
    await header.trigger('click')
    await nextTick()
    expect(wrapper.find('.ant-table-column-sorter-down.active').exists()).toBe(true)

    // Click 2: cancel
    await header.trigger('click')
    await nextTick()
    expect(wrapper.find('.ant-table-column-sorter-down.active').exists()).toBe(false)
  })

  it('should support sorter with boolean true', () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', sorter: true },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    // sorter=true shows icon but no sort function
    expect(wrapper.find('.ant-table-column-sorter').exists()).toBe(true)
  })

  it('should support multiple column sorter', async () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        sorter: { compare: (a: any, b: any) => a.name.localeCompare(b.name), multiple: 2 },
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        sorter: { compare: (a: any, b: any) => a.age - b.age, multiple: 1 },
      },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    // Both columns should have sorter icons
    const sorters = wrapper.findAll('.ant-table-column-sorter')
    expect(sorters.length).toBe(2)
  })

  it('should apply ant-table-column-sort class to sorted column', async () => {
    const columns = [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        sorter: (a: any, b: any) => a.age - b.age,
        defaultSortOrder: 'ascend' as const,
      },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    expect(wrapper.find('.ant-table-column-sort').exists()).toBe(true)
  })

  it('should emit onChange with sorter info', async () => {
    const columns = [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        sorter: (a: any, b: any) => a.age - b.age,
      },
    ]
    const onChange = vi.fn()
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false, onChange },
    })
    await wrapper.find('.ant-table-column-has-sorters').trigger('click')
    await nextTick()

    expect(onChange).toHaveBeenCalledTimes(1)
    const [, , sorter, extra] = onChange.mock.calls[0]!
    expect(sorter.field).toBe('age')
    expect(sorter.order).toBe('ascend')
    expect(extra.action).toBe('sort')
  })

  it('should support custom sortIcon', () => {
    const columns = [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        sorter: true,
        sortIcon: ({ sortOrder }: any) => <span class="custom-sort-icon">{sortOrder || 'none'}</span>,
      },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    expect(wrapper.find('.custom-sort-icon').exists()).toBe(true)
  })
})
