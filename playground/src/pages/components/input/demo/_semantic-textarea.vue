<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('TextAreaRoot') },
  { name: 'textarea', desc: t('textarea') },
  { name: 'count', desc: t('TextAreaCount') },
])
</script>

<template>
  <SemanticPreview
    component-name="TextArea"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div style="width: 100%">
        <a-textarea
          default-value="Hello, Antdv-Next"
          :maxlength="100"
          show-count
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
