<script setup lang="ts">
import { theme } from 'antdv-next'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'header', desc: t('header'), version: '1.0.0' },
  { name: 'icon', desc: t('icon'), version: '1.0.0' },
  { name: 'title', desc: t('title'), version: '1.0.0' },
  { name: 'body', desc: t('body'), version: '1.0.0' },
])

const { token } = theme.useToken()

const items = computed(() => [
  {
    key: '1',
    label: 'This is panel header',
    children: 'This is panel body',
  },
])
</script>

<template>
  <SemanticPreview
    component-name="Collapse"
    items-a-p-i="items"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div :style="{ position: 'absolute', inset: 0, margin: `${token.marginXL}px` }">
        <a-collapse
          :items="items"
          :default-active-key="['1']"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
