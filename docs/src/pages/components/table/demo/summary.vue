<docs lang="zh-CN">
通过 `summary` 设置总结栏。使用 `Table.Summary.Cell` 同步 Column 的固定状态。你可以通过配置 `Table.Summary` 的 `fixed` 属性使其固定。
</docs>

<docs lang="en-US">
Set summary content by `summary` prop. Sync column fixed status with `Table.Summary.Cell`. You can fixed it by set `Table.Summary` `fixed` prop.
</docs>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'

interface DataType {
  key: string
  name: string
  borrow: number
  repayment: number
}

interface FixedDataType {
  key: number
  name: string
  description: string
}

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Borrow', dataIndex: 'borrow', key: 'borrow' },
  { title: 'Repayment', dataIndex: 'repayment', key: 'repayment' },
]

const dataSource: DataType[] = [
  { key: '1', name: 'John Brown', borrow: 10, repayment: 33 },
  { key: '2', name: 'Jim Green', borrow: 100, repayment: 0 },
  { key: '3', name: 'Joe Black', borrow: 10, repayment: 10 },
  { key: '4', name: 'Jim Red', borrow: 75, repayment: 45 },
]

const fixedColumns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', fixed: true, width: 100 },
  { title: 'Description', dataIndex: 'description' },
]

const fixedDataSource = Array.from({ length: 20 }).map<FixedDataType>((_, i) => ({
  key: i,
  name: ['Light', 'Bamboo', 'Little'][i % 3]!,
  description: 'Everything that has a beginning, has an end.',
}))
</script>

<template>
  <a-flex vertical gap="small">
    <a-table
      bordered
      class="custom-summary-table"
      :columns="columns"
      :data-source="dataSource"
      :pagination="false"
    >
      <template #summary="pageData">
        <a-table-summary>
          <a-table-summary-row>
            <a-table-summary-cell :index="0">
              Total
            </a-table-summary-cell>
            <a-table-summary-cell :index="1">
              <a-typography-text type="danger">
                {{ pageData.reduce((sum, item) => sum + item.borrow, 0) }}
              </a-typography-text>
            </a-table-summary-cell>
            <a-table-summary-cell :index="2">
              <a-typography-text>
                {{ pageData.reduce((sum, item) => sum + item.repayment, 0) }}
              </a-typography-text>
            </a-table-summary-cell>
          </a-table-summary-row>
          <a-table-summary-row>
            <a-table-summary-cell :index="0">
              Balance
            </a-table-summary-cell>
            <a-table-summary-cell :index="1" :col-span="2">
              <a-typography-text type="danger">
                {{ pageData.reduce((sum, item) => sum + item.borrow - item.repayment, 0) }}
              </a-typography-text>
            </a-table-summary-cell>
          </a-table-summary-row>
        </a-table-summary>
      </template>
    </a-table>
    <a-table
      bordered
      class="custom-summary-table"
      :columns="fixedColumns"
      :data-source="fixedDataSource"
      :pagination="false"
      :scroll="{ x: 2000, y: 500 }"
    >
      <template #summary>
        <a-table-summary fixed>
          <a-table-summary-row>
            <a-table-summary-cell :index="0">
              Summary
            </a-table-summary-cell>
            <a-table-summary-cell :index="1">
              This is a summary content
            </a-table-summary-cell>
          </a-table-summary-row>
        </a-table-summary>
      </template>
    </a-table>
  </a-flex>
</template>

<style>
.custom-summary-table .ant-table-body,
.custom-summary-table .ant-table-content {
  scrollbar-width: thin;
  scrollbar-color: #eaeaea transparent;
}
</style>
