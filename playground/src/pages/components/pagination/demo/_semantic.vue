<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'item', desc: t('item'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Pagination"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-pagination :default-current="1" :total="50" :classes="classes" />
    </template>
  </SemanticPreview>
</template>
