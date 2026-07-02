<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Tabs 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Tabs by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { TabsProps } from 'antdv-next'

const items: TabsProps['items'] = [
  { key: '1', label: 'Tab 1', content: 'Content of Tab Pane 1' },
  { key: '2', label: 'Tab 2', content: 'Content of Tab Pane 2' },
  { key: '3', label: 'Tab 3', content: 'Content of Tab Pane 3' },
]

const classes: TabsProps['classes'] = {
  root: 'custom-tabs-root',
}

const stylesObject: TabsProps['styles'] = {
  root: { borderWidth: '2px', borderStyle: 'dashed', padding: '16px', marginBottom: '10px' },
  header: { backgroundColor: 'rgba(245,245,245,0.5)' },
  item: { fontWeight: 'bold', color: '#1890ff', padding: `6px 10px` },
  indicator: { backgroundColor: 'rgba(255,77,79, 0.3)', height: '4px' },
  body: { backgroundColor: 'rgba(230,247,255,0.8)' },
  content: { padding: '16px' },
}

const stylesFn: TabsProps['styles'] = (info) => {
  if (info.props.type === 'card') {
    return {
      root: { backgroundColor: 'rgba(250,250,250, 0.8)', borderColor: '#d9d9d9' },
      header: { textAlign: 'start' },
    } satisfies TabsProps['styles']
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-tabs :items="items" :classes="classes" :styles="stylesObject" />
    <a-tabs type="card" :items="items" :classes="classes" :styles="stylesFn" />
  </a-flex>
</template>

<style>
.custom-tabs-root {
  border-width: 2px;
  border-style: dashed;
  padding: 16px;
  margin-bottom: 10px;
}
</style>
