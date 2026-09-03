<docs lang="zh-CN">
两种紧凑型的列表，小型列表只用于对话框内。
</docs>

<docs lang="en-US">
There are two compacted table sizes: `medium` and `small`. The `small` size is used in Modals only.
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

const dataSource: DataType[] = Array.from({ length: 200 }).map((_, key) => ({
  key: String(key),
  name: 'Sample Name',
  age: 30 + (key % 5),
  address: `Sample Address ${key}`,
}))
</script>

<template>
  <div style="width: 300px">
    <a-table
      :columns="columns"
      :data-source="dataSource"
      size="small"
      :pagination="{ defaultCurrent: 13 }"
    />
  </div>
</template>
