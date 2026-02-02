<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，包含日历组件的背景色、边框、圆角等基础样式和整体布局结构',
    header: '头部元素，包含年份选择器、月份选择器、模式切换器的布局和样式控制',
    body: '主体元素，包含日历表格的内边距、布局控制等样式，用于容纳日历网格',
    content: '内容元素，包含日历表格的宽度、高度等尺寸控制和表格样式',
    item: '条目元素，包含日历单元格的背景色、边框、悬停态、选中态等交互样式',
  },
  en: {
    root: 'Root element containing background, border, border-radius and overall layout structure of the calendar component',
    header: 'Header element with layout and style control for year selector, month selector and mode switcher',
    body: 'Body element with padding and layout control for the calendar table that contains the calendar grid',
    content: 'Content element with width, height and table styling control for the calendar table',
    item: 'Item element with background, border, hover state, selected state and other interactive styles for calendar cells',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'header', desc: locale.value.header, version: '1.0.0' },
  { name: 'body', desc: locale.value.body, version: '1.0.0' },
  { name: 'content', desc: locale.value.content, version: '1.0.0' },
  { name: 'item', desc: locale.value.item, version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Calendar"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-calendar :classes="classes" />
    </template>
  </SemanticPreview>
</template>
