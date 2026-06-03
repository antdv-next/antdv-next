<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Table 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Table by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'

interface DataType {
  key?: string
  name?: string
  age?: number
  address?: string
  description?: string
}

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
]

const dataSource: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    description: 'My name is Joe Black, I am 32 years old, living in Sydney No. 1 Lake Park.',
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sydney No. 2 Lake Park',
    description: 'This user is disabled.',
  },
]

const classes: TableProps['classes'] = {
  root: 'custom-table-root',
}

const styles: TableProps['styles'] = {
  root: {
    padding: '10px',
    borderRadius: '8px',
  },
  pagination: {
    root: {
      padding: '10px',
    },
  },
  body: {
    row: {
      outline: '1px dashed rgba(226, 225, 225, 0.1)',
    },
    cell: {
      outline: '1px dashed rgba(226, 225, 225, 0.1)',
    },
  },
}

const stylesFn: TableProps['styles'] = (info) => {
  if (info?.props?.size === 'middle') {
    return {
      root: {
        color: '#e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      },
      title: {
        backgroundImage: 'linear-gradient(90deg, #6a5acd, #836fff)',
        color: '#fff',
        fontSize: '1.25rem',
        fontWeight: 600,
        padding: '12px 16px',
      },
      footer: {
        color: '#9ca3af',
      },
      header: {
        cell: {
          fontWeight: 600,
          fontSize: '0.95rem',
          color: '#b8bdfd',
          padding: '12px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        },
      },
      pagination: {
        root: {
          padding: '10px',
        },
        item: {
          color: '#b8bdfd',
        },
      },
    } as TableProps['styles']
  }
  return {} as any
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :classes="classes"
      :pagination="{ pageSize: 3, simple: true }"
      :styles="styles"
      size="small"
      virtual
      :scroll="{ y: 300 }"
    >
      <template #title>
        Table Object Styles
      </template>
      <template #footer>
        Table Object Footer
      </template>
    </a-table>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :classes="classes"
      :pagination="{ pageSize: 3, simple: true }"
      :styles="stylesFn"
      size="middle"
    >
      <template #title>
        Table Function Styles
      </template>
      <template #footer>
        Table Function Styles
      </template>
    </a-table>
  </a-flex>
</template>

<style>
.custom-table-root {
  color: #e0e0e0;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}
</style>
