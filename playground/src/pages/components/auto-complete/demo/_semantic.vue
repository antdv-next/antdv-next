<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'prefix', desc: t('prefix') },
  { name: 'input', desc: t('input') },
  { name: 'placeholder', desc: t('placeholder') },
  { name: 'content', desc: t('content') },
  { name: 'clear', desc: t('clear') },
  { name: 'popup.root', desc: t('popup.root') },
  { name: 'popup.list', desc: t('popup.list') },
  { name: 'popup.listItem', desc: t('popup.listItem') },
])

const options = ref([
  { value: 'aojunhao123', label: 'aojunhao123' },
  { value: 'thinkasany', label: 'thinkasany' },
  { value: 'meet-student', label: 'meet-student' },
])

const divRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <SemanticPreview
    component-name="AutoComplete"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ position: 'absolute', height: '200px' }">
        <a-auto-complete
          prefix="prefix"
          :style="{ width: '200px' }"
          :options="options"
          placeholder="input here"
          open
          :get-popup-container="() => divRef!"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
