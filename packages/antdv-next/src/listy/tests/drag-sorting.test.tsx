import type { VueWrapper } from '/@tests/utils'
import { afterEach, beforeAll, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '/@tests/utils'

type Handlers = Record<string, (...args: any[]) => void>

function handlersOf(wrapper: VueWrapper<any>): Handlers {
  return ((wrapper.vm.$ as any).subTree?.props ?? {}) as Handlers
}

function orderOf(wrapper: VueWrapper<any>) {
  return wrapper.findAll('.ant-listy-item').map(item => item.text())
}

function dragOver(sourceId: unknown, targetId: unknown) {
  return { operation: { source: { id: sourceId }, target: { id: targetId } } }
}

describe('listy drag-sorting demo', () => {
  let antd: any
  let Demo: any
  let wrapper: VueWrapper<any>

  beforeAll(async () => {
    antd = (await import('../../index')).default
    Demo = (
      await import(
        /* @vite-ignore */
        '../../../../../docs/src/pages/components/listy/demo/drag-sorting.vue',
      )
    ).default
  }, 60000)

  function render() {
    wrapper = mount(Demo, { global: { plugins: [antd] }, attachTo: document.body })
    return wrapper
  }

  afterEach(() => {
    wrapper?.unmount()
  })

  it('renders every row as the single child of its item wrapper', () => {
    render()
    const rows = wrapper.findAll('.ant-listy-item')
    expect(rows.length).toBe(20)
    rows.forEach((row) => {
      // The sortable element is the row content; its parent is the drop slot.
      expect(row.element.children.length).toBe(1)
      const content = row.element.firstElementChild as HTMLElement
      expect(content.classList.contains('ant-flex')).toBe(true)
      expect(content.parentElement).toBe(row.element)
      expect(content.querySelectorAll('button').length).toBe(1)
    })
  })

  it('keeps the drag overlay empty while idle', () => {
    render()
    const overlay = wrapper.find('[data-dnd-overlay]')
    expect(overlay.exists()).toBe(true)
    expect(overlay.element.children.length).toBe(0)
  })

  it('reorders rows when dragging over another row', async () => {
    render()
    expect(orderOf(wrapper).slice(0, 5)).toEqual(['Item 0', 'Item 1', 'Item 2', 'Item 3', 'Item 4'])

    handlersOf(wrapper).onDragStart?.()
    handlersOf(wrapper).onDragOver?.(dragOver(0, 3))
    await nextTick()

    expect(orderOf(wrapper).slice(0, 5)).toEqual(['Item 1', 'Item 2', 'Item 3', 'Item 0', 'Item 4'])
  })

  it('moves a row backwards as well', async () => {
    render()
    handlersOf(wrapper).onDragStart?.()
    handlersOf(wrapper).onDragOver?.(dragOver(4, 1))
    await nextTick()

    expect(orderOf(wrapper).slice(0, 5)).toEqual(['Item 0', 'Item 4', 'Item 1', 'Item 2', 'Item 3'])
  })

  it('ignores a drag over the row itself', async () => {
    render()
    const before = orderOf(wrapper)

    handlersOf(wrapper).onDragStart?.()
    handlersOf(wrapper).onDragOver?.(dragOver(2, 2))
    await nextTick()

    expect(orderOf(wrapper)).toEqual(before)
  })

  it('ignores a drag over an unknown target', async () => {
    render()
    const before = orderOf(wrapper)

    handlersOf(wrapper).onDragStart?.()
    handlersOf(wrapper).onDragOver?.(dragOver(0, 'not-an-item'))
    handlersOf(wrapper).onDragOver?.({ operation: { source: null, target: null } })
    await nextTick()

    expect(orderOf(wrapper)).toEqual(before)
  })

  it('keeps the new order once the drag completes', async () => {
    render()
    handlersOf(wrapper).onDragStart?.()
    handlersOf(wrapper).onDragOver?.(dragOver(0, 2))
    await nextTick()
    handlersOf(wrapper).onDragEnd?.({ canceled: false, operation: { source: { id: 0 } } })
    await nextTick()

    expect(orderOf(wrapper).slice(0, 4)).toEqual(['Item 1', 'Item 2', 'Item 0', 'Item 3'])
  })

  it('restores the original order when the drag is canceled', async () => {
    render()
    const before = orderOf(wrapper)

    handlersOf(wrapper).onDragStart?.()
    handlersOf(wrapper).onDragOver?.(dragOver(0, 5))
    await nextTick()
    expect(orderOf(wrapper)).not.toEqual(before)

    handlersOf(wrapper).onDragEnd?.({ canceled: true, operation: { source: { id: 0 } } })
    await nextTick()

    expect(orderOf(wrapper)).toEqual(before)
  })

  it('applies each drag over against the current order', async () => {
    render()
    handlersOf(wrapper).onDragStart?.()
    handlersOf(wrapper).onDragOver?.(dragOver(0, 1))
    await nextTick()
    handlersOf(wrapper).onDragOver?.(dragOver(0, 2))
    await nextTick()

    expect(orderOf(wrapper).slice(0, 4)).toEqual(['Item 1', 'Item 2', 'Item 0', 'Item 3'])
  })
})
