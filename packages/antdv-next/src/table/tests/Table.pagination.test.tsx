import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, ref } from 'vue'
import Table from '..'
import { mount } from '/@tests/utils'

const columns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
]

function generateData(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    key: String(i),
    name: `Name ${i}`,
  }))
}

describe('table pagination', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
  })

  it('should show pagination by default when data > 10', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: generateData(15) },
    })
    expect(wrapper.find('.ant-pagination').exists()).toBe(true)
  })

  it('should show all rows on single page when data fits default pageSize', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: generateData(5) },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(5)
  })

  it('should hide pagination when pagination=false', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: generateData(20), pagination: false },
    })
    expect(wrapper.find('.ant-pagination').exists()).toBe(false)
    // All rows visible
    expect(wrapper.findAll('tbody tr')).toHaveLength(20)
  })

  it('should support custom pageSize', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: generateData(20), pagination: { pageSize: 5 } },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(5)
  })

  it('should support defaultPageSize', () => {
    const wrapper = mount(Table, {
      props: { columns, dataSource: generateData(20), pagination: { defaultPageSize: 5 } },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(5)
  })

  it('should support defaultCurrent', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: generateData(20),
        pagination: { defaultCurrent: 2, pageSize: 10 },
      },
    })
    const firstCell = wrapper.find('tbody tr td')
    expect(firstCell.text()).toBe('Name 10')
  })

  it('should emit onChange when page changes', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: generateData(20),
        pagination: { pageSize: 10 },
        onChange,
      },
    })
    // Click page 2
    const page2 = wrapper.findAll('.ant-pagination-item').find(el => el.text() === '2')
    expect(page2).toBeDefined()
    await page2!.trigger('click')
    await nextTick()
    expect(onChange).toHaveBeenCalled()
    const args = onChange.mock.calls[0]!
    // First arg is pagination
    expect(args[0].current).toBe(2)
    // Fourth arg is extra with action
    expect(args[3].action).toBe('paginate')
  })

  it('should support controlled pagination via current', async () => {
    const current = ref(1)
    const wrapper = mount(() => (
      <Table
        columns={columns}
        dataSource={generateData(20)}
        pagination={{ current: current.value, pageSize: 10 }}
      />
    ))
    expect(wrapper.find('tbody tr td').text()).toBe('Name 0')
    current.value = 2
    await nextTick()
    expect(wrapper.find('tbody tr td').text()).toBe('Name 10')
  })

  // ====================== Pagination Placement ======================
  it('should support placement=["topEnd"]', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: generateData(20),
        pagination: { placement: ['topEnd'] },
      },
    })
    // Top pagination should exist
    expect(wrapper.find('.ant-table-pagination-end').exists()).toBe(true)
  })

  it('should support placement=["bottomCenter"]', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: generateData(20),
        pagination: { placement: ['bottomCenter'] },
      },
    })
    expect(wrapper.find('.ant-table-pagination-center').exists()).toBe(true)
  })

  it('should support both top and bottom placement', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: generateData(20),
        pagination: { placement: ['topStart', 'bottomEnd'] },
      },
    })
    const paginationNodes = wrapper.findAll('.ant-table-pagination')
    expect(paginationNodes.length).toBe(2)
  })

  it('should hide pagination when placement=["none"]', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: generateData(20),
        pagination: { placement: ['none'] },
      },
    })
    expect(wrapper.find('.ant-pagination').exists()).toBe(false)
  })

  // ====================== Pagination + Size ======================
  it('should use small pagination size when table is small', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: generateData(20),
        size: 'small',
      },
    })
    expect(wrapper.find('.ant-pagination-mini').exists()).toBe(true)
  })

  it('should use small pagination size when table is middle', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: generateData(20),
        size: 'middle',
      },
    })
    expect(wrapper.find('.ant-pagination-mini').exists()).toBe(true)
  })

  it('should use small pagination size when table is medium', () => {
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: generateData(20),
        size: 'medium',
      },
    })
    expect(wrapper.find('.ant-pagination-mini').exists()).toBe(true)
  })

  // https://github.com/antdv-next/antdv-next/issues/780
  it('should forward pagination config classes/styles when Table-level semantic is absent', () => {
    const wrapper = mount(() => (
      <Table
        columns={columns}
        dataSource={generateData(20)}
        pagination={{
          total: 20,
          classes: { root: 'cfg-pagination-cls' },
          styles: { root: { marginBottom: '0px' } },
        }}
      />
    ), { attachTo: document.body })

    const pager = wrapper.find('.ant-pagination')
    expect(pager.exists()).toBe(true)
    expect(pager.classes()).toContain('cfg-pagination-cls')
    expect((pager.element as HTMLElement).style.marginBottom).toBe('0px')
    wrapper.unmount()
  })

  it('should keep pagination config classes/styles when Table classes/styles target the table root', () => {
    const wrapper = mount(() => (
      <Table
        columns={columns}
        dataSource={generateData(20)}
        pagination={{
          total: 20,
          classes: { root: 'cfg-pagination-cls' },
          styles: { root: { marginBottom: '0px' } },
        }}
        classes={{ root: 'table-root-cls' }}
        styles={{ root: { marginTop: '8px' } }}
      />
    ), { attachTo: document.body })

    const pager = wrapper.find('.ant-pagination')
    expect(pager.classes()).toContain('cfg-pagination-cls')
    expect((pager.element as HTMLElement).style.marginBottom).toBe('0px')
    expect(wrapper.find('.ant-table-wrapper').classes()).toContain('table-root-cls')
    expect((wrapper.find('.ant-table-wrapper').element as HTMLElement).style.marginTop).toBe('8px')
    wrapper.unmount()
  })

  it('should keep supporting Table-level pagination classes/styles', () => {
    const wrapper = mount(() => (
      <Table
        columns={columns}
        dataSource={generateData(20)}
        classes={{ pagination: { root: 'table-pagination-cls' } }}
        styles={{ pagination: { root: { marginTop: '8px' } } }}
      />
    ), { attachTo: document.body })

    const pager = wrapper.find('.ant-pagination')
    expect(pager.classes()).toContain('table-pagination-cls')
    expect((pager.element as HTMLElement).style.marginTop).toBe('8px')
    wrapper.unmount()
  })

  it('should prefer pagination config classes/styles when both APIs are used', () => {
    const wrapper = mount(() => (
      <Table
        columns={columns}
        dataSource={generateData(20)}
        pagination={{
          classes: { root: 'config-pagination-cls' },
          styles: { root: { marginBottom: '4px' } },
        }}
        classes={{ pagination: { root: 'table-pagination-cls' } }}
        styles={{ pagination: { root: { marginTop: '8px' } } }}
      />
    ), { attachTo: document.body })

    const pager = wrapper.find('.ant-pagination')
    expect(pager.classes()).toContain('config-pagination-cls')
    expect(pager.classes()).not.toContain('table-pagination-cls')
    expect((pager.element as HTMLElement).style.marginBottom).toBe('4px')
    expect((pager.element as HTMLElement).style.marginTop).toBe('')
    wrapper.unmount()
  })
})
