<docs lang="zh-CN">
在列配置中设置 `resizable`，即可拖动表头边缘调整列宽。拖动过程中仅移动代理线，松开后才更新表格布局。
</docs>

<docs lang="en-US">
Set `resizable` on a column to resize it from the header edge. Only the proxy moves while dragging; the table layout updates on release.
</docs>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'

interface DataType {
  key: number
  date: string
  amount: number
  type: string
  note: string
}

const columns: TableProps<DataType>['columns'] = [
  { title: 'Date', dataIndex: 'date', width: 200, resizable: true },
  { title: 'Amount', dataIndex: 'amount', width: 120, resizable: true, sorter: (a, b) => a.amount - b.amount },
  { title: 'Type', dataIndex: 'type', width: 120, resizable: true },
  { title: 'Note', dataIndex: 'note', width: 160, resizable: true },
  { title: 'Action', key: 'action' },
]

const dataSource: DataType[] = [
  { key: 0, date: '2018-02-11', amount: 120, type: 'income', note: 'transfer' },
  { key: 1, date: '2018-03-11', amount: 243, type: 'income', note: 'transfer' },
  { key: 2, date: '2018-04-11', amount: 98, type: 'income', note: 'transfer' },
]
</script>

<template>
  <a-table bordered :columns="columns" :data-source="dataSource">
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'action'">
        <a>Delete</a>
      </template>
    </template>
  </a-table>
</template>
