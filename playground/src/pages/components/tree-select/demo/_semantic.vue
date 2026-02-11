<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const mode = ref<'single' | 'multiple'>('single')

const { t } = useComponentLocale(locales)

const semantics = computed(() => {
  const base = [
    { name: 'root', desc: t('root') },
    { name: 'prefix', desc: t('prefix') },
    { name: 'placeholder', desc: t('placeholder') },
  ]

  if (mode.value === 'multiple') {
    base.push(
      ...[
        { name: 'content', desc: t('content') },
        { name: 'item', desc: t('item') },
        { name: 'itemContent', desc: t('itemContent') },
        { name: 'itemRemove', desc: t('itemRemove') },
      ],
    )
  }

  base.push(
    ...[
      { name: 'input', desc: t('input') },
      { name: 'suffix', desc: t('suffix') },
      { name: 'popup.root', desc: t('popup.root') },
      { name: 'popup.item', desc: t('popup.item') },
      { name: 'popup.itemTitle', desc: t('popup.itemTitle') },
    ],
  )

  return base
})

const treeValue = ref<string[]>([])
console.log(treeValue)
function handleResetValue(newMode: string | number) {
  if (newMode === 'multiple') {
    treeValue.value = ['aojunhao123']
  }
  else {
    treeValue.value = []
  }
}

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
        <div :style="{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }">
          <a-segmented v-model:value="mode" :options="['single', 'multiple']" @change="handleResetValue" />
        </div>

        <a-tree-select
          v-model:value="treeValue"
          prefix="prefix"
          :style="{ width: '300px' }"
          :tree-data="treeData"
          tree-default-expand-all
          :multiple="mode === 'multiple'"
          show-search
          max-tag-count="responsive"
          placeholder="Please select"
          allow-clear
          open
          :get-popup-container="() => divRef!"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
