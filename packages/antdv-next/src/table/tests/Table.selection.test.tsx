import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import Table from '..'
import { mount } from '/@tests/utils'

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
]

const data = [
  { key: '1', name: 'John', age: 32 },
  { key: '2', name: 'Jim', age: 42 },
  { key: '3', name: 'Joe', age: 22 },
]

describe('table row selection', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('should render checkbox column when rowSelection is set', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: {},
      },
    })
    expect(wrapper.find('.ant-table-selection-column').exists()).toBe(true)
    expect(wrapper.findAll('input[type="checkbox"]').length).toBeGreaterThan(0)
  })

  it('should render radio column when type is radio', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: { type: 'radio' },
      },
    })
    expect(wrapper.findAll('input[type="radio"]').length).toBe(3)
  })

  it('should support controlled selectedRowKeys', async () => {
    const selectedRowKeys = ref<string[]>(['1'])
    const wrapper = mount(() => (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowSelection={{ selectedRowKeys: selectedRowKeys.value }}
      />
    ))
    // First row should have selected class
    const rows = wrapper.findAll('tbody tr')
    expect(rows[0]!.classes().join(' ')).toContain('ant-table-row-selected')
    expect(rows[1]!.classes().join(' ')).not.toContain('ant-table-row-selected')
  })

  it('should call onChange when selection changes', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: { onChange },
      },
    })
    // Click first row checkbox
    const checkboxes = wrapper.findAll('tbody input[type="checkbox"]')
    await checkboxes[0]!.trigger('change')
    await nextTick()
    vi.advanceTimersByTime(100)
    await nextTick()

    expect(onChange).toHaveBeenCalled()
    const [keys, rows] = onChange.mock.calls[0]!
    expect(keys).toContain('1')
    expect(rows).toHaveLength(1)
  })

  it('should support select all', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: { onChange },
      },
    })
    // Click header checkbox to select all
    const headerCheckbox = wrapper.find('thead input[type="checkbox"]')
    await headerCheckbox.trigger('change')
    await nextTick()
    vi.advanceTimersByTime(100)
    await nextTick()

    expect(onChange).toHaveBeenCalled()
    const [keys] = onChange.mock.calls[0]!
    expect(keys).toHaveLength(3)
  })

  it('should support defaultSelectedRowKeys', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: { defaultSelectedRowKeys: ['1', '2'] },
      },
    })
    const selectedRows = wrapper.findAll('tbody tr.ant-table-row-selected')
    expect(selectedRows).toHaveLength(2)
  })

  it('should support getCheckboxProps to disable row', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: {
          getCheckboxProps: (record: any) => ({
            disabled: record.name === 'Jim',
          }),
        },
      },
    })
    const checkboxes = wrapper.findAll('tbody input[type="checkbox"]')
    expect((checkboxes[1]!.element as HTMLInputElement).disabled).toBe(true)
  })

  it('should support hideSelectAll', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: { hideSelectAll: true },
      },
    })
    expect(wrapper.find('thead input[type="checkbox"]').exists()).toBe(false)
  })

  it('should support fixed selection column', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: { fixed: true },
        scroll: { x: 1000 },
      },
    })
    expect(wrapper.find('.ant-table-selection-column').exists()).toBe(true)
  })

  it('should support columnWidth', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: { columnWidth: 60 },
      },
    })
    expect(wrapper.find('.ant-table-selection-column').exists()).toBe(true)
  })

  it('should support checkStrictly for tree data', () => {
    const treeData = [
      {
        key: '1',
        name: 'John',
        age: 32,
        children: [
          { key: '1-1', name: 'John Jr', age: 5 },
        ],
      },
    ]
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: treeData,
        pagination: false,
        rowSelection: { checkStrictly: false },
      },
    })
    expect(wrapper.find('.ant-table-selection-column').exists()).toBe(true)
  })

  it('should support preserveSelectedRowKeys', async () => {
    const selectedKeys = ref<string[]>(['1'])
    const ds = ref(data)
    const wrapper = mount(() => (
      <Table
        columns={columns}
        dataSource={ds.value}
        pagination={false}
        rowSelection={{
          selectedRowKeys: selectedKeys.value,
          preserveSelectedRowKeys: true,
        }}
      />
    ))
    expect(wrapper.findAll('tbody tr.ant-table-row-selected')).toHaveLength(1)

    // Remove the selected row from data
    ds.value = data.filter(d => d.key !== '1')
    await nextTick()
    // With preserveSelectedRowKeys, the key is still in selectedRowKeys
    // but no row matches, so 0 selected rows visible
    expect(wrapper.findAll('tbody tr.ant-table-row-selected')).toHaveLength(0)
  })

  it('should render selection dropdown when selections is true', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: { selections: true },
      },
      attachTo: document.body,
    })
    // When selections is set, header shows a dropdown arrow for select all/invert/none
    expect(wrapper.find('.ant-table-selection').exists()).toBe(true)
    wrapper.unmount()
  })

  it('should support custom selections', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: {
          selections: [
            { key: 'odd', text: 'Select Odd', onSelect: (keys: any) => keys },
          ],
        },
      },
      attachTo: document.body,
    })
    expect(wrapper.find('.ant-table-selection').exists()).toBe(true)
    wrapper.unmount()
  })

  it('should support onSelectAll callback', async () => {
    const onSelectAll = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: { onSelectAll },
      },
    })
    const headerCheckbox = wrapper.find('thead input[type="checkbox"]')
    await headerCheckbox.trigger('change')
    await nextTick()
    vi.advanceTimersByTime(100)
    await nextTick()
    expect(onSelectAll).toHaveBeenCalled()
  })

  it('should support onSelect callback', async () => {
    const onSelect = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: { onSelect },
      },
    })
    const checkboxes = wrapper.findAll('tbody input[type="checkbox"]')
    await checkboxes[0]!.trigger('change')
    await nextTick()
    vi.advanceTimersByTime(100)
    await nextTick()

    expect(onSelect).toHaveBeenCalled()
  })
})
