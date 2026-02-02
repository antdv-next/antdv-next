<script setup lang="ts">
import { UploadOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素容器，包含布局样式、禁用状态文字颜色、用户选择控制、鼠标样式等基础样式',
    list: '文件列表容器，包含布局排列、过渡动画、间距控制等样式',
    item: '文件项元素，包含内边距、背景色、边框样式、悬停效果、状态颜色、过渡动画等样式',
  },
  en: {
    root: 'Root container element with layout styles, disabled text color, user-select control, cursor styles and other basic styles',
    list: 'File list container with layout arrangement, transition animations, spacing control and other styles',
    item: 'File item element with padding, background color, border styles, hover effects, status colors, transition animations and other styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'list', desc: locale.value.list, version: '1.0.0' },
  { name: 'item', desc: locale.value.item, version: '1.0.0' },
])

const defaultFileList = [
  { uid: '1', name: 'xxx.png', status: 'uploading', url: 'http://www.baidu.com/xxx.png', percent: 33 },
  { uid: '2', name: 'yyy.png', status: 'done', url: 'http://www.baidu.com/yyy.png' },
  { uid: '3', name: 'zzz.png', status: 'error', response: 'Server Error 500', url: 'http://www.baidu.com/zzz.png' },
]
</script>

<template>
  <SemanticPreview
    component-name="Upload"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-upload
        action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
        :default-file-list="defaultFileList"
        :classes="classes"
      >
        <a-button>
          <template #icon>
            <UploadOutlined />
          </template>
          Upload
        </a-button>
      </a-upload>
    </template>
  </SemanticPreview>
</template>
