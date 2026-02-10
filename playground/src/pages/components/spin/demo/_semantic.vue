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
    component-name="Spin"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div
        :style="{
          position: 'relative',
          width: '500px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }"
      >
        <a-spin :percent="0" :classes="classes" />
      </div>
    </template>
  </SemanticPreview>
</template>
