<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'textarea', desc: t('textarea'), version: '1.0.0' },
  { name: 'suffix', desc: t('suffix'), version: '1.0.0' },
  { name: 'popup', desc: t('popup'), version: '1.0.0' },
])

const divRef = ref<HTMLDivElement | null>(null)

const options = [
  { value: 'afc163', label: 'afc163' },
  { value: 'zombieJ', label: 'zombieJ' },
  { value: 'thinkasany', label: 'thinkasany' },
  { value: 'meet-student', label: 'meet-student' },
]
</script>

<template>
  <SemanticPreview
    component-name="Mentions"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ position: 'absolute', height: '200px' }">
        <a-mentions
          placement="bottom"
          :style="{ width: '100%' }"
          value="Hi, @"
          allow-clear
          open
          :get-popup-container="() => divRef!"
          :options="options"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
