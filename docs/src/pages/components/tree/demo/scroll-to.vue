<docs lang="zh-CN">
受控模式可使用 `useTree` 获取节点路径并更新 `expandedKeys`，然后滚动到目标节点。
</docs>

<docs lang="en-US">
In controlled mode, use `useTree` to get the node path and update `expandedKeys` before scrolling to the target node.
</docs>

<script setup lang="ts">
import type { TreeDataNode } from 'antdv-next'
import { useTree } from 'antdv-next'
import { nextTick, ref, useTemplateRef } from 'vue'

const TARGET_KEY = '0-1-1-1-1'

function createTree(key = '0', level = 1): TreeDataNode {
  return {
    key,
    title: key,
    children: level < 5 ? [0, 1].map(index => createTree(`${key}-${index}`, level + 1)) : undefined,
  }
}

const treeData = [createTree()]

const treeRef = useTemplateRef<any>('treeRef')
const expandedKeys = ref<(string | number)[]>([])
const { getPath } = useTree(treeData)

async function scrollTo() {
  expandedKeys.value = getPath(TARGET_KEY).map(({ key }) => key as string)
  await nextTick()
  treeRef.value?.scrollTo({ key: TARGET_KEY, align: 'top' })
}
</script>

<template>
  <a-flex vertical gap="small">
    <a-button @click="scrollTo">
      scrollTo: {{ TARGET_KEY }}
    </a-button>
    <a-tree
      ref="treeRef"
      v-model:expanded-keys="expandedKeys"
      :height="200"
      :tree-data="treeData"
    />
  </a-flex>
</template>
