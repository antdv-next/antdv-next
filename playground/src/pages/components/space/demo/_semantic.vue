<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，包含 flex 布局、间隙设置、对齐方式、换行等间距容器的基础样式',
    item: '包裹的子组件，包含间距项的布局和样式，为每个子元素提供包装用于内联对齐',
    separator: '分隔符，包含分隔元素的样式',
  },
  en: {
    root: 'Root element with flex layout, gap settings, alignment, wrap and other spacing container basic styles',
    item: 'Wrapped item element with spacing item layout and styles, providing wrapper for each child element for inline alignment',
    separator: 'Separator element with divider styling',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root },
  { name: 'item', desc: locale.value.item },
  { name: 'separator', desc: locale.value.separator },
])
</script>

<template>
  <SemanticPreview
    component-name="Space"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-space :classes="classes">
        <template #separator>
          <a-divider vertical />
        </template>
        <a-button type="primary">
          Primary
        </a-button>
        <a-button>Default</a-button>
        <a-button type="dashed">
          Dashed
        </a-button>
      </a-space>
    </template>
  </SemanticPreview>
</template>
