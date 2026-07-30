<docs lang="zh-CN">
配合 [@antdv-next/img-crop](https://github.com/antdv-next/img-crop) 实现上传前裁切图片。
</docs>

<docs lang="en-US">
Use [@antdv-next/img-crop](https://github.com/antdv-next/img-crop) to crop image before uploading.
</docs>

<script setup lang="ts">
import type { UploadFile, UploadProps } from 'antdv-next'
import { ImgCrop } from '@antdv-next/img-crop'
import { ref } from 'vue'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

type FileType = Parameters<NonNullable<UploadProps['beforeUpload']>>[0]

const { t } = useComponentLocale(locales)

const fileList = ref<UploadFile[]>([
  {
    uid: '-1',
    name: 'image.png',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
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
  let src = file.url as string
  if (!src && file.originFileObj) {
    src = await getBase64(file.originFileObj as FileType)
  }
  const image = new Image()
  image.src = src
  const imgWindow = window.open(src)
  imgWindow?.document.write(image.outerHTML)
}
</script>

<template>
  <ImgCrop :modal-title="t('cropModalTitle')" :reset-text="t('cropResetText')" rotation-slider>
    <a-upload
      v-model:file-list="fileList"
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      list-type="picture-card"
      @preview="handlePreview"
    >
      <template v-if="fileList.length < 5">
        + Upload
      </template>
    </a-upload>
  </ImgCrop>
</template>
