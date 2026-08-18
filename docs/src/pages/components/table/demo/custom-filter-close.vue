<docs lang="zh-CN">
自定义筛选面板关闭时不会自动提交暂存值。输入筛选值后，再次点击表头筛选图标关闭面板，`change` 不会触发；只有通过 `confirm` 才会应用筛选。
</docs>

<docs lang="en-US">
Closing a custom filter panel does not submit staged values automatically. Stage a value and click the header filter icon again to close the panel; `change` only fires after an explicit `confirm`.
</docs>

<script setup lang="ts">
import type { TableEmits, TableProps } from 'antdv-next'
import { Button, Input, Space } from 'antdv-next'
import { h, ref } from 'vue'

interface DataType {
  key: string
  name: string
  age: number
}

const dataSource: DataType[] = [
  { key: '1', name: 'John', age: 32 },
  { key: '2', name: 'Jim', age: 42 },
  { key: '3', name: 'Joe', age: 22 },
]

const changeCount = ref(0)
const appliedFilter = ref('')

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    onFilter: (value, record) => record.name.includes(String(value)),
    filterDropdown: ({ clearFilters, confirm, selectedKeys, setSelectedKeys }) => h(
      'div',
      {
        class: 'custom-filter-close-panel',
        onKeydown: (event: KeyboardEvent) => event.stopPropagation(),
      },
      [
        h(Input, {
          class: 'custom-filter-stage-input',
          placeholder: 'Stage a name',
          value: String(selectedKeys[0] || ''),
          'onUpdate:value': (value: string) => setSelectedKeys(value ? [value] : []),
        }),
        h(Space, null, {
          default: () => [
            h(Button, {
              class: 'custom-filter-apply',
              size: 'small',
              type: 'primary',
              onClick: () => confirm(),
            }, { default: () => 'Apply' }),
            h(Button, {
              class: 'custom-filter-reset',
              size: 'small',
              onClick: () => clearFilters?.({ confirm: true, closeDropdown: true }),
            }, { default: () => 'Reset' }),
          ],
        }),
      ],
    ),
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
]

const handleChange: TableEmits<DataType>['change'] = (_, filters) => {
  changeCount.value += 1
  const nameFilter = filters.name
  appliedFilter.value = Array.isArray(nameFilter) ? nameFilter.map(String).join(', ') : ''
}
</script>

<template>
  <a-space direction="vertical">
    <div class="custom-filter-status">
      <span data-testid="change-count">Change events: {{ changeCount }}</span>
      <span data-testid="applied-filter">Applied filter: {{ appliedFilter || 'none' }}</span>
    </div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
      @change="handleChange"
    />
  </a-space>
</template>

<style scoped>
.custom-filter-close-panel {
  display: flex;
  width: 220px;
  flex-direction: column;
  gap: 8px;
  padding: 8px;
}

.custom-filter-status {
  display: flex;
  gap: 16px;
}
</style>
