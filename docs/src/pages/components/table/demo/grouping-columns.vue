<docs lang="zh-CN">
`columns[n]` 可以内嵌 `children`，以渲染分组表头。
</docs>

<docs lang="en-US">
Group table head with `columns[n].children`.
</docs>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'

interface DataType {
  key: string
  name: string
  age: number
  street: string
  building: string
  number: number
  companyAddress: string
  companyName: string
  gender: string
}

const columns: TableProps['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    width: 100,
    fixed: 'start',
    filters: [
      { text: 'Joe', value: 'Joe' },
      { text: 'John', value: 'John' },
    ],
    onFilter: (value, record) => record.name.indexOf(String(value)) === 0,
  },
  {
    title: 'Other',
    children: [
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: 150,
        sorter: (a, b) => a.age - b.age,
      },
      {
        title: 'Address',
        children: [
          { title: 'Street', dataIndex: 'street', key: 'street', width: 150 },
          {
            title: 'Block',
            children: [
              { title: 'Building', dataIndex: 'building', key: 'building', width: 100 },
              { title: 'Door No.', dataIndex: 'number', key: 'number', width: 100 },
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Company',
    children: [
      {
        title: 'Company Address',
        dataIndex: 'companyAddress',
        key: 'companyAddress',
        width: 200,
      },
      {
        title: 'Company Name',
        dataIndex: 'companyName',
        key: 'companyName',
      },
    ],
  },
  {
    title: 'Gender',
    dataIndex: 'gender',
    key: 'gender',
    width: 80,
    fixed: 'end',
  },
]

const dataSource: DataType[] = Array.from({ length: 100 }).map((_, i) => ({
  key: String(i),
  name: 'John Brown',
  age: i + 1,
  street: 'Lake Park',
  building: 'C',
  number: 2035,
  companyAddress: 'Lake Street 42',
  companyName: 'SoftLake Co',
  gender: 'M',
}))
</script>

<template>
  <a-table
    class="custom-table"
    :columns="columns"
    :data-source="dataSource"
    bordered
    size="medium"
    :scroll="{ x: 'calc(700px + 50%)', y: 47 * 5 }"
  />
</template>

<style scoped>
.custom-table :deep(.ant-table .ant-table-container .ant-table-body),
.custom-table :deep(.ant-table .ant-table-container .ant-table-content) {
  scrollbar-width: thin;
  scrollbar-color: #eaeaea transparent;
}
</style>
