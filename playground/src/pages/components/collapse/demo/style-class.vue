<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Collapse 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Collapse by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { CollapseProps } from 'antdv-next'
import { h } from 'vue'

const text
  = 'A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.'

const element = h('p', text)

const items = [
  {
    key: '1',
    label: 'This is panel header 1',
    content: element,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    content: element,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    content: element,
  },
]

const classes: CollapseProps['classes'] = {
  root: 'demo-collapse-root',
}

const stylesObject: CollapseProps['styles'] = {
  root: {
    backgroundColor: '#fafafa',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
  },
  header: {
    backgroundColor: '#f0f0f0',
    padding: '12px 16px',
    color: '#141414',
  },
}

const stylesFn: CollapseProps['styles'] = (info) => {
  if (info?.props?.size === 'large') {
    return {
      root: {
        backgroundColor: '#fff',
        border: '1px solid #696FC7',
        borderRadius: '8px',
      },
      header: {
        backgroundColor: '#F5EFFF',
        padding: '12px 16px',
        color: '#141414',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-collapse :items="items" :classes="classes" :styles="stylesObject" :default-active-key="['1']" />
    <a-collapse :items="items" :classes="classes" :styles="stylesFn" size="large" :default-active-key="['2']" />
  </a-flex>
</template>

<style>
.demo-collapse-root {
  border-radius: 8px;
}
</style>
