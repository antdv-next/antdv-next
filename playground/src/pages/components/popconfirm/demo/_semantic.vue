<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，设置绝对定位、层级、变换原点、箭头指向和弹层容器样式',
    container: '容器元素，设置背景色、内边距、圆角、阴影、边框和内容展示样式',
    arrow: '箭头元素，设置宽高、位置、颜色和边框样式',
    title: '标题元素，设置标题文本样式和间距',
    content: '描述元素，设置描述文本样式和布局',
  },
  en: {
    root: 'Root element, set absolute positioning, z-index, transform origin, arrow direction and popover container styles',
    container: 'Container element, set background color, padding, border radius, shadow, border and content display styles',
    arrow: 'Arrow element with width, height, position, color and border styles',
    title: 'Title element, set title text styles and spacing',
    content: 'Description element, set content text styles and layout',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root },
  { name: 'container', desc: locale.value.container },
  { name: 'title', desc: locale.value.title },
  { name: 'content', desc: locale.value.content },
  { name: 'arrow', desc: locale.value.arrow },
])

const divRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <SemanticPreview
    component-name="Popconfirm"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ position: 'absolute', marginTop: '60px' }">
        <a-popconfirm
          open
          placement="top"
          title="Confirm"
          description="Are you sure you want to perform this action?"
          :auto-adjust-overflow="false"
          :get-popup-container="() => divRef!"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
