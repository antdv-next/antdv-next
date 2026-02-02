<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，包含最小宽度、高度、行高、垂直对齐、背景色、边框、圆角、光标样式、过渡动画、用户选择等开关容器的基础样式',
    content: '内容元素，包含块级显示、溢出隐藏、圆角、高度、内边距、过渡动画等开关内容区域的布局和样式',
  },
  en: {
    root: 'Root element with min-width, height, line-height, vertical alignment, background color, border, border radius, cursor style, transition animations, user selection and other basic switch container styles',
    content: 'Content element with block display, overflow hidden, border radius, height, padding, transition animations and other switch content area layout and styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'content', desc: locale.value.content, version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Switch"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-switch
        checked-children="on"
        un-checked-children="off"
        default-checked
        disabled
        :classes="classes"
      />
    </template>
  </SemanticPreview>
</template>
