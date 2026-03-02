import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import Table from '..'
import { mount } from '/@tests/utils'

const data = [
  { key: '1', name: 'John', age: 32 },
  { key: '2', name: 'Jim', age: 42 },
  { key: '3', name: 'Joe', age: 22 },
]

describe('table filter', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    // Clean up portal dropdowns
    document.querySelectorAll('.ant-dropdown').forEach(el => el.remove())
  })

  it('should render filter icon when column has filters', () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filters: [
          { text: 'John', value: 'John' },
          { text: 'Jim', value: 'Jim' },
        ],
        onFilter: (value: any, record: any) => record.name === value,
      },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
      attachTo: document.body,
    })
    expect(wrapper.find('.ant-table-filter-trigger').exists()).toBe(true)
    wrapper.unmount()
  })

  it('should support controlled filteredValue', async () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filters: [
          { text: 'John', value: 'John' },
          { text: 'Jim', value: 'Jim' },
        ],
        filteredValue: ['John'],
        onFilter: (value: any, record: any) => record.name === value,
      },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    // Only John should be visible
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.find('tbody tr td').text()).toBe('John')
  })

  it('should support defaultFilteredValue', () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filters: [
          { text: 'John', value: 'John' },
          { text: 'Jim', value: 'Jim' },
        ],
        defaultFilteredValue: ['Jim'],
        onFilter: (value: any, record: any) => record.name === value,
      },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    expect(wrapper.find('tbody tr td').text()).toBe('Jim')
  })

  it('should highlight filter icon when filtered', () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filters: [
          { text: 'John', value: 'John' },
        ],
        filteredValue: ['John'],
        onFilter: (value: any, record: any) => record.name === value,
      },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    expect(wrapper.find('.ant-table-filter-trigger.active').exists()).toBe(true)
  })

  it('should not highlight filter icon when no filter active', () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filters: [
          { text: 'John', value: 'John' },
        ],
        onFilter: (value: any, record: any) => record.name === value,
      },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    expect(wrapper.find('.ant-table-filter-trigger.active').exists()).toBe(false)
  })

  it('should support custom filterDropdown slot', () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filters: [{ text: 'John', value: 'John' }],
      },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
      slots: {
        filterDropdown: ({ column }: any) => h('div', { class: 'custom-filter' }, `Filter for ${column.title}`),
      },
      attachTo: document.body,
    })
    expect(wrapper.find('.ant-table-filter-trigger').exists()).toBe(true)
    wrapper.unmount()
  })

  it('should support custom filterIcon slot', () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filters: [{ text: 'John', value: 'John' }],
      },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
      slots: {
        filterIcon: ({ filtered }: any) => h('span', { class: 'custom-filter-icon' }, filtered ? 'filtered' : 'not'),
      },
    })
    expect(wrapper.find('.custom-filter-icon').exists()).toBe(true)
  })

  it('should support multiple filters on same column', () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filters: [
          { text: 'John', value: 'John' },
          { text: 'Jim', value: 'Jim' },
        ],
        filteredValue: ['John', 'Jim'],
        onFilter: (value: any, record: any) => record.name === value,
        filterMultiple: true,
      },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    // Both John and Jim should be visible
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('should support single filter mode (filterMultiple=false)', () => {
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filters: [
          { text: 'John', value: 'John' },
          { text: 'Jim', value: 'Jim' },
        ],
        filteredValue: ['John'],
        onFilter: (value: any, record: any) => record.name === value,
        filterMultiple: false,
      },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
  })

  it('should filter with nested children data', () => {
    const nestedData = [
      { key: '1', name: 'John', age: 32, children: [{ key: '1-1', name: 'John Jr', age: 5 }] },
      { key: '2', name: 'Jim', age: 42 },
    ]
    const columns = [
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        filters: [{ text: 'John', value: 'John' }],
        filteredValue: ['John'],
        onFilter: (value: any, record: any) => record.name.includes(value as string),
      },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: nestedData, pagination: false },
    })
    expect(wrapper.findAll('tbody tr').length).toBeGreaterThanOrEqual(1)
  })
})
