import type { ComputedRef, ShallowRef } from 'vue'
import type { AnyObject } from '../../_util/type'
import type { ColumnsType, ColumnType } from '../interface'
import { clsx } from '@v-c/util'
import { computed, onBeforeUnmount, shallowRef, watch } from 'vue'

const RESIZE_HIT_AREA_WIDTH = 8
const DEFAULT_MIN_WIDTH = 40

interface DragState {
  headerCell: HTMLElement
  columnKey: string
  startClientX: number
  startWidth: number
  pendingWidth: number
  minWidth: number
  rtl: boolean
}

interface BodyStyleSnapshot {
  cursor: string
  cursorPriority: string
  userSelect: string
  userSelectPriority: string
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
  const resizedWidthsByKey = shallowRef(new Map<string, number>())
  let dragState: DragState | undefined
  let originalBodyStyles: BodyStyleSnapshot | undefined
  let suppressNextHeaderClick = false
  let clickSuppressionTimer: ReturnType<typeof setTimeout> | undefined

  function isPointerInResizeZone(event: MouseEvent, headerCell: HTMLElement) {
    // 合并表头的实际宽度不对应单个叶子列，不能直接用于调整列宽。
    if (Number(headerCell.getAttribute('colspan') ?? 1) !== 1) {
      return false
    }

    const rect = headerCell.getBoundingClientRect()
    const distance = options.direction.value === 'rtl'
      ? event.clientX - rect.left
      : rect.right - event.clientX
    return rect.width > RESIZE_HIT_AREA_WIDTH * 2 && distance >= 0 && distance <= RESIZE_HIT_AREA_WIDTH
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

    dragState.headerCell.classList.remove(`${options.prefixCls.value}-cell-resize-active`)
    if (originalBodyStyles) {
      document.body.style.setProperty('cursor', originalBodyStyles.cursor, originalBodyStyles.cursorPriority)
      document.body.style.setProperty('user-select', originalBodyStyles.userSelect, originalBodyStyles.userSelectPriority)
      originalBodyStyles = undefined
    }

    dragState = undefined
    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)
    window.removeEventListener('blur', cleanupDrag)
  }

  function handleDragMove(event: MouseEvent) {
    if (!dragState) {
      return
    }

    const delta = event.clientX - dragState.startClientX
    dragState.pendingWidth = Math.max(
      Math.round(dragState.startWidth + (dragState.rtl ? -delta : delta)),
      dragState.minWidth,
    )

    // 拖动过程中只移动代理线，松开后才更新表格布局。
    const offset = (dragState.pendingWidth - dragState.startWidth) * (dragState.rtl ? -1 : 1)
    const proxy = resizeProxyRef.value
    if (proxy) {
      proxy.style.transform = `translateX(${offset}px)`
    }
  }

  function handleDragEnd() {
    if (!dragState) {
      return
    }

    if (dragState.pendingWidth !== dragState.startWidth) {
      const nextResizedWidthsByKey = new Map(resizedWidthsByKey.value)
      nextResizedWidthsByKey.set(dragState.columnKey, dragState.pendingWidth)
      resizedWidthsByKey.value = nextResizedWidthsByKey
    }

    // mouseup 后紧跟着 click，短暂拦截一次，避免触发表头排序。
    suppressNextHeaderClick = true
    clearTimeout(clickSuppressionTimer)
    clickSuppressionTimer = setTimeout(() => {
      suppressNextHeaderClick = false
    }, 0)

    cleanupDrag()
  }

  function startDrag(
    event: MouseEvent,
    column: ColumnType<RecordType>,
    columnKey: string,
    headerCell: HTMLElement,
  ) {
    if (dragState || event.button !== 0 || !isPointerInResizeZone(event, headerCell)) {
      return
    }

    const root = options.rootRef.value
    const proxy = resizeProxyRef.value
    if (!root || !proxy) {
      return
    }

    const cellRect = headerCell.getBoundingClientRect()
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
      headerCell,
      columnKey,
      startClientX: event.clientX,
      startWidth,
      pendingWidth: startWidth,
      minWidth: column.minWidth ?? DEFAULT_MIN_WIDTH,
      rtl,
    }

    proxy.style.display = 'block'
    proxy.style.left = `${startEdge}px`
    proxy.style.top = `${cellRect.top - rootRect.top}px`
    proxy.style.height = `${Math.max(contentBottom - cellRect.top, cellRect.height)}px`
    proxy.style.transform = 'translateX(0px)'

    originalBodyStyles = {
      cursor: document.body.style.cursor,
      cursorPriority: document.body.style.getPropertyPriority('cursor'),
      userSelect: document.body.style.userSelect,
      userSelectPriority: document.body.style.getPropertyPriority('user-select'),
    }

    headerCell.classList.add(`${options.prefixCls.value}-cell-resize-active`)

    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)
    window.addEventListener('blur', cleanupDrag)

    event.preventDefault()
    event.stopPropagation()
  }

  // 注入到 header cell 的事件处理，由 onHeaderCell 转发。
  function handleHeaderMouseMove(event: MouseEvent, headerCell: HTMLElement) {
    headerCell.classList.toggle(
      `${options.prefixCls.value}-cell-resize-active`,
      isPointerInResizeZone(event, headerCell),
    )
  }

  function handleHeaderMouseLeave(headerCell: HTMLElement) {
    if (!dragState) {
      headerCell.classList.remove(`${options.prefixCls.value}-cell-resize-active`)
    }
  }

  function handleHeaderClickCapture(
    event: MouseEvent,
    next?: (event: MouseEvent) => void,
  ) {
    if (suppressNextHeaderClick) {
      suppressNextHeaderClick = false
      event.preventDefault()
      event.stopPropagation()
      return
    }
    next?.(event)
  }

  function withResizableColumns(
    columns: ColumnsType<RecordType>,
    parentPath: number[] = [],
  ): ColumnsType<RecordType> {
    return columns.map((column, index) => {
      const path = [...parentPath, index]

      if ('children' in column && column.children?.length) {
        return { ...column, children: withResizableColumns(column.children, path) }
      }
      if (!column.resizable) {
        return column
      }

      const columnKey = getColumnKey(column, path)
      const originalOnHeaderCell = column.onHeaderCell

      return {
        ...column,
        width: resizedWidthsByKey.value.get(columnKey) ?? column.width,
        onHeaderCell: (currentColumn, columnIndex) => {
          const cellProps = originalOnHeaderCell?.(currentColumn, columnIndex) ?? {}
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
              handleHeaderMouseMove(event, event.currentTarget as HTMLElement)
              onMousemove?.(event)
            },
            onMouseleave: (event: MouseEvent) => {
              handleHeaderMouseLeave(event.currentTarget as HTMLElement)
              onMouseleave?.(event)
            },
            onMousedown: (event: MouseEvent) => {
              startDrag(event, column, columnKey, event.currentTarget as HTMLElement)
              onMousedown?.(event)
            },
            onClickCapture: (event: MouseEvent) => {
              handleHeaderClickCapture(event, onClickCapture)
            },
          }
        },
      }
    })
  }

  const configuredWidthsByKey = computed(() => {
    const widthsByKey = new Map<string, ColumnType<RecordType>['width']>()
    walkLeafColumns(options.columns.value, (column, path) => {
      if (column.resizable) {
        widthsByKey.set(getColumnKey(column, path), column.width)
      }
    })
    return widthsByKey
  })

  let previousConfiguredWidthsByKey = new Map(configuredWidthsByKey.value)
  watch(configuredWidthsByKey, (currentConfiguredWidthsByKey) => {
    const nextResizedWidthsByKey = new Map(resizedWidthsByKey.value)
    let changed = false

    nextResizedWidthsByKey.forEach((_width, columnKey) => {
      if (!currentConfiguredWidthsByKey.has(columnKey) || previousConfiguredWidthsByKey.get(columnKey) !== currentConfiguredWidthsByKey.get(columnKey)) {
        nextResizedWidthsByKey.delete(columnKey)
        changed = true
      }
    })

    if (changed) {
      resizedWidthsByKey.value = nextResizedWidthsByKey
    }

    previousConfiguredWidthsByKey = new Map(currentConfiguredWidthsByKey)
  })

  onBeforeUnmount(() => {
    clearTimeout(clickSuppressionTimer)
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
    columns: computed(() => withResizableColumns(options.columns.value)),
    hasResizableColumns,
    resizeProxyRef,
  }
}
