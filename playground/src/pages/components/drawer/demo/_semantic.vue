<script setup lang="ts">
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，包含固定定位、层级控制、指针事件、颜色等抽屉容器的基础样式和布局控制',
    mask: '遮罩层元素，包含绝对定位、层级、背景色、指针事件等遮罩层的样式和交互控制',
    section: 'Drawer 容器元素，包含flex布局、宽高、溢出控制、背景色、指针事件等抽屉主体的样式',
    header: '头部元素，包含flex布局、对齐方式、内边距、字体大小、行高、下边框等头部区域的样式',
    body: '内容元素，包含flex占比、最小尺寸、内边距、溢出滚动等内容区域的展示和布局样式',
    footer: '底部元素，包含flex收缩、内边距、上边框等底部操作区域的样式',
    title: '标题元素，包含flex占比、外边距、字体权重、字体大小、行高等标题文字的样式',
    extra: '额外元素，包含flex固定布局等额外操作内容的样式控制',
    dragger: '拖拽元素，用于调整抽屉大小的拖拽手柄，包含绝对定位、背景透明、指针事件控制、hover状态样式、拖拽状态样式等',
    close: '关闭按钮元素，包含按钮的基础样式',
  },
  en: {
    root: 'Root element with fixed positioning, z-index control, pointer events, color and other basic styles and layout control for drawer container',
    mask: 'Mask element with absolute positioning, z-index, background color, pointer events and other mask layer styles and interaction controls',
    section: 'Drawer container element with flex layout, width/height, overflow control, background color, pointer events and other drawer body styles',
    header: 'Header element with flex layout, alignment, padding, font size, line height, bottom border and other header area styles',
    body: 'Body element with flex ratio, minimum size, padding, overflow scroll and other content area display and layout styles',
    footer: 'Footer element with flex shrink, padding, top border and other bottom operation area styles',
    title: 'Title element with flex ratio, margin, font weight, font size, line height and other title text styles',
    extra: 'Extra element with flex fixed layout and other additional operation content style controls',
    dragger: 'Dragger element used to resize the drawer, with absolute positioning, transparent background, pointer events control, hover state styles, and dragging state styles',
    close: 'Close button element with basic button styling',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'mask', desc: locale.value.mask, version: '1.0.0' },
  { name: 'section', desc: locale.value.section, version: '1.0.0' },
  { name: 'header', desc: locale.value.header, version: '1.0.0' },
  { name: 'title', desc: locale.value.title, version: '1.0.0' },
  { name: 'extra', desc: locale.value.extra, version: '1.0.0' },
  { name: 'body', desc: locale.value.body, version: '1.0.0' },
  { name: 'footer', desc: locale.value.footer, version: '1.0.0' },
  { name: 'dragger', desc: locale.value.dragger, version: '1.0.0' },
  { name: 'close', desc: locale.value.close, version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Drawer"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-drawer
        title="Title"
        placement="right"
        open
        :get-container="false"
        :size="300"
        :resizable="{}"
        :classes="classes"
      >
        <template #footer>
          <a-typography-link>Footer</a-typography-link>
        </template>
        <template #extra>
          <a-button>Cancel</a-button>
        </template>
        <p>Some contents...</p>
      </a-drawer>
    </template>
  </SemanticPreview>
</template>
