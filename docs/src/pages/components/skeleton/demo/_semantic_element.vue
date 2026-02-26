<script setup lang="ts">
import type { SegmentedOptions } from 'antdv-next'
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

type SkeletonElement = 'Avatar' | 'Button' | 'Input' | 'Image' | 'Node'
const internalOptions: SegmentedOptions = ['Avatar', 'Button', 'Input', 'Image', 'Node']

const element = ref<SkeletonElement>('Avatar')

const componentMap: Record<SkeletonElement, string> = {
  Avatar: 'a-skeleton-avatar',
  Button: 'a-skeleton-button',
  Input: 'a-skeleton-input',
  Image: 'a-skeleton-image',
  Node: 'a-skeleton-node',
}

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('element.root'), version: '1.0.0' },
  { name: 'content', desc: t('element.content'), version: '1.0.0' },
])

const componentName = computed(() => `Skeleton.${element.value}`)
const currentComponent = computed(() => componentMap[element.value])
</script>

<template>
  <SemanticPreview
    :component-name="componentName"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-flex vertical :style="{ width: 'fit-content', marginInlineEnd: 'auto' }">
        <a-segmented v-model:value="element" :options="internalOptions" />
        <a-divider title-placement="start" plain>
          {{ t('element.preview') }}
        </a-divider>
        <component :is="currentComponent" :classes="classes" />
      </a-flex>
    </template>
  </SemanticPreview>
</template>
