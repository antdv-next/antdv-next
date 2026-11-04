<docs lang="zh-CN">
当 `showCheckedStrategy='SHOW_PARENT'` 或 `showCheckedStrategy='SHOW_ALL'` 且 `treeCheckStrictly=false` 时，`maxCount` 就不会生效。
</docs>

<docs lang="en-US">
When `showCheckedStrategy=SHOW_PARENT` or `showCheckedStrategy=SHOW_ALL` and `treeCheckStrictly=false`, `maxCount` will not take effect.
</docs>

<script setup lang="ts">
import { DownOutlined } from '@antdv-next/icons'
import { TreeSelect } from 'antdv-next'
import { ref } from 'vue'

const MAX_COUNT = 2
const SHOW_PARENT = TreeSelect.SHOW_PARENT

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    key: '0-0',
    children: [
      {
        title: 'Child Node1',
        value: '0-0-1',
        key: '0-0-1',
      },
      {
        title: 'Child Node2',
        value: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    key: '0-1',
    children: [
      {
        title: 'Child Node3',
        value: '0-1-1',
        key: '0-1-1',
      },
      {
        title: 'Child Node4',
        value: '0-1-2',
        key: '0-1-2',
      },
    ],
  },
]

const value = ref<string[]>([])
</script>

<template>
  <a-tree-select
    v-model:value="value"
    tree-checkable
    :show-checked-strategy="SHOW_PARENT"
    :max-count="MAX_COUNT"
    placeholder="please select"
    style="width: 100%"
    :tree-data="treeData"
  >
    <template #suffix>
      <span>{{ value.length }} / {{ MAX_COUNT }}</span>
      <DownOutlined />
    </template>
  </a-tree-select>
</template>
