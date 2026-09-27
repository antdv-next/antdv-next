<docs lang="zh-CN">
  对比默认行悬浮效果和 `rowHoverable=false` 的效果。
</docs>

<docs lang="en-US">
  Compare the default row hover effect with `rowHoverable=false`.
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
  <div class="row-hoverable-debug">
    <section>
      <h5>Default</h5>
      <a-listy
        :items="items"
        :row-key="(item: Item) => item.id"
        :item-render="(item: Item) => item.content"
      />
    </section>
    <section>
      <h5>rowHoverable=false</h5>
      <a-listy
        :items="items"
        :row-key="(item: Item) => item.id"
        :item-render="(item: Item) => item.content"
        :row-hoverable="false"
      />
    </section>
  </div>
</template>

<style scoped>
.row-hoverable-debug {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
</style>
