<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'header', desc: t('header'), version: '1.0.0' },
  { name: 'title', desc: t('title'), version: '1.0.0' },
  { name: 'extra', desc: t('extra'), version: '1.0.0' },
  { name: 'label', desc: t('label'), version: '1.0.0' },
  { name: 'content', desc: t('content'), version: '1.0.0' },
])

const bordered = ref(false)

const items = [
  { key: '1', label: 'Telephone', children: '1810000000' },
]
</script>

<template>
  <SemanticPreview
    component-name="Descriptions"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div :style="{ width: '100%', height: '100%' }">
        <a-switch v-model:checked="bordered" />
        Toggle Border
        <a-divider />
        <a-descriptions
          title="User Info"
          :items="items"
          :bordered="bordered"
          :classes="classes"
        >
          <template #extra>
            <a-button type="primary">
              Edit
            </a-button>
          </template>
        </a-descriptions>
      </div>
    </template>
  </SemanticPreview>
</template>
