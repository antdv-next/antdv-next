import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
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

describe('table expand', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  // ====================== expandedRowRender ======================
  it('should render expand icon when expandedRowRender slot is provided', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
      slots: {
        expandedRowRender: ({ record }: any) => h('p', `Details for ${record.name}`),
      },
    })
    expect(wrapper.findAll('.ant-table-row-expand-icon').length).toBe(3)
  })

  it('should expand row when clicking expand icon', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
      slots: {
        expandedRowRender: ({ record }: any) => h('p', { class: 'expanded-content' }, `Details for ${record.name}`),
      },
    })
    // Click first expand icon
    const expandIcon = wrapper.find('.ant-table-row-expand-icon')
    await expandIcon.trigger('click')
    await nextTick()
    expect(wrapper.find('.expanded-content').exists()).toBe(true)
    expect(wrapper.find('.expanded-content').text()).toBe('Details for John')
  })

  it('should toggle expand icon state on click', async () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
      slots: {
        expandedRowRender: ({ record }: any) => h('p', { class: 'expanded-content' }, record.name),
      },
    })
    const expandIcon = wrapper.find('.ant-table-row-expand-icon')
    // Expand
    await expandIcon.trigger('click')
    await nextTick()
    expect(wrapper.find('.ant-table-row-expand-icon-expanded').exists()).toBe(true)
    // Collapse
    await wrapper.find('.ant-table-row-expand-icon-expanded').trigger('click')
    await nextTick()
    expect(wrapper.find('.ant-table-row-expand-icon-collapsed').exists()).toBe(true)
  })

  it('should support controlled expandedRowKeys', async () => {
    const expandedKeys = ref<string[]>(['1'])
    const wrapper = mount(() => (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        expandable={{ expandedRowKeys: expandedKeys.value }}
        v-slots={{
          expandedRowRender: ({ record }: any) => h('p', { class: 'expanded-content' }, record.name),
        }}
      />
    ))
    expect(wrapper.find('.expanded-content').exists()).toBe(true)
    expect(wrapper.find('.expanded-content').text()).toBe('John')

    // When collapsing, the expand icon state changes even if DOM is retained for animation
    expandedKeys.value = []
    await nextTick()
    // Verify the expand icon reverts to collapsed state
    expect(wrapper.find('.ant-table-row-expand-icon-expanded').exists()).toBe(false)
  })

  it('should support defaultExpandedRowKeys', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        expandable: { defaultExpandedRowKeys: ['2'] },
      },
      slots: {
        expandedRowRender: ({ record }: any) => h('p', { class: 'expanded-content' }, record.name),
      },
    })
    expect(wrapper.find('.expanded-content').text()).toBe('Jim')
  })

  it('should support defaultExpandAllRows', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        expandable: { defaultExpandAllRows: true },
      },
      slots: {
        expandedRowRender: ({ record }: any) => h('p', { class: 'expanded-content' }, record.name),
      },
    })
    expect(wrapper.findAll('.expanded-content')).toHaveLength(3)
  })

  it('should have correct aria labels on expand icon', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
      slots: {
        expandedRowRender: ({ record }: any) => h('p', record.name),
      },
    })
    const icon = wrapper.find('.ant-table-row-expand-icon')
    expect(icon.attributes('aria-expanded')).toBe('false')
    expect(icon.attributes('aria-label')).toBeDefined()
  })

  it('should mark expand icon as spaced when row is not expandable', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        expandable: {
          rowExpandable: (record: any) => record.name === 'John',
        },
      },
      slots: {
        expandedRowRender: ({ record }: any) => h('p', record.name),
      },
    })
    // John is expandable, others have spaced icon
    const spacedIcons = wrapper.findAll('.ant-table-row-expand-icon-spaced')
    expect(spacedIcons.length).toBe(2)
  })

  // ====================== Tree Data ======================
  it('should support tree data (children)', () => {
    const treeData = [
      {
        key: '1',
        name: 'John',
        age: 32,
        children: [
          { key: '1-1', name: 'John Jr', age: 5 },
        ],
      },
      { key: '2', name: 'Jim', age: 42 },
    ]
    const wrapper = mount(Table, {
      props: { columns, dataSource: treeData, pagination: false },
    })
    // Should auto detect nest expand type and show expand icons
    expect(wrapper.find('.ant-table-row-expand-icon').exists()).toBe(true)
  })

  it('should expand tree data on click', async () => {
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
      props: { columns, dataSource: treeData, pagination: false },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    await wrapper.find('.ant-table-row-expand-icon').trigger('click')
    await nextTick()
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('should support custom childrenColumnName', async () => {
    const treeData = [
      {
        key: '1',
        name: 'John',
        age: 32,
        subItems: [
          { key: '1-1', name: 'John Jr', age: 5 },
        ],
      },
    ]
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: treeData,
        pagination: false,
        expandable: { childrenColumnName: 'subItems' },
      },
    })
    expect(wrapper.find('.ant-table-row-expand-icon').exists()).toBe(true)
    await wrapper.find('.ant-table-row-expand-icon').trigger('click')
    await nextTick()
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  // ====================== Custom Expand Icon ======================
  it('should support custom expandIcon slot', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
      slots: {
        expandedRowRender: ({ record }: any) => h('p', record.name),
        expandIcon: ({ expanded, onExpand, record }: any) =>
          h('span', {
            class: 'custom-expand-icon',
            onClick: (e: MouseEvent) => onExpand(record, e),
          }, expanded ? '-' : '+'),
      },
    })
    expect(wrapper.find('.custom-expand-icon').exists()).toBe(true)
    expect(wrapper.find('.custom-expand-icon').text()).toBe('+')
  })

  // ====================== showExpandColumn ======================
  it('should hide expand column when showExpandColumn=false', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        expandable: { showExpandColumn: false },
      },
      slots: {
        expandedRowRender: ({ record }: any) => h('p', record.name),
      },
    })
    expect(wrapper.find('.ant-table-row-expand-icon').exists()).toBe(false)
  })

  // ====================== indentSize ======================
  it('should support custom indentSize for tree data', async () => {
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
        indentSize: 30,
        expandable: { defaultExpandAllRows: true },
      },
    })
    // With defaultExpandAllRows, child row should be visible
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    // The child row (indent level 1) should have padding-left = 1 * indentSize = 30px
    const rows = wrapper.findAll('tbody tr')
    const childRow = rows[1]!
    const indentCell = childRow.find('.ant-table-row-indent')
    if (indentCell.exists()) {
      expect(indentCell.attributes('style')).toContain('padding-left: 30px')
    }
  })

  // ====================== expandedRowClassName ======================
  it('should support expandedRowClassName', async () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        expandable: { defaultExpandedRowKeys: ['1'], expandedRowClassName: () => 'custom-expanded-row' },
      },
      slots: {
        expandedRowRender: ({ record }: any) => h('p', record.name),
      },
    })
    expect(wrapper.find('.custom-expanded-row').exists()).toBe(true)
  })

  // ====================== Emit update:expandedRowKeys ======================
  it('should emit update:expandedRowKeys when expanding', async () => {
    const onUpdate = vi.fn()
    const wrapper = mount(Table, {
      props: {
        'columns': columns,
        'dataSource': data,
        'pagination': false,
        'onUpdate:expandedRowKeys': onUpdate,
      },
      slots: {
        expandedRowRender: ({ record }: any) => h('p', record.name),
      },
    })
    await wrapper.find('.ant-table-row-expand-icon').trigger('click')
    await nextTick()
    expect(onUpdate).toHaveBeenCalled()
  })
})
