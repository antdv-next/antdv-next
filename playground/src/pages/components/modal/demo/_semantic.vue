<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root'), version: '1.0.0' },
  { name: 'mask', desc: t('mask'), version: '1.0.0' },
  { name: 'container', desc: t('container'), version: '1.0.0' },
  { name: 'wrapper', desc: t('wrapper'), version: '1.0.0' },
  { name: 'header', desc: t('header'), version: '1.0.0' },
  { name: 'title', desc: t('title'), version: '1.0.0' },
  { name: 'body', desc: t('body'), version: '1.0.0' },
  { name: 'footer', desc: t('footer'), version: '1.0.0' },
])

const divRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <SemanticPreview
    component-name="Modal"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ position: 'absolute', inset: 0 }">
        <a-modal
          title="Title"
          :closable="false"
          open
          :get-container="() => divRef!"
          :width="400"
          :styles="{
            mask: { position: 'absolute', zIndex: 1 },
            wrapper: { position: 'absolute', zIndex: 1 },
          }"
          :style="{ top: '50%', transform: 'translateY(-50%)', marginBottom: 0, paddingBottom: 0 }"
          :classes="classes"
        >
          <p>Some contents...</p>
        </a-modal>
      </div>
    </template>
  </SemanticPreview>
</template>
