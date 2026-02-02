<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，包含布局定位、内边距、边距、背景色等基础样式',
    item: '链接项元素，包含内边距、文字颜色、悬停状态、过渡动画等样式',
    itemTitle: '标题文字元素，包含字体样式、颜色变化、文本装饰、过渡效果等样式',
    indicator: '指示器元素，包含宽度、高度、背景色、位置变化、过渡动画等样式',
  },
  en: {
    root: 'Root element with layout positioning, padding, margin, background color and other basic styles',
    item: 'Link item element with padding, text color, hover states, transition animations and other styles',
    itemTitle: 'Title text element with font styles, color changes, text decoration, transition effects and other styles',
    indicator: 'Indicator element with width, height, background color, position changes, transition animations and other styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'item', desc: locale.value.item, version: '1.0.0' },
  { name: 'itemTitle', desc: locale.value.itemTitle, version: '1.0.0' },
  { name: 'indicator', desc: locale.value.indicator, version: '1.0.0' },
])

const items = [
  {
    key: 'api',
    href: '#api',
    title: 'API',
    children: [
      { key: '4', href: '#anchor-props', title: 'Anchor Props' },
      { key: '5', href: '#link-props', title: 'Link Props' },
    ],
  },
  { key: '1', href: '#anchor-demo-basic', title: 'Basic demo' },
  { key: '2', href: '#anchor-demo-static', title: 'Static demo' },
]
</script>

<template>
  <SemanticPreview
    component-name="Anchor"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-anchor :affix="false" :items="items" :classes="classes" />
    </template>
  </SemanticPreview>
</template>
