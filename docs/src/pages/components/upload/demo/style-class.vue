<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Upload 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Upload components by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { UploadEmits, UploadFile, UploadProps } from 'antdv-next'
import { UploadOutlined } from '@antdv-next/icons'

const classes: UploadProps['classes'] = {
  root: 'upload-demo-root',
}

const stylesObject: UploadProps['styles'] = {
  item: {
    borderRadius: 2,
    backgroundColor: 'rgba(5, 5, 5, 0.06)',
    height: '30px',
  },
}

const stylesFn: UploadProps['styles'] = (info) => {
  if (info.props.multiple) {
    return {
      root: { border: '1px solid #5459AC' },
      item: {
        borderRadius: 2,
        backgroundColor: 'rgba(5, 5, 5, 0.06)',
        height: '30px',
      },
    }
  }
  return {}
}

const defaultFileList: UploadFile[] = [
  {
    uid: '1',
    name: 'xxx.png',
    status: 'uploading',
    url: 'http://www.baidu.com/xxx.png',
    percent: 33,
  },
  {
    uid: '2',
    name: 'yyy.png',
    status: 'done',
    url: 'http://www.baidu.com/yyy.png',
  },
  {
    uid: '3',
    name: 'zzz.png',
    status: 'error',
    response: 'Server Error 500',
    url: 'http://www.baidu.com/zzz.png',
  },
]

const handleChange: UploadEmits['change'] = ({ file, fileList }) => {
  if (file?.status !== 'uploading') {
    console.log(file, fileList)
  }
}
</script>

<template>
  <a-flex gap="large" vertical>
    <a-upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      :classes="classes"
      :default-file-list="defaultFileList"
      :styles="stylesObject"
      @change="handleChange"
    >
      <a-button>
        <template #icon>
          <UploadOutlined />
        </template>
        Upload
      </a-button>
    </a-upload>
    <a-upload
      action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
      :classes="classes"
      :default-file-list="defaultFileList"
      :styles="stylesFn"
      multiple
      @change="handleChange"
    >
      <a-button>
        <template #icon>
          <UploadOutlined />
        </template>
        Upload
      </a-button>
    </a-upload>
  </a-flex>
</template>

<style>
.upload-demo-root {
  border-radius: 6px;
  padding: 12px;
}
</style>
