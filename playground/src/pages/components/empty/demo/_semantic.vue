<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，设置文本对齐、字体和行高样式',
    image: '图标元素，设置高度、透明度、边距和图片样式',
    description: '描述元素，设置文本颜色样式',
    footer: '底部元素，设置顶部边距和操作按钮样式',
  },
  en: {
    root: 'Root element, sets text alignment, font and line height styles',
    image: 'Image element, sets height, opacity, margin and image styles',
    description: 'Description element, sets text color styles',
    footer: 'Footer element, sets top margin and action button styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'image', desc: locale.value.image, version: '1.0.0' },
  { name: 'description', desc: locale.value.description, version: '1.0.0' },
  { name: 'footer', desc: locale.value.footer, version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Empty"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-empty
        :image="1"
        :styles="{ image: { height: '60px' } }"
        :classes="classes"
      >
        <template #description>
          <a-typography-text>
            Customize <a href="#API">Description</a>
          </a-typography-text>
        </template>
        <a-button type="primary">
          Create Now
        </a-button>
      </a-empty>
    </template>
  </SemanticPreview>
</template>
