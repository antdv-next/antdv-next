<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，设置行内flex布局、相对定位、内边距和边框样式',
    prefix: '前缀元素，包含前缀内容的布局和样式',
    selector: '选择器元素，设置内边距、flex布局和选中项显示样式',
    suffix: '后缀元素，包含后缀内容的布局和样式，如箭头图标等',
    popup: '弹出框元素，设置绝对定位、层级、背景色、圆角、阴影和下拉选项样式',
    item: '选项元素，设置内边距、背景色、悬停态和选中态样式',
  },
  en: {
    root: 'Root element, set inline flex layout, relative positioning, padding and border styles',
    prefix: 'Prefix element with layout and styling for prefix content',
    selector: 'Selector element, set padding, flex layout and selected item display styles',
    suffix: 'Suffix element with layout and styling for suffix content like arrow icon, etc.',
    popup: 'Popup element, set absolute positioning, z-index, background color, border radius, shadow and dropdown options styles',
    item: 'Option element, set padding, background color, hover state and selected state styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root },
  { name: 'prefix', desc: locale.value.prefix },
  { name: 'selector', desc: locale.value.selector },
  { name: 'suffix', desc: locale.value.suffix },
  { name: 'popup', desc: locale.value.popup },
  { name: 'item', desc: locale.value.item },
])

const divRef = ref<HTMLDivElement | null>(null)

const options = [
  { value: 'aojunhao123', label: 'aojunhao123' },
  { value: 'thinkasany', label: 'thinkasany' },
  { value: 'meet-student', label: 'meet-student' },
]
</script>

<template>
  <SemanticPreview
    component-name="Select"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ position: 'absolute', height: '200px', overflow: 'hidden' }">
        <a-select
          prefix="prefix"
          :style="{ width: '300px' }"
          :options="options"
          open
          :get-popup-container="() => divRef!"
          :styles="{ popup: { zIndex: 1 } }"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
