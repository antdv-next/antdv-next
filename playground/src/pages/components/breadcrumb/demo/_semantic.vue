<script setup lang="ts">
import { HomeOutlined, UserOutlined } from '@antdv-next/icons'
import { computed, h } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，包含文字颜色、字体大小、图标尺寸等基础样式，内部使用 flex 布局的有序列表',
    item: 'Item 元素，包含文字颜色、链接的颜色变化、悬浮效果、内边距、圆角、高度、外边距等样式',
    separator: '分隔符元素，包含分隔符的外边距和颜色样式',
  },
  en: {
    root: 'Root element with text color, font size, icon size and other basic styles, using flex layout with ordered list',
    item: 'Item element with text color, link color transitions, hover effects, padding, border-radius, height, and margin styles',
    separator: 'Separator element with margin and color styles for the divider',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'item', desc: locale.value.item, version: '1.0.0' },
  { name: 'separator', desc: locale.value.separator, version: '1.0.0' },
])

const items = [
  { href: '', title: h(HomeOutlined) },
  { href: '', title: [h(UserOutlined), h('span', 'Application List')] },
  { title: 'Application' },
]
</script>

<template>
  <SemanticPreview
    component-name="Breadcrumb"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-breadcrumb :items="items" :classes="classes" />
    </template>
  </SemanticPreview>
</template>
