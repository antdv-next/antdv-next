<script setup lang="ts">
import { message } from 'antdv-next'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { _InternalListDoNotUseOrYouWillBeFired: InternalList } = message

const { t } = useComponentLocale(locales)

const previewListStyle = {
  position: 'relative',
  inset: 'auto',
  width: '100%',
  maxWidth: '100%',
  height: 'auto',
  padding: '24px',
  overflow: 'visible',
  transform: 'none',
} as const

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'wrapper', desc: t('wrapper'), version: '1.3.0' },
  { name: 'icon', desc: t('icon'), version: '1.0.0' },
  { name: 'title', desc: t('title'), version: '1.3.0' },
  { name: 'list', desc: t('list'), version: '1.3.0' },
  { name: 'listContent', desc: t('listContent'), version: '1.3.0' },
])

const items = computed(() => [
  {
    key: 'semantic-message-1',
    content: 'Hello, Antdv Next!',
    type: 'success' as const,
    duration: false as const,
  },
  {
    key: 'semantic-message-2',
    content: 'Welcome back!',
    type: 'info' as const,
    duration: false as const,
  },
])
</script>

<template>
  <SemanticPreview
    component-name="Message"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <InternalList
        :style="previewListStyle"
        :items="items"
        :classes="classes"
      />
    </template>
  </SemanticPreview>
</template>
