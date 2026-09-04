<docs lang="zh-CN">
选择后进行操作，完成后清空选择，通过 `rowSelection.selectedRowKeys` 来控制选中项。
</docs>

<docs lang="en-US">
To perform operations and clear selections after selecting some rows, use `rowSelection.selectedRowKeys` to control selected rows.
</docs>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { computed, ref } from 'vue'

type TableRowSelection = TableProps['rowSelection']
type Key = string | number

interface DataType {
  key: Key
  name: string
  age: number
  address: string
}

const dataSource = Array.from({ length: 46 }).map<DataType>((_, i) => ({
  key: i,
  name: `Edward King ${i}`,
  age: 32,
  address: `London, Park Lane no. ${i}`,
}))

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
]

const selectedRowKeys = ref<Key[]>([])
const loading = ref(false)

function start() {
  loading.value = true
  setTimeout(() => {
    selectedRowKeys.value = []
    loading.value = false
  }, 1000)
}

function onSelectChange(newSelectedRowKeys: Key[]) {
  console.log('selectedRowKeys changed: ', newSelectedRowKeys)
  selectedRowKeys.value = newSelectedRowKeys
}

const rowSelection = computed<TableRowSelection>(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: onSelectChange,
}))

const hasSelected = computed(() => selectedRowKeys.value.length > 0)
</script>

<template>
  <a-flex gap="medium" vertical>
    <a-flex align="center" gap="medium">
      <a-button type="primary" :disabled="!hasSelected" :loading="loading" @click="start">
        Reload
      </a-button>
      <span v-if="hasSelected">
        Selected {{ selectedRowKeys.length }} items
      </span>
    </a-flex>
    <a-table :columns="columns" :data-source="dataSource" :row-selection="rowSelection" />
  </a-flex>
</template>
