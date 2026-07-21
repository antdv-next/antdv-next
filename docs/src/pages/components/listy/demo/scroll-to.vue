<docs lang="zh-CN">
通过 ref 的 `scrollTo` 滚动到指定像素位置、数据项或分组，`align` 与 `offset` 控制对齐方式。`onScroll` 可以监听原生滚动事件。
</docs>

<docs lang="en-US">
Use `scrollTo` on the ref to jump to a pixel position, an item or a group, with `align` and `offset` controlling the alignment. `onScroll` listens to the native scroll event.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

interface Item {
  id: number
  group: string
}

type Align = 'top' | 'bottom' | 'auto'

const items: Item[] = Array.from({ length: 1000 }, (_, index) => ({
  id: index,
  group: `Group ${Math.floor(index / 100)}`,
}))

const groups = Array.from({ length: 10 }, (_, index) => `Group ${index}`)
const listRef = ref(null)
const align = ref<Align>('top')
const key = ref<number | null>(600)
const groupKey = ref('Group 5')
const scrollTop = ref(0)
</script>

<template>
  <a-flex vertical gap="middle">
    <a-flex gap="small" wrap align="center">
      <a-segmented v-model:value="align" :options="['top', 'bottom', 'auto']" />
      <a-space-Compact>
        <a-input-number v-model:value="key" min="0" max="999" style="{{" width: 70 }} />
        <a-button @click="() => listRef?.scrollTo({ key: key ?? 0, align })">
          Scroll to item
        </a-button>
      </a-space-Compact>
      <a-space-Compact>
        <a-select
          v-model:value="groupKey"
          :options="groups.map((group) => ({ value: group }))"
          style="width: 110px"
        />
        <a-button @click="() => listRef?.scrollTo({ groupKey, align })">
          Scroll to group
        </a-button>
      </a-space-compact>
      <a-button @click="() => listRef?.scrollTo(0)">
        Back to top
      </a-button>
    </a-flex>
    <a-listy
      ref="listRef"
      :items="items"
      row-key="id"
      :height="400"
      :sticky="true"
      :group="{
        key: (item) => item.group,
        title: (group) => group,
      }"
      :item-render=" (item) => `Item ${item.id}` "
      @scroll=" (event) => scrollTop = Math.round(event.currentTarget.scrollTop)"
    />
    <a-typography-text type="secondary">
      scrollTop: {{ scrollTop }}px
    </a-typography-text>
  </a-flex>
</template>
