<docs lang="zh-CN">
根据类型默认显示对应 icon
</docs>

<docs lang="en-US">
Displays the corresponding by default by type icon
</docs>

<script setup lang="ts">
import type { UploadEmits, UploadFile, UploadProps } from 'antdv-next'
import {
  FileExcelTwoTone,
  FilePdfTwoTone,
  FileWordTwoTone,
  LoadingOutlined,
  PaperClipOutlined,
  PictureTwoTone,
  PlusOutlined,
} from '@antdv-next/icons'
import { h, ref } from 'vue'

type FileType = Parameters<NonNullable<UploadProps['beforeUpload']>>[0]

const previewOpen = ref(false)
const previewImage = ref('')
const fileList = ref<UploadFile[]>([
  {
    uid: '-2',
    name: 'pdf.pdf',
    status: 'done',
    url: 'http://cdn07.foxitsoftware.cn/pub/foxit/cpdf/FoxitCompanyProfile.pdf',
  },
  {
    uid: '-3',
    name: 'doc.doc',
    status: 'done',
    url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.doc',
  },
  {
    uid: '-4',
    name: 'image.png',
    status: 'error',
  },
  {
    uid: '-5',
    name: 'pdf.pdf',
    status: 'error',
  },
  {
    uid: '-6',
    name: 'doc.doc',
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
  if (!file.url && !file.preview && file.originFileObj) {
    file.preview = await getBase64(file.originFileObj as FileType)
  }
  previewOpen.value = true
  previewImage.value = (file.url || (file.preview as string)) ?? ''
}

const handleChange: UploadEmits['change'] = ({ fileList: newFileList }) => {
  fileList.value = newFileList
}

function handlePreviewOpenChange(open: boolean) {
  previewOpen.value = open
}

function handleAfterOpenChange(open: boolean) {
  if (!open) {
    previewImage.value = ''
  }
}

const fileSufIconList = [
  { icon: FilePdfTwoTone, suf: ['.pdf'] },
  { icon: FileExcelTwoTone, suf: ['.xlsx', '.xls', '.csv'] },
  { icon: FileWordTwoTone, suf: ['.doc', '.docx'] },
  {
    icon: PictureTwoTone,
    suf: ['.webp', '.svg', '.png', '.gif', '.jpg', '.jpeg', '.jfif', '.bmp', '.dpg'],
  },
]

const iconRender: UploadProps['iconRender'] = (file, listType) => {
  let icon = file.status === 'uploading' ? h(LoadingOutlined) : h(PaperClipOutlined)
  if (listType === 'picture' || listType === 'picture-card' || listType === 'picture-circle') {
    if (listType === 'picture-card' && file.status === 'uploading') {
      icon = h(LoadingOutlined)
    }
    else {
      const suffix = file.name.slice(file.name.lastIndexOf('.'))
      fileSufIconList.forEach((item) => {
        if (item.suf.includes(suffix)) {
          icon = h(item.icon)
        }
      })
    }
  }
  return icon
}
</script>

<template>
  <a-upload
    v-model:file-list="fileList"
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    list-type="picture-card"
    :on-preview="handlePreview"
    :icon-render="iconRender"
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
