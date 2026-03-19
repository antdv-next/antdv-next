<docs lang="zh-CN">
在移动端直接使用桌面表格组件时，常会遇到滚动不跟手、缺少惯性反馈、表头与内容滚动撕裂、方向轴误判等问题。开启 `touchScroll` 可让表格在移动设备上获得接近原生的丝滑触摸滚动体验。传入 [TableTouchScrollConfig](#tabletouchscrollconfig) 可自定义摩擦力、拖拽阈值等参数。
</docs>

<docs lang="en-US">
When using desktop Table components on mobile, you may encounter issues like scroll lag, no inertia, header-body scroll tearing, and axis misjudgment. Enable `touchScroll` for a near-native smooth touch scrolling experience. Pass [TableTouchScrollConfig](#tabletouchscrollconfig) to customize friction, drag threshold, etc.
</docs>

<script setup lang="ts">
import type { TableProps } from 'antdv-next'
import { h, ref } from 'vue'

interface DataType {
  key: number
  name: string
  age: number
  department: string
  role: string
  email: string
  status: string
}

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name', key: 'name', width: 100, fixed: 'start' },
  { title: 'Age', dataIndex: 'age', key: 'age', width: 80 },
  { title: 'Department', dataIndex: 'department', key: 'department', width: 120 },
  { title: 'Role', dataIndex: 'role', key: 'role', width: 140 },
  { title: 'Email', dataIndex: 'email', key: 'email', width: 200 },
  { title: 'Status', dataIndex: 'status', key: 'status', width: 100 },
  {
    title: 'Action',
    key: 'action',
    fixed: 'end',
    width: 80,
    render: () => h('a', 'Edit'),
  },
]

const departments = ['Engineering', 'Design', 'Product', 'Marketing', 'Sales']
const roles = ['Manager', 'Senior', 'Junior', 'Lead', 'Intern']
const statuses = ['Active', 'On Leave', 'Remote']

const dataSource: DataType[] = Array.from({ length: 30 }).map((_, i) => ({
  key: i,
  name: `User ${i}`,
  age: 24 + (i % 15),
  department: departments[i % departments.length]!,
  role: roles[i % roles.length]!,
  email: `user${i}@example.com`,
  status: statuses[i % statuses.length]!,
}))

const viewMode = ref<'mobile' | 'pc'>('mobile')
</script>

<template>
  <a-space direction="vertical" style="width: 100%">
    <a-segmented v-model:value="viewMode" :options="[{ label: '移动端', value: 'mobile' }, { label: 'PC 端', value: 'pc' }]" shape="round" />
    <div :style="{ maxWidth: viewMode === 'mobile' ? '375px' : '100%', border: '1px solid #f0f0f0', borderRadius: '8px', overflow: 'hidden', transition: 'max-width 0.3s' }">
      <a-table
        :columns="columns"
        :data-source="dataSource"
        :pagination="false"
        :scroll="{ x: 'max-content', y: 300 }"
        :touch-scroll="true"
        size="small"
      />
    </div>
  </a-space>
</template>
