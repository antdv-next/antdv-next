<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，设置行内flex布局、相对定位、内边距和边框样式',
    prefix: '前缀元素，包含前缀内容的布局和样式',
    input: '输入框元素，设置字体、行高、文本输入和背景样式',
    popup: '弹出框元素，设置绝对定位、层级、背景色、圆角、阴影和下拉选项样式',
  },
  en: {
    root: 'Root element, set inline flex layout, relative positioning, padding and border styles',
    prefix: 'Prefix element with layout and styling for prefix content',
    input: 'Input element, set font, line height, text input and background styles',
    popup: 'Popup element, set absolute positioning, z-index, background color, border radius, shadow and dropdown options styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root },
  { name: 'prefix', desc: locale.value.prefix },
  { name: 'input', desc: locale.value.input },
  { name: 'popup', desc: locale.value.popup },
])

const options = ref([
  { value: 'aojunhao123', label: 'aojunhao123' },
  { value: 'thinkasany', label: 'thinkasany' },
  { value: 'meet-student', label: 'meet-student' },
])

const divRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <SemanticPreview
    component-name="AutoComplete"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ position: 'absolute', height: '200px', overflow: 'hidden' }">
        <a-auto-complete
          prefix="prefix"
          :style="{ width: '200px' }"
          :options="options"
          placeholder="input here"
          open
          :get-popup-container="() => divRef!"
          :styles="{ popup: { zIndex: 1 } }"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
