<script setup lang="ts">
import { UploadOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'list', desc: t('list'), version: '1.0.0' },
  { name: 'item', desc: t('item'), version: '1.0.0' },
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
