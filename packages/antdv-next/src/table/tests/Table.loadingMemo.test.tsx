import { describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
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

describe('table loading memoization', () => {
  it('does not re-run bodyCell when toggling loading', async () => {
    const bodyCell = vi.fn(({ text }: any) => text)

    const wrapper = mount(Table, {
      props: { columns, dataSource: data, loading: false },
      slots: {
        bodyCell: (scope: any) => bodyCell(scope),
      },
    })
    await nextTick()

    const initial = bodyCell.mock.calls.length
    expect(initial).toBeGreaterThan(0)

    await wrapper.setProps({ loading: true })
    await nextTick()
    expect(bodyCell.mock.calls.length).toBe(initial)

    await wrapper.setProps({ loading: false })
    await nextTick()
    expect(bodyCell.mock.calls.length).toBe(initial)
  })

  it('still re-runs bodyCell when the data changes', async () => {
    const bodyCell = vi.fn(({ text }: any) => text)

    const wrapper = mount(Table, {
      props: { columns, dataSource: data, loading: false },
      slots: {
        bodyCell: (scope: any) => bodyCell(scope),
      },
    })
    await nextTick()
    const initial = bodyCell.mock.calls.length

    await wrapper.setProps({
      dataSource: [...data.slice(0, 2), { key: '3', name: 'Joe-next', age: 23 }],
    })
    await nextTick()
    expect(bodyCell.mock.calls.length).toBeGreaterThan(initial)
  })
})
