<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，包含边框、背景色、内边距、圆角、位置布局等警告提示框的基础样式',
    section: '内容元素，采用 flex 布局控制内容区域的排版和最小宽度',
    icon: '图标元素，包含图标的颜色、行高、外边距等样式，支持不同类型的状态图标',
    title: '标题元素，包含标题文字的颜色、字体等样式',
    description: '描述元素，包含描述文字的字体大小、行高等排版样式',
    actions: '操作组元素，包含操作按钮的布局和间距样式',
    close: '关闭按钮元素，包含按钮的基础样式',
  },
  en: {
    root: 'Root element with border, background, padding, border-radius, and positioning styles for the alert container',
    section: 'Content element with flex layout controlling content area typography and minimum width',
    icon: 'Icon element with color, line-height, and margin styles, supporting different status icon types',
    title: 'Title element with text color and font styling for the alert title',
    description: 'Description element with font-size and line-height styles for additional content',
    actions: 'Actions element with layout and spacing styles for action buttons',
    close: 'Close button element with basic button styling',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'icon', desc: locale.value.icon, version: '1.0.0' },
  { name: 'section', desc: locale.value.section, version: '1.0.0' },
  { name: 'title', desc: locale.value.title, version: '1.0.0' },
  { name: 'description', desc: locale.value.description, version: '1.0.0' },
  { name: 'actions', desc: locale.value.actions, version: '1.0.0' },
  { name: 'close', desc: locale.value.close, version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Alert"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-alert
        closable
        title="Info Text"
        show-icon
        description="Info Description Info Description Info Description Info Description"
        type="info"
        :classes="classes"
      >
        <template #action>
          <a-space direction="vertical">
            <a-button size="small" type="primary">
              Accept
            </a-button>
            <a-button size="small" danger ghost>
              Decline
            </a-button>
          </a-space>
        </template>
      </a-alert>
    </template>
  </SemanticPreview>
</template>
