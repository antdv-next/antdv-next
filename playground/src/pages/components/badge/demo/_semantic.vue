<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，包含相对定位、行内块布局、适应内容宽度等基础布局样式',
    indicator: '指示器元素，包含定位、层级、尺寸、颜色、字体、文本对齐、背景、圆角、阴影、过渡动画等完整的徽标样式',
  },
  en: {
    root: 'Root element with relative positioning, inline-block display, and fit-content width for basic layout',
    indicator: 'Indicator element with positioning, z-index, dimensions, colors, fonts, text alignment, background, border-radius, box-shadow, and transition animations for complete badge styling',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'indicator', desc: locale.value.indicator, version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Badge"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-badge :count="5" :classes="classes">
        <a-avatar shape="square" size="large" />
      </a-badge>
    </template>
  </SemanticPreview>
</template>
