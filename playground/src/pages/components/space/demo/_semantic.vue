<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'item', desc: t('item') },
  { name: 'separator', desc: t('separator') },
])
</script>

<template>
  <SemanticPreview
    component-name="Space"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-space :classes="classes">
        <template #separator>
          <a-divider vertical />
        </template>
        <a-button type="primary">
          Primary
        </a-button>
        <a-button>Default</a-button>
        <a-button type="dashed">
          Dashed
        </a-button>
      </a-space>
    </template>
  </SemanticPreview>
</template>
