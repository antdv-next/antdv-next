<docs lang="zh-CN">
使用 Table 组件作为自定义渲染列表。
</docs>

<docs lang="en-US">
Use the Table component as the customize render list.
</docs>

<script setup lang="ts">
import type { TableProps, TransferEmits, TransferProps } from 'antdv-next'
import { Table } from 'antdv-next'
import { ref } from 'vue'

interface DataType {
  key: string
  title: string
  description: string
  tag: string
  disabled?: boolean
}

const mockTags = ['cat', 'dog', 'bird'] as const

const mockData: DataType[] = Array.from({ length: 20 }, (_, i) => ({
  key: String(i),
  title: `content${i + 1}`,
  description: `description of content${i + 1}`,
  tag: mockTags[i % 3]!,
}))

const targetKeys = ref<string[]>([])

const interactionEnabled = ref(false)

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'title', key: 'title' },
  { title: 'Tag', dataIndex: 'tag', key: 'tag' },
  { title: 'Description', dataIndex: 'description', key: 'description' },
]

const filterOption: NonNullable<TransferProps['filterOption']> = (input: string, item: DataType) => {
  const q = input.trim().toLowerCase()
  if (!q)
    return true
  return item.title!.toLowerCase().includes(q)
}

const handleChange: TransferEmits['change'] = (keys) => {
  targetKeys.value = keys as string[]
}

const panelStyles: TransferProps['styles'] = {
  section: {
    width: 420,
    minHeight: 520,
  },
}

const tablePagination: TableProps['pagination'] = {
  pageSize: 10,
  showSizeChanger: false,
  hideOnSinglePage: false,
}

interface ListSlotProps {
  direction: 'left' | 'right'
  disabled: boolean
  filteredItems: DataType[]
  selectedKeys: string[]
  onItemSelect: (key: string, selected: boolean) => void
  onItemSelectAll: (keys: string[], checkAll: boolean | 'replace') => void
}

function tableRowSelection(slot: ListSlotProps): TableProps['rowSelection'] {
  return {
    getCheckboxProps: record => ({
      disabled: slot.disabled || Boolean((record as DataType).disabled),
    }),
    onChange: (selectedRowKeys) => {
      slot.onItemSelectAll(selectedRowKeys as string[], 'replace')
    },
    selectedRowKeys: slot.selectedKeys,
    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
  }
}

function tableOnRow(slot: ListSlotProps): TableProps['onRow'] {
  return (record) => {
    const row = record as DataType
    return {
      onClick: (e: MouseEvent) => {
        if (slot.disabled || row.disabled)
          return
        const el = e.target as HTMLElement | null
        if (!el)
          return
        if (el.closest('.ant-table-selection-column'))
          return
        const key = row.key
        const selected = slot.selectedKeys.includes(key)
        slot.onItemSelect(key, !selected)
      },
      style: { cursor: slot.disabled || row.disabled ? undefined : 'pointer' },
    }
  }
}
</script>

<template>
  <div>
    <a-transfer
      v-model:target-keys="targetKeys"
      :data-source="mockData"
      :disabled="interactionEnabled"
      :show-select-all="false"
      show-search
      :filter-option="filterOption"
      :styles="panelStyles"
      :render="(item: DataType) => item.title"
      @change="handleChange"
    >
      <template #default="slotProps">
        <a-table
          size="small"
          :row-selection="tableRowSelection(slotProps as ListSlotProps)"
          :on-row="tableOnRow(slotProps as ListSlotProps)"
          :columns="columns"
          :data-source="slotProps.filteredItems"
          :pagination="tablePagination"
        >
          <template #bodyCell="{ column, text }">
            <template v-if="column.key === 'tag'">
              <a-tag color="cyan">
                {{ String(text).toUpperCase() }}
              </a-tag>
            </template>
          </template>
        </a-table>
      </template>
    </a-transfer>
    <a-space align="center" style="margin-top: 12px">
      <a-switch
        v-model:checked="interactionEnabled"
        checked-children="disabled"
        un-checked-children="disabled"
      />
    </a-space>
  </div>
</template>
