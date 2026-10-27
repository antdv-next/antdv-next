<docs lang="zh-CN">
动态添加和删除项。通过 `layoutChange` 事件可以获取到每个项的列信息。
</docs>

<docs lang="en-US">
Dynamically add and remove items. The `layoutChange` event provides column information for each item.
</docs>

<script setup lang="ts">
import type { MasonryEmits } from 'antdv-next'
import { CloseOutlined } from '@antdv-next/icons'
import { theme } from 'antdv-next'
import { ref } from 'vue'

const { token } = theme.useToken()

const heights = [150, 50, 90, 70, 110, 150, 130, 80, 50, 90, 100, 150, 70, 50, 80]

interface ItemType {
  key: number
  column?: number
  data: number
}

const items = ref<ItemType[]>(
  heights.map((height, index) => ({
    key: index,
    column: index % 4,
    data: height,
  })),
)

function removeItem(removeKey: number) {
  items.value = items.value.filter(({ key }) => key !== removeKey)
}

function addItem() {
  const lastItem = items.value[items.value.length - 1]
  items.value = [
    ...items.value,
    {
      key: lastItem ? lastItem.key + 1 : 0,
      data: Math.floor(Math.random() * 100) + 50,
    },
  ]
}

const handleLayoutChange: MasonryEmits['layoutChange'] = (sortedItems) => {
  items.value = items.value.map((item) => {
    const matchItem = sortedItems.find(sortedItem => sortedItem.key === item.key)
    return matchItem
      ? {
          ...item,
          column: matchItem.column,
        }
      : item
  })
}
</script>

<template>
  <a-flex vertical :gap="16">
    <a-masonry
      :columns="4"
      :gutter="16"
      :items="items"
      @layout-change="handleLayoutChange"
    >
      <template #itemRender="{ data, key }">
        <a-card size="small" :style="{ height: `${data}px` }">
          {{ Number(key) + 1 }}
          <a-button
            :style="{
              position: 'absolute',
              insetBlockStart: `${token.paddingSM}px`,
              insetInlineEnd: `${token.paddingSM}px`,
            }"
            size="small"
            @click="() => removeItem(key as any)"
          >
            <template #icon>
              <CloseOutlined />
            </template>
          </a-button>
        </a-card>
      </template>
    </a-masonry>
    <a-button block @click="addItem">
      Add Item
    </a-button>
  </a-flex>
</template>
