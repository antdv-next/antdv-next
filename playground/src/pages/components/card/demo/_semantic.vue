<script setup lang="ts">
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'header', desc: t('header'), version: '1.0.0' },
  { name: 'title', desc: t('title'), version: '1.0.0' },
  { name: 'extra', desc: t('extra'), version: '1.0.0' },
  { name: 'cover', desc: t('cover'), version: '1.0.0' },
  { name: 'body', desc: t('body'), version: '1.0.0' },
  { name: 'actions', desc: t('actions'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Card"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div :style="{ position: 'absolute' }">
        <a-card
          title="Card title"
          extra="More"
          :style="{ width: '300px' }"
          :classes="classes"
        >
          <template #cover>
            <img
              draggable="false"
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            >
          </template>
          <template #actions>
            <SettingOutlined key="setting" />
            <EditOutlined key="edit" />
            <EllipsisOutlined key="ellipsis" />
          </template>
          <a-card-meta
            title="Card Meta title"
            description="This is the description"
          >
            <template #avatar>
              <a-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
            </template>
          </a-card-meta>
        </a-card>
      </div>
    </template>
  </SemanticPreview>
</template>
