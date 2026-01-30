<docs lang="zh-CN">
图片卡的替代显示。
</docs>

<docs lang="en-US">
Alternative display for picture-card.
</docs>

<script setup lang="ts">
import type { UploadEmits, UploadFile, UploadProps } from 'antdv-next'
import { PlusOutlined } from '@antdv-next/icons'
import { ref } from 'vue'

type FileType = Parameters<NonNullable<UploadProps['beforeUpload']>>[0]

const previewOpen = ref(false)
const previewImage = ref('')
const fileList = ref<UploadFile[]>([
  {
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-xxx',
    percent: 50,
    name: 'image.png',
    status: 'uploading',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
  },
  {
    uid: '-5',
    name: 'image.png',
    status: 'error',
  },
])

function getBase64(file: FileType) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

async function handlePreview(file: UploadFile) {
  console.log('file', file)
  if (!file.url && !file.preview && file.originFileObj) {
    file.preview = await getBase64(file.originFileObj as FileType)
  }
  previewImage.value = (file.url || (file.preview as string)) ?? ''
  previewOpen.value = true
}

const handleChange: UploadEmits['change'] = ({ fileList: newFileList }) => {
  fileList.value = newFileList
}

function handlePreviewOpenChange(visible: boolean) {
  previewOpen.value = visible
}

function handleAfterOpenChange(visible: boolean) {
  if (!visible) {
    previewImage.value = ''
  }
}
</script>

<template>
  <a-upload
    v-model:file-list="fileList"
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    list-type="picture-circle"
    @preview="handlePreview"
    @change="handleChange"
  >
    <template v-if="fileList.length < 8">
      <button style="border: 0; background: none" type="button">
        <PlusOutlined />
        <div style="margin-top: 8px">
          Upload
        </div>
      </button>
    </template>
  </a-upload>
  <a-image
    v-if="previewImage"
    :styles="{ root: { display: 'none' } }"
    :preview="{
      open: previewOpen,
      onOpenChange: handlePreviewOpenChange,
      afterOpenChange: handleAfterOpenChange,
    }"
    :src="previewImage"
  />
</template>
