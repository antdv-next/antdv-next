<docs lang="zh-CN">
选择不同配置组合查看效果。
</docs>

<docs lang="en-US">
Select different settings to see the result.

<style>
.table-demo-control-bar .ant-form-item {
  margin-inline-end: 16px !important;
  margin-bottom: 8px !important;
}
</style>
</docs>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { DownOutlined } from '@antdv-next/icons'
import { computed, ref } from 'vue'

interface DataType {
  key: number
  name: string
  age: number
  address: string
  description: string
}

type SizeType = TableProps['size']
type TablePagination = NonNullable<Exclude<TableProps['pagination'], boolean>>
type TablePaginationPlacement = NonNullable<TablePagination['placement']>[number]
type ExpandableConfig = TableProps['expandable']
type TableRowSelection = TableProps['rowSelection']

const columns: TableProps['columns'] = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    filters: [
      { text: 'London', value: 'London' },
      { text: 'New York', value: 'New York' },
    ],
    onFilter: (value, record) => record.address.indexOf(value as string) === 0,
  },
  {
    title: 'Action',
    key: 'action',
    sorter: true,
  },
]

const dataSource = Array.from({ length: 10 }).map<DataType>((_, i) => ({
  key: i,
  name: 'John Brown',
  age: Number(`${i}2`),
  address: `New York No. ${i} Lake Park`,
  description: `My name is John Brown, I am ${i}2 years old, living in New York No. ${i} Lake Park.`,
}))

const defaultExpandable: ExpandableConfig = {
  expandedRowRender: record => record.description,
}

const bordered = ref(false)
const loading = ref(false)
const size = ref<SizeType>('large')
const expandableEnabled = ref(true)
const showTitle = ref(false)
const showHeader = ref(true)
const showFooter = ref(true)
const rowSelectionEnabled = ref(true)
const hasData = ref(true)
const tableLayout = ref<'unset' | 'fixed'>('unset')
const top = ref<TablePaginationPlacement>('none')
const bottom = ref<TablePaginationPlacement>('bottomEnd')
const ellipsis = ref(false)
const yScroll = ref(false)
const xScroll = ref<'unset' | 'scroll' | 'fixed'>('unset')

const scroll = computed(() => {
  const next: { x?: number | string, y?: number | string } = {}
  if (yScroll.value) {
    next.y = 240
  }
  if (xScroll.value !== 'unset') {
    next.x = '120vw'
  }
  return next
})

const tableColumns = computed<TableProps['columns']>(() => {
  const next = columns.map(column => ({
    ...column,
    ellipsis: ellipsis.value,
  }))

  if (xScroll.value === 'fixed') {
    if (next[0]) {
      next[0].fixed = true
    }
    if (next.length > 0) {
      next[next.length - 1]!.fixed = 'right'
    }
  }

  return next as TableProps['columns']
})

const expandable = computed<ExpandableConfig | undefined>(() => (
  expandableEnabled.value ? defaultExpandable : undefined
))
const rowSelection = computed<TableRowSelection | undefined>(() => (
  rowSelectionEnabled.value ? {} : undefined
))
const tableData = computed(() => (hasData.value ? dataSource : []))
const pagination = computed<TableProps['pagination']>(() => ({
  placement: [top.value, bottom.value],
}))

function handleAction() {}
</script>

<template>
  <a-form layout="inline" class="table-demo-control-bar" style="margin-bottom: 16px">
    <a-form-item label="Bordered">
      <a-switch v-model:checked="bordered" />
    </a-form-item>
    <a-form-item label="loading">
      <a-switch v-model:checked="loading" />
    </a-form-item>
    <a-form-item label="Title">
      <a-switch v-model:checked="showTitle" />
    </a-form-item>
    <a-form-item label="Column Header">
      <a-switch v-model:checked="showHeader" />
    </a-form-item>
    <a-form-item label="Footer">
      <a-switch v-model:checked="showFooter" />
    </a-form-item>
    <a-form-item label="Expandable">
      <a-switch v-model:checked="expandableEnabled" />
    </a-form-item>
    <a-form-item label="Checkbox">
      <a-switch v-model:checked="rowSelectionEnabled" />
    </a-form-item>
    <a-form-item label="Fixed Header">
      <a-switch v-model:checked="yScroll" />
    </a-form-item>
    <a-form-item label="Has Data">
      <a-switch v-model:checked="hasData" />
    </a-form-item>
    <a-form-item label="Ellipsis">
      <a-switch v-model:checked="ellipsis" />
    </a-form-item>
    <a-form-item label="Size">
      <a-radio-group v-model:value="size">
        <a-radio-button value="large">
          Large
        </a-radio-button>
        <a-radio-button value="medium">
          Medium
        </a-radio-button>
        <a-radio-button value="small">
          Small
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Table Scroll">
      <a-radio-group v-model:value="xScroll">
        <a-radio-button value="unset">
          Unset
        </a-radio-button>
        <a-radio-button value="scroll">
          Scroll
        </a-radio-button>
        <a-radio-button value="fixed">
          Fixed Columns
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Table Layout">
      <a-radio-group v-model:value="tableLayout">
        <a-radio-button value="unset">
          Unset
        </a-radio-button>
        <a-radio-button value="fixed">
          Fixed
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Pagination Top">
      <a-radio-group v-model:value="top">
        <a-radio-button value="topStart">
          TopStart
        </a-radio-button>
        <a-radio-button value="topCenter">
          TopCenter
        </a-radio-button>
        <a-radio-button value="topEnd">
          TopEnd
        </a-radio-button>
        <a-radio-button value="none">
          None
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="Pagination Bottom">
      <a-radio-group v-model:value="bottom">
        <a-radio-button value="bottomStart">
          BottomStart
        </a-radio-button>
        <a-radio-button value="bottomCenter">
          BottomCenter
        </a-radio-button>
        <a-radio-button value="bottomEnd">
          BottomEnd
        </a-radio-button>
        <a-radio-button value="none">
          None
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
  </a-form>
  <a-table
    :bordered="bordered"
    :loading="loading"
    :size="size"
    :row-selection="rowSelection"
    :expandable="expandable"
    :scroll="scroll"
    :table-layout="tableLayout === 'unset' ? undefined : tableLayout"
    :show-header="showHeader"
    :columns="tableColumns"
    :data-source="tableData"
    :pagination="pagination"
  >
    <template v-if="showTitle" #title>
      Here is title
    </template>
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'action'">
        <a-space size="medium">
          <a @click.prevent="handleAction">Delete</a>
          <a @click.prevent="handleAction">
            <a-space>
              More actions
              <DownOutlined />
            </a-space>
          </a>
        </a-space>
      </template>
    </template>
    <template v-if="showFooter" #footer>
      Here is footer
    </template>
  </a-table>
</template>
