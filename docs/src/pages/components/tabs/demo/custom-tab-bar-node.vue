<docs lang="zh-CN">
使用 `renderTabBar` 结合拖拽能力实现标签可排序。
</docs>

<docs lang="en-US">
Use `renderTabBar` with drag support to reorder tabs.
</docs>

<script setup lang="ts">
import type { TabsProps } from 'antdv-next'
import { ref } from 'vue'

type TabItem = NonNullable<TabsProps['items']>[number]

const items = ref<TabItem[]>([
  { key: '1', label: 'Tab 1', content: 'Content of Tab Pane 1' },
  { key: '2', label: 'Tab 2', content: 'Content of Tab Pane 2' },
  { key: '3', label: 'Tab 3', content: 'Content of Tab Pane 3' },
])

const draggingKey = ref<string | null>(null)

function getNodeKey(node: any) {
  return String(node?.props?.['data-node-key'] ?? '')
}

function handleDragStart(key: string, event: DragEvent) {
  if (!key) {
    return
  }
  draggingKey.value = key
  event.dataTransfer?.setData('text/plain', key)
  event.dataTransfer?.setDragImage?.(event.currentTarget as Element, 0, 0)
}

function handleDragEnd() {
  draggingKey.value = null
}

function handleDrop(overKey: string, event: DragEvent) {
  const activeKey = event.dataTransfer?.getData('text/plain')
  if (!activeKey || !overKey || activeKey === overKey) {
    return
  }
  const activeIndex = items.value.findIndex(item => String(item.key) === activeKey)
  const overIndex = items.value.findIndex(item => String(item.key) === overKey)
  if (activeIndex < 0 || overIndex < 0) {
    return
  }
  const next = items.value.slice()
  const [moved] = next.splice(activeIndex, 1)
  if (!moved) {
    return
  }
  next.splice(overIndex, 0, moved)
  items.value = next
}
</script>

<template>
  <a-tabs :items="items" :styles="{ item: { cursor: 'move' } }">
    <template #renderTabBar="{ TabNavListComponent, props }">
      <component :is="TabNavListComponent" v-bind="props">
        <template #default="node">
          <div
            class="draggable-tab" :class="{ 'draggable-tab--dragging': draggingKey === getNodeKey(node) }"
            draggable="true" @dragstart="(event) => handleDragStart(getNodeKey(node), event)" @dragover.prevent
            @drop="(event) => handleDrop(getNodeKey(node), event)" @dragend="handleDragEnd"
          >
            <component :is="node" />
          </div>
        </template>
      </component>
    </template>
  </a-tabs>
</template>

<style>
.draggable-tab {
  margin-left: var(--ant-tabs-horizontal-item-gutter);
}

.draggable-tab:first-child {
  margin-left: 0;
}

.draggable-tab--dragging {
  opacity: 0.6;
}
</style>
