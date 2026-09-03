<docs lang="zh-CN">
表格的分页设置。
</docs>

<docs lang="en-US">
Table pagination settings.
</docs>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { computed, ref } from 'vue'

type TablePagination = NonNullable<Exclude<TableProps['pagination'], boolean>>
type TablePaginationPlacement = NonNullable<TablePagination['placement']>[number]

interface DataType {
  key: string
  name: string
  age: number
  address: string
  tags: string[]
}

const topOptions = [
  { label: 'topStart', value: 'topStart' },
  { label: 'topCenter', value: 'topCenter' },
  { label: 'topEnd', value: 'topEnd' },
  { label: 'none', value: 'none' },
]

const bottomOptions = [
  { label: 'bottomStart', value: 'bottomStart' },
  { label: 'bottomCenter', value: 'bottomCenter' },
  { label: 'bottomEnd', value: 'bottomEnd' },
  { label: 'none', value: 'none' },
]

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
  { title: 'Tags', dataIndex: 'tags', key: 'tags' },
  { title: 'Action', key: 'action' },
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

const top = ref<TablePaginationPlacement>('topStart')
const bottom = ref<TablePaginationPlacement>('bottomEnd')
const pagination = computed<TableProps['pagination']>(() => ({
  placement: [top.value, bottom.value],
}))

function getTagColor(tag: string) {
  if (tag === 'loser') {
    return 'volcano'
  }
  return tag.length > 5 ? 'geekblue' : 'green'
}
</script>

<template>
  <div>
    <div>
      <a-radio-group
        v-model:value="top"
        style="margin-bottom: 10px"
        :options="topOptions"
      />
    </div>
    <a-radio-group
      v-model:value="bottom"
      style="margin-bottom: 10px"
      :options="bottomOptions"
    />
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
    >
      <template #bodyCell="{ column, record, text }">
        <template v-if="column.key === 'name'">
          <a>{{ text }}</a>
        </template>
        <template v-else-if="column.key === 'tags'">
          <a-space size="small" wrap>
            <a-tag
              v-for="tag in record.tags"
              :key="tag"
              :color="getTagColor(tag)"
            >
              {{ tag.toUpperCase() }}
            </a-tag>
          </a-space>
        </template>
        <template v-else-if="column.key === 'action'">
          <a-space size="medium">
            <a>Invite {{ record.name }}</a>
            <a>Delete</a>
          </a-space>
        </template>
      </template>
    </a-table>
  </div>
</template>
