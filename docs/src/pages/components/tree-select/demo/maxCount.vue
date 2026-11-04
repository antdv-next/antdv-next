<docs lang="zh-CN">
你可以通过设置 `maxCount` 约束最多可选中的数量，当超出限制时会变成禁止选中状态。
</docs>

<docs lang="en-US">
You can set the `maxCount` prop to control the max number of items can be selected. When the limit is exceeded, the options will become disabled.
</docs>

<script setup lang="ts">
import { DownOutlined } from '@antdv-next/icons'
import { TreeSelect } from 'antdv-next'
import { ref } from 'vue'

const MAX_COUNT = 3
const SHOW_CHILD = TreeSelect.SHOW_CHILD

const treeData = [
  {
    title: 'Parent 1',
    value: 'parent1',
    children: [
      {
        title: 'Child 1-1',
        value: 'child1-1',
      },
      {
        title: 'Child 1-2',
        value: 'child1-2',
      },
    ],
  },
  {
    title: 'Parent 2',
    value: 'parent2',
    children: [
      {
        title: 'Child 2-1',
        value: 'child2-1',
      },
      {
        title: 'Child 2-2',
        value: 'child2-2',
      },
    ],
  },
]

const value = ref<string[]>(['child1-1'])
</script>

<template>
  <a-tree-select
    v-model:value="value"
    :tree-data="treeData"
    multiple
    tree-checkable
    :max-count="MAX_COUNT"
    style="width: 100%"
    :show-checked-strategy="SHOW_CHILD"
    placeholder="Please select"
  >
    <template #suffix>
      <span>{{ value.length }} / {{ MAX_COUNT }}</span>
      <DownOutlined />
    </template>
  </a-tree-select>
</template>
