<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，包含行内 flex 布局、基线对齐、光标样式、重置样式等复选框容器的基础样式',
    icon: '选中框元素，包含尺寸、方向、背景色、边框、圆角、过渡动画，以及选中状态的勾选标记样式',
    label: '文本元素，包含文本的内边距和与复选框的间距样式',
  },
  en: {
    root: 'Root element with inline-flex layout, baseline alignment, cursor style, reset styles and other basic checkbox container styles',
    icon: 'Checkbox icon element with size, direction, background, border, border-radius, transitions, and checked state checkmark styles',
    label: 'Label text element with padding and spacing styles relative to the checkbox',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'icon', desc: locale.value.icon, version: '1.0.0' },
  { name: 'label', desc: locale.value.label, version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Checkbox"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-checkbox :classes="classes">
        Checkbox
      </a-checkbox>
    </template>
  </SemanticPreview>
</template>
