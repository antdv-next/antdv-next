<docs lang="zh-CN">
  在 `onScroll` 中判断列表即将滚动到底部时，按需加载下一页数据，实现无限滚动。配合 `virtual`，数据积累也只渲染视口内的行。
</docs>

<docs lang="en-US">
  Detect in `onScroll` that the list is about to reach the bottom, then load the next page on demand for endless scrolling. Combined with `virtual`, only the rows in view are rendered no matter how much data piles up.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

interface Item {
  id: number
  content: string
}

const PAGE_SIZE = 50

function makePage(offset: number): Item[] {
  return Array.from({ length: PAGE_SIZE }, (_, index) => ({
    id: offset + index,
    content: `Item ${offset + index}`,
  }))
}
const items = ref<Item[]>(makePage(0))
const loading = ref(false)
const loadingRef = ref(false)

function onScroll(event: Event) {
  const { scrollTop, clientHeight, scrollHeight } = event.currentTarget
  if (scrollHeight - scrollTop - clientHeight > 200 || loadingRef.value) {
    return
  }
  loadingRef.value = true
  loading.value = true
  setTimeout(() => {
    items.value = [...items.value, ...makePage(items.value.length)]
    loadingRef.value = false
    loading.value = false
  }, 600)
};
</script>

<template>
  <a-flex vertical gap="small">
    <a-listy
      virtual
      :items="items"
      :row-key="(item: Item) => item.id"
      :height="400"
      :item-render="(item: Item) => item.content"
      @scroll="onScroll"
    />
    <a-flex justify="center" align="center" style="height: 24px">
      <template v-if="loading">
        <a-spin size="small" />
      </template>
      <template v-else>
        <a-typography-text type="secondary">
          {{ items.length }} items loaded
        </a-typography-text>
      </template>
    </a-flex>
  </a-flex>
</template>
