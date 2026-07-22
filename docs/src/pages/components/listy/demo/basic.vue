<docs lang="zh-CN">
一万条数据的长列表。虚拟滚动默认开启，仅渲染视口内的行。
</docs>

<docs lang="en-US">
A long list of 10,000 rows. Virtual scrolling is enabled by default, so only the rows in view are rendered.
</docs>

<script setup lang="ts">
interface Item {
  id: number
  content: string
}

const items: Item[] = Array.from({ length: 10000 }, (_, index) => ({
  id: index,
  content: `Item ${index}`,
}))
</script>

<template>
  <a-listy :items="items" :row-key="(item: Item) => item.id" :height="400" :item-render="(item: Item) => item.content" />
</template>
