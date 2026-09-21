import type { VueWrapper } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h, nextTick } from 'vue'
import Table from '..'
import ConfigProvider from '../../config-provider'
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
  const { direction, ...restTableProps } = tableProps
  const props = {
    bordered: true,
    pagination: false,
    dataSource,
    columns: [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 200, ...extraColumn },
      { title: 'Age', dataIndex: 'age', key: 'age' },
    ],
    ...restTableProps,
  }

  if (direction) {
    return mount(ConfigProvider, {
      props: { direction },
      slots: {
        default: () => h(Table, props),
      },
    })
  }

  return mount(Table, { props })
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

  it('emits resizeColumn once from a template listener without Vue warnings', async () => {
    const onResizeColumn = vi.fn()
    const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const wrapper = mount({
      components: { 'a-table': Table },
      setup() {
        return {
          columns: [
            { title: 'Name', dataIndex: 'name', key: 'name', width: 200, resizable: true },
            { title: 'Age', dataIndex: 'age', key: 'age' },
          ],
          dataSource,
          onResizeColumn,
        }
      },
      template: '<a-table bordered table-layout="fixed" :columns="columns" :data-source="dataSource" @resize-column="onResizeColumn" />',
    })
    prepareRects(wrapper)

    const header = wrapper.find('thead th')
    await header.trigger('mousedown', { button: 0, clientX: 198 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 218 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 218 }))
    await nextTick()

    expect(onResizeColumn).toHaveBeenCalledTimes(1)
    expect(consoleWarn).not.toHaveBeenCalledWith(expect.stringContaining('resizeColumn'))
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

  it.each([
    { fixed: false, sticky: false, expectedZIndex: 3 },
    { fixed: true, sticky: false, expectedZIndex: 43 },
    { fixed: true, sticky: true, expectedZIndex: 54 },
  ])('keeps the resize proxy just above table layers (fixed=$fixed, sticky=$sticky)', async ({ fixed, sticky, expectedZIndex }) => {
    const wrapper = renderTable({}, {
      sticky,
      scroll: fixed ? { x: 1000 } : undefined,
      columns: [
        { title: 'Name', dataIndex: 'name', width: 200, resizable: true, fixed: fixed ? 'start' : undefined },
        { title: 'Age', dataIndex: 'age', width: 200, fixed: fixed ? 'start' : undefined },
        { title: 'Other', dataIndex: 'name', width: 200 },
      ],
    })
    document.body.appendChild(wrapper.element)
    prepareRects(wrapper)
    const header = wrapper.find('thead th')
    const proxy = wrapper.find('.ant-table-resize-proxy').element as HTMLElement
    // JSDOM does not resolve calc() with CSS variables; supply resolved values for table layers.
    const fixedHeaders = wrapper.findAll('.ant-table-thead .ant-table-cell-fix')
    if (fixed) {
      expect(fixedHeaders).toHaveLength(2)
      fixedHeaders.forEach((cell, index) => {
        (cell.element as HTMLElement).style.zIndex = String(41 + index)
      })
    }
    if (sticky) {
      (wrapper.find('.ant-table-sticky-holder').element as HTMLElement).style.zIndex = '53'
    }

    try {
      for (let attempt = 0; attempt < 2; attempt++) {
        await header.trigger('mousedown', { button: 0, clientX: 198 })
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 218 }))
        expect(Number(getComputedStyle(proxy).zIndex)).toBe(expectedZIndex)
        expect(Number(getComputedStyle(proxy).zIndex)).toBeLessThan(1000)
        document.dispatchEvent(new MouseEvent('mouseup', { clientX: 218 }))
        expect(proxy.style.zIndex).toBe('')
      }
    }
    finally {
      wrapper.unmount()
      wrapper.element?.remove()
    }
  })

  it.each([
    { mode: 'normal', virtual: false, scroll: undefined, selector: '.ant-table-content', top: 0, clientHeight: 208, expectedHeight: 208 },
    { mode: 'scrollable', virtual: false, scroll: { x: 1000, y: 400 }, selector: '.ant-table-body', top: 48, clientHeight: 160, expectedHeight: 208 },
    { mode: 'virtual', virtual: true, scroll: { x: 1000, y: 400 }, selector: '.ant-table-tbody-virtual-holder', top: 48, clientHeight: 400, expectedHeight: 448 },
    { mode: 'short virtual', virtual: true, scroll: { x: 1000, y: 400 }, selector: '.ant-table-tbody-virtual-holder', top: 48, clientHeight: 80, expectedHeight: 128 },
  ])('covers the visible viewport in $mode tables', async ({ virtual, scroll, selector, top, clientHeight, expectedHeight }) => {
    const wrapper = renderTable({ resizable: true }, { virtual, scroll })
    prepareRects(wrapper)
    try {
      const viewport = wrapper.find(selector).element
      // Use the viewport height, not scroll.y, its full scrollHeight, or its scrollbar-inclusive bounds.
      mockRect(viewport, { top, bottom: top + clientHeight + 16, height: clientHeight + 16 })
      Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: clientHeight })
      Object.defineProperty(viewport, 'scrollHeight', { configurable: true, value: 10000 })
      await wrapper.find('thead th').trigger('mousedown', { button: 0, clientX: 198 })
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 218 }))

      const proxy = wrapper.find('.ant-table-resize-proxy').element as HTMLElement
      expect(proxy.style.height).toBe(`${expectedHeight}px`)
      expect(proxy.style.top).toBe('0px')
      document.dispatchEvent(new MouseEvent('mouseup', { clientX: 218 }))
    }
    finally {
      wrapper.unmount()
    }
  })

  it.each([
    { direction: 'ltr', clientHeight: 400, sticky: false, scrollbarTop: 440 },
    { direction: 'rtl', clientHeight: 400, sticky: false, scrollbarTop: 440 },
    { direction: 'ltr', clientHeight: 80, sticky: false, scrollbarTop: 120 },
    { direction: 'ltr', clientHeight: 400, sticky: true, scrollbarTop: 448 },
  ] as const)('keeps a full-height proxy below virtual scrollbars as they hide and show ($direction, height=$clientHeight, sticky=$sticky)', async ({ direction, clientHeight, sticky, scrollbarTop }) => {
    const wrapper = renderTable({ resizable: true }, {
      virtual: true,
      direction,
      sticky,
      scroll: { x: 1000, y: 400 },
      dataSource: Array.from({ length: 20 }, (_, index) => ({ ...dataSource[0], key: String(index) })),
    })
    prepareRects(wrapper)
    try {
      const viewport = wrapper.find('.ant-table-tbody-virtual-holder').element
      const scrollbar = wrapper.find('.ant-table-tbody-virtual-scrollbar-horizontal').element as HTMLElement
      const root = wrapper.find('.ant-table-wrapper').element as HTMLElement
      if (sticky) {
        // JSDOM does not resolve the sticky holder's calc() z-index.
        (wrapper.find('.ant-table-sticky-holder').element as HTMLElement).style.zIndex = '25'
      }
      mockRect(viewport, { top: 48, bottom: 48 + clientHeight, height: clientHeight })
      Object.defineProperty(viewport, 'clientHeight', { configurable: true, value: clientHeight })
      mockRect(scrollbar, { top: scrollbarTop, bottom: scrollbarTop + 8, height: 8 })
      const startX = direction === 'rtl' ? 2 : 198
      const endX = startX + (direction === 'rtl' ? -20 : 20)
      await wrapper.find('thead th').trigger('mousedown', { button: 0, clientX: startX })
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: endX }))

      const proxy = wrapper.find('.ant-table-resize-proxy').element as HTMLElement
      expect(Number.parseFloat(proxy.style.height)).toBe(48 + clientHeight)
      expect(Number(root.style.getPropertyValue('--table-resize-scrollbar-z-index'))).toBe(Number(proxy.style.zIndex) + 1)
      for (const bar of wrapper.findAll('.ant-table-tbody-virtual-scrollbar')) {
        // JSDOM leaves var() unresolved; verify the shared declaration and its supplied numeric value.
        expect(getComputedStyle(bar.element).zIndex).toBe('var(--table-resize-scrollbar-z-index, auto)')
      }
      for (const visibility of ['hidden', 'visible']) {
        scrollbar.style.visibility = visibility
        // No new mousemove is needed to keep the line continuous when the scrollbar hides.
        expect(Number.parseFloat(proxy.style.height)).toBe(48 + clientHeight)
      }
      document.dispatchEvent(new MouseEvent('mouseup', { clientX: endX }))
      expect(root.style.getPropertyValue('--table-resize-scrollbar-z-index')).toBe('')
    }
    finally {
      wrapper.unmount()
    }
  })

  it('moves only the proxy while dragging and commits width on mouseup', async () => {
    const wrapper = renderTable({ resizable: true })
    prepareRects(wrapper)

    const header = wrapper.find('thead th')
    const firstCol = wrapper.find('col')
    const initialStyle = firstCol.attributes('style')

    await header.trigger('mousemove', { clientX: 198 })
    expect((header.element as HTMLElement).style.cursor).toBe('col-resize')

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

  it('emits resizeColumn with the committed width and column', async () => {
    const onResizeColumn = vi.fn()
    const wrapper = renderTable({ resizable: true }, { onResizeColumn })
    prepareRects(wrapper)

    const header = wrapper.find('thead th')
    await header.trigger('mousedown', { button: 0, clientX: 198 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 218 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 218 }))
    await nextTick()

    const expectedColumn = expect.objectContaining({
      dataIndex: 'name',
      key: 'name',
      resizable: true,
    })
    expect(wrapper.emitted('resizeColumn')).toHaveLength(1)
    expect(wrapper.emitted('resizeColumn')![0]).toEqual([220, expectedColumn])
    expect(onResizeColumn).toHaveBeenCalledTimes(1)
    expect(onResizeColumn).toHaveBeenCalledWith(220, expectedColumn)
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
      expect((header.element as HTMLElement).style.cursor).toBe('')

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

      expect((header.element as HTMLElement).style.cursor).toBe('')
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

  it('keeps widths isolated for stable column identifiers', async () => {
    const wrapper = mount(Table, {
      props: {
        bordered: true,
        pagination: false,
        dataSource,
        columns: [
          { title: 'Numeric', key: 0, width: 100, resizable: true },
          { title: 'String', dataIndex: '0', width: 140, resizable: true },
        ],
      },
    })
    const root = wrapper.find('.ant-table-wrapper').element
    const table = wrapper.find('.ant-table').element
    const headers = wrapper.findAll('thead th')

    mockRect(root, { left: 0, top: 0, right: 500, bottom: 300, width: 500, height: 300 })
    mockRect(table, { left: 0, top: 0, right: 500, bottom: 200, width: 500, height: 200 })
    mockRect(headers[0]!.element, { left: 0, top: 0, right: 100, bottom: 48, width: 100, height: 48 })
    mockRect(headers[1]!.element, { left: 100, top: 0, right: 240, bottom: 48, width: 140, height: 48 })

    await headers[0]!.trigger('mousedown', { button: 0, clientX: 98 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 118 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 118 }))
    await nextTick()

    expect(wrapper.findAll('col')[0]!.attributes('style')).toContain('120px')
    expect(wrapper.findAll('col')[1]!.attributes('style')).toContain('140px')

    await headers[1]!.trigger('mousedown', { button: 0, clientX: 238 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 258 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 258 }))
    await nextTick()

    expect(wrapper.findAll('col')[0]!.attributes('style')).toContain('120px')
    expect(wrapper.findAll('col')[1]!.attributes('style')).toContain('160px')
  })

  it('does not enable resizing without a stable key or dataIndex', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const wrapper = mount(Table, {
      props: {
        bordered: true,
        pagination: false,
        dataSource,
        columns: [
          { title: 'Name', width: 200, resizable: true },
          { title: 'Age', width: 100, resizable: true },
        ],
      },
    })

    expect(wrapper.find('.ant-table-cell-resizable').exists()).toBe(false)
    expect(wrapper.find('.ant-table-resize-proxy').exists()).toBe(false)
    expect(consoleError).toHaveBeenCalledTimes(1)
    expect(consoleError.mock.calls[0]![0]).toContain('`resizable` requires a stable `key` or `dataIndex`')
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

  it.each([
    { direction: 'ltr', startX: 198, delta: 0 },
    { direction: 'ltr', startX: 198, delta: 2 },
    { direction: 'ltr', startX: 198, delta: -2 },
    { direction: 'rtl', startX: 2, delta: 0 },
    { direction: 'rtl', startX: 2, delta: 2 },
    { direction: 'rtl', startX: 2, delta: -2 },
  ] as const)('sorts on an edge click with $delta px movement in $direction', async ({ direction, startX, delta }) => {
    const onChange = vi.fn()
    const onClickCapture = vi.fn()
    const wrapper = renderTable({ resizable: true, sorter: true, onHeaderCell: () => ({ onClickCapture }) }, { onChange, direction })
    prepareRects(wrapper)
    const sorter = wrapper.find('.ant-table-column-sorter').element

    // Dispatch the full mouse sequence synchronously, including the click following mouseup.
    sorter.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0, clientX: startX }))
    if (delta) {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: startX + delta }))
    }
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: startX + delta }))
    sorter.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: startX + delta }))
    await nextTick()

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onClickCapture).toHaveBeenCalledTimes(1)
    expect(wrapper.find('col').attributes('style')).toContain('200px')
  })

  it.each(['move-away', 'mouseleave', 'blur', 'unmount'] as const)('restores body and header cursors after hover ends via %s', async (ending) => {
    const wrapper = renderTable({ resizable: true, sorter: true })
    prepareRects(wrapper)
    const header = wrapper.find('thead th')
    const cell = header.element as HTMLElement
    document.body.style.cursor = 'progress'
    cell.style.cursor = 'crosshair'
    try {
      await header.trigger('mousemove', { clientX: 199 })
      expect(document.body.style.cursor).toBe('col-resize')
      expect(cell.style.cursor).toBe('col-resize')
      expect(cell.classList.contains('ant-table-cell-resizable')).toBe(true)
      expect(document.body.style.userSelect).toBe('')
      expect(wrapper.find('.ant-table-resize-proxy').attributes('style') ?? '').not.toContain('display: block')
      if (ending === 'move-away') {
        await header.trigger('mousemove', { clientX: 150 })
      }
      else if (ending === 'mouseleave') {
        await header.trigger('mouseleave')
      }
      else if (ending === 'blur') {
        window.dispatchEvent(new Event('blur'))
      }
      else {
        wrapper.unmount()
      }
      expect(document.body.style.cursor).toBe('progress')
      expect(cell.style.cursor).toBe('crosshair')
      expect(cell.classList.contains('ant-table-cell-resizable')).toBe(true)
    }
    finally {
      if (ending !== 'unmount') {
        wrapper.unmount()
      }
    }
  })

  it.each(['ltr', 'rtl'] as const)('keeps the cursor over adjacent sortable headers before and after the threshold in %s', async (direction) => {
    const wrapper = renderTable({}, {
      direction,
      columns: [
        { title: 'Name', dataIndex: 'name', width: 200, resizable: true, sorter: true },
        { title: 'Age', dataIndex: 'age', width: 200, sorter: true },
      ],
    })
    document.body.appendChild(wrapper.element)
    prepareRects(wrapper)
    const [header, adjacent] = wrapper.findAll('thead th')
    const rtl = direction === 'rtl'
    const startX = rtl ? 201 : 199
    const sign = rtl ? -1 : 1
    mockRect(header!.element, { left: rtl ? 200 : 0, right: rtl ? 400 : 200, width: 200, height: 48 })
    mockRect(adjacent!.element, { left: rtl ? 0 : 200, right: rtl ? 200 : 400, width: 200, height: 48 })
    const proxy = wrapper.find('.ant-table-resize-proxy').element as HTMLElement

    try {
      expect(getComputedStyle(adjacent!.element).cursor).toBe('pointer')
      await header!.trigger('mousemove', { clientX: startX })
      expect(document.body.style.cursor).toBe('col-resize')
      expect(getComputedStyle(header!.element).cursor).toBe('col-resize')
      await header!.trigger('mousedown', { button: 0, clientX: startX })
      await header!.trigger('mouseleave')
      expect(document.body.style.cursor).toBe('col-resize')

      await adjacent!.trigger('mousemove', { clientX: startX + sign * 2 })
      expect(getComputedStyle(adjacent!.element).cursor).toBe('col-resize')
      expect(proxy.style.display).not.toBe('block')
      expect(document.body.style.cursor).toBe('col-resize')
      expect(document.body.style.userSelect).toBe('')

      await adjacent!.trigger('mousemove', { clientX: startX + sign * 4 })
      expect(getComputedStyle(adjacent!.element).cursor).toBe('col-resize')
      expect(proxy.style.display).toBe('block')
      document.dispatchEvent(new MouseEvent('mouseup', { clientX: startX + sign * 4 }))
      await nextTick()
      expect(getComputedStyle(adjacent!.element).cursor).toBe('pointer')
      expect(document.body.style.cursor).toBe('')
      expect(wrapper.find('col').attributes('style')).toContain('204px')
    }
    finally {
      wrapper.unmount()
      wrapper.element?.remove()
    }
  })

  it.each([0, 40])('restores the edge cursor after releasing with %i px movement', async (delta) => {
    const wrapper = renderTable({ resizable: true, sorter: true })
    document.body.appendChild(wrapper.element)
    prepareRects(wrapper)
    const header = wrapper.find('thead th')
    try {
      await header.trigger('mousemove', { clientX: 199, clientY: 20 })
      await header.trigger('mousedown', { button: 0, clientX: 199, clientY: 20 })
      if (delta) {
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 199 + delta, clientY: 20 }))
      }
      document.dispatchEvent(new MouseEvent('mouseup', { clientX: 199 + delta, clientY: 20 }))
      // JSDOM has no layout; simulate the geometry after the column width is committed.
      mockRect(header.element, { left: 0, right: 200 + delta, top: 0, bottom: 48, width: 200 + delta, height: 48 })
      await nextTick()

      expect(getComputedStyle(header.element).cursor).toBe('col-resize')
      expect(document.body.style.cursor).toBe('col-resize')
      await header.trigger('mouseleave')
      expect((header.element as HTMLElement).style.cursor).toBe('')
      expect(document.body.style.cursor).toBe('')
      expect(getComputedStyle(header.element).cursor).toBe('pointer')
    }
    finally {
      wrapper.unmount()
      wrapper.element?.remove()
    }
  })

  it.each([
    { started: false, ending: 'mouseup' },
    { started: false, ending: 'blur' },
    { started: false, ending: 'unmount' },
    { started: true, ending: 'mouseup' },
    { started: true, ending: 'blur' },
    { started: true, ending: 'unmount' },
  ])('cleans up body and header cursors on $ending (started=$started)', async ({ started, ending }) => {
    const wrapper = renderTable({ resizable: true, sorter: true })
    prepareRects(wrapper)
    const header = wrapper.find('thead th')
    const cell = header.element as HTMLElement
    const root = wrapper.find('.ant-table-wrapper').element as HTMLElement
    try {
      await header.trigger('mousedown', { button: 0, clientX: 199 })
      expect(cell.style.cursor).toBe('col-resize')
      expect(document.body.style.cursor).toBe('col-resize')
      if (started) {
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 219 }))
      }
      if (ending === 'unmount') {
        wrapper.unmount()
      }
      else if (ending === 'blur') {
        window.dispatchEvent(new Event('blur'))
      }
      else {
        document.dispatchEvent(new MouseEvent('mouseup', { clientX: started ? 219 : 199 }))
      }
      expect(root.style.getPropertyValue('--table-resize-scrollbar-z-index')).toBe('')
      expect(cell.style.cursor).toBe('')
      expect(document.body.style.cursor).toBe('')
      expect(document.body.style.userSelect).toBe('')
    }
    finally {
      if (ending !== 'unmount') {
        wrapper.unmount()
      }
    }
  })

  it.each([
    { resizable: true, clientX: 198, button: 0, detail: 1, prevented: true },
    { resizable: true, clientX: 198, button: 0, detail: 2, prevented: true },
    { resizable: true, clientX: 198, button: 0, detail: 3, prevented: true },
    { resizable: true, clientX: 100, button: 0, detail: 1, prevented: false },
    { resizable: true, clientX: 198, button: 2, detail: 1, prevented: false },
    { resizable: false, clientX: 198, button: 0, detail: 1, prevented: false },
  ])('only prevents native selection for left presses in the resize zone ($resizable, $clientX, $button, $detail)', async ({ resizable, clientX, button, detail, prevented }) => {
    const onChange = vi.fn()
    const onMousedown = vi.fn()
    const wrapper = renderTable({ resizable, sorter: true, onHeaderCell: () => ({ onMousedown }) }, { onChange })
    prepareRects(wrapper)
    const header = wrapper.find('thead th').element
    const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true, clientX, button, detail })
    try {
      header.dispatchEvent(down)
      expect(down.defaultPrevented).toBe(prevented)
      expect(onMousedown).toHaveBeenCalledWith(down)
      document.dispatchEvent(new MouseEvent('mouseup', { clientX, button }))
      if (button === 0) {
        header.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX, button, detail }))
        await nextTick()
        expect(onChange).toHaveBeenCalledTimes(1)
      }
      expect(wrapper.find('col').attributes('style')).toContain('200px')
    }
    finally {
      wrapper.unmount()
    }
  })

  it('waits for the drag threshold before showing the proxy or disabling selection', async () => {
    document.body.style.cursor = 'progress'
    document.body.style.userSelect = 'text'
    const wrapper = renderTable({ resizable: true, sorter: true })
    prepareRects(wrapper)
    const header = wrapper.find('thead th').element
    const proxy = wrapper.find('.ant-table-resize-proxy').element as HTMLElement
    const down = new MouseEvent('mousedown', { bubbles: true, cancelable: true, button: 0, clientX: 198 })
    header.dispatchEvent(down)
    const preventedOnDown = down.defaultPrevented
    const displayOnDown = proxy.style.display
    const cursorOnDown = document.body.style.cursor
    const userSelectOnDown = document.body.style.userSelect

    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200 }))
    const displayBeforeThreshold = proxy.style.display
    const cursorBeforeThreshold = document.body.style.cursor
    const userSelectBeforeThreshold = document.body.style.userSelect
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 201 }))
    expect(proxy.style.display).toBe('block')
    expect(proxy.style.transform).toBe('translateX(3px)')
    expect(document.body.style.cursor).toBe('col-resize')
    expect(document.body.style.userSelect).toBe('none')
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 201 }))
    await nextTick()

    expect(preventedOnDown).toBe(true)
    expect(displayOnDown).not.toBe('block')
    expect(cursorOnDown).toBe('col-resize')
    expect(userSelectOnDown).toBe('text')
    expect(displayBeforeThreshold).not.toBe('block')
    expect(cursorBeforeThreshold).toBe('col-resize')
    expect(userSelectBeforeThreshold).toBe('text')
    expect(wrapper.find('col').attributes('style')).toContain('203px')
    expect(document.body.style.cursor).toBe('progress')
    expect(document.body.style.userSelect).toBe('text')
  })

  it.each(['blur', 'unmount'] as const)('cleans up a pending drag on %s', async (ending) => {
    const wrapper = renderTable({ resizable: true })
    prepareRects(wrapper)
    const removeDocumentListener = vi.spyOn(document, 'removeEventListener')
    const removeWindowListener = vi.spyOn(window, 'removeEventListener')
    await wrapper.find('thead th').trigger('mousedown', { button: 0, clientX: 198 })
    if (ending === 'unmount') {
      wrapper.unmount()
    }
    else {
      window.dispatchEvent(new Event('blur'))
    }
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 238 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 238 }))
    await nextTick()

    expect(document.body.style.cursor).toBe('')
    expect(document.body.style.userSelect).toBe('')
    expect(removeDocumentListener).toHaveBeenCalledWith('mousemove', expect.any(Function))
    expect(removeDocumentListener).toHaveBeenCalledWith('mouseup', expect.any(Function))
    expect(removeWindowListener).toHaveBeenCalledWith('blur', expect.any(Function))
    if (ending === 'blur') {
      expect(wrapper.find('col').attributes('style')).toContain('200px')
      await wrapper.find('thead th').trigger('mousedown', { button: 0, clientX: 198 })
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 218 }))
      document.dispatchEvent(new MouseEvent('mouseup', { clientX: 218 }))
      await nextTick()
      expect(wrapper.find('col').attributes('style')).toContain('220px')
    }
  })

  it.each(['returned', 'clamped'] as const)('suppresses sorting after a real drag with unchanged width (%s)', async (mode) => {
    const onChange = vi.fn()
    const wrapper = renderTable({ resizable: true, sorter: true, minWidth: mode === 'clamped' ? 200 : undefined }, { onChange })
    prepareRects(wrapper)
    const header = wrapper.find('thead th')
    await header.trigger('mousedown', { button: 0, clientX: 198 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: mode === 'clamped' ? 178 : 218 }))
    if (mode === 'returned') {
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 198 }))
    }
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 198 }))
    await header.trigger('click')

    expect(onChange).not.toHaveBeenCalled()
    expect(wrapper.find('col').attributes('style')).toContain('200px')
    await header.trigger('click')
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it.each(['header', 'sorter'] as const)('only suppresses the resized header click, including clicks on its %s', async (target) => {
    const onChange = vi.fn()
    const onNameCapture = vi.fn()
    const onAgeCapture = vi.fn()
    const wrapper = renderTable({}, {
      onChange,
      columns: [
        { title: 'Name', key: 'name', dataIndex: 'name', width: 200, resizable: true, sorter: true, onHeaderCell: () => ({ onClickCapture: onNameCapture }) },
        { title: 'Age', key: 'age', dataIndex: 'age', width: 200, resizable: true, sorter: true, onHeaderCell: () => ({ onClickCapture: onAgeCapture }) },
      ],
    })
    prepareRects(wrapper)
    const [nameHeader, ageHeader] = wrapper.findAll('thead th')
    const nameTarget = target === 'header' ? nameHeader! : nameHeader!.find('.ant-table-column-sorter')
    const ageTarget = target === 'header' ? ageHeader! : ageHeader!.find('.ant-table-column-sorter')
    try {
      await nameHeader!.trigger('mousedown', { button: 0, clientX: 198 })
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 218 }))
      document.dispatchEvent(new MouseEvent('mouseup', { clientX: 218 }))
      // Keep both clicks in the same task: the other header must neither be blocked nor consume the marker.
      ageTarget.element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      nameTarget.element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      await nextTick()

      expect(onChange).toHaveBeenCalledTimes(1)
      expect(onChange.mock.calls[0]![2].columnKey).toBe('age')
      expect(onAgeCapture).toHaveBeenCalledTimes(1)
      expect(onNameCapture).not.toHaveBeenCalled()
      await nameTarget.trigger('click')
      expect(onChange).toHaveBeenCalledTimes(2)
      expect(onNameCapture).toHaveBeenCalledTimes(1)
    }
    finally {
      wrapper.unmount()
    }
  })

  it('suppresses the header row click after a resize', async () => {
    const onHeaderRowClick = vi.fn()
    const wrapper = renderTable({ resizable: true }, {
      onHeaderRow: () => ({ onClick: onHeaderRowClick }),
    })
    prepareRects(wrapper)

    const header = wrapper.find('thead th')
    await header.trigger('mousedown', { button: 0, clientX: 198 })
    document.dispatchEvent(new MouseEvent('mousemove', { clientX: 218 }))
    document.dispatchEvent(new MouseEvent('mouseup', { clientX: 218 }))
    await wrapper.find('thead tr').trigger('click')

    expect(onHeaderRowClick).not.toHaveBeenCalled()
  })

  it('suppresses the next click after the header DOM is re-created', async () => {
    const onChange = vi.fn()
    const RecreatedHeaderCell = (_props: any, { attrs, slots }: any) =>
      h('th', { ...attrs, 'data-recreated': 'true' }, slots.default?.())
    const wrapper = renderTable({ resizable: true, sorter: true }, { onChange })
    prepareRects(wrapper)
    const originalHeader = wrapper.find('thead th')
    try {
      await originalHeader.trigger('mousedown', { button: 0, clientX: 198 })
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 218 }))
      document.dispatchEvent(new MouseEvent('mouseup', { clientX: 218 }))

      await wrapper.setProps({ components: { header: { cell: RecreatedHeaderCell } } })
      await nextTick()

      const recreatedHeader = wrapper.find('thead th')
      expect(recreatedHeader.element).not.toBe(originalHeader.element)
      expect(recreatedHeader.attributes('data-recreated')).toBe('true')

      await recreatedHeader.trigger('click')
      expect(onChange).not.toHaveBeenCalled()
    }
    finally {
      wrapper.unmount()
    }
  })

  it('clears the suppression when no click follows the resize', async () => {
    const onChange = vi.fn()
    const wrapper = renderTable({ resizable: true, sorter: true }, { onChange })
    prepareRects(wrapper)
    const header = wrapper.find('thead th')
    try {
      await header.trigger('mousedown', { button: 0, clientX: 198 })
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 218 }))
      document.dispatchEvent(new MouseEvent('mouseup', { clientX: 218 }))
      await new Promise(resolve => setTimeout(resolve, 0))
      await header.trigger('click')
      expect(onChange).toHaveBeenCalledTimes(1)
    }
    finally {
      wrapper.unmount()
    }
  })

  it('does not block keyboard sorting while a drag click is suppressed', async () => {
    const onChange = vi.fn()
    const wrapper = renderTable({ resizable: true, sorter: true }, { onChange })
    prepareRects(wrapper)
    const header = wrapper.find('thead th')
    try {
      await header.trigger('mousedown', { button: 0, clientX: 198 })
      document.dispatchEvent(new MouseEvent('mousemove', { clientX: 218 }))
      document.dispatchEvent(new MouseEvent('mouseup', { clientX: 218 }))
      await header.trigger('keydown', { key: 'Enter', keyCode: 13 })
      expect(onChange).toHaveBeenCalledTimes(1)
    }
    finally {
      wrapper.unmount()
    }
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
