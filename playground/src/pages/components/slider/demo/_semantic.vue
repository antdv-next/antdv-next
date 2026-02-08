<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'track', desc: t('track'), version: '1.0.0' },
  { name: 'tracks', desc: t('tracks'), version: '1.0.0' },
  { name: 'rail', desc: t('rail'), version: '1.0.0' },
  { name: 'handle', desc: t('handle'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Slider"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-slider
        range
        :default-value="[20, 30, 50]"
        :style="{ width: '100%' }"
        :classes="classes"
      />
    </template>
  </SemanticPreview>
</template>
