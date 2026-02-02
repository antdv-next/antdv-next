<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素 (包含箭头、内容元素)，设置绝对定位、层级、块级显示、最大宽度、可见性、变换原点和箭头背景色',
    container: '内容元素，设置最小宽度高度、内边距、颜色、文本对齐、背景色、圆角、阴影和边框样式',
    arrow: '箭头元素，设置宽高、位置、颜色和边框样式',
  },
  en: {
    root: 'Root element (including arrows, content elements) with absolute positioning, z-index, block display, max width, visibility, transform origin and arrow background color',
    container: 'Content element with min width and height, padding, color, text alignment, background color, border radius, shadow and border styles',
    arrow: 'Arrow element with width, height, position, color and border styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root },
  { name: 'container', desc: locale.value.container },
  { name: 'arrow', desc: locale.value.arrow },
])

const divRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <SemanticPreview
    component-name="Tooltip"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ position: 'absolute', marginTop: '60px' }">
        <a-tooltip
          open
          placement="top"
          title="tooltip prompt text"
          :auto-adjust-overflow="false"
          :get-popup-container="() => divRef!"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
