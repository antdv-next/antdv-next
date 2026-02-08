<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const mode = ref<'single' | 'multiple'>('single')

const options = [
  { value: 'aojunhao123', label: 'aojunhao123' },
  { value: 'thinkasany', label: 'thinkasany' },
  { value: 'meet-student', label: 'meet-student' },
]

const value = computed(() => {
  if (mode.value !== 'multiple')
    return []

  return options.length > 0
    ? [options[0]!.value]
    : []
})

const { t } = useComponentLocale(locales)

const semantics = computed(() => {
  const base = [
    { name: 'root', desc: t('root') },
    { name: 'prefix', desc: t('prefix') },
    { name: 'content', desc: t('content') },
    { name: 'placeholder', desc: t('placeholder') },
    { name: 'clear', desc: t('clear') },
    { name: 'input', desc: t('input') },
    { name: 'suffix', desc: t('suffix') },
    { name: 'popup.root', desc: t('popup.root') },
    { name: 'popup.list', desc: t('popup.list') },
    { name: 'popup.listItem', desc: t('popup.listItem') },
  ]

  if (mode.value === 'multiple') {
    return [
      ...base,
      { name: 'item', desc: t('item') },
      { name: 'itemContent', desc: t('itemContent') },
      { name: 'itemRemove', desc: t('itemRemove') },
    ]
  }

  return base
})

const divRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <SemanticPreview
    component-name="Select"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ position: 'absolute', height: '200px' }">
        <div :style="{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }">
          <a-segmented v-model:value="mode" :options="['single', 'multiple']" />
        </div>
        <div :style="{ display: 'flex', flexDirection: 'column', gap: '12px' }">
          <a-select
            prefix="prefix"
            :style="{ width: '300px' }"
            :options="options"
            :value="value"
            :mode="mode === 'multiple' ? 'multiple' : undefined"
            open
            :get-popup-container="() => divRef!"
            :classes="classes"
          />
        </div>
      </div>
    </template>
  </SemanticPreview>
</template>
