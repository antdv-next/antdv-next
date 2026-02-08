<script setup lang="ts">
import { AppstoreOutlined, BarsOutlined } from '@antdv-next/icons'
import { computed, h } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'item', desc: t('item'), version: '1.0.0' },
  { name: 'label', desc: t('label'), version: '1.0.0' },
  { name: 'icon', desc: t('icon'), version: '1.0.0' },
])

const options = [
  { label: 'List', value: 'List', icon: h(BarsOutlined) },
  { label: 'Kanban', value: 'Kanban', icon: h(AppstoreOutlined) },
]
</script>

<template>
  <SemanticPreview
    component-name="Segmented"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-segmented :options="options" :classes="classes" />
    </template>
  </SemanticPreview>
</template>
