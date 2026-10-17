import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import Table from '..'
import ConfigProvider from '../../config-provider'
import Dropdown from '../../dropdown'
import enUS from '../../locale/en_US'
import frFR from '../../locale/fr_FR'
import zhTW from '../../locale/zh_TW'
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

function getSelections(wrapper: any) {
  return wrapper
    .findAll('tbody tr.ant-table-row')
    .filter((row: any) => (row.find('input[type="checkbox"]').element as HTMLInputElement).checked)
    .map((row: any) => row.attributes('data-row-key'))
}

async function clickSelectionMenuItem(wrapper: any) {
  await wrapper.find('.ant-table-selection .ant-dropdown-trigger').trigger('mouseenter')
  vi.runAllTimers()
  await nextTick()
  const item = document.body.querySelector<HTMLElement>('li.ant-dropdown-menu-item')!
  item.click()
  await nextTick()
}

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

  // https://github.com/ant-design/ant-design/pull/58275
  it('should have default aria-label on body checkboxes', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false, rowSelection: {} },
    })
    const checkboxes = wrapper.findAll('tbody .ant-checkbox-wrapper')
    expect(checkboxes[0]!.attributes('aria-label')).toBe('Select row')
    expect(checkboxes[1]!.attributes('aria-label')).toBe('Select row')
    expect(checkboxes[2]!.attributes('aria-label')).toBe('Select row')
  })

  it('should have default aria-label on radios and selected rows', () => {
    const radioWrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false, rowSelection: { type: 'radio' } },
    })
    const radios = radioWrapper.findAll('tbody .ant-radio-wrapper')
    expect(radios[0]!.attributes('aria-label')).toBe('Select row')
    expect(radios[1]!.attributes('aria-label')).toBe('Select row')

    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false, rowSelection: { defaultSelectedRowKeys: ['1', '2'] } },
    })
    const checkboxes = wrapper.findAll('tbody .ant-checkbox-wrapper')
    expect(checkboxes[0]!.attributes('aria-label')).toBe('Row selected')
    expect(checkboxes[1]!.attributes('aria-label')).toBe('Row selected')
    expect(checkboxes[2]!.attributes('aria-label')).toBe('Select row')
  })

  it('should localize row selection accessible names', async () => {
    const locale = ref<any>(zhTW)
    const type = ref<'checkbox' | 'radio'>('checkbox')
    const wrapper = mount(() => (
      <ConfigProvider locale={locale.value}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowSelection={{ type: type.value, defaultSelectedRowKeys: ['1'], selections: true }}
        />
      </ConfigProvider>
    ))

    expect(wrapper.find('thead .ant-checkbox-wrapper').attributes('aria-label')).toBe('選取目前頁面')
    const checkboxes = wrapper.findAll('tbody .ant-checkbox-wrapper')
    expect(checkboxes[0]!.attributes('aria-label')).toBe('列已選取')
    expect(checkboxes[1]!.attributes('aria-label')).toBe('選取列')
    expect(wrapper.find('.ant-table-selection-extra [role="button"]').attributes('aria-label')).toBe('選取選單')

    locale.value = frFR
    await nextTick()
    const frCheckboxes = wrapper.findAll('tbody .ant-checkbox-wrapper')
    expect(frCheckboxes[0]!.attributes('aria-label')).toBe('Ligne sélectionnée')
    expect(frCheckboxes[1]!.attributes('aria-label')).toBe('Sélectionner la ligne')
    expect(wrapper.find('.ant-table-selection-extra [role="button"]').attributes('aria-label')).toBe('Menu de sélection')

    locale.value = {
      ...enUS,
      locale: 'custom',
      Table: {
        ...enUS.Table,
        selectAll: 'Choose all rows',
        selectRow: 'Choose row',
        selectedRow: 'Row chosen',
        selectionMenu: 'Choose rows menu',
      },
    }
    await nextTick()
    expect(wrapper.find('thead .ant-checkbox-wrapper').attributes('aria-label')).toBe('Choose all rows')
    expect(wrapper.findAll('tbody .ant-checkbox-wrapper')[1]!.attributes('aria-label')).toBe('Choose row')
    expect(wrapper.find('.ant-table-selection-extra [role="button"]').attributes('aria-label')).toBe('Choose rows menu')

    type.value = 'radio'
    locale.value = zhTW
    await nextTick()
    expect(wrapper.findAll('tbody .ant-radio-wrapper')[1]!.attributes('aria-label')).toBe('選取列')
  })

  it('should fall back to English accessible names for a custom locale', () => {
    const wrapper = mount(() => (
      <ConfigProvider locale={{ locale: 'custom' } as any}>
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowSelection={{ defaultSelectedRowKeys: ['1'], selections: true }}
        />
      </ConfigProvider>
    ))
    const checkboxes = wrapper.findAll('tbody .ant-checkbox-wrapper')
    expect(checkboxes[0]!.attributes('aria-label')).toBe('Row selected')
    expect(checkboxes[1]!.attributes('aria-label')).toBe('Select row')
    expect(wrapper.find('.ant-table-selection-extra [role="button"]').attributes('aria-label')).toBe('Selection menu')
  })

  it('should fall back when selectAll is not a string', () => {
    const wrapper = mount(() => (
      <ConfigProvider locale={{ ...enUS, Table: { ...enUS.Table, selectAll: <span>Select all rows</span> } } as any}>
        <Table columns={columns} dataSource={data} pagination={false} rowSelection={{}} />
      </ConfigProvider>
    ))
    expect(wrapper.find('thead .ant-checkbox-wrapper').attributes('aria-label')).toBe('Select all')
  })

  it('should make the selection menu keyboard accessible', async () => {
    const wrapper = mount(() => (
      <ConfigProvider locale={zhTW}>
        <Table columns={columns} dataSource={data} pagination={false} rowSelection={{ selections: true }} />
      </ConfigProvider>
    ), { attachTo: document.body })
    const menuTrigger = wrapper.find('.ant-table-selection-extra [role="button"]')

    expect(menuTrigger.element.tagName).toBe('SPAN')
    expect(menuTrigger.attributes('tabindex')).toBe('0')
    expect(menuTrigger.attributes('aria-label')).toBe('選取選單')
    expect(menuTrigger.attributes('aria-haspopup')).toBe('menu')
    expect(menuTrigger.attributes('aria-expanded')).toBe('false')

    await menuTrigger.trigger('keydown', { key: 'Enter' })
    vi.runAllTimers()
    await nextTick()
    expect(wrapper.find('.ant-table-selection-extra [role="button"]').attributes('aria-expanded')).toBe('true')

    await wrapper.find('.ant-table-selection-extra [role="button"]').trigger('click')
    vi.runAllTimers()
    await nextTick()
    expect(wrapper.find('.ant-table-selection-extra [role="button"]').attributes('aria-expanded')).toBe('false')

    await wrapper.find('.ant-table-selection-extra [role="button"]').trigger('keydown', { key: ' ' })
    vi.runAllTimers()
    await nextTick()
    expect(wrapper.find('.ant-table-selection-extra [role="button"]').attributes('aria-expanded')).toBe('true')
    wrapper.unmount()
  })

  it('should support custom aria-label from getCheckboxProps', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: {
          getCheckboxProps: (record: any) => ({ 'aria-label': `Select ${record.name}` }),
        },
      },
    })
    const checkboxes = wrapper.findAll('tbody .ant-checkbox-wrapper')
    expect(checkboxes[0]!.attributes('aria-label')).toBe('Select John')
    expect(checkboxes[1]!.attributes('aria-label')).toBe('Select Jim')
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

  it('should use theme selectionColumnWidth by default for rowSelection', async () => {
    const wrapper = mount(() => (
      <ConfigProvider
        theme={{
          components: {
            Table: {
              selectionColumnWidth: 80,
            },
          },
        }}
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowSelection={{}}
        />
      </ConfigProvider>
    ))

    await nextTick()

    const selectionCol = wrapper.find('.ant-table-selection-col')
    expect(selectionCol.exists()).toBe(true)
    expect(selectionCol.attributes('style') || selectionCol.attributes('width')).toContain('80')
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

  it('should include tree descendants when SELECTION_ALL is used', async () => {
    const onChange = vi.fn()
    const treeData = [
      {
        key: 'parent',
        name: 'Parent',
        children: [
          { key: 'child-1', name: 'Child 1' },
          { key: 'child-2', name: 'Child 2' },
        ],
      },
    ]
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: treeData,
        pagination: false,
        expandable: { defaultExpandAllRows: true },
        rowSelection: {
          onChange,
          selections: [Table.SELECTION_ALL],
        },
      },
      attachTo: document.body,
    })

    const dropdown = wrapper.findComponent(Dropdown)
    expect(dropdown.exists()).toBe(true)
    dropdown.vm.$emit('menuClick', { key: 'all' })
    await nextTick()
    vi.advanceTimersByTime(100)
    await nextTick()
    expect(onChange).toHaveBeenCalledWith(
      ['parent', 'child-1', 'child-2'],
      expect.anything(),
      { type: 'all' },
    )
    wrapper.unmount()
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

  it.each(['children', 'nodes'])(
    'SELECTION_ALL should select tree descendants across pages with %s',
    async (childrenColumnName) => {
      const onChange = vi.fn()
      const grandchild = { key: 'grandchild', name: 'Grandchild' }
      const child = { key: 'child', name: 'Child', [childrenColumnName]: [grandchild] }
      const parent = { key: 'parent', name: 'Parent', [childrenColumnName]: [child] }
      const disabledChild = { key: 'disabled', name: 'Disabled', disabled: true }
      const selectedChild = { key: 'selected', name: 'Selected', disabled: true }
      const otherChild = { key: 'other-child', name: 'Other child' }
      const otherParent = {
        key: 'other-parent',
        name: 'Other parent',
        [childrenColumnName]: [disabledChild, selectedChild, otherChild],
      }
      const wrapper = mount(Table, {
        props: {
          columns,
          dataSource: [parent, otherParent],
          pagination: { pageSize: 1 },
          expandable: { childrenColumnName, defaultExpandAllRows: true },
          rowSelection: {
            onChange,
            defaultSelectedRowKeys: ['selected'],
            getCheckboxProps: (record: any) => ({ disabled: record.disabled }),
            selections: [Table.SELECTION_ALL],
          },
        },
        attachTo: document.body,
      })

      await clickSelectionMenuItem(wrapper)

      expect(onChange).toHaveBeenCalledWith(
        ['parent', 'child', 'grandchild', 'other-parent', 'selected', 'other-child'],
        [parent, child, grandchild, otherParent, selectedChild, otherChild],
        { type: 'all' },
      )
      expect(getSelections(wrapper)).toEqual(['parent', 'child', 'grandchild'])
      expect((wrapper.find('thead input[type="checkbox"]').element as HTMLInputElement).checked).toBe(true)
      expect(wrapper.find('thead .ant-checkbox-indeterminate').exists()).toBe(false)

      await wrapper.find('.ant-pagination-item-2').trigger('click')
      await wrapper.find('.ant-table-row-expand-icon').trigger('click')
      expect(getSelections(wrapper)).toEqual(['other-parent', 'selected', 'other-child'])
      wrapper.unmount()
    },
  )

  it.each(['children', 'nodes'])(
    'SELECTION_INVERT should invert current-page descendants with %s',
    async (childrenColumnName) => {
      const onChange = vi.fn()
      const grandchild = { key: 'grandchild', name: 'Grandchild' }
      const child = { key: 'child', name: 'Child', [childrenColumnName]: [grandchild] }
      const disabledChild = { key: 'disabled', name: 'Disabled', disabled: true }
      const selectedChild = { key: 'selected', name: 'Selected', disabled: true }
      const parent = {
        key: 'parent',
        name: 'Parent',
        [childrenColumnName]: [child, disabledChild, selectedChild],
      }
      const otherParent = { key: 'other-parent', name: 'Other parent' }
      const wrapper = mount(Table, {
        props: {
          columns,
          dataSource: [parent, otherParent],
          pagination: { pageSize: 1 },
          expandable: { childrenColumnName, defaultExpandAllRows: true },
          rowSelection: {
            onChange,
            defaultSelectedRowKeys: ['child', 'selected', 'other-parent'],
            getCheckboxProps: (record: any) => ({ disabled: record.disabled }),
            selections: [Table.SELECTION_INVERT],
          },
        },
        attachTo: document.body,
      })

      await clickSelectionMenuItem(wrapper)

      expect(onChange).toHaveBeenLastCalledWith(
        ['selected', 'other-parent', 'parent', 'grandchild'],
        [selectedChild, otherParent, parent, grandchild],
        { type: 'invert' },
      )
      expect(getSelections(wrapper)).toEqual(['parent', 'grandchild', 'selected'])

      await clickSelectionMenuItem(wrapper)

      expect(onChange).toHaveBeenLastCalledWith(
        ['selected', 'other-parent', 'child'],
        [selectedChild, otherParent, child],
        { type: 'invert' },
      )
      expect(getSelections(wrapper)).toEqual(['child', 'selected'])
      wrapper.unmount()
    },
  )

  const presetData = [
    { key: 0, name: 'Jack' },
    { key: 1, name: 'Lucy', disabled: true },
    { key: 2, name: 'Tom' },
  ]

  it.each([1, 2])('SELECTION_NONE should preserve disabled rows from page %s', async (current) => {
    const onChange = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: presetData,
        pagination: { defaultCurrent: current, pageSize: 1 },
        rowSelection: {
          onChange,
          defaultSelectedRowKeys: [0, 1, 2],
          getCheckboxProps: (record: any) => ({ disabled: record.disabled }),
          selections: [Table.SELECTION_NONE],
        },
      },
      attachTo: document.body,
    })

    await clickSelectionMenuItem(wrapper)

    expect(onChange).toHaveBeenCalledWith([1], [presetData[1]], { type: 'none' })
    await wrapper.find('.ant-pagination-item-2').trigger('click')
    expect(getSelections(wrapper)).toEqual(['1'])
    wrapper.unmount()
  })

  it('SELECTION_NONE should use preserved records and ignore missing records', async () => {
    const onChange = vi.fn()
    const rowSelection = {
      onChange,
      defaultSelectedRowKeys: [1, 2, 'missing'],
      preserveSelectedRowKeys: true,
      getCheckboxProps: (record: any) => ({ disabled: record.disabled }),
      selections: [Table.SELECTION_NONE],
    }
    const wrapper = mount(Table, {
      props: { columns, dataSource: presetData, rowSelection },
      attachTo: document.body,
    })

    await wrapper.setProps({ dataSource: [presetData[0]] })
    await clickSelectionMenuItem(wrapper)

    expect(onChange).toHaveBeenCalledWith([1], [presetData[1]], { type: 'none' })
    wrapper.unmount()
  })

  it('selects a range when shift-clicking row checkboxes', async () => {
    const onChange = vi.fn()
    const onSelect = vi.fn()
    const onSelectMultiple = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowSelection: { onChange, onSelect, onSelectMultiple },
      },
      attachTo: document.body,
    })

    await wrapper.findAll('tbody input[type="checkbox"]')[0]!.trigger('click')
    expect(onSelect).toHaveBeenLastCalledWith(data[0], true, [data[0]], expect.any(MouseEvent))

    await wrapper.findAll('tbody input[type="checkbox"]')[2]!.trigger('click', { shiftKey: true })

    expect(onSelectMultiple).toHaveBeenCalledWith(true, data, [data[1], data[2]])
    expect(onChange).toHaveBeenLastCalledWith(['1', '2', '3'], data, { type: 'multiple' })
    expect(wrapper.findAll('tbody tr.ant-table-row-selected')).toHaveLength(3)
    wrapper.unmount()
  })
})
