<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'body', desc: t('body') },
  { name: 'content', desc: t('content') },
  { name: 'description', desc: t('description') },
  { name: 'popup.root', desc: t('popup.root') },
])

const divRef = ref<HTMLDivElement | null>(null)
const body = document?.body
</script>

<template>
  <SemanticPreview
    component-name="ColorPicker"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-flex ref="divRef" :style="{ height: '300px' }" align="flex-start" gap="small">
        <a-color-picker
          default-value="#1677ff"
          open
          show-text
          :get-popup-container="() => divRef || body"
          :styles="{ popup: { root: { zIndex: 1 } } }"
          :classes="classes"
        />
        <a-color-picker :open="false" allow-clear :classes="classes" />
      </a-flex>
    </template>
  </SemanticPreview>
</template>
