<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，设置绝对定位、显示控制、颜色、字体大小、文本对齐、垂直对齐、透明度和过渡动画(fullscreen 为 false 时才有效)',
    indicator: '指示器元素，设置宽度、高度、字体大小、行内块显示、过渡动画、变换原点、行高和颜色',
  },
  en: {
    root: 'Root element with absolute positioning, display control, color, font size, text alignment, vertical alignment, opacity and transition animation (effective when fullscreen is false)',
    indicator: 'Indicator element with width, height, font size, inline-block display, transition animation, transform origin, line height and color',
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
    component-name="Spin"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div
        :style="{
          position: 'relative',
          width: '500px',
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }"
      >
        <a-spin :percent="0" :classes="classes" />
      </div>
    </template>
  </SemanticPreview>
</template>
