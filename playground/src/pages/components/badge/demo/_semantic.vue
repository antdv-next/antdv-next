<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'indicator', desc: t('indicator'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Badge"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-badge :count="5" :classes="classes">
        <a-avatar shape="square" size="large" />
      </a-badge>
    </template>
  </SemanticPreview>
</template>
