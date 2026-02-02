<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，设置行内flex布局、相对定位、内边距和边框样式',
    textarea: '文本域元素，设置字体、行高、文本输入和背景样式',
    popup: '弹出框元素，设置绝对定位、层级、背景色、圆角、阴影和下拉选项样式',
    suffix: '后缀元素，包含后缀内容的布局和样式，如清除按钮等',
  },
  en: {
    root: 'Root element, set inline flex layout, relative positioning, padding and border styles',
    textarea: 'Textarea element, set font, line height, text input and background styles',
    popup: 'Popup element, set absolute positioning, z-index, background color, border radius, shadow and dropdown options styles',
    suffix: 'Suffix element with layout and styling for suffix content like clear button, etc.',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'textarea', desc: locale.value.textarea, version: '1.0.0' },
  { name: 'suffix', desc: locale.value.suffix, version: '1.0.0' },
  { name: 'popup', desc: locale.value.popup, version: '1.0.0' },
])

const divRef = ref<HTMLDivElement | null>(null)

const options = [
  { value: 'afc163', label: 'afc163' },
  { value: 'zombieJ', label: 'zombieJ' },
  { value: 'thinkasany', label: 'thinkasany' },
  { value: 'meet-student', label: 'meet-student' },
]
</script>

<template>
  <SemanticPreview
    component-name="Mentions"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ position: 'absolute', height: '200px', overflow: 'hidden' }">
        <a-mentions
          placement="bottom"
          :style="{ width: '100%' }"
          value="Hi, @"
          allow-clear
          open
          :get-popup-container="() => divRef!"
          :styles="{ popup: { zIndex: 1 } }"
          :options="options"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
