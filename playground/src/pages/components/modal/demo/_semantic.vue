<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，包含相对定位、顶部位置、宽度、最大宽度、外边距、底部内边距等模态框容器的基础布局样式',
    mask: '遮罩层元素，包含固定定位、层级、背景色、动画过渡等遮罩层的样式',
    wrapper: '包裹层元素，一般用于动画容器，包含动画和过渡效果的样式',
    container: 'Modal 容器元素，包含相对定位、背景色、背景裁剪、边框、圆角、阴影、指针事件、内边距等模态框主体样式',
    header: '头部元素，包含头部内边距、下边框等头部区域样式',
    title: '标题元素，包含外边距、颜色、字体权重、字体大小、行高、文字换行等标题文字样式',
    body: '内容元素，包含内容区域的背景色、内边距等内容展示样式',
    footer: '底部元素，包含底部的背景色、内边距、上边框、圆角等底部区域样式',
  },
  en: {
    root: 'Root element with relative positioning, top position, width, max-width, margins, bottom padding and other basic layout styles for modal container',
    mask: 'Mask element with fixed positioning, z-index, background color, animation transitions and other mask layer styles',
    wrapper: 'Wrapper element used for motion container with animation and transition effect styles',
    container: 'Modal container element with relative positioning, background, background-clip, border, border-radius, box-shadow, pointer-events, padding and other modal body styles',
    header: 'Header element with padding, bottom border and other header area styles',
    title: 'Title element with margin, color, font-weight, font-size, line-height, word-wrap and other title text styles',
    body: 'Body element with content area background color, padding and other content display styles',
    footer: 'Footer element with footer background color, padding, top border, border-radius and other footer area styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'mask', desc: locale.value.mask, version: '1.0.0' },
  { name: 'container', desc: locale.value.container, version: '1.0.0' },
  { name: 'wrapper', desc: locale.value.wrapper, version: '1.0.0' },
  { name: 'header', desc: locale.value.header, version: '1.0.0' },
  { name: 'title', desc: locale.value.title, version: '1.0.0' },
  { name: 'body', desc: locale.value.body, version: '1.0.0' },
  { name: 'footer', desc: locale.value.footer, version: '1.0.0' },
])

const divRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <SemanticPreview
    component-name="Modal"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ position: 'absolute', inset: 0 }">
        <a-modal
          title="Title"
          :closable="false"
          open
          :get-container="() => divRef!"
          :width="400"
          :styles="{
            mask: { position: 'absolute', zIndex: 1 },
            wrapper: { position: 'absolute', zIndex: 1 },
          }"
          :style="{ top: '50%', transform: 'translateY(-50%)', marginBottom: 0, paddingBottom: 0 }"
          :classes="classes"
        >
          <p>Some contents...</p>
        </a-modal>
      </div>
    </template>
  </SemanticPreview>
</template>
