<docs lang="zh-CN">
简单的表格，最后一列是各种操作。
</docs>

<docs lang="en-US">
Simple table with actions.
</docs>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { h } from 'vue'

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: text => h('a', text),
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, record) => record.tags,
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => h('span', [`Invite ${record.name}`, ' | ', 'Delete']),
  },
]

const dataSource: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
]

function tagColor(tag: string) {
  if (tag === 'loser') {
    return 'volcano'
  }
  return tag.length > 5 ? 'geekblue' : 'green'
}
</script>

<template>
  <a-table :columns="columns" :data-source="dataSource">
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'tags'">
        <a-space size="small" wrap>
          <a-tag v-for="tag in record.tags" :key="tag" :color="tagColor(tag)">
            {{ tag.toUpperCase() }}
          </a-tag>
        </a-space>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-space size="middle">
          <a>Invite {{ record.name }}</a>
          <a>Delete</a>
        </a-space>
      </template>
    </template>
  </a-table>
</template>
