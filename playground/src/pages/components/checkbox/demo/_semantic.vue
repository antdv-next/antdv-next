<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'icon', desc: t('icon'), version: '1.0.0' },
  { name: 'label', desc: t('label'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Checkbox"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-checkbox :classes="classes">
        Checkbox
      </a-checkbox>
    </template>
  </SemanticPreview>
</template>
