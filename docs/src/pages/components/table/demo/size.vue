<docs lang="zh-CN">
两种紧凑型的列表，小型列表只用于对话框内。
</docs>

<docs lang="en-US">
There are two compacted table sizes: `medium` and `small`. The `small` size is used in Modals only.

<style>#table-demo-size h4 { margin-bottom: 16px; }</style>
</docs>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'

interface DataType {
  key: string
  name: string
  age: number
  address: string
}

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
]

const dataSource: DataType[] = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: '3', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park' },
]
</script>

<template>
  <a-divider>Medium size table</a-divider>
  <a-table :columns="columns" :data-source="dataSource" size="medium" />
  <a-divider>Small size table</a-divider>
  <a-table :columns="columns" :data-source="dataSource" size="small" />
</template>
