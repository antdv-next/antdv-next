import type { VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Table from '..'
import { mount } from '/@tests/utils'

const dataSource = [{ key: '1', name: 'Bamboo', age: 32 }]

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

function prepareRects(wrapper: VueWrapper, width = 200) {
  const root = wrapper.find('.ant-table-wrapper').element
  const table = wrapper.find('.ant-table').element
  const header = wrapper.find('thead th').element

  mockRect(root, { left: 0, top: 0, right: 500, bottom: 300, width: 500, height: 300 })
  mockRect(table, { left: 0, top: 0, right: 500, bottom: 200, width: 500, height: 200 })
  mockRect(header, { left: 0, top: 0, right: width, bottom: 48, width, height: 48 })
}

function renderTable(extraColumn: Record<string, any> = {}, tableProps: Record<string, any> = {}) {
  return mount(Table, {
    props: {
      bordered: true,
      pagination: false,
      dataSource,
      columns: [
        { title: 'Name', dataIndex: 'name', key: 'name', width: 200, ...extraColumn },
        { title: 'Age', dataIndex: 'age', key: 'age' },
      ],
      ...tableProps,
    },
  })
}

describe('Table resizable columns', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  })

  it('does not add resize UI without resizable columns', () => {
    const wrapper = renderTable()

    expect(wrapper.find('.ant-table-cell-resizable').exists()).toBe(false)
    expect(wrapper.find('.ant-table-resize-proxy').exists()).toBe(false)
  })

  it('only marks resizable leaf columns', () => {
    const wrapper = renderTable({ resizable: true, onHeaderCell: () => ({ className: 'custom-header' }) })
    const headers = wrapper.findAll('thead th')

    expect(headers[0]!.classes()).toContain('ant-table-cell-resizable')
    expect(headers[0]!.classes()).toContain('custom-header')
    expect(headers[1]!.classes()).not.toContain('ant-table-cell-resizable')
    expect(wrapper.find('.ant-table-resize-proxy').exists()).toBe(true)
  })

  it('works with a custom header cell component', () => {
    const HeaderCell = (_props: any, { attrs, slots }: any) =>
      h('th', { ...attrs, class: ['custom-header-cell', attrs.class] }, slots.default?.())
    const wrapper = renderTable({ resizable: true }, {
      components: { header: { cell: HeaderCell } },
    })

    const header = wrapper.find('thead th')
    expect(header.classes()).toContain('custom-header-cell')
    expect(header.classes()).toContain('ant-table-cell-resizable')
  })

  it('moves only the proxy while dragging and commits width on mouseup', async () => {
    const wrapper = renderTable({ resizable: true })
    prepareRects(wrapper)

    const header = wrapper.find('thead th')
    const firstCol = wrapper.find('col')
    const initialStyle = firstCol.attributes('style')

    await header.trigger('mousemove', { clientX: 198 })
    expect(header.classes()).toContain('ant-table-cell-resize-active')

    await header.trigger('mousedown', { button: 0, clientX: 198 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 238 }))
    await nextTick()

    expect(firstCol.attributes('style')).toBe(initialStyle)
    expect(wrapper.find('.ant-table-resize-proxy').attributes('style')).toContain('translateX(40px)')

    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 238 }))
    await nextTick()

    expect(wrapper.find('col').attributes('style')).toContain('240px')
    expect(wrapper.find('.ant-table-resize-proxy').attributes('style')).toContain('display: none')
    expect(document.body.style.cursor).toBe('')
    expect(document.body.style.userSelect).toBe('')
  })

  it.each(['column', 'onHeaderCell'] as const)('does not resize a merged header configured through %s', async (source) => {
    const wrapper = renderTable({}, {
      columns: [
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: 100,
          resizable: true,
          ...(source === 'column' ? { colSpan: 2 } : { onHeaderCell: () => ({ colSpan: 2 }) }),
        },
        { title: 'Age', dataIndex: 'age', key: 'age', width: 100, colSpan: 0 },
      ],
    })
    prepareRects(wrapper)

    try {
      const header = wrapper.find('thead th')
      expect(header.attributes('colspan')).toBe('2')
      await header.trigger('mousemove', { clientX: 198 })
      expect(header.classes()).not.toContain('ant-table-cell-resize-active')

      await header.trigger('mousedown', { button: 0, clientX: 198 })
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 218 }))
      document.dispatchEvent(new MouseEvent('mouseup', { clientX: 218 }))
      await nextTick()

      expect(wrapper.findAll('col').map(col => col.attributes('style'))).toEqual([
        'width: 100px;',
        'width: 100px;',
      ])
      expect(wrapper.find('.ant-table-resize-proxy').attributes('style') ?? '').not.toContain('display: block')
    }
    finally {
      wrapper.unmount()
    }
  })

  it('cancels on window blur without committing and allows another drag', async () => {
    const wrapper = renderTable({ resizable: true })
    prepareRects(wrapper)
    const removeDocumentListener = vi.spyOn(document, 'removeEventListener')
    const removeWindowListener = vi.spyOn(window, 'removeEventListener')

    try {
      const header = wrapper.find('thead th')
      await header.trigger('mousedown', { button: 0, clientX: 198 })
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 238 }))
      window.dispatchEvent(new Event('blur'))
      await nextTick()

      expect(header.classes()).not.toContain('ant-table-cell-resize-active')
      expect(wrapper.find('.ant-table-resize-proxy').attributes('style')).toContain('display: none')
      expect(document.body.style.cursor).toBe('')
      expect(document.body.style.userSelect).toBe('')
      expect(removeDocumentListener).toHaveBeenCalledWith('mousemove', expect.any(Function))
      expect(removeDocumentListener).toHaveBeenCalledWith('mouseup', expect.any(Function))
      expect(removeWindowListener).toHaveBeenCalledWith('blur', expect.any(Function))

      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 258 }))
      document.dispatchEvent(new MouseEvent('mouseup', { clientX: 258 }))
      await nextTick()
      expect(wrapper.find('col').attributes('style')).toContain('200px')

      await header.trigger('mousedown', { button: 0, clientX: 198 })
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 218 }))
      document.dispatchEvent(new MouseEvent('mouseup', { clientX: 218 }))
      await nextTick()
      expect(wrapper.find('col').attributes('style')).toContain('220px')
    }
    finally {
      wrapper.unmount()
    }
  })

  it.each(['mouseup', 'blur', 'unmount'] as const)('restores existing body styles after %s', async (ending) => {
    document.body.style.setProperty('cursor', 'progress', 'important')
    document.body.style.setProperty('user-select', 'text', 'important')
    // The installed JSDOM drops priorities for these properties, so verify their restoration at the CSSOM boundary.
    vi.spyOn(document.body.style, 'getPropertyPriority').mockReturnValue('important')
    const setBodyStyle = vi.spyOn(document.body.style, 'setProperty')
    const wrapper = renderTable({ resizable: true })
    prepareRects(wrapper)

    try {
      await wrapper.find('thead th').trigger('mousedown', { button: 0, clientX: 198 })
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 218 }))
      if (ending === 'unmount') {
        wrapper.unmount()
      }
      else if (ending === 'blur') {
        window.dispatchEvent(new Event('blur'))
      }
      else {
        document.dispatchEvent(new MouseEvent('mouseup', { clientX: 218 }))
      }
      await nextTick()

      expect(document.body.style.cursor).toBe('progress')
      expect(document.body.style.userSelect).toBe('text')
      expect(setBodyStyle).toHaveBeenCalledWith('cursor', 'progress', 'important')
      expect(setBodyStyle).toHaveBeenCalledWith('user-select', 'text', 'important')
    }
    finally {
      if (ending !== 'unmount') {
        wrapper.unmount()
      }
    }
  })

  it('uses the rendered width when no width is configured', async () => {
    const wrapper = renderTable({ resizable: true, width: undefined })
    prepareRects(wrapper, 180)

    const header = wrapper.find('thead th')
    await header.trigger('mousedown', { button: 0, clientX: 178 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 198 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 198 }))
    await nextTick()

    expect(wrapper.find('col').attributes('style')).toContain('200px')
  })

  it('resets the internal width when the source width changes', async () => {
    const wrapper = renderTable({ resizable: true })
    prepareRects(wrapper)

    const header = wrapper.find('thead th')
    await header.trigger('mousedown', { button: 0, clientX: 198 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 238 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 238 }))
    await nextTick()
    expect(wrapper.find('col').attributes('style')).toContain('240px')

    await wrapper.setProps({
      columns: [
        { title: 'Name', dataIndex: 'name', key: 'name', width: 300, resizable: true },
        { title: 'Age', dataIndex: 'age', key: 'age' },
      ],
    })
    await nextTick()

    expect(wrapper.find('col').attributes('style')).toContain('300px')
  })

  it('respects the configured minimum width', async () => {
    const wrapper = renderTable({ resizable: true, minWidth: 80 })
    prepareRects(wrapper)

    const header = wrapper.find('thead th')
    await header.trigger('mousedown', { button: 0, clientX: 198 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 0 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 0 }))
    await nextTick()

    expect(wrapper.find('col').attributes('style')).toContain('80px')
  })

  it('keeps widths isolated for colliding column identifiers', async () => {
    const wrapper = mount(Table, {
      props: {
        bordered: true,
        pagination: false,
        dataSource,
        columns: [
          {
            title: 'Group',
            children: [
              { title: 'Named', key: '0-1', dataIndex: 'name', width: 100, resizable: true },
              { title: 'Path', width: 120, resizable: true },
            ],
          },
        ],
      },
    })
    const root = wrapper.find('.ant-table-wrapper').element
    const table = wrapper.find('.ant-table').element
    const headers = wrapper.findAll('thead th')
    const columns = wrapper.findAll('col')

    mockRect(root, { left: 0, top: 0, right: 500, bottom: 300, width: 500, height: 300 })
    mockRect(table, { left: 0, top: 0, right: 500, bottom: 200, width: 500, height: 200 })
    mockRect(headers[1]!.element, { left: 0, top: 0, right: 100, bottom: 48, width: 100, height: 48 })
    mockRect(headers[2]!.element, { left: 100, top: 0, right: 220, bottom: 48, width: 120, height: 48 })

    await headers[1]!.trigger('mousedown', { button: 0, clientX: 98 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 118 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 118 }))
    await nextTick()

    expect(columns[0]!.attributes('style')).toContain('120px')
    expect(columns[1]!.attributes('style')).toContain('120px')

    await headers[2]!.trigger('mousedown', { button: 0, clientX: 218 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 238 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 238 }))
    await nextTick()

    expect(wrapper.findAll('col')[0]!.attributes('style')).toContain('120px')
    expect(wrapper.findAll('col')[1]!.attributes('style')).toContain('140px')
  })

  it('supports nested leaf columns without making the group resizable', () => {
    const wrapper = mount(Table, {
      props: {
        bordered: true,
        pagination: false,
        dataSource,
        columns: [
          {
            title: 'Group',
            children: [
              { title: 'Name', dataIndex: 'name', key: 'name', width: 200, resizable: true },
              { title: 'Age', dataIndex: 'age', key: 'age' },
            ],
          },
        ],
      },
    })
    const headers = wrapper.findAll('thead th')

    expect(headers[0]!.classes()).not.toContain('ant-table-cell-resizable')
    expect(headers[1]!.classes()).toContain('ant-table-cell-resizable')
    expect(headers[2]!.classes()).not.toContain('ant-table-cell-resizable')
  })

  it('reverses the resize direction in RTL', async () => {
    const wrapper = renderTable({ resizable: true }, { direction: 'rtl' })
    prepareRects(wrapper)

    const header = wrapper.find('thead th')
    await header.trigger('mousedown', { button: 0, clientX: 2 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: -38 }))
    await nextTick()

    expect(wrapper.find('col').attributes('style')).toContain('200px')
    expect(wrapper.find('.ant-table-resize-proxy').attributes('style')).toContain('translateX(-40px)')

    document.dispatchEvent(new MouseEvent('mouseup', { clientX: -38 }))
    await nextTick()

    expect(wrapper.find('col').attributes('style')).toContain('240px')
  })

  it('does not trigger sorting after a resize', async () => {
    const onChange = vi.fn()
    const wrapper = renderTable({ resizable: true, sorter: true }, { onChange })
    prepareRects(wrapper)

    const header = wrapper.find('thead th')
    await header.trigger('mousedown', { button: 0, clientX: 198 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 218 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 218 }))
    await header.trigger('click')

    expect(onChange).not.toHaveBeenCalled()
  })
})
