<docs lang="zh-CN">
`filterSearch` 用于开启筛选项的搜索，通过 `filterSearch:(input, record) => boolean` 设置自定义筛选方法
</docs>

<docs lang="en-US">
`filterSearch` is used to enable search of filter items, and you can set a custom filter method through `filterSearch:(input, record) => boolean`.
</docs>

<script setup lang="ts">
import type { TableEmits, TableProps } from 'antdv-next'

interface DataType {
  key: string
  name: string
  age: number
  address: string
}

const columns: TableProps['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    filters: [
      { text: 'Joe', value: 'Joe' },
      { text: 'Category 1', value: 'Category 1' },
      { text: 'Category 2', value: 'Category 2' },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.name.startsWith(String(value)),
    width: '30%',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    filters: [
      { text: 'London', value: 'London' },
      { text: 'New York', value: 'New York' },
    ],
    onFilter: (value, record) => record.address.startsWith(String(value)),
    filterSearch: true,
    width: '40%',
  },
]

const dataSource: DataType[] = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
  { key: '2', name: 'Jim Green', age: 42, address: 'London No. 1 Lake Park' },
  { key: '3', name: 'Joe Black', age: 32, address: 'Sydney No. 1 Lake Park' },
  { key: '4', name: 'Jim Red', age: 32, address: 'London No. 2 Lake Park' },
]

const handleChange: TableEmits['change'] = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra)
}
</script>

<template>
  <a-table :columns="columns" :data-source="dataSource" @change="handleChange" />
</template>
