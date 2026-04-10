<docs lang="zh-CN">
多行树节点。
</docs>

<docs lang="en-US">
Multiple line tree node.
</docs>

<script setup lang="ts">
import type { TreeDataNode, TreeEmits } from 'antdv-next'
import { ref } from 'vue'

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: 'This is a very very very very long text',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: 'This is also a very very very very very long text',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'This is also a very very very very very long title',
        key: '0-0-1',
        children: [{ key: '0-0-1-0' }],
      },
    ],
  },
]

const expandedKeys = ref(['0-0-0', '0-0-1'])
const selectedKeys = ref(['0-0-1'])
const checkedKeys = ref(['0-0-0', '0-0-1'])

const onSelect: TreeEmits['select'] = (selectedKeys, info) => {
  console.log('selected', selectedKeys, info)
}

const onCheck: TreeEmits['check'] = (checkedKeys, info) => {
  console.log('onCheck', checkedKeys, info)
}
</script>

<template>
  <a-tree
    v-model:expanded-keys="expandedKeys"
    v-model:selected-keys="selectedKeys"
    v-model:checked-keys="checkedKeys"
    checkable
    :tree-data="treeData"
    :style="{ width: '200px' }"
    @select="onSelect"
    @check="onCheck"
  >
    <template #titleRender="{ key }">
      <template v-if="key === '0-0-1-0'">
        <span style="color: #1677ff">sss</span>
      </template>
    </template>
  </a-tree>
</template>
