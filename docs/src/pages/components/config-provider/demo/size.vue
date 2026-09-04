<docs lang="zh-CN">
修改默认组件尺寸。
</docs>

<docs lang="en-US">
Config component default size.
</docs>

<script setup lang="ts">
import type { ConfigProviderProps, TableProps } from 'antdv-next'
import { ref } from 'vue'

type SizeType = ConfigProviderProps['componentSize']

const componentSize = ref<SizeType>('small')

const columns: TableProps['columns'] = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Age', dataIndex: 'age' },
]

const dataSource = [
  { key: '1', name: 'John Brown', age: 32 },
  { key: '2', name: 'Jim Green', age: 42 },
  { key: '3', name: 'Joe Black', age: 32 },
]

const tabItems = [
  {
    label: 'Tab 1',
    key: '1',
    children: 'Content of Tab Pane 1',
  },
  {
    label: 'Tab 2',
    key: '2',
    children: 'Content of Tab Pane 2',
  },
  {
    label: 'Tab 3',
    key: '3',
    children: 'Content of Tab Pane 3',
  },
]
</script>

<template>
  <a-radio-group v-model:value="componentSize">
    <a-radio-button value="small">
      Small
    </a-radio-button>
    <a-radio-button value="medium">
      Medium
    </a-radio-button>
    <a-radio-button value="large">
      Large
    </a-radio-button>
  </a-radio-group>
  <a-divider />
  <a-config-provider :component-size="componentSize">
    <a-space vertical :size="[0, 16]" style="width: 100%">
      <a-input />
      <a-tabs default-active-key="1" :items="tabItems" />
      <a-input-search allow-clear />
      <a-textarea allow-clear />
      <a-select default-value="demo" :options="[{ value: 'demo' }]" />
      <a-date-picker />
      <a-range-picker />
      <a-button>Button</a-button>
      <a-card title="Card">
        <a-table :columns="columns" :data-source="dataSource" />
      </a-card>
    </a-space>
  </a-config-provider>
</template>
