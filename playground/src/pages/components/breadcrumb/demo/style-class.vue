<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Breadcrumb 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Breadcrumb by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { BreadcrumbProps } from 'antdv-next'

const classesObject = {
  root: 'demo-breadcrumb-root',
  item: 'demo-breadcrumb-item',
  separator: 'demo-breadcrumb-separator',
}

const stylesObject: BreadcrumbProps['styles'] = {
  root: { border: '1px solid #f0f0f0', padding: '8px', borderRadius: '4px' },
  item: { color: '#1890ff' },
  separator: { color: 'rgba(0, 0, 0, 0.45)' },
}

const stylesFn: BreadcrumbProps['styles'] = (info) => {
  const items = info.props.items || []
  if (items.length > 2) {
    return {
      root: { border: '1px solid #F5EFFF', padding: '8px', borderRadius: '4px' },
      item: { color: '#8F87F1' },
    }
  }
  return {}
}

const items = [
  { title: 'Antdv Next' },
  { title: 'Component' },
  { title: 'Breadcrumb' },
]
</script>

<template>
  <a-flex vertical gap="middle">
    <a-breadcrumb
      :classes="classesObject"
      :items="items.slice(0, 2)"
      :styles="stylesObject"
      aria-label="Breadcrumb with Object"
    />
    <a-breadcrumb
      :classes="classesObject"
      :items="items"
      :styles="stylesFn"
      aria-label="Breadcrumb with Function"
    />
  </a-flex>
</template>

<style scoped>
.demo-breadcrumb-root {
  padding: 8px;
  border-radius: 4px;
}

.demo-breadcrumb-item {
  color: #1890ff;
}

.demo-breadcrumb-separator {
  color: rgba(0, 0, 0, 0.45);
}
</style>
