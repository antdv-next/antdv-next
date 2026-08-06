<docs lang="zh-CN">
  一万条数据的长列表。通过设置 `virtual` 和 `height` 开启虚拟滚动，仅渲染视口内的行。
</docs>

<docs lang="en-US">
  A long list of 10,000 rows. Set `virtual` and `height` to enable virtual scrolling, so only the rows in view are rendered.
</docs>

<script setup lang="ts">
interface Item {
  id: number
  content: string
}

const items = Array.from<any, Item>({ length: 10000 }, (_, index) => ({
  id: index,
  content: `Item ${index}`,
}))
</script>

<template>
  <a-listy
    virtual
    :items="items"
    :height="400"
    :row-key="(item: Item) => item.id"
    :item-render="(item: Item) => item.content"
  />
</template>
