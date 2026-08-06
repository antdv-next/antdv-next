<docs lang="zh-CN">
 基础示例，渲染一个简单的列表。
</docs>

<docs lang="en-US">
 Basic example.
</docs>

<script setup lang="ts">
interface Item {
  id: number
  content: string
}

const items: Item[] = Array.from({ length: 20 }, (_, index) => ({
  id: index,
  content: `Item ${index}`,
}))
</script>

<template>
  <a-listy :items="items" :row-key="(item: Item) => item.id" :height="400" :item-render="(item: Item) => item.content" />
</template>
