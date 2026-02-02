<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '引导根容器，设置绝对定位、层级控制、最大宽度、可见性、箭头背景色变量、主题样式等容器样式',
    cover: '卡片封面区域，设置文本居中对齐、内边距、图片宽度等图片展示样式',
    section: '卡片主要内容区域，设置文本对齐、边框圆角、盒阴影、相对定位、背景色、边框、背景裁剪等卡片样式',
    footer: '卡片底部操作区域，设置内边距、文本右对齐、边框圆角、Flex布局等底部容器样式',
    actions: '操作按钮组容器，设置左侧自动外边距、按钮间距等按钮组布局样式',
    indicator: '单个指示器元素，设置宽高尺寸、行内块显示、圆角、背景色、右外边距、激活状态等圆点样式',
    indicators: '指示器组容器，设置行内块显示等指示器容器样式',
    header: '卡片头部区域，设置内边距、宽度计算、词汇换行等头部容器样式',
    title: '引导标题文字，设置字体粗细等标题文本样式',
    description: '引导描述文字，设置内边距、词汇换行等描述文本样式',
    mask: '遮罩层元素，设置固定定位、全屏覆盖、层级、指针事件、过渡动画等遮罩样式',
  },
  en: {
    root: 'Tour root container with absolute positioning, z-index control, max width, visibility, arrow background color variable, theme styles and other container styles',
    cover: 'Card cover area with text center alignment, padding, image width and other image display styles',
    section: 'Card main content area with text alignment, border radius, box shadow, relative positioning, background color, border, background clip and other card styles',
    footer: 'Card bottom action area with padding, text right alignment, border radius, flex layout and other bottom container styles',
    actions: 'Action button group container with left auto margin, button spacing and other button group layout styles',
    indicator: 'Single indicator element with width/height size, inline-block display, border radius, background color, right margin, active state and other dot styles',
    indicators: 'Indicator group container with inline-block display and other indicator container styles',
    header: 'Card header area with padding, width calculation, word break and other header container styles',
    title: 'Guide title text with font weight and other title text styles',
    description: 'Guide description text with padding, word wrap and other description text styles',
    mask: 'Mask layer element with fixed positioning, full screen coverage, z-index, pointer events, transition animation and other mask styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'mask', desc: locale.value.mask, version: '1.0.0' },
  { name: 'section', desc: locale.value.section, version: '1.0.0' },
  { name: 'cover', desc: locale.value.cover, version: '1.0.0' },
  { name: 'header', desc: locale.value.header, version: '1.0.0' },
  { name: 'title', desc: locale.value.title, version: '1.0.0' },
  { name: 'description', desc: locale.value.description, version: '1.0.0' },
  { name: 'footer', desc: locale.value.footer, version: '1.0.0' },
  { name: 'actions', desc: locale.value.actions, version: '1.0.0' },
  { name: 'indicators', desc: locale.value.indicators, version: '1.0.0' },
  { name: 'indicator', desc: locale.value.indicator, version: '1.0.0' },
])

const open = ref(true)
const createBtnRef = ref<HTMLButtonElement | null>(null)

const steps = [
  {
    title: 'Hello World!',
    description: 'Hello World?!',
    target: () => createBtnRef.value!,
    mask: true,
  },
  {
    title: 'Save',
    description: 'Save your changes.',
    target: () => createBtnRef.value!,
  },
]
</script>

<template>
  <SemanticPreview
    component-name="Tour"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div
        :style="{
          width: '100%',
          height: '825px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }"
      >
        <a-button ref="createBtnRef" @click="open = true">
          Show
        </a-button>
        <a-tour
          v-model:open="open"
          :z-index="1"
          :default-current="0"
          :get-popup-container="false"
          :steps="steps"
          :classes="classes"
        >
          <template #coverRender="{ index }">
            <template v-if="index === 0">
              <img src="https://user-images.githubusercontent.com/5378891/197385811-55df8480-7ff4-44bd-9d43-a7dade598d70.png" alt="img">
            </template>
          </template>
        </a-tour>
      </div>
    </template>
  </SemanticPreview>
</template>
