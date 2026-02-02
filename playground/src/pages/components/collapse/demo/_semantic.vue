<script setup lang="ts">
import { theme } from 'antdv-next'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，包含折叠面板的边框、圆角、背景色等容器样式，控制面板的整体布局和外观',
    header: '头部元素，包含flex布局、内边距、颜色、行高、光标样式、过渡动画等面板头部的交互和样式',
    title: '标题元素，包含flex自适应布局、右边距等标题文字的布局和排版样式',
    body: '内容元素，包含内边距、颜色、背景色等面板内容区域的展示样式',
    icon: '图标元素，包含字体大小、过渡动画、旋转变换等展开收起箭头的样式和动效',
  },
  en: {
    root: 'Root element with border, border-radius, background color and container styles that control the overall layout and appearance of collapse panels',
    header: 'Header element with flex layout, padding, color, line-height, cursor style, transition animations and other interactive styles for panel headers',
    title: 'Title element with flex auto layout and margin styles for title text layout and typography',
    body: 'Body element with padding, color, background color and other styles for panel content area display',
    icon: 'Icon element with font size, transition animations, rotation transforms and other styles and animations for expand/collapse arrows',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'header', desc: locale.value.header, version: '1.0.0' },
  { name: 'icon', desc: locale.value.icon, version: '1.0.0' },
  { name: 'title', desc: locale.value.title, version: '1.0.0' },
  { name: 'body', desc: locale.value.body, version: '1.0.0' },
])

const { token } = theme.useToken()

const items = computed(() => [
  {
    key: '1',
    label: 'This is panel header',
    children: 'This is panel body',
  },
])
</script>

<template>
  <SemanticPreview
    component-name="Collapse"
    items-a-p-i="items"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div :style="{ position: 'absolute', inset: 0, margin: `${token.marginXL}px` }">
        <a-collapse
          :items="items"
          :default-active-key="['1']"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
