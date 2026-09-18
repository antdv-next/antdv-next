import type { ComputedRef, ShallowRef } from 'vue'
import type { AnyObject } from '../../_util/type'
import type { ColumnsType, ColumnType } from '../interface'
import { clsx } from '@v-c/util'
import { computed, nextTick, onBeforeUnmount, shallowRef, watch } from 'vue'

const RESIZE_HIT_AREA_WIDTH = 8
const RESIZE_DRAG_THRESHOLD = 3
const DEFAULT_MIN_WIDTH = 40

interface DragState {
  started: boolean
  headerCell: HTMLElement
  columnKey: string
  startClientX: number
  startWidth: number
  pendingWidth: number
  minWidth: number
  rtl: boolean
}

interface CursorState {
  headerCell: HTMLElement
  bodyCursor: string
  bodyCursorPriority: string
  headerCursor: string
  headerCursorPriority: string
}

interface BodyStyleSnapshot {
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
  let cursorState: CursorState | undefined
  let suppressedHeader: HTMLElement | undefined
  let clickSuppressionTimer: ReturnType<typeof setTimeout> | undefined

  function isPointerInResizeZone(event: MouseEvent, headerCell: HTMLElement) {
    // 合并表头的实际宽度不对应单个叶子列，不能直接用于调整列宽。
    // Merged header widths span multiple leaf columns and cannot be used to resize a single column.
    if (Number(headerCell.getAttribute('colspan') ?? 1) !== 1) {
      return false
    }

    const rect = headerCell.getBoundingClientRect()
    const distance = options.direction.value === 'rtl'
      ? event.clientX - rect.left
      : rect.right - event.clientX
    return rect.width > RESIZE_HIT_AREA_WIDTH * 2 && distance >= 0 && distance <= RESIZE_HIT_AREA_WIDTH
  }

  function clearResizeCursor() {
    if (!cursorState) {
      return
    }
    const { headerCell, bodyCursor, bodyCursorPriority, headerCursor, headerCursorPriority } = cursorState
    document.body.style.setProperty('cursor', bodyCursor, bodyCursorPriority)
    headerCell.style.setProperty('cursor', headerCursor, headerCursorPriority)
    cursorState = undefined
    window.removeEventListener('blur', cleanupDrag)
  }

  function setResizeCursor(headerCell: HTMLElement) {
    if (cursorState?.headerCell === headerCell) {
      return
    }
    clearResizeCursor()
    cursorState = {
      headerCell,
      bodyCursor: document.body.style.cursor,
      bodyCursorPriority: document.body.style.getPropertyPriority('cursor'),
      headerCursor: headerCell.style.cursor,
      headerCursorPriority: headerCell.style.getPropertyPriority('cursor'),
    }
    document.body.style.cursor = 'col-resize'
    headerCell.style.cursor = 'col-resize'
    window.addEventListener('blur', cleanupDrag)
  }

  function cleanupDrag() {
    clearResizeCursor()
    if (!dragState) {
      return
    }

    const proxy = resizeProxyRef.value
    if (proxy) {
      proxy.style.display = 'none'
      proxy.style.transform = ''
      proxy.style.zIndex = ''
    }
    options.rootRef.value?.style.removeProperty('--table-resize-scrollbar-z-index')

    if (originalBodyStyles) {
      document.body.style.setProperty('user-select', originalBodyStyles.userSelect, originalBodyStyles.userSelectPriority)
      originalBodyStyles = undefined
    }

    dragState = undefined
    document.removeEventListener('mousemove', handleDragMove)
    document.removeEventListener('mouseup', handleDragEnd)
  }

  function handleDragMove(event: MouseEvent) {
    if (!dragState) {
      return
    }

    // 拖拽经过其他表头时也覆盖其 cursor: pointer，包括未开启 resizable 的排序列。
    // Override the cursor on other headers during dragging, including sortable columns without resizable enabled.
    const headerCell = event.target instanceof Element ? event.target.closest('th') : null
    if (headerCell && options.rootRef.value?.contains(headerCell)) {
      setResizeCursor(headerCell)
    }

    const delta = event.clientX - dragState.startClientX

    // 边缘单击和轻微抖动不启动拖拽，保留表头排序等点击行为。
    // Treat edge clicks and small pointer movements as clicks, preserving header sorting and other click behavior.
    if (!dragState.started && (Math.abs(delta) < RESIZE_DRAG_THRESHOLD || !activateDrag(dragState))) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    dragState.pendingWidth = Math.max(
      Math.round(dragState.startWidth + (dragState.rtl ? -delta : delta)),
      dragState.minWidth,
    )

    // 拖动过程中只移动代理线，松开后才更新表格布局。
    // Move only the proxy during dragging; update the table layout on release.
    const offset = (dragState.pendingWidth - dragState.startWidth) * (dragState.rtl ? -1 : 1)
    const proxy = resizeProxyRef.value
    if (proxy) {
      proxy.style.transform = `translateX(${offset}px)`
    }
  }

  function handleDragEnd(event: MouseEvent) {
    if (!dragState) {
      return
    }

    const { headerCell, started } = dragState
    if (started) {
      if (dragState.pendingWidth !== dragState.startWidth) {
        const nextResizedWidthsByKey = new Map(resizedWidthsByKey.value)
        nextResizedWidthsByKey.set(dragState.columnKey, dragState.pendingWidth)
        resizedWidthsByKey.value = nextResizedWidthsByKey
      }

      // 仅拦截实际拖拽表头随后的一次点击，不影响其他列；没有 click 时自动清除。
      // Suppress only the resized header's next click; clear the marker if no click follows.
      suppressedHeader = headerCell
      clearTimeout(clickSuppressionTimer)
      clickSuppressionTimer = setTimeout(() => {
        suppressedHeader = undefined
      }, 0)
    }

    cleanupDrag()

    // 列宽提交后重新判断边缘位置，避免松开时先变回 pointer，等下次移动才恢复。
    // Recheck the edge after committing the width so the resize cursor stays correct on release.
    nextTick(() => {
      if (dragState || !headerCell.isConnected) {
        return
      }
      const rect = headerCell.getBoundingClientRect()
      if (event.clientY >= rect.top && event.clientY <= rect.bottom) {
        handleHeaderMouseMove(event, headerCell)
      }
    })
  }

  function prepareDrag(
    event: MouseEvent,
    column: ColumnType<RecordType>,
    columnKey: string,
    headerCell: HTMLElement,
  ) {
    if (dragState || event.button !== 0 || !isPointerInResizeZone(event, headerCell)) {
      return
    }

    const startWidth = headerCell.getBoundingClientRect().width
    dragState = {
      started: false,
      headerCell,
      columnKey,
      startClientX: event.clientX,
      startWidth,
      pendingWidth: startWidth,
      minWidth: column.minWidth ?? DEFAULT_MIN_WIDTH,
      rtl: options.direction.value === 'rtl',
    }

    // 按下时就阻止原生文字选择；是否拦截后续 click 仍由实际拖拽决定。
    // Prevent native text selection on press; suppress the subsequent click only if a drag actually occurs.
    event.preventDefault()
    setResizeCursor(headerCell)
    document.addEventListener('mousemove', handleDragMove)
    document.addEventListener('mouseup', handleDragEnd)
  }

  function activateDrag(state: DragState) {
    const root = options.rootRef.value
    const proxy = resizeProxyRef.value
    if (!root || !proxy) {
      return false
    }

    const { headerCell, rtl } = state
    const cellRect = headerCell.getBoundingClientRect()
    const rootRect = root.getBoundingClientRect()

    // clientHeight 排除原生滚动条；虚拟滚动条通过层级覆盖完整的代理线。
    // clientHeight excludes native scrollbars; virtual scrollbars are layered above the full-height proxy.
    const scrollContainer = root.querySelector(
      `.${options.prefixCls.value}-content, .${options.prefixCls.value}-body, .${options.prefixCls.value}-tbody-virtual-holder`,
    )
    const contentBottom = scrollContainer
      ? scrollContainer.getBoundingClientRect().top + scrollContainer.clientHeight
      : cellRect.bottom
    const startEdge = (rtl ? cellRect.left : cellRect.right) - rootRect.left

    const header = headerCell.closest(`.${options.prefixCls.value}-thead`)!
    const layers = Array.from(header.querySelectorAll(`.${options.prefixCls.value}-cell-fix`))
    const stickyHolder = header.closest(`.${options.prefixCls.value}-sticky-holder`)
    if (stickyHolder) {
      layers.push(stickyHolder)
    }

    // 只高于表内固定层，不使用会覆盖 Tooltip 等浮层的超大 z-index。
    // Stay just above fixed table layers without using a large z-index that would cover tooltips or other popups.
    const zIndex = Math.max(
      Number(getComputedStyle(proxy).zIndex),
      ...layers.map(layer => Number(getComputedStyle(layer).zIndex) + 1),
    )
    proxy.style.zIndex = String(zIndex)
    root.style.setProperty('--table-resize-scrollbar-z-index', String(zIndex + 1))

    state.started = true
    proxy.style.display = 'block'
    proxy.style.left = `${startEdge}px`
    proxy.style.top = `${cellRect.top - rootRect.top}px`
    proxy.style.height = `${Math.max(contentBottom - cellRect.top, cellRect.height)}px`
    proxy.style.transform = 'translateX(0px)'

    originalBodyStyles = {
      userSelect: document.body.style.userSelect,
      userSelectPriority: document.body.style.getPropertyPriority('user-select'),
    }

    document.body.style.userSelect = 'none'
    return true
  }

  // 注入到 header cell 的事件处理，由 onHeaderCell 转发。
  // Header cell event handlers are attached through onHeaderCell.
  function handleHeaderMouseMove(event: MouseEvent, headerCell: HTMLElement) {
    if (dragState || isPointerInResizeZone(event, headerCell)) {
      setResizeCursor(headerCell)
    }
    else if (cursorState?.headerCell === headerCell) {
      clearResizeCursor()
    }
  }

  function handleHeaderMouseLeave(headerCell: HTMLElement) {
    if (!dragState && cursorState?.headerCell === headerCell) {
      clearResizeCursor()
    }
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
              prepareDrag(event, column, columnKey, event.currentTarget as HTMLElement)
              onMousedown?.(event)
            },
            onClickCapture: (event: MouseEvent) => {
              if (event.currentTarget === suppressedHeader) {
                suppressedHeader = undefined
                event.preventDefault()
                event.stopPropagation()
              }
              else {
                onClickCapture?.(event)
              }
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
