<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { h } from 'vue'

interface DataType {
  key: string
  name: string
  age: number
  address?: string | null
}

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
]

const dataSource: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: null,
  },
  { key: '2', name: 'Jim Green', age: 42, address: undefined },
  { key: '3', name: 'Joe Black', age: 32, address: '' },
]
function transformCellText({ text, column, record }: any) {
  const val = record && column?.dataIndex ? record[column.dataIndex] : undefined
  // 处理空值
  if (column?.dataIndex && (val === null || val === undefined || val === '')) {
    return '-'
  }
  // 默认返回文本
  return h('span', { class: column?.class }, text)
}
</script>

<template>
  <a-config-provider :transform-cell-text="transformCellText">
    <a-table :columns="columns" :data-source="dataSource" bordered />
  </a-config-provider>
</template>
