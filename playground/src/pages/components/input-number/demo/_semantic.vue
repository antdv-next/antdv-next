<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'prefix', desc: t('prefix') },
  { name: 'input', desc: t('input') },
  { name: 'suffix', desc: t('suffix') },
  { name: 'actions', desc: t('actions') },
  { name: 'action', desc: t('action') },
])
</script>

<template>
  <SemanticPreview
    component-name="InputNumber"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
        <a-input-number
          prefix="￥"
          suffix="RMB"
          :default-value="100"
          :style="{ width: '200px' }"
          :styles="{ actions: { opacity: 1, width: '24px' }, suffix: { marginRight: '28px' } }"
          :classes="classes"
        />
        <a-input-number
          :default-value="100"
          :style="{ width: '200px' }"
          :styles="{ actions: { opacity: 1, width: '24px' }, suffix: { marginRight: '28px' } }"
          mode="spinner"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
