<script setup lang="ts">
import { ArrowUpOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，包含统计数值组件的重置样式和整体容器样式',
    header: '头部元素，包含下内边距和标题区域的布局样式',
    title: '标题元素，包含文字颜色、字体大小等标题文字的显示样式',
    content: '内容元素，包含文字颜色、字体大小、字体族等数值内容的展示样式',
    prefix: '前缀元素，包含行内块显示、右外边距等前缀内容的布局样式',
    suffix: '后缀元素，包含行内块显示、左外边距等后缀内容的布局样式',
  },
  en: {
    root: 'Root element with reset styles and overall container styles for statistic component',
    header: 'Header element with bottom padding and title area layout styles',
    title: 'Title element with text color, font size and other title text display styles',
    content: 'Content element with text color, font size, font family and other numeric content display styles',
    prefix: 'Prefix element with inline-block display, right margin and other prefix content layout styles',
    suffix: 'Suffix element with inline-block display, left margin and other suffix content layout styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'header', desc: locale.value.header, version: '1.0.0' },
  { name: 'title', desc: locale.value.title, version: '1.0.0' },
  { name: 'prefix', desc: locale.value.prefix, version: '1.0.0' },
  { name: 'content', desc: locale.value.content, version: '1.0.0' },
  { name: 'suffix', desc: locale.value.suffix, version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Statistic"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div :style="{ position: 'absolute' }">
        <a-statistic
          title="Active"
          :value="11.28"
          :precision="2"
          :styles="{ content: { color: '#3f8600' } }"
          suffix="%"
          :classes="classes"
        >
          <template #prefix>
            <ArrowUpOutlined />
          </template>
        </a-statistic>
      </div>
    </template>
  </SemanticPreview>
</template>
