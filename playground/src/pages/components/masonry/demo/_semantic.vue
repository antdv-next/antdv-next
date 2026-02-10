<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useComponentLocale } from '@/composables/use-locale'
import { locales } from '../locales'

const { t } = useComponentLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: t('root') },
  { name: 'item', desc: t('item') },
])

const heights = [75, 50, 70, 60, 85, 75, 50].map((height, index) => ({
  key: `item-${index}`,
  data: height,
}))
</script>

<template>
  <SemanticPreview
    component-name="Masonry"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-masonry
        :columns="3"
        :gutter="16"
        :items="heights"
        style="width: 100%"
        :classes="classes"
      >
        <template #itemRender="{ data, index }">
          <a-card size="small" :style="{ height: data }">
            {{ index + 1 }}
          </a-card>
        </template>
      </a-masonry>
    </template>
  </SemanticPreview>
</template>
