<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
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
      <div ref="divRef" :style="{ height: '300px' }">
        <a-color-picker
          default-value="#1677ff"
          open
          :get-popup-container="() => divRef || body"
          :styles="{ popup: { root: { zIndex: 1 } } }"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
