<docs lang="zh-CN">
`column.sorter` 支持 `multiple` 字段以配置多列排序优先级。通过 `sorter.compare` 配置排序逻辑，你可以通过不设置该函数只启动多列排序的交互形式。
</docs>

<docs lang="en-US">
`column.sorter` support `multiple` to config the priority of sort columns. Though `sorter.compare` to customize compare function. You can also leave it empty to use the interactive only.
</docs>

<script setup lang="ts">
import type { TableEmits, TableProps } from 'antdv-next'

interface DataType {
  key: string
  name: string
  chinese: number
  math: number
  english: number
}

const columns: TableProps['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Chinese Score',
    dataIndex: 'chinese',
    key: 'chinese',
    sorter: {
      compare: (a, b) => a.chinese - b.chinese,
      multiple: 3,
    },
  },
  {
    title: 'Math Score',
    dataIndex: 'math',
    key: 'math',
    sorter: {
      compare: (a, b) => a.math - b.math,
      multiple: 2,
    },
  },
  {
    title: 'English Score',
    dataIndex: 'english',
    key: 'english',
    sorter: {
      compare: (a, b) => a.english - b.english,
      multiple: 1,
    },
  },
]

const dataSource: DataType[] = [
  { key: '1', name: 'John Brown', chinese: 98, math: 60, english: 70 },
  { key: '2', name: 'Jim Green', chinese: 98, math: 66, english: 89 },
  { key: '3', name: 'Joe Black', chinese: 98, math: 90, english: 70 },
  { key: '4', name: 'Jim Red', chinese: 88, math: 99, english: 89 },
]

const onChange: TableEmits['change'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra)
}
</script>

<template>
  <a-table :columns="columns" :data-source="dataSource" @change="onChange" />
</template>
