<docs lang="zh-CN">
通过集成第三方库 [dnd-kit](https://github.com/clauderic/dnd-kit)（`@dnd-kit/vue`），实现列表项的拖拽排序。
</docs>

<docs lang="en-US">
Implement drag sorting for list items by integrating the third-party library [dnd-kit](https://github.com/clauderic/dnd-kit) (`@dnd-kit/vue`).
</docs>

<script setup lang="ts">
import type { DragEndEvent } from '@dnd-kit/vue'
import { HolderOutlined } from '@antdv-next/icons'
import { PointerActivationConstraints } from '@dnd-kit/dom'
import { DragDropProvider, KeyboardSensor, PointerSensor } from '@dnd-kit/vue'
import { isSortable, useSortable } from '@dnd-kit/vue/sortable'
import { Button, Flex } from 'antdv-next'
import { defineComponent, h, ref } from 'vue'

interface Item {
  id: number
  content: string
}

interface SortableItemProps {
  id: number
  index: number
  content: string
}

const items = Array.from<any, Item>({ length: 20 }, (_, index) => ({
  id: index,
  content: `Item ${index}`,
}))

const data = ref<Item[]>(items)

const SortableItem = defineComponent<SortableItemProps>(
  (props) => {
    // useSortable needs real DOM elements: unwrap component instances to their $el
    const element = ref<HTMLElement>()
    const handle = ref<HTMLElement>()
    const setElement = (el: any) => {
      element.value = el?.$el ?? el ?? undefined
    }
    const setHandle = (el: any) => {
      handle.value = el?.$el ?? el ?? undefined
    }
    const { isDragging } = useSortable({
      id: () => props.id,
      index: () => props.index,
      element,
      handle,
    })
    return () => h(
      Flex,
      {
        ref: setElement,
        align: 'center',
        gap: 'small',
        style: isDragging.value ? { position: 'relative', zIndex: 1 } : undefined,
      },
      () => [
        h(Button, {
          ref: setHandle,
          type: 'text',
          size: 'small',
          style: { cursor: 'move' },
          icon: () => h(HolderOutlined),
        }),
        props.content,
      ],
    )
  },
  {
    props: ['id', 'index', 'content'],
  },
)

const sensors = [
  PointerSensor.configure({
    activationConstraints: [
      new PointerActivationConstraints.Distance({ value: 1 }),
    ],
  }),
  KeyboardSensor,
]

function onDragEnd(event: DragEndEvent) {
  if (event.canceled)
    return

  const { source } = event.operation

  if (isSortable(source)) {
    const { initialIndex, index } = source

    if (initialIndex !== index) {
      const next = [...data.value]
      const [moved] = next.splice(initialIndex, 1) as [Item]
      next.splice(index, 0, moved)
      data.value = next
    }
  }
}
</script>

<template>
  <DragDropProvider :sensors="sensors" @drag-end="onDragEnd">
    <a-listy
      :items="data"
      :height="400"
      :row-key="(item: Item) => item.id"
      :item-render="(item: Item, index: number) => h(SortableItem, { key: item.id, id: item.id, index, content: item.content })"
    />
  </DragDropProvider>
</template>
