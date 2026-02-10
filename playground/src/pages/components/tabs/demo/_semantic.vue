<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'header', desc: t('header') },
  { name: 'item', desc: t('item') },
  { name: 'indicator', desc: t('indicator') },
  { name: 'content', desc: t('content') },
  { name: 'popup.root', desc: t('popup.root') },
])

const items = computed(() =>
  Array.from({ length: 30 }, (_, i) => {
    const id = String(i)
    return {
      label: `Tab-${id}`,
      key: id,
      disabled: i === 28,
      children: `Content of tab ${id}`,
    }
  }),
)
</script>

<template>
  <SemanticPreview
    component-name="Tabs"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-tabs
        default-active-key="1"
        :style="{ height: '220px', width: '100%' }"
        :styles="{
          popup: {
            root: { background: '#fff' },
          },
        }"
        :items="items"
        :classes="classes"
      />
    </template>
  </SemanticPreview>
</template>
