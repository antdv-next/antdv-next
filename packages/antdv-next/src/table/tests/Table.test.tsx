import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick, ref } from 'vue'
import Table, { Column, ColumnGroup, EXPAND_COLUMN, SELECTION_ALL, SELECTION_COLUMN, SELECTION_INVERT, SELECTION_NONE, Summary, SummaryCell, SummaryRow } from '..'
import ConfigProvider from '../../config-provider'
import mountTest from '/@tests/shared/mountTest'
import rtlTest from '/@tests/shared/rtlTest'
import { mount } from '/@tests/utils'

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
]

const data = [
  { key: '1', name: 'John', age: 32, address: 'New York' },
  { key: '2', name: 'Jim', age: 42, address: 'London' },
  { key: '3', name: 'Joe', age: 22, address: 'Sidney' },
]

describe('table', () => {
  mountTest(Table)
  rtlTest(() => h(Table, { columns, dataSource: data }))

  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  // ========================= Static Exports =========================
  it('should export sub-components and constants', () => {
    expect(Table.Column).toBeDefined()
    expect(Table.ColumnGroup).toBeDefined()
    expect(Table.Summary).toBeDefined()
    expect(Column).toBeDefined()
    expect(ColumnGroup).toBeDefined()
    expect(Summary).toBeDefined()
    expect(SummaryRow).toBeDefined()
    expect(SummaryCell).toBeDefined()
    expect(SELECTION_COLUMN).toBeDefined()
    expect(EXPAND_COLUMN).toBeDefined()
    expect(SELECTION_ALL).toBeDefined()
    expect(SELECTION_INVERT).toBeDefined()
    expect(SELECTION_NONE).toBeDefined()
  })

  // ========================= Basic Rendering =========================
  it('should render basic table with columns and data', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    expect(wrapper.find('.ant-table-wrapper').exists()).toBe(true)
    expect(wrapper.find('.ant-table').exists()).toBe(true)
    expect(wrapper.findAll('thead th')).toHaveLength(3)
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
  })

  it('should render column headers', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    const headers = wrapper.findAll('thead th')
    expect(headers[0]!.text()).toBe('Name')
    expect(headers[1]!.text()).toBe('Age')
    expect(headers[2]!.text()).toBe('Address')
  })

  it('should render cell data', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    const firstRow = wrapper.findAll('tbody tr')[0]!
    const cells = firstRow.findAll('td')
    expect(cells[0]!.text()).toBe('John')
    expect(cells[1]!.text()).toBe('32')
    expect(cells[2]!.text()).toBe('New York')
  })

  it('should render empty table when no data', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: [] },
    })
    expect(wrapper.find('.ant-table-empty').exists()).toBe(true)
    expect(wrapper.find('.ant-table-placeholder').exists()).toBe(true)
  })

  it('should render JSX columns via Column and ColumnGroup', () => {
    // @ts-expect-error ColumnGroup generic props cause JSX overload resolution issues
    const columnGroup = <ColumnGroup title="Name"><Column title="First Name" dataIndex="name" key="name" /></ColumnGroup>
    const wrapper = mount(
      () => (
        <Table dataSource={data} pagination={false}>
          {columnGroup}
          <Column title="Age" dataIndex="age" key="age" />
        </Table>
      ),
    )
    expect(wrapper.findAll('thead th').length).toBeGreaterThanOrEqual(2)
  })

  // ========================= rowKey =========================
  it('should support rowKey as string', () => {
    const noKeyData = [
      { id: '1', name: 'John', age: 32 },
      { id: '2', name: 'Jim', age: 42 },
    ]
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name' }],
        dataSource: noKeyData,
        rowKey: 'id',
        pagination: false,
      },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  it('should support rowKey as function', () => {
    const noKeyData = [
      { id: '1', name: 'John', age: 32 },
      { id: '2', name: 'Jim', age: 42 },
    ]
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name' }],
        dataSource: noKeyData,
        rowKey: (record: any) => record.id,
        pagination: false,
      },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
  })

  // ========================= Size =========================
  it.each([
    ['middle', 'ant-table-middle'],
    ['small', 'ant-table-small'],
  ])('should support size="%s"', (size, expectedClass) => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, size: size as any },
    })
    expect(wrapper.find(`.${expectedClass}`).exists()).toBe(true)
  })

  it('should inherit size from ConfigProvider', () => {
    const wrapper = mount(() => (
      <ConfigProvider componentSize="small">
        <Table columns={columns} dataSource={data} />
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-table-small').exists()).toBe(true)
  })

  // ========================= Bordered =========================
  it('should support bordered', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, bordered: true },
    })
    expect(wrapper.find('.ant-table-bordered').exists()).toBe(true)
  })

  it('should not have bordered class by default', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data },
    })
    expect(wrapper.find('.ant-table-bordered').exists()).toBe(false)
  })

  // ========================= Loading =========================
  it('should support loading as boolean', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, loading: true },
    })
    expect(wrapper.find('.ant-spin-spinning').exists()).toBe(true)
  })

  it('should not show spinner when loading is false', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, loading: false },
    })
    expect(wrapper.find('.ant-spin-spinning').exists()).toBe(false)
  })

  it('should support loading as object', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, loading: { tip: 'Loading...' } },
    })
    expect(wrapper.find('.ant-spin-spinning').exists()).toBe(true)
  })

  // ========================= Locale =========================
  it('should support custom empty text via locale', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: [],
        locale: { emptyText: 'No Data Here' },
      },
    })
    expect(wrapper.text()).toContain('No Data Here')
  })

  // ========================= Slots =========================
  it('should support title slot', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data },
      slots: { title: () => 'Table Title' },
    })
    expect(wrapper.text()).toContain('Table Title')
  })

  it('should support footer slot', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data },
      slots: { footer: () => 'Table Footer' },
    })
    expect(wrapper.text()).toContain('Table Footer')
  })

  it('should support emptyText slot', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: [] },
      slots: { emptyText: () => 'Custom Empty' },
    })
    expect(wrapper.text()).toContain('Custom Empty')
  })

  it('should support bodyCell slot', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', key: 'name' }],
        dataSource: [{ key: '1', name: 'John' }],
        pagination: false,
      },
      slots: {
        bodyCell: ({ text }: any) => h('strong', text),
      },
    })
    expect(wrapper.find('tbody td strong').exists()).toBe(true)
    expect(wrapper.find('tbody td strong').text()).toBe('John')
  })

  it('should support headerCell slot', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [{ title: 'Name', dataIndex: 'name', key: 'name' }],
        dataSource: [{ key: '1', name: 'John' }],
        pagination: false,
      },
      slots: {
        headerCell: ({ column }: any) => h('em', column.title),
      },
    })
    expect(wrapper.find('thead th em').exists()).toBe(true)
    expect(wrapper.find('thead th em').text()).toBe('Name')
  })

  // ========================= Attrs Passthrough =========================
  it('should pass data attributes', () => {
    const wrapper = mount(() => (
      <Table columns={columns} dataSource={data} data-testid="my-table" />
    ))
    expect(wrapper.find('[data-testid="my-table"]').exists()).toBe(true)
  })

  it('should apply rootClass', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, rootClass: 'custom-root' },
    })
    expect(wrapper.find('.ant-table-wrapper').classes()).toContain('custom-root')
  })

  it('should pass style to wrapper', () => {
    const wrapper = mount(() => (
      <Table columns={columns} dataSource={data} style={{ marginTop: '10px' }} />
    ))
    expect(wrapper.find('.ant-table-wrapper').attributes('style')).toContain('margin-top: 10px')
  })

  // ========================= RTL =========================
  it('should support RTL direction', () => {
    const wrapper = mount(() => (
      <ConfigProvider direction="rtl">
        <Table columns={columns} dataSource={data} />
      </ConfigProvider>
    ))
    expect(wrapper.find('.ant-table-wrapper-rtl').exists()).toBe(true)
  })

  // ========================= Dynamic Update =========================
  it('should update when columns change', async () => {
    const cols = ref([{ title: 'Name', dataIndex: 'name', key: 'name' }])
    const wrapper = mount(() => (
      <Table columns={cols.value} dataSource={data} pagination={false} />
    ))
    expect(wrapper.findAll('thead th')).toHaveLength(1)
    cols.value = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age' },
    ]
    await nextTick()
    expect(wrapper.findAll('thead th')).toHaveLength(2)
  })

  it('should update when dataSource changes', async () => {
    const ds = ref<any[]>([])
    const wrapper = mount(() => (
      <Table columns={columns} dataSource={ds.value} pagination={false} />
    ))
    expect(wrapper.find('.ant-table-empty').exists()).toBe(true)
    ds.value = data
    await nextTick()
    expect(wrapper.findAll('tbody tr')).toHaveLength(3)
  })

  // ========================= Pagination disabled =========================
  it('should not show pagination when pagination=false', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false },
    })
    expect(wrapper.find('.ant-pagination').exists()).toBe(false)
  })

  // ========================= Scroll =========================
  it('should support scroll.x', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        scroll: { x: 1000 },
        pagination: false,
      },
    })
    expect(wrapper.find('.ant-table').exists()).toBe(true)
  })

  it('should support scroll.y', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        scroll: { y: 300 },
        pagination: false,
      },
    })
    expect(wrapper.find('.ant-table').exists()).toBe(true)
  })

  // ========================= Responsive Columns =========================
  it('should support responsive columns', () => {
    const responsiveCols = [
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Age', dataIndex: 'age', key: 'age', responsive: ['lg'] as any },
    ]
    const wrapper = mount(Table, {
      props: { columns: responsiveCols, dataSource: data, pagination: false },
    })
    // In jsdom, window.matchMedia returns false for all queries,
    // so responsive columns are filtered out
    expect(wrapper.find('.ant-table').exists()).toBe(true)
  })

  // ========================= rowClassName =========================
  it('should support rowClassName as string', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false, rowClassName: 'custom-row' },
    })
    const rows = wrapper.findAll('tbody tr.ant-table-row')
    rows.forEach((row) => {
      expect(row.classes()).toContain('custom-row')
    })
  })

  it('should support rowClassName as function', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data,
        pagination: false,
        rowClassName: (_record: any, index: number) => index === 0 ? 'first-row' : 'other-row',
      },
    })
    const rows = wrapper.findAll('tbody tr.ant-table-row')
    expect(rows[0]!.classes()).toContain('first-row')
    expect(rows[1]!.classes()).toContain('other-row')
    expect(rows[2]!.classes()).toContain('other-row')
  })

  // ========================= showHeader =========================
  it('should hide header when showHeader is false', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: data, pagination: false, showHeader: false },
    })
    expect(wrapper.find('thead').exists()).toBe(false)
  })

  // ========================= Snapshot =========================
  it('should match snapshot', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: data.slice(0, 1),
        pagination: false,
      },
    })
    expect(wrapper.element).toMatchSnapshot()
  })
})
