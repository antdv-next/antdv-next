<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，包含表单项的底边距、垂直对齐、过渡动画、隐藏状态、错误警告状态等表单项容器的基础样式',
    label: '标签元素，包含 flex 布局、溢出隐藏、文本不换行、文本对齐、垂直对齐，以及标签的颜色、字体大小、高度、必填标记等标签显示样式',
    content: '内容元素，包含表单内容区域的布局、样式和控件容器的相关样式',
  },
  en: {
    root: 'Root element with form item margin-bottom, vertical-align, transitions, hidden states, error/warning states and other basic form item container styles',
    label: 'Label element with flex layout, overflow hidden, whitespace nowrap, text alignment, vertical alignment, plus label color, font size, height, required marks and other label display styles',
    content: 'Content element with form content area layout, styling and control container related styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'label', desc: locale.value.label, version: '1.0.0' },
  { name: 'content', desc: locale.value.content, version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Form"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-form
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        :style="{ maxWidth: '600px' }"
        :initial-values="{ remember: true }"
        autocomplete="off"
        :classes="classes"
      >
        <a-form-item
          label="Username"
          name="username"
          :rules="[{ required: true, message: 'Please input your username!' }]"
        >
          <a-input />
        </a-form-item>
        <a-form-item
          label="Password"
          name="password"
          :rules="[{ required: true, message: 'Please input your password!' }]"
        >
          <a-input-password />
        </a-form-item>
      </a-form>
    </template>
  </SemanticPreview>
</template>
