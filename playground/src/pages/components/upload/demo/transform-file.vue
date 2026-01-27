<docs lang="zh-CN">
使用 `beforeUpload` 转换上传的文件（例如添加水印）。
</docs>

<docs lang="en-US">
Use `beforeUpload` for transform file before request such as add a watermark.
</docs>

<script setup lang="ts">
import type { UploadProps } from 'antdv-next'
import { UploadOutlined } from '@antdv-next/icons'

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      const img = document.createElement('img')
      img.src = reader.result as string
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve(file)
          return
        }
        ctx.drawImage(img, 0, 0)
        ctx.fillStyle = 'red'
        ctx.textBaseline = 'middle'
        ctx.font = '33px Arial'
        ctx.fillText('Antdv Next', 20, 20)
        canvas.toBlob((result) => {
          if (result) {
            resolve(result)
          }
          else {
            resolve(file)
          }
        })
      }
    }
  })
}
</script>

<template>
  <a-upload
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    list-type="picture"
    :before-upload="beforeUpload"
  >
    <a-button>
      <template #icon>
        <UploadOutlined />
      </template>
      Upload
    </a-button>
  </a-upload>
</template>
