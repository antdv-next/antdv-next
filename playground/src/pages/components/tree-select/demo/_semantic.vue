<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'prefix', desc: t('prefix') },
  { name: 'selector', desc: t('selector') },
  { name: 'suffix', desc: t('suffix') },
  { name: 'popup', desc: t('popup') },
  { name: 'item', desc: t('item') },
])

const divRef = ref<HTMLDivElement | null>(null)

const treeData = [
  {
    value: 'contributors',
    title: 'contributors',
    children: [
      { value: 'aojunhao123', title: 'aojunhao123' },
      { value: 'thinkasany', title: 'thinkasany' },
      { value: 'meet-student', title: 'meet-student' },
    ],
  },
]
</script>

<template>
  <SemanticPreview
    component-name="TreeSelect"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ position: 'absolute', height: '200px' }">
        <a-tree-select
          prefix="prefix"
          :style="{ width: '300px' }"
          :tree-data="treeData"
          tree-default-expand-all
          show-search
          allow-clear
          open
          :get-popup-container="() => divRef!"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
