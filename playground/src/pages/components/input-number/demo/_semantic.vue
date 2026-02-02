<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，设置行内块布局、宽度、边框圆角和重置样式',
    input: '输入框元素，设置字体、行高、文本输入和交互样式',
    prefix: '前缀的包裹元素，设置flex布局、对齐方式和右边距样式',
    suffix: '后缀的包裹元素，设置flex布局、边距和过渡动画样式',
    action: '单个操作按钮元素，设置按钮的样式、悬浮效果和点击交互',
    actions: '操作元素，设置绝对定位、宽度、flex布局和数值调节按钮样式',
  },
  en: {
    root: 'Root element, sets inline-block layout, width, border radius and reset styles',
    input: 'Input element, sets font, line height, text input and interaction styles',
    prefix: 'Prefix wrapper element, sets flex layout, alignment and right margin styles',
    suffix: 'Suffix wrapper element, sets flex layout, margin and transition animation styles',
    action: 'Single action button element, sets button styling, hover effects and click interactions',
    actions: 'Actions element, sets absolute positioning, width, flex layout and number adjustment button styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root },
  { name: 'prefix', desc: locale.value.prefix },
  { name: 'input', desc: locale.value.input },
  { name: 'suffix', desc: locale.value.suffix },
  { name: 'actions', desc: locale.value.actions },
  { name: 'action', desc: locale.value.action },
])
</script>

<template>
  <SemanticPreview
    component-name="InputNumber"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div :style="{ display: 'flex', flexDirection: 'column', gap: '16px' }">
        <a-input-number
          prefix="￥"
          suffix="RMB"
          :default-value="100"
          :style="{ width: '200px' }"
          :styles="{ actions: { opacity: 1, width: '24px' }, suffix: { marginRight: '28px' } }"
          :classes="classes"
        />
        <a-input-number
          :default-value="100"
          :style="{ width: '200px' }"
          :styles="{ actions: { opacity: 1, width: '24px' }, suffix: { marginRight: '28px' } }"
          mode="spinner"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
