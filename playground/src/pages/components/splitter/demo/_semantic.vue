<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'panel', desc: t('panel'), version: '1.0.0' },
  { name: 'dragger', desc: t('dragger'), version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Splitter"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-splitter
        :style="{ height: '200px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }"
        :classes="classes"
      >
        <a-splitter-panel>
          <div :style="{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }">
            First
          </div>
        </a-splitter-panel>
        <a-splitter-panel>
          <div :style="{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }">
            Second
          </div>
        </a-splitter-panel>
      </a-splitter>
    </template>
  </SemanticPreview>
</template>
