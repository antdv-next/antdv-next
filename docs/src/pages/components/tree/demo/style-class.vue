<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Tree 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Tree by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { TreeDataNode, TreeProps } from 'antdv-next'
import { ref } from 'vue'

const treeData: TreeDataNode[] = [
  {
    title: 'parent 1',
    key: '0-0',
    children: [
      {
        title: 'parent 1-0',
        key: '0-0-0',
        children: [
          {
            title: 'leaf',
            key: '0-0-0-0',
          },
          {
            title: 'leaf',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: 'parent 1-1',
        key: '0-0-1',
        children: [
          {
            title: 'leaf',
            key: '0-0-1-0',
          },
        ],
      },
    ],
  },
]

const styles: TreeProps['styles'] = {
  root: { border: '2px solid #d9d9d9' },
  item: { margin: '2px 0' },
}

const stylesFn: TreeProps['styles'] = (info) => {
  if (!info.props.checkable) {
    return {
      root: {
        border: `2px solid #E5D9F2`,
        borderRadius: '4px',
      },
    }
  }
  return {}
}

const expandedKeys = ref(['0-0-0', '0-0-1'])
const selectedKeys = ref(['0-0-1'])
const checkedKeys = ref(['0-0-0', '0-0-1'])
const classes = {
  root: 'root',
  item: 'item',
  itemTitle: 'itemTitle',
}
</script>

<template>
  <a-flex vertical gap="medium">
    <a-tree
      :tree-data="treeData"
      :classes="classes"
      auto-expand-parent
      checkable
      :styles="styles"
    />
    <a-tree
      v-model:expanded-keys="expandedKeys"
      v-model:selected-keys="selectedKeys"
      v-model:checked-keys="checkedKeys"
      :tree-data="treeData"
      :classes="classes"
      auto-expand-parent
      :checkable="false"
      :styles="stylesFn"
    />
  </a-flex>
</template>

<style>
.root {
  padding: 8px;
  border-radius: 4px;
}

.item {
  border-radius: 2px;
}

.itemTitle {
  font-size: 14px;
}
</style>
