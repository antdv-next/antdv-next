<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'mask', desc: t('mask'), version: '1.0.0' },
  { name: 'section', desc: t('section'), version: '1.0.0' },
  { name: 'header', desc: t('header'), version: '1.0.0' },
  { name: 'title', desc: t('title'), version: '1.0.0' },
  { name: 'extra', desc: t('extra'), version: '1.0.0' },
  { name: 'body', desc: t('body'), version: '1.0.0' },
  { name: 'footer', desc: t('footer'), version: '1.0.0' },
  { name: 'dragger', desc: t('dragger'), version: '1.0.0' },
  { name: 'close', desc: t('close'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Drawer"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-drawer
        title="Title"
        placement="right"
        open
        :get-container="false"
        :size="300"
        :resizable="{}"
        :classes="classes"
      >
        <template #footer>
          <a-typography-link>Footer</a-typography-link>
        </template>
        <template #extra>
          <a-button>Cancel</a-button>
        </template>
        <p>Some contents...</p>
      </a-drawer>
    </template>
  </SemanticPreview>
</template>
