<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'item', desc: t('item'), version: '1.0.0' },
  { name: 'itemTitle', desc: t('itemTitle'), version: '1.0.0' },
  { name: 'indicator', desc: t('indicator'), version: '1.0.0' },
])

const items = [
  {
    key: 'api',
    href: '#api',
    title: 'API',
    children: [
      { key: '4', href: '#anchor-props', title: 'Anchor Props' },
      { key: '5', href: '#link-props', title: 'Link Props' },
    ],
  },
  { key: '1', href: '#anchor-demo-basic', title: 'Basic demo' },
  { key: '2', href: '#anchor-demo-static', title: 'Static demo' },
]
</script>

<template>
  <SemanticPreview
    component-name="Anchor"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-anchor :affix="false" :items="items" :classes="classes" />
    </template>
  </SemanticPreview>
</template>
