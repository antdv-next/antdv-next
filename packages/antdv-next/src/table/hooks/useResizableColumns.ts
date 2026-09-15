import type { ComputedRef, ShallowRef } from 'vue'
import type { AnyObject } from '../../_util/type'
import type { ColumnsType, ColumnType } from '../interface'
import { clsx } from '@v-c/util'
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'

const RESIZE_HANDLE_SIZE = 8
const DEFAULT_MIN_WIDTH = 40

interface DragState {
  cell: HTMLElement
  key: string
  startX: number
  startWidth: number
  currentWidth: number
  minWidth: number
  rtl: boolean
}

interface ResizableColumnsOptions<RecordType> {
  columns: ComputedRef<ColumnsType<RecordType>>
  direction: ComputedRef<'ltr' | 'rtl'>
  prefixCls: ComputedRef<string>
  rootRef: ShallowRef<HTMLElement | null>
}

function getColumnKey<RecordType>(column: ColumnType<RecordType>, path: number[]) {
  if (column.key !== undefined && column.key !== null) {
    return `key:${String(column.key)}`
  }
  if (column.dataIndex !== undefined && column.dataIndex !== null) {
    return `data:${JSON.stringify(column.dataIndex)}`
  }
  return `path:${path.join('.')}`
}

function walkLeafColumns<RecordType>(
  columns: ColumnsType<RecordType>,
  visit: (column: ColumnType<RecordType>, path: number[]) => void,
  parentPath: number[] = [],
) {
  columns.forEach((column, index) => {
    const path = [...parentPath, index]
    if ('children' in column && column.children?.length) {
      walkLeafColumns(column.children, visit, path)
    }
    else {
      visit(column, path)
    }
  })
}

export default function useResizableColumns<RecordType extends AnyObject>(
  options: ResizableColumnsOptions<RecordType>,
) {
  const resizeProxyRef = shallowRef<HTMLDivElement | null>(null)
  const resizedWidths = shallowRef(new Map<string, number>())
  let dragState: DragState | undefined
  let suppressClick = false
  let clickTimer: ReturnType<typeof setTimeout> | undefined

  function isResizeEdge(event: MouseEvent, cell: HTMLElement) {
    const rect = cell.getBoundingClientRect()
    const distance = options.direction.value === 'rtl'
      ? event.clientX - rect.left
      : rect.right - event.clientX
    return rect.width > RESIZE_HANDLE_SIZE * 2 && distance >= 0 && distance <= RESIZE_HANDLE_SIZE
  }

  function cleanupDrag() {
    if (!dragState) {
      return
    }

    const proxy = resizeProxyRef.value
    if (proxy) {
      proxy.style.display = 'none'
      proxy.style.transform = ''
    }

    dragState.cell.classList.remove(`${options.prefixCls.value}-cell-resize-active`)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
    dragState = undefined
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
  }

  function onMouseMove(event: MouseEvent) {
    if (!dragState) {
      return
    }

    const delta = event.clientX - dragState.startX
    dragState.currentWidth = Math.max(
      Math.round(dragState.startWidth + (dragState.rtl ? -delta : delta)),
      dragState.minWidth,
    )

    // 拖动过程中只移动代理线，松开后才更新表格布局。
    const offset = (dragState.currentWidth - dragState.startWidth) * (dragState.rtl ? -1 : 1)
    const proxy = resizeProxyRef.value
    if (proxy) {
      proxy.style.transform = `translateX(${offset}px)`
    }
  }

  function onMouseUp() {
    if (!dragState) {
      return
    }

    if (dragState.currentWidth !== dragState.startWidth) {
      const nextWidths = new Map(resizedWidths.value)
      nextWidths.set(dragState.key, dragState.currentWidth)
      resizedWidths.value = nextWidths
    }

    // mouseup 后紧跟着 click，短暂拦截一次，避免触发表头排序。
    suppressClick = true
    clearTimeout(clickTimer)
    clickTimer = setTimeout(() => {
      suppressClick = false
    }, 0)

    cleanupDrag()
  }

  function startDrag(
    event: MouseEvent,
    column: ColumnType<RecordType>,
    key: string,
    cell: HTMLElement,
  ) {
    if (dragState || event.button !== 0 || !isResizeEdge(event, cell)) {
      return
    }

    const root = options.rootRef.value
    const proxy = resizeProxyRef.value
    if (!root || !proxy) {
      return
    }

    const cellRect = cell.getBoundingClientRect()
    const rootRect = root.getBoundingClientRect()

    // 横向滚动条位于滚动容器底部，代理线只覆盖到可视内容区，避免盖住滚动条。
    const scrollContainer = root.querySelector(`.${options.prefixCls.value}-content`) ?? root.querySelector(`.${options.prefixCls.value}-body`)
    const contentBottom = scrollContainer
      ? scrollContainer.getBoundingClientRect().top + scrollContainer.clientHeight
      : cellRect.bottom
    const rtl = options.direction.value === 'rtl'
    const startWidth = cellRect.width
    const startEdge = (rtl ? cellRect.left : cellRect.right) - rootRect.left

    dragState = {
      cell,
      key,
      startX: event.clientX,
      startWidth,
      currentWidth: startWidth,
      minWidth: column.minWidth ?? DEFAULT_MIN_WIDTH,
      rtl,
    }

    proxy.style.display = 'block'
    proxy.style.left = `${startEdge}px`
    proxy.style.top = `${cellRect.top - rootRect.top}px`
    proxy.style.height = `${Math.max(contentBottom - cellRect.top, cellRect.height)}px`
    proxy.style.transform = 'translateX(0px)'

    cell.classList.add(`${options.prefixCls.value}-cell-resize-active`)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    event.preventDefault()
    event.stopPropagation()
  }

  // 注入到 header cell 的事件处理，由 onHeaderCell 转发。
  function handleMouseMove(event: MouseEvent, cell: HTMLElement) {
    cell.classList.toggle(
      `${options.prefixCls.value}-cell-resize-active`,
      isResizeEdge(event, cell),
    )
  }

  function handleMouseLeave(cell: HTMLElement) {
    if (!dragState) {
      cell.classList.remove(`${options.prefixCls.value}-cell-resize-active`)
    }
  }

  function handleClickCapture(
    event: MouseEvent,
    next?: (event: MouseEvent) => void,
  ) {
    if (suppressClick) {
      suppressClick = false
      event.preventDefault()
      event.stopPropagation()
      return
    }
    next?.(event)
  }

  function enhanceColumns(
    columns: ColumnsType<RecordType>,
    parentPath: number[] = [],
  ): ColumnsType<RecordType> {
    return columns.map((column, index) => {
      const path = [...parentPath, index]

      if ('children' in column && column.children?.length) {
        return { ...column, children: enhanceColumns(column.children, path) }
      }
      if (!column.resizable) {
        return column
      }

      const key = getColumnKey(column, path)
      const originOnHeaderCell = column.onHeaderCell

      return {
        ...column,
        width: resizedWidths.value.get(key) ?? column.width,
        onHeaderCell: (currentColumn, columnIndex) => {
          const cellProps = originOnHeaderCell?.(currentColumn, columnIndex) ?? {}
          const {
            class: cellClass,
            className,
            onClickCapture,
            onMousedown,
            onMousemove,
            onMouseleave,
            ...restCellProps
          } = cellProps as any

          return {
            ...restCellProps,
            className: clsx(className, cellClass, `${options.prefixCls.value}-cell-resizable`),
            onMousemove: (event: MouseEvent) => {
              handleMouseMove(event, event.currentTarget as HTMLElement)
              onMousemove?.(event)
            },
            onMouseleave: (event: MouseEvent) => {
              handleMouseLeave(event.currentTarget as HTMLElement)
              onMouseleave?.(event)
            },
            onMousedown: (event: MouseEvent) => {
              startDrag(event, column, key, event.currentTarget as HTMLElement)
              onMousedown?.(event)
            },
            onClickCapture: (event: MouseEvent) => {
              handleClickCapture(event, onClickCapture)
            },
          }
        },
      }
    })
  }

  const sourceWidths = computed(() => {
    const widths = new Map<string, ColumnType<RecordType>['width']>()
    walkLeafColumns(options.columns.value, (column, path) => {
      if (column.resizable) {
        widths.set(getColumnKey(column, path), column.width)
      }
    })
    return widths
  })

  let previousSourceWidths = new Map(sourceWidths.value)
  watch(sourceWidths, (currentWidths) => {
    const nextWidths = new Map(resizedWidths.value)
    let changed = false

    nextWidths.forEach((_width, key) => {
      if (!currentWidths.has(key) || previousSourceWidths.get(key) !== currentWidths.get(key)) {
        nextWidths.delete(key)
        changed = true
      }
    })

    if (changed) {
      resizedWidths.value = nextWidths
    }

    previousSourceWidths = new Map(currentWidths)
  })

  onBeforeUnmount(() => {
    clearTimeout(clickTimer)
    cleanupDrag()
  })

  const hasResizableColumns = computed(() => {
    let found = false
    walkLeafColumns(options.columns.value, (column) => {
      if (column.resizable) {
        found = true
      }
    })
    return found
  })

  return {
    columns: computed(() => enhanceColumns(options.columns.value)),
    hasResizableColumns,
    resizeProxyRef,
  }
}
