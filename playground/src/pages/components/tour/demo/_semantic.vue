<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'mask', desc: t('mask'), version: '1.0.0' },
  { name: 'section', desc: t('section'), version: '1.0.0' },
  { name: 'cover', desc: t('cover'), version: '1.0.0' },
  { name: 'header', desc: t('header'), version: '1.0.0' },
  { name: 'title', desc: t('title'), version: '1.0.0' },
  { name: 'description', desc: t('description'), version: '1.0.0' },
  { name: 'footer', desc: t('footer'), version: '1.0.0' },
  { name: 'actions', desc: t('actions'), version: '1.0.0' },
  { name: 'indicators', desc: t('indicators'), version: '1.0.0' },
  { name: 'indicator', desc: t('indicator'), version: '1.0.0' },
])

const open = ref(true)
const createBtnRef = ref<HTMLButtonElement | null>(null)

const steps = [
  {
    title: 'Hello World!',
    description: 'Hello World?!',
    target: () => createBtnRef.value!,
    mask: true,
  },
  {
    title: 'Save',
    description: 'Save your changes.',
    target: () => createBtnRef.value!,
  },
]
</script>

<template>
  <SemanticPreview
    component-name="Tour"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div
        :style="{
          width: '100%',
          height: '825px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }"
      >
        <a-button ref="createBtnRef" @click="open = true">
          Show
        </a-button>
        <a-tour
          v-model:open="open"
          :z-index="1"
          :default-current="0"
          :get-popup-container="false"
          :steps="steps"
          :classes="classes"
        >
          <template #coverRender="{ index }">
            <template v-if="index === 0">
              <img src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png" alt="img">
            </template>
          </template>
        </a-tour>
      </div>
    </template>
  </SemanticPreview>
</template>
