import { describe, expect, it, vi } from 'vitest'
import Table from '..'
import { mount } from '/@tests/utils'

const columns = [{ title: 'Name', dataIndex: 'name' }]
const firstPage = [{ key: '1', name: 'Order 1', amount: 100 }]
const secondPage = [{ key: '2', name: 'Order 2', amount: 200 }]

describe('table preserved selection records', () => {
  describe.each(['selectedRowKeys', 'defaultSelectedRowKeys'] as const)('%s', (keyProp) => {
    it.each([false, true])('preserves initial records when data is loaded later: %s', async (loadLater) => {
      const onChange = vi.fn()
      const wrapper = mount(Table, {
        props: {
          columns,
          dataSource: loadLater ? [] : firstPage,
          pagination: false,
          rowSelection: {
            [keyProp]: ['1'],
            preserveSelectedRowKeys: true,
            onChange,
          },
        },
      })
      if (loadLater) {
        await wrapper.setProps({ dataSource: firstPage })
      }
      expect(wrapper.findAll('tbody tr.ant-table-row-selected')).toHaveLength(1)

      await wrapper.setProps({ dataSource: secondPage })
      expect(onChange).not.toHaveBeenCalled()
      await wrapper.get('tbody input[type="checkbox"]').setValue(true)

      expect(onChange).toHaveBeenLastCalledWith(
        ['1', '2'],
        [firstPage[0], secondPage[0]],
        { type: 'single' },
      )
      wrapper.unmount()
    })

    it('preserves initial records when selecting all on another page', async () => {
      const onChange = vi.fn()
      const wrapper = mount(Table, {
        props: {
          columns,
          dataSource: firstPage,
          pagination: false,
          rowSelection: {
            [keyProp]: ['1'],
            preserveSelectedRowKeys: true,
            onChange,
          },
        },
      })
      await wrapper.setProps({ dataSource: secondPage })
      await wrapper.get('thead input[type="checkbox"]').setValue(true)

      expect(onChange).toHaveBeenLastCalledWith(
        ['1', '2'],
        [firstPage[0], secondPage[0]],
        { type: 'all' },
      )
      wrapper.unmount()
    })
  })

  it('caches existing selections when preservation is enabled', async () => {
    const onChange = vi.fn()
    const rowSelection = { selectedRowKeys: ['1'], preserveSelectedRowKeys: false, onChange }
    const wrapper = mount(Table, {
      props: { columns, dataSource: firstPage, pagination: false, rowSelection },
    })
    await wrapper.setProps({ rowSelection: { ...rowSelection, preserveSelectedRowKeys: true } })
    await wrapper.setProps({ dataSource: secondPage })
    await wrapper.get('tbody input[type="checkbox"]').setValue(true)

    expect(onChange).toHaveBeenLastCalledWith(
      ['1', '2'],
      [firstPage[0], secondPage[0]],
      { type: 'single' },
    )
    wrapper.unmount()
  })

  it('keeps the latest loaded record before it leaves the current page', async () => {
    const onChange = vi.fn()
    const refreshedOrder = { ...firstPage[0], amount: 150 }
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: firstPage,
        pagination: false,
        rowSelection: { preserveSelectedRowKeys: true, onChange },
      },
    })
    await wrapper.get('tbody input[type="checkbox"]').setValue(true)
    await wrapper.setProps({ dataSource: [refreshedOrder] })
    await wrapper.setProps({ dataSource: secondPage })
    await wrapper.get('tbody input[type="checkbox"]').setValue(true)

    expect(onChange).toHaveBeenLastCalledWith(
      ['1', '2'],
      [refreshedOrder, secondPage[0]],
      { type: 'single' },
    )
    wrapper.unmount()
  })

  it('keeps records selected by clicking before changing pages', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: firstPage,
        pagination: false,
        rowSelection: { preserveSelectedRowKeys: true, onChange },
      },
    })
    await wrapper.get('tbody input[type="checkbox"]').setValue(true)
    await wrapper.setProps({ dataSource: secondPage })
    await wrapper.get('tbody input[type="checkbox"]').setValue(true)

    expect(onChange).toHaveBeenLastCalledWith(
      ['1', '2'],
      [firstPage[0], secondPage[0]],
      { type: 'single' },
    )
    wrapper.unmount()
  })

  it('does not preserve missing records when preservation is disabled', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: firstPage,
        pagination: false,
        rowSelection: { defaultSelectedRowKeys: ['1'], preserveSelectedRowKeys: false, onChange },
      },
    })
    await wrapper.setProps({ dataSource: secondPage })
    await wrapper.get('tbody input[type="checkbox"]').setValue(true)

    expect(onChange).toHaveBeenLastCalledWith(['2'], secondPage, { type: 'single' })
    wrapper.unmount()
  })

  it('does not restore records that have been deselected', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: firstPage,
        pagination: false,
        rowSelection: { defaultSelectedRowKeys: ['1'], preserveSelectedRowKeys: true, onChange },
      },
    })
    await wrapper.get('tbody input[type="checkbox"]').setValue(false)
    await wrapper.setProps({ dataSource: secondPage })
    await wrapper.get('tbody input[type="checkbox"]').setValue(true)

    expect(onChange).toHaveBeenLastCalledWith(['2'], secondPage, { type: 'single' })
    wrapper.unmount()
  })

  it('supports initially selected tree rows before the data has loaded', async () => {
    const onChange = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource: [],
        pagination: false,
        rowSelection: {
          selectedRowKeys: ['1'],
          checkStrictly: false,
          preserveSelectedRowKeys: true,
          onChange,
        },
      },
    })
    await wrapper.setProps({ dataSource: firstPage })
    expect(wrapper.findAll('tbody tr.ant-table-row-selected')).toHaveLength(1)
    await wrapper.setProps({ dataSource: secondPage })
    await wrapper.get('tbody input[type="checkbox"]').setValue(true)

    expect(onChange).toHaveBeenLastCalledWith(
      ['1', '2'],
      [firstPage[0], secondPage[0]],
      { type: 'single' },
    )
    wrapper.unmount()
  })
})
