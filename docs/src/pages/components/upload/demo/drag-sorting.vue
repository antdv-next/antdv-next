<docs lang="zh-CN">
使用 `@dnd-kit/vue` 实现上传列表的拖拽排序。
</docs>

<docs lang="en-US">
Drag sorting of uploadList by using `@dnd-kit/vue`.
</docs>

<script setup lang="ts">
import type { DragEndEvent } from '@dnd-kit/vue'
import type { UploadEmits, UploadFile } from 'antdv-next'
import { UploadOutlined } from '@antdv-next/icons'
import { PointerActivationConstraints } from '@dnd-kit/dom'
import { DragDropProvider, PointerSensor } from '@dnd-kit/vue'
import { isSortable, useSortable } from '@dnd-kit/vue/sortable'
import { defineComponent, h, ref } from 'vue'

const fileList = ref<UploadFile[]>([
  {
    uid: '-1',
    name: 'image1.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-2',
    name: 'image2.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-3',
    name: 'image3.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-4',
    name: 'image4.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-5',
    name: 'image.png',
    status: 'error',
  },
])

const SortableWrapper = defineComponent({
  props: {
    id: { type: String, required: true },
    index: { type: Number, required: true },
  },
  setup(props, { slots }) {
    const handle = ref<HTMLElement>()
    const { isDragging } = useSortable({
      id: () => props.id,
      index: () => props.index,
      element: () => handle.value?.parentElement,
      handle,
    })
    return () => h('div', {
      ref: handle,
      class: ['upload-sort-item', { 'is-dragging': isDragging.value }],
    }, slots.default?.())
  },
})

const sensors = [
  PointerSensor.configure({
    activationConstraints: [
      new PointerActivationConstraints.Distance({ value: 10 }),
    ],
  }),
]

const handleChange: UploadEmits['change'] = ({ fileList: newFileList }) => {
  fileList.value = newFileList
}

function handleDragEnd(event: DragEndEvent) {
  if (event.canceled)
    return

  const { source } = event.operation

  if (isSortable(source)) {
    const { initialIndex, index } = source

    if (initialIndex !== index) {
      const newList = [...fileList.value]
      const [moved] = newList.splice(initialIndex, 1) as [UploadFile]
      newList.splice(index, 0, moved)
      fileList.value = newList
    }
  }
}
</script>

<template>
  <DragDropProvider :sensors="sensors" @drag-end="handleDragEnd">
    <a-upload
      v-model:file-list="fileList"
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      @change="handleChange"
    >
      <template #itemRender="{ originNode, file, fileList }">
        <SortableWrapper :id="file.uid" :index="fileList.indexOf(file)">
          <component :is="originNode" />
        </SortableWrapper>
      </template>
      <a-button>
        <template #icon>
          <UploadOutlined />
        </template>
        Click to Upload
      </a-button>
    </a-upload>
  </DragDropProvider>
</template>

<style scoped>
.upload-sort-item {
  cursor: move;
  user-select: none;
}
.upload-sort-item :deep(a) {
  -webkit-user-drag: none;
}
.is-dragging :deep(a) {
  pointer-events: none;
}
</style>
