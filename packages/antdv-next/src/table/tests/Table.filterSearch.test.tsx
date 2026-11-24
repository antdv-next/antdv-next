import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Table from '..'
import { mount, waitFakeTimer } from '/@tests/utils'

async function typeSearch(value: string) {
  const input = document.querySelector<HTMLInputElement>('.ant-table-filter-dropdown-search input')!
  input.value = value
  input.dispatchEvent(new Event('input', { bubbles: true }))
  await waitFakeTimer()
}

// https://github.com/ant-design/ant-design/pull/59735
describe('table custom filter search input', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it.each([
    { filterMode: 'menu' as const, query: 'SKU' },
    { filterMode: 'tree' as const, query: 'SKU' },
    { filterMode: 'menu' as const, query: ' SKU ' },
    { filterMode: 'tree' as const, query: ' SKU ' },
  ])('preserves the query "$query" in $filterMode mode', async ({ filterMode, query }) => {
    const filterSearch = vi.fn((input: string, record: { value: unknown }) =>
      String(record.value).startsWith(input),
    )
    const wrapper = mount(Table, {
      props: {
        pagination: false,
        dataSource: [],
        columns: [
          {
            title: 'Product code',
            dataIndex: 'code',
            filters: [
              { text: `${query}-001`, value: `${query}-001` },
              { text: 'sku-002', value: 'sku-002' },
            ],
            filterMode,
            filterSearch,
          },
        ],
      },
      attachTo: document.body,
    })
    await wrapper.find('.ant-table-filter-trigger').trigger('click')
    await waitFakeTimer()
    await typeSearch(query)

    if (filterMode === 'menu') {
      const options = document.querySelectorAll('.ant-dropdown-menu-item')
      expect(options).toHaveLength(1)
      expect(options[0]!.textContent).toContain(`${query}-001`.trim())
    }
    else {
      const highlighted = document.querySelectorAll('.ant-tree-treenode.filter-node')
      expect(highlighted).toHaveLength(1)
      expect(highlighted[0]!.textContent).toContain(`${query}-001`.trim())
    }
    expect(filterSearch).toHaveBeenCalledWith(
      query,
      expect.objectContaining({ value: `${query}-001` }),
    )
    wrapper.unmount()
  })

  it('keeps built-in search case insensitive', async () => {
    const wrapper = mount(Table, {
      props: {
        pagination: false,
        dataSource: [],
        columns: [
          {
            title: 'Product code',
            dataIndex: 'code',
            filters: [
              { text: 'SKU-001', value: 'SKU-001' },
              { text: 'sku-002', value: 'sku-002' },
            ],
            filterSearch: true,
          },
        ],
      },
      attachTo: document.body,
    })
    await wrapper.find('.ant-table-filter-trigger').trigger('click')
    await waitFakeTimer()
    await typeSearch(' SKU ')

    expect(document.querySelectorAll('.ant-dropdown-menu-item')).toHaveLength(2)
    wrapper.unmount()
  })
})
