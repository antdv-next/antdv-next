<docs lang="zh-CN">
使用 Tree 组件作为自定义渲染列表。
</docs>

<docs lang="en-US">
Customize the render list with a Tree component.
</docs>

<script setup lang="ts">
import type { TransferEmits, TransferKey } from 'antdv-next'
import { ref } from 'vue'

interface TreeNode {
  key: string
  title: string
  children?: TreeNode[]
}

const treeData: TreeNode[] = [
  { key: '0-0', title: '0-0' },
  {
    key: '0-1',
    title: '0-1',
    children: [
      { key: '0-1-0', title: '0-1-0' },
      { key: '0-1-1', title: '0-1-1' },
    ],
  },
  { key: '0-2', title: '0-2' },
  { key: '0-3', title: '0-3' },
  { key: '0-4', title: '0-4' },
]

const targetKeys = ref<string[]>([])

function flattenData(list: TreeNode[] = [], result: TreeNode[] = []) {
  list.forEach((item) => {
    result.push(item)
    if (item.children) {
      flattenData(item.children, result)
    }
  })
  return result
}

const transferDataSource = flattenData(treeData, []).map(item => ({
  key: item.key,
  title: item.title,
}))

const isChecked = (selectedKeys: TransferKey[], eventKey: TransferKey) => selectedKeys.includes(eventKey)

function generateTree(treeNodes: TreeNode[] = [], checkedKeys: string[] = []): TreeNode[] {
  return treeNodes.map(({ children, ...props }) => ({
    ...props,
    disabled: checkedKeys.includes(props.key),
    children: children ? generateTree(children, checkedKeys) : undefined,
  }))
}

const handleChange: TransferEmits['change'] = (keys) => {
  targetKeys.value = keys as string[]
}
</script>

<template>
  <a-transfer
    v-model:target-keys="targetKeys"
    class="tree-transfer"
    :data-source="transferDataSource"
    :render="(item) => item.title"
    :show-select-all="false"
    @change="handleChange"
  >
    <template #default="{ direction, selectedKeys, onItemSelect }">
      <div v-if="direction === 'left'" style="padding: 8px">
        <a-tree
          block-node
          checkable
          check-strictly
          default-expand-all
          :checked-keys="[...selectedKeys, ...targetKeys]"
          :tree-data="generateTree(treeData, targetKeys)"
          @check="(_, info) => onItemSelect(info.node.key, !isChecked([...selectedKeys, ...targetKeys], info.node.key))"
          @select="(_, info) => onItemSelect(info.node.key, !isChecked([...selectedKeys, ...targetKeys], info.node.key))"
        />
      </div>
    </template>
  </a-transfer>
</template>

<style scoped>
:deep(.tree-transfer .ant-transfer-list:first-child) {
  flex: none;
  width: 50%;
}
</style>
