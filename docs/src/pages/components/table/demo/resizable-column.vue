<docs lang="zh-CN">
可调整列宽。
</docs>

<docs lang="en-US">
Resizable column width.
</docs>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { computed, defineComponent, h, onBeforeUnmount, ref } from 'vue'

interface DataType {
  key: number
  date: string
  amount: number
  type: string
  note: string
}

interface ResizeInfo {
  size: {
    width: number
  }
}

interface ResizableTitleProps {
  width?: number
  onResize?: (event: MouseEvent, info: ResizeInfo) => void
}

type ColumnsType = NonNullable<TableProps['columns']>

const ResizableTitle = defineComponent<ResizableTitleProps>({
  name: 'ResizableTitle',
  inheritAttrs: false,
  props: ['width', 'onResize'] as any,
  setup(props, { slots, attrs }) {
    const dragging = ref(false)
    const stopNextClick = ref(false)
    let startX = 0
    let startWidth = 0

    const onMouseMove = (event: MouseEvent) => {
      if (!dragging.value) {
        return
      }
      stopNextClick.value = true
      const nextWidth = Math.max(startWidth + event.clientX - startX, 40)
      props.onResize?.(event, { size: { width: nextWidth } })
    }

    const onMouseUp = () => {
      dragging.value = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
      setTimeout(() => {
        stopNextClick.value = false
      }, 0)
    }

    const onMouseDown = (event: MouseEvent) => {
      event.preventDefault()
      event.stopPropagation()
      dragging.value = true
      stopNextClick.value = false
      startX = event.clientX
      startWidth = props.width || (event.currentTarget as HTMLElement).parentElement?.offsetWidth || 0
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    const onClickCapture = (event: MouseEvent) => {
      if (stopNextClick.value) {
        event.stopPropagation()
        event.preventDefault()
        stopNextClick.value = false
      }
    }

    onBeforeUnmount(() => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    })

    return () => {
      if (!props.width) {
        return h('th', attrs, slots.default?.())
      }

      return h(
        'th',
        {
          ...attrs,
          class: ['resizable-title', attrs.class],
          style: { ...(attrs.style as any), width: `${props.width}px` },
          onClickCapture,
        },
        [
          slots.default?.(),
          h('span', {
            class: 'resizable-handle',
            onMousedown: onMouseDown,
          }),
        ],
      )
    }
  },
})

const columns = ref<ColumnsType>([
  {
    title: 'Date',
    dataIndex: 'date',
    width: 200,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    width: 100,
    sorter: (a, b) => a.amount - b.amount,
  },
  {
    title: 'Type',
    dataIndex: 'type',
    width: 100,
  },
  {
    title: 'Note',
    dataIndex: 'note',
    width: 100,
  },
  {
    title: 'Action',
    key: 'action',
  },
])

const dataSource: DataType[] = [
  {
    key: 0,
    date: '2018-02-11',
    amount: 120,
    type: 'income',
    note: 'transfer',
  },
  {
    key: 1,
    date: '2018-03-11',
    amount: 243,
    type: 'income',
    note: 'transfer',
  },
  {
    key: 2,
    date: '2018-04-11',
    amount: 98,
    type: 'income',
    note: 'transfer',
  },
]

function handleResize(index: number) {
  return (_event: MouseEvent, { size }: ResizeInfo) => {
    columns.value = columns.value.map((col, colIndex) =>
      colIndex === index ? { ...col, width: size.width } : col,
    )
  }
}

const mergedColumns = computed<TableProps['columns']>(() =>
  columns.value.map((col, index) => ({
    ...col,
    onHeaderCell: (column: any) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  })),
)

const components = {
  header: {
    cell: ResizableTitle,
  },
}
</script>

<template>
  <a-table
    bordered
    :components="components"
    :columns="mergedColumns"
    :data-source="dataSource"
  >
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'action'">
        <a>Delete</a>
      </template>
    </template>
  </a-table>
</template>

<style>
.resizable-title {
  position: relative;
}

.resizable-handle {
  position: absolute;
  top: 0;
  right: -4px;
  width: 8px;
  height: 100%;
  cursor: col-resize;
  user-select: none;
}
</style>
