<script setup lang="ts">
import { Button, notification } from 'antdv-next'
import { computed, h } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { _InternalListDoNotUseOrYouWillBeFired: InternalList } = notification

const { t } = useComponentLocale(locales)

const previewListStyle = {
  position: 'relative',
  inset: 'auto',
  width: '432px',
  maxWidth: '100%',
  height: 'auto',
  padding: '24px',
  transform: 'none',
} as const

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'wrapper', desc: t('wrapper'), version: '1.3.0' },
  { name: 'icon', desc: t('icon'), version: '1.0.0' },
  { name: 'section', desc: t('section'), version: '1.3.0' },
  { name: 'title', desc: t('title'), version: '1.0.0' },
  { name: 'description', desc: t('description'), version: '1.0.0' },
  { name: 'close', desc: t('close'), version: '1.3.0' },
  { name: 'actions', desc: t('actions'), version: '1.0.0' },
  { name: 'progress', desc: t('progress'), version: '1.3.0' },
  { name: 'list', desc: t('list'), version: '1.3.0' },
  { name: 'listContent', desc: t('listContent'), version: '1.3.0' },
])

const items = computed(() => [
  {
    key: 'semantic-notification-1',
    title: 'Hello World!',
    description: 'Hello World?',
    type: 'success' as const,
    duration: false as const,
    actions: h(Button, { type: 'primary', size: 'small' }, () => 'My Button'),
  },
  {
    key: 'semantic-notification-2',
    title: 'Welcome back!',
    description: 'This is another notification.',
    type: 'info' as const,
    duration: 999999,
    showProgress: true,
  },
])
</script>

<template>
  <SemanticPreview
    component-name="Notification"
    :height="320"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <InternalList
        placement="topRight"
        :style="previewListStyle"
        :items="items"
        :classes="classes"
      />
    </template>
  </SemanticPreview>
</template>
