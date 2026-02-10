<script setup lang="ts">
import { HomeOutlined, UserOutlined } from '@antdv-next/icons'
import { computed, h } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'item', desc: t('item'), version: '1.0.0' },
  { name: 'separator', desc: t('separator'), version: '1.0.0' },
])

const items = [
  { href: '', title: h(HomeOutlined) },
  { href: '', title: [h(UserOutlined), h('span', 'Application List')] },
  { title: 'Application' },
]
</script>

<template>
  <SemanticPreview
    component-name="Breadcrumb"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-breadcrumb :items="items" :classes="classes" />
    </template>
  </SemanticPreview>
</template>
