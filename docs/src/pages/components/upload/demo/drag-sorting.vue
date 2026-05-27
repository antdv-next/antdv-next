<docs lang="zh-CN">
使用 `itemRender` ，我们可以使用原生 drag 来实现对上传列表拖拽排序。
</docs>

<docs lang="en-US">
By using `itemRender`, we can integrate upload with drag to implement drag sorting of uploadList.

```css
.is-dragging a {
  pointer-events: none;
}
```
</docs>

<script setup lang="ts">
import type { UploadEmits, UploadFile } from 'antdv-next'
import { UploadOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

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

const draggingUid = ref<string | null>(null)

const handleChange: UploadEmits['change'] = ({ fileList: newFileList }) => {
  fileList.value = newFileList
}

function handleDragStart(uid: string, event: DragEvent) {
  draggingUid.value = uid
  event.dataTransfer?.setData('text/plain', uid)
}

function handleDragEnd() {
  draggingUid.value = null
}

function handleDrop(overUid: string, event: DragEvent) {
  const activeUid = event.dataTransfer?.getData('text/plain')
  if (!activeUid || activeUid === overUid) {
    return
  }
  const activeIndex = fileList.value.findIndex(file => file.uid === activeUid)
  const overIndex = fileList.value.findIndex(file => file.uid === overUid)
  if (activeIndex < 0 || overIndex < 0) {
    return
  }
  const nextList = fileList.value.slice()
  const [moved] = nextList.splice(activeIndex, 1)
  nextList.splice(overIndex, 0, moved)
  fileList.value = nextList
}
</script>

<template>
  <a-upload
    v-model:file-list="fileList"
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    @change="handleChange"
  >
    <template #itemRender="{ originNode, file }">
      <div
        class="upload-sort-item"
        :class="{ 'is-dragging': draggingUid === file.uid }"
        draggable="true"
        @dragstart="(event) => handleDragStart(file.uid, event)"
        @dragover.prevent
        @drop="(event) => handleDrop(file.uid, event)"
        @dragend="handleDragEnd"
      >
        <component :is="originNode" />
      </div>
    </template>
    <a-button>
      <template #icon>
        <UploadOutlined />
      </template>
      Click to Upload
    </a-button>
  </a-upload>
</template>

<style scoped>
.upload-sort-item {
  cursor: move;
}

.is-dragging a {
  pointer-events: none;
}
</style>
