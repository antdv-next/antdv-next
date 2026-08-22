<docs lang="zh-CN">
通过集成第三方库 [dnd-kit](https://github.com/clauderic/dnd-kit)（`@dnd-kit/vue`），实现列表项的拖拽排序。
</docs>

<docs lang="en-US">
Implement drag sorting for list items by integrating the third-party library [dnd-kit](https://github.com/clauderic/dnd-kit) (`@dnd-kit/vue`).
</docs>

<script setup lang="ts">
import type { DragEndEvent } from '@dnd-kit/vue'
import { HolderOutlined } from '@antdv-next/icons'
import { RestrictToVerticalAxis } from '@dnd-kit/abstract/modifiers'
import { PointerActivationConstraints } from '@dnd-kit/dom'
import { DragDropProvider, DragOverlay, KeyboardSensor, PointerSensor } from '@dnd-kit/vue'
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

const transition = { duration: 200, easing: 'cubic-bezier(0.2, 0, 0, 1)' }

const SortableItem = defineComponent<SortableItemProps>(
  (props) => {
    const content = ref<HTMLElement>()
    const handle = ref<HTMLElement>()

    const setContent = (el: any) => {
      content.value = el?.$el ?? el ?? undefined
    }

    const setHandle = (el: any) => {
      handle.value = el?.$el ?? el ?? undefined
    }

    const { isDragging } = useSortable({
      id: () => props.id,
      index: () => props.index,
      element: () => content.value?.parentElement,
      target: () => content.value?.parentElement,
      handle,
      transition,
    })
    return () => h(
      Flex,
      {
        ref: setContent,
        align: 'center',
        gap: 'small',
        style: isDragging.value ? { opacity: 0 } : undefined,
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

const modifiers = [RestrictToVerticalAxis]

function contentOf(id: unknown) {
  return data.value.find(item => item.id === id)?.content ?? ''
}

let snapshot: Item[] = []

function onDragStart() {
  snapshot = [...data.value]
}

function onDragEnd(event: DragEndEvent) {
  if (event.canceled) {
    data.value = snapshot
    return
  }

  const { source } = event.operation

  if (!isSortable(source))
    return

  const { initialIndex, index } = source

  if (initialIndex === index
    || initialIndex < 0
    || initialIndex >= data.value.length
    || index < 0
    || index >= data.value.length) {
    return
  }

  const next = [...data.value]
  const [moved] = next.splice(initialIndex, 1) as [Item]
  next.splice(index, 0, moved)
  data.value = next
}
</script>

<template>
  <DragDropProvider
    :sensors="sensors"
    :modifiers="modifiers"
    @drag-start="onDragStart"
    @drag-end="onDragEnd"
  >
    <a-listy
      :items="data"
      :height="400"
      :row-key="(item: Item) => item.id"
      :item-render="(item: Item, index: number) => h(SortableItem, { key: item.id, id: item.id, index, content: item.content })"
    />
    <DragOverlay
      class="ant-listy-item"
      :style="{ width: '100%', boxSizing: 'border-box' }"
      :drop-animation="null"
    >
      <template #default="{ source }">
        <a-flex align="center" gap="small">
          <a-button type="text" size="small" :style="{ cursor: 'move' }">
            <template #icon>
              <HolderOutlined />
            </template>
          </a-button>
          {{ contentOf(source.id) }}
        </a-flex>
      </template>
    </DragOverlay>
  </DragDropProvider>
</template>
