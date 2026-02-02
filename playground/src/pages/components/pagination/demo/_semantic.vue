<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，设置flex布局、对齐方式、换行和列表样式',
    item: '页码元素，设置尺寸、内边距、边框、背景色、悬停态和激活态样式',
  },
  en: {
    root: 'Root element, set flex layout, alignment, flex wrap and list styles',
    item: 'Item element, set size, padding, border, background color, hover state and active state styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'item', desc: locale.value.item, version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Pagination"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-pagination :default-current="1" :total="50" :classes="classes" />
    </template>
  </SemanticPreview>
</template>
