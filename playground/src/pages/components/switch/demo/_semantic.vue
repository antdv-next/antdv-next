<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'content', desc: t('content'), version: '1.0.0' },
  { name: 'indicator', desc: t('indicator'), version: '1.0.3' },
])
</script>

<template>
  <SemanticPreview
    component-name="Switch"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-switch
        checked-children="on"
        un-checked-children="off"
        default-checked
        disabled
        :classes="classes"
      />
    </template>
  </SemanticPreview>
</template>
