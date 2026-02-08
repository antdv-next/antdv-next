<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'item', desc: t('item') },
  { name: 'itemWrapper', desc: t('itemWrapper') },
  { name: 'itemIcon', desc: t('itemIcon') },
  { name: 'itemSection', desc: t('itemSection') },
  { name: 'itemHeader', desc: t('itemHeader') },
  { name: 'itemTitle', desc: t('itemTitle') },
  { name: 'itemContent', desc: t('itemContent') },
  { name: 'itemRail', desc: t('itemRail') },
])

const items = [
  { title: '2015-09-01', content: 'Create a services' },
  { title: '2015-09-01 09:12:11', content: 'Solve initial network problems' },
  { content: 'Technical testing' },
  { title: '2015-09-01 09:12:11', content: 'Network problems being solved' },
]
</script>

<template>
  <SemanticPreview
    component-name="Timeline"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-timeline :items="items" :classes="classes" />
    </template>
  </SemanticPreview>
</template>
