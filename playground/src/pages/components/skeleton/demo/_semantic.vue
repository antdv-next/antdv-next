<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'header', desc: t('header'), version: '1.0.0' },
  { name: 'section', desc: t('section'), version: '1.0.0' },
  { name: 'avatar', desc: t('avatar'), version: '1.0.0' },
  { name: 'title', desc: t('title'), version: '1.0.0' },
  { name: 'paragraph', desc: t('paragraph'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Skeleton"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-skeleton avatar :paragraph="{ rows: 4 }" :classes="classes" />
    </template>
  </SemanticPreview>
</template>
