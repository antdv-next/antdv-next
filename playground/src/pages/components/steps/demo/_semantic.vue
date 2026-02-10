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
  { name: 'itemHeader', desc: t('itemHeader') },
  { name: 'itemTitle', desc: t('itemTitle') },
  { name: 'itemSubtitle', desc: t('itemSubtitle') },
  { name: 'itemSection', desc: t('itemSection') },
  { name: 'itemContent', desc: t('itemContent') },
  { name: 'itemRail', desc: t('itemRail') },
])

const items = [
  { title: 'Step 1', subTitle: '00:01', content: 'This is a content.' },
  { title: 'Step 2', subTitle: '00:02', content: 'This is a content.' },
  { title: 'Step 3', subTitle: '00:03', content: 'This is a content.' },
]
</script>

<template>
  <SemanticPreview
    component-name="Steps"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-flex vertical gap="large" :style="{ width: '100%' }">
        <a-steps
          :current="1"
          :style="{ width: '100%' }"
          title-placement="vertical"
          :items="items"
          :classes="classes"
        />
        <a-steps
          :current="1"
          :style="{ width: '100%' }"
          type="panel"
          size="small"
          title-placement="horizontal"
          :items="items"
          :classes="classes"
        />
      </a-flex>
    </template>
  </SemanticPreview>
</template>
