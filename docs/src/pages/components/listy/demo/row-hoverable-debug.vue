<docs lang="zh-CN">
通过 `rowHoverable` 关闭列表行的悬浮效果。
</docs>

<docs lang="en-US">
Disable row hover effect with `rowHoverable`.
</docs>

<script setup lang="ts">
interface Item {
  id: number
  content: string
}

const items: Item[] = Array.from({ length: 4 }, (_, index) => ({
  id: index,
  content: `Item ${index}`,
}))
</script>

<template>
  <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px">
    <section>
      <a-typography-title :level="5">
        Default
      </a-typography-title>
      <a-listy :items="items" row-key="id" :item-render="(item: Item) => item.content" />
    </section>
    <section>
      <a-typography-title :level="5">
        rowHoverable=false
      </a-typography-title>
      <a-listy :items="items" :row-hoverable="false" row-key="id" :item-render="(item: Item) => item.content" />
    </section>
  </div>
</template>
