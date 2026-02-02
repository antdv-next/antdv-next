<script setup lang="ts">
import { message } from 'antdv-next'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const { _InternalPanelDoNotUseOrYouWillBeFired: InternalPanel } = message

const locales = {
  cn: {
    root: '根元素，设置固定定位、层级、内边距、背景色、圆角、阴影和动画样式',
    icon: '图标元素，设置字体大小、右边距和状态颜色样式',
    content: '内容元素，设置行内块布局、文字颜色和内容展示样式',
  },
  en: {
    root: 'Root element, set fixed positioning, z-index, padding, background color, border radius, shadow and animation styles',
    icon: 'Icon element, set font size, right margin and status color styles',
    content: 'Content element, set inline block layout, text color and content display styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'icon', desc: locale.value.icon, version: '1.0.0' },
  { name: 'content', desc: locale.value.content, version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Message"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <InternalPanel
        type="success"
        content="Hello, Ant Design!"
        :classes="classes"
      />
    </template>
  </SemanticPreview>
</template>
