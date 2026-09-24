import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import Table from '..'
import { mount } from '/@tests/utils'

const dataSource = [
  { key: '1', name: 'John', age: 32 },
  { key: '2', name: 'Jim', age: 42 },
]

function mockRect(element: Element, rect: Partial<DOMRect>) {
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({
    x: 0,
    y: 0,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    toJSON: () => ({}),
    ...rect,
  } as DOMRect)
}

describe('table resizable columns', () => {
  const nativeGetComputedStyle = window.getComputedStyle.bind(window)

  beforeEach(() => {
    // jsdom has no pseudo-element support; the scrollbar probe asks for `::-webkit-scrollbar`.
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element: Element, pseudo?: string | null) =>
      pseudo ? ({ width: '', height: '' } as CSSStyleDeclaration) : nativeGetComputedStyle(element))
  })

  afterEach(() => {
    vi.restoreAllMocks()
    document.body.innerHTML = ''
  })

  it('renders a handle only on resizable leaf header cells', () => {
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'Name', dataIndex: 'name', key: 'name', width: 200, resizable: true },
          { title: 'Age', dataIndex: 'age', key: 'age', width: 200 },
        ],
        dataSource,
      },
    })

    const headers = wrapper.findAll('thead th')
    expect(headers[0]!.find('.ant-table-resize-handle').exists()).toBe(true)
    expect(headers[1]!.find('.ant-table-resize-handle').exists()).toBe(false)
    expect(wrapper.find('.ant-table-resize-proxy').exists()).toBe(true)
    expect(wrapper.find('.ant-table-content').attributes('style')).toContain('overflow-x: auto')
    expect(wrapper.find('table').attributes('style')).toContain('table-layout: fixed')
    wrapper.unmount()
  })

  it('emits `resizeColumn` once per drag and applies the width', async () => {
    const onResizeColumn = vi.fn()
    const wrapper = mount(Table, {
      props: {
        columns: [
          { title: 'Name', dataIndex: 'name', key: 'name', width: 200, resizable: true },
          { title: 'Age', dataIndex: 'age', key: 'age', width: 200 },
        ],
        dataSource,
        onResizeColumn,
      },
      attachTo: document.body,
    })
    mockRect(wrapper.find('.ant-table').element, { right: 600, bottom: 300, width: 600, height: 300 })
    mockRect(wrapper.find('thead th').element, { right: 200, bottom: 40, width: 200, height: 40 })

    await wrapper.find('.ant-table-resize-handle').trigger('mousedown', { button: 0, clientX: 198 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 228 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 228 }))
    await nextTick()

    expect(onResizeColumn).toHaveBeenCalledTimes(1)
    expect(onResizeColumn).toHaveBeenCalledWith(230, expect.objectContaining({ dataIndex: 'name' }), 'name')
    expect(wrapper.findAll('col')[0]!.attributes('style')).toContain('width: 230px')
    wrapper.unmount()
  })

  it('takes over a width written back through `resizeColumn`', async () => {
    const columns = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 200, resizable: true },
      { title: 'Age', dataIndex: 'age', key: 'age', width: 200 },
    ]
    const wrapper = mount(Table, {
      props: {
        columns,
        dataSource,
        onResizeColumn: (width: number, _column: any, columnKey: string) => {
          wrapper.setProps({ columns: columns.map(col => (col.key === columnKey ? { ...col, width } : col)) })
        },
      },
      attachTo: document.body,
    })
    mockRect(wrapper.find('.ant-table').element, { right: 600, bottom: 300, width: 600, height: 300 })
    mockRect(wrapper.find('thead th').element, { right: 200, bottom: 40, width: 200, height: 40 })

    await wrapper.find('.ant-table-resize-handle').trigger('mousedown', { button: 0, clientX: 198 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 248 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 248 }))
    await nextTick()
    await nextTick()
    expect(wrapper.findAll('col')[0]!.attributes('style')).toContain('width: 250px')

    // Resetting the columns restores the configured width.
    await wrapper.setProps({ columns })
    expect(wrapper.findAll('col')[0]!.attributes('style')).toContain('width: 200px')
    wrapper.unmount()
  })
})
