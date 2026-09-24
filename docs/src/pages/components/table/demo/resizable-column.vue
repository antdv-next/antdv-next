<docs lang="zh-CN">
给列设置 `resizable`，即可拖动表头边缘调整列宽，松开后触发 `resizeColumn`。未回写 `columns` 时表格会自行记住拖出的宽度；下面的示例通过 `resizeColumn` 回写宽度，并可一键恢复默认。

开启后各列的 `width` 请使用数字（px），不需要固定宽度的列可以不写；使用 `'20%'`、`'200px'` 等字符串时，松手位置的精确对齐和对无宽度列的保护都不会生效。
</docs>

<docs lang="en-US">
Set `resizable` on a column to resize it by dragging the header edge; `resizeColumn` fires on release. The table keeps the dragged width on its own when `columns` is not updated. This demo writes the width back through `resizeColumn` and can reset it.

Use numeric (px) `width` values on resizable tables and leave `width` unset on columns that should stay flexible. With string widths such as `'20%'` or `'200px'`, the drop position is not kept exact and columns without a width are no longer protected from being squeezed.
</docs>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { ref } from 'vue'

interface DataType {
  key: number
  date: string
  amount: number
  type: string
  note: string
}

type Columns = NonNullable<TableProps<DataType>['columns']>

function defaultColumns(): Columns {
  return [
    { title: 'Date', dataIndex: 'date', key: 'date', width: 200, resizable: true },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', width: 120, resizable: true, minWidth: 80, sorter: (a, b) => a.amount - b.amount },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 120, resizable: true },
    { title: 'Note', dataIndex: 'note', key: 'note', width: 160, resizable: true },
    { title: 'Action', key: 'action' },
  ]
}

const columns = ref<Columns>(defaultColumns())

const dataSource: DataType[] = [
  { key: 0, date: '2018-02-11', amount: 120, type: 'income', note: 'transfer' },
  { key: 1, date: '2018-03-11', amount: 243, type: 'income', note: 'transfer' },
  { key: 2, date: '2018-04-11', amount: 98, type: 'income', note: 'transfer' },
]

const onResizeColumn: TableProps<DataType>['onResizeColumn'] = (width, _column, columnKey) => {
  columns.value = columns.value.map(col => (col.key === columnKey ? { ...col, width } : col))
}
</script>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-button @click="columns = defaultColumns()">
      Reset widths
    </a-button>
    <a-table bordered :columns="columns" :data-source="dataSource" @resize-column="onResizeColumn">
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'action'">
          <a>Delete</a>
        </template>
      </template>
    </a-table>
  </a-space>
</template>
