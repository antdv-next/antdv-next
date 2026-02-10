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

const options = [
  {
    value: 'contributors',
    label: 'contributors',
    children: [
      { value: 'aojunhao123', label: 'aojunhao123' },
      { value: 'thinkasany', label: 'thinkasany' },
      { value: 'meet-student', label: 'meet-student' },
    ],
  },
]
</script>

<template>
  <SemanticPreview
    component-name="Cascader"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ position: 'absolute', height: '200px' }">
        <a-cascader
          prefix="prefix"
          :style="{ width: '200px' }"
          :options="options"
          :default-value="['contributors', 'thinkasany']"
          open
          :get-popup-container="() => divRef!"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
