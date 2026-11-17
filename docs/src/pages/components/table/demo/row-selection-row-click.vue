<docs lang="zh-CN">
默认点击 checkbox 触发选择行为。通过 `onRow` 给行绑定点击事件，实现点击行触发选择；radio 模式下点击行会替换当前选中项，被 `getCheckboxProps` 禁用的行不会响应点击。
</docs>

<docs lang="en-US">
Selection happens when clicking the checkbox by default. Bind a click event to rows via `onRow` to trigger selection on row click; in radio mode clicking a row replaces the current selection, and rows disabled by `getCheckboxProps` are not selected on click.
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

const isDisabledRow = (record: DataType) => record.name === 'Disabled User'

const rowSelection = computed<TableProps['rowSelection']>(() => ({
  type: selectionType.value,
  selectedRowKeys: selectedRowKeys.value,
  onChange: (_selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${_selectedRowKeys}`, 'selectedRows: ', selectedRows)
    selectedRowKeys.value = _selectedRowKeys
  },
  getCheckboxProps: record => ({
    disabled: isDisabledRow(record),
    name: record.name,
  }),
}))

const onRow: TableProps['onRow'] = record => ({
  onClick: () => {
    if (isDisabledRow(record))
      return
    const key = record.key
    if (selectionType.value === 'radio') {
      selectedRowKeys.value = [key]
    }
    else {
      selectedRowKeys.value = selectedRowKeys.value.includes(key)
        ? selectedRowKeys.value.filter(k => k !== key)
        : [...selectedRowKeys.value, key]
    }
  },
})
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
    <a-table :columns="columns" :data-source="dataSource" :row-selection="rowSelection" :on-row="onRow">
      <template #bodyCell="{ column, text }">
        <template v-if="column.key === 'name'">
          <a>{{ text }}</a>
        </template>
      </template>
    </a-table>
  </div>
</template>
