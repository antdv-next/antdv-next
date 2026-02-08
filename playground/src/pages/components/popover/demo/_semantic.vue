<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'container', desc: t('container') },
  { name: 'title', desc: t('title') },
  { name: 'content', desc: t('content') },
  { name: 'arrow', desc: t('arrow') },
])

const divRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <SemanticPreview
    component-name="Popover"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ position: 'absolute', marginTop: '60px' }">
        <a-popover
          open
          placement="top"
          title="Hello"
          content="Ant Design love you!"
          :auto-adjust-overflow="false"
          :get-popup-container="() => divRef!"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
