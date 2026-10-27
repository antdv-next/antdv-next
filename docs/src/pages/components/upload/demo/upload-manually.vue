<docs lang="zh-CN">
`beforeUpload` 返回 `false` 后，手动上传文件。
</docs>

<docs lang="en-US">
Upload files manually after `beforeUpload` returns `false`.
</docs>

<script setup lang="ts">
import type { UploadFile, UploadProps } from 'antdv-next'
import { UploadOutlined } from '@antdv-next/icons'
import { message } from 'antdv-next'
import { ref } from 'vue'

type FileType = Parameters<NonNullable<UploadProps['beforeUpload']>>[0]

const fileList = ref<UploadFile[]>([])
const uploading = ref(false)

function handleUpload() {
  const formData = new FormData()
  fileList.value.forEach((file) => {
    formData.append('files[]', file as FileType)
  })
  uploading.value = true
  fetch('https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload', {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(() => {
      fileList.value = []
      message.success('upload successfully.')
    })
    .catch(() => {
      message.error('upload failed.')
    })
    .finally(() => {
      uploading.value = false
    })
}

const handleRemove: UploadProps['onRemove'] = (file) => {
  fileList.value = fileList.value.filter(item => item.uid !== file.uid)
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  fileList.value = [...fileList.value, file]
  return false
}
</script>

<template>
  <a-upload
    :before-upload="beforeUpload"
    :on-remove="handleRemove"
    :file-list="fileList"
  >
    <a-button>
      <template #icon>
        <UploadOutlined />
      </template>
      Select File
    </a-button>
  </a-upload>
  <a-button
    type="primary"
    :disabled="fileList.length === 0"
    :loading="uploading"
    style="margin-top: 16px"
    @click="handleUpload"
  >
    {{ uploading ? 'Uploading' : 'Start Upload' }}
  </a-button>
</template>
