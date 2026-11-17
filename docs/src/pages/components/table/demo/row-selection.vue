<docs lang="zh-CN">
第一列是联动的选择框。可以通过 `rowSelection.type` 属性指定选择类型，默认为 `checkbox`。

> 默认点击 checkbox 触发选择行为，需要点击行触发可以参考「点击行选中」示例。
</docs>

<docs lang="en-US">
Rows can be selectable by making first column as a selectable column. You can use `rowSelection.type` to set selection type. Default is `checkbox`.

> Selection happens when clicking checkbox by default. See the "Row Click Selection" example if you need row-click selection behavior.
</docs>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { computed, ref } from 'vue'

interface DataType {
  key: string
  name: string
  age: number
  address: string
}

const dataSource: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Disabled User',
    age: 99,
    address: 'Sydney No. 1 Lake Park',
  },
]

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Age', dataIndex: 'age', key: 'age' },
  { title: 'Address', dataIndex: 'address', key: 'address' },
]

const selectionType = ref<'checkbox' | 'radio'>('checkbox')

const selectedRowKeys = ref<Array<string | number>>([])
const rowSelection = computed<TableProps['rowSelection']>(() => ({
  type: selectionType.value,
  selectedRowKeys: selectedRowKeys.value,
  onChange: (_selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${_selectedRowKeys}`, 'selectedRows: ', selectedRows)
    selectedRowKeys.value = _selectedRowKeys
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User',
    name: record.name,
  }),
}))
</script>

<template>
  <div>
    <a-radio-group v-model:value="selectionType">
      <a-radio value="checkbox">
        Checkbox
      </a-radio>
      <a-radio value="radio">
        radio
      </a-radio>
    </a-radio-group>
    <a-divider />
    <a-table :columns="columns" :data-source="dataSource" :row-selection="rowSelection">
      <template #bodyCell="{ column, text }">
        <template v-if="column.key === 'name'">
          <a>{{ text }}</a>
        </template>
      </template>
    </a-table>
  </div>
</template>
