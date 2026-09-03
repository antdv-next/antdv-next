<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 TreeSelect 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of TreeSelect by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { TreeSelectProps } from 'antdv-next'

const classes: TreeSelectProps['classes'] = {
  root: 'custom-tree-select',
}

const stylesObject: TreeSelectProps['styles'] = {
  input: {
    fontSize: 16,
  },
  suffix: {
    color: '#1890ff',
  },
  popup: {
    root: {
      border: '1px solid #1890ff',
    },
  },
}

const stylesFn: TreeSelectProps['styles'] = (info) => {
  if (info.props.size === 'medium') {
    return {
      suffix: {
        color: '#722ed1',
      },
      popup: {
        item: {
          color: '#722ed1',
        },
      },
    }
  }
  return {}
}

const treeData: TreeSelectProps['treeData'] = [
  {
    value: 'parent 1',
    title: 'parent 1',
    children: [
      {
        value: 'parent 1-0',
        title: 'parent 1-0',
        children: [
          {
            value: 'leaf1',
            title: 'leaf1',
          },
          {
            value: 'leaf2',
            title: 'leaf2',
          },
        ],
      },
      {
        value: 'parent 1-1',
        title: 'parent 1-1',
        children: [
          {
            value: 'leaf3',
            title: 'leaf3',
          },
        ],
      },
    ],
  },
]
</script>

<template>
  <a-flex vertical gap="large">
    <a-tree-select
      :tree-data="treeData"
      :classes="classes"
      :styles="stylesObject"
      placeholder="Object"
    />
    <a-tree-select
      :tree-data="treeData"
      :classes="classes"
      :styles="stylesFn"
      placeholder="Function"
      size="medium"
    />
  </a-flex>
</template>

<style>
.custom-tree-select {
  width: 300px;
  border-radius: 6px;
}
</style>
