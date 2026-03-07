<script setup lang="ts">
import type { TreeDataNode } from 'antdv-next'
import { ref } from 'vue'

const checkedKeys = ref<string[]>([])
const checkedKey2 = ref<string[]>([])
const treeData: TreeDataNode[] = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      { title: '0-1-0-0', key: '0-1-0-0' },
      { title: '0-1-0-1', key: '0-1-0-1' },
      { title: '0-1-0-2', key: '0-1-0-2' },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
]

function handleCheck() {
  checkedKeys.value = ['0-0-1']
  checkedKey2.value = ['0-0-1']
}
</script>

<template>
  <div>
    <a-app class="w-full px-10">
      <a-button @click="handleCheck">
        测试
      </a-button>
      <a-tree
        v-model:checked-keys="checkedKeys"
        checkable
        :tree-data="treeData"
      />
      <span>
        {{ checkedKeys }}
      </span>
      <a-tree
        v-model:checked-keys="checkedKey2"
        checkable
        :check-strictly="true"
        :tree-data="treeData"
      />
      <span>
        {{ checkedKey2 }}
      </span>
    </a-app>
  </div>
</template>
