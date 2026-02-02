<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，包含文本对齐、布局样式等基础容器样式',
    title: '标题元素，包含字体大小、文字颜色、行高、对齐方式等文字样式',
    subTitle: '副标题元素，包含字体大小、文字颜色、行高等文字样式',
    body: '内容元素，包含外边距、内边距、背景色等内容区域样式',
    extra: '操作区域元素，包含外边距、文本对齐、内部元素间距等布局样式',
    icon: '图标元素，包含外边距、文本对齐、字体大小、状态颜色等图标样式',
  },
  en: {
    root: 'Root element with text alignment, layout styles and other basic container styles',
    title: 'Title element with font size, text color, line height, text alignment and other text styles',
    subTitle: 'Subtitle element with font size, text color, line height and other text styles',
    body: 'Content element with margin, padding, background color and other content area styles',
    extra: 'Action area element with margin, text alignment, inner element spacing and other layout styles',
    icon: 'Icon element with margin, text alignment, font size, status colors and other icon styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'icon', desc: locale.value.icon, version: '1.0.0' },
  { name: 'title', desc: locale.value.title, version: '1.0.0' },
  { name: 'subTitle', desc: locale.value.subTitle, version: '1.0.0' },
  { name: 'extra', desc: locale.value.extra, version: '1.0.0' },
  { name: 'body', desc: locale.value.body, version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Result"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-result
        title="title"
        sub-title="subTitle"
        :classes="classes"
      >
        <template #extra>
          <a-button type="primary">
            extra
          </a-button>
        </template>
        <div :style="{ textAlign: 'center' }">
          The Content of Result
        </div>
      </a-result>
    </template>
  </SemanticPreview>
</template>
