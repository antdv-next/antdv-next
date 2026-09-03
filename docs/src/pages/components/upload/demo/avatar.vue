<docs lang="zh-CN">
点击上传用户头像，并使用 `beforeUpload` 限制用户上传的图片格式和大小。

> `beforeUpload` 的返回值可以是一个 Promise 以支持异步处理，如服务端校验等：[示例](https://upload-react-component.vercel.app/demo/before-upload#beforeupload)。
</docs>

<docs lang="en-US">
Click to upload user's avatar, and validate size and format of picture with `beforeUpload`.

> The return value of function `beforeUpload` can be a Promise to check asynchronously. [demo](https://upload-react-component.vercel.app/demo/before-upload#beforeupload)
</docs>

<script setup lang="ts">
import type { UploadEmits, UploadProps } from 'antdv-next'
import { LoadingOutlined, PlusOutlined } from '@antdv-next/icons'
import { message } from 'antdv-next'
import { ref } from 'vue'

type FileType = Parameters<NonNullable<UploadProps['beforeUpload']>>[0]

const loading = ref(false)
const imageUrl = ref('')

function getBase64(img: FileType) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(img)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!')
  }
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!')
  }
  return isJpgOrPng && isLt2M
}

const handleChange: UploadEmits['change'] = async (info) => {
  if (info.file?.status === 'uploading') {
    loading.value = true
    return
  }
  if (info.file?.status === 'done') {
    try {
      if (info.file.originFileObj) {
        imageUrl.value = await getBase64(info.file.originFileObj as FileType)
      }
    }
    finally {
      loading.value = false
    }
  }
  else {
    loading.value = false
  }
}
</script>

<template>
  <a-flex gap="medium" wrap>
    <a-upload
      name="avatar"
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      :before-upload="beforeUpload"
      @change="handleChange"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        alt="avatar"
        :draggable="false"
        style="width: 100%"
      >
      <button v-else style="border: 0; background: none" type="button">
        <LoadingOutlined v-if="loading" />
        <PlusOutlined v-else />
        <div style="margin-top: 8px">
          Upload
        </div>
      </button>
    </a-upload>

    <a-upload
      name="avatar"
      list-type="picture-circle"
      class="avatar-uploader"
      :show-upload-list="false"
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      :before-upload="beforeUpload"
      @change="handleChange"
    >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        alt="avatar"
        :draggable="false"
        style="width: 100%"
      >
      <button v-else style="border: 0; background: none" type="button">
        <LoadingOutlined v-if="loading" />
        <PlusOutlined v-else />
        <div style="margin-top: 8px">
          Upload
        </div>
      </button>
    </a-upload>
  </a-flex>
</template>
