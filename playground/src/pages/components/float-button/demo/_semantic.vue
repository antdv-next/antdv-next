<script setup lang="ts">
import { QuestionCircleOutlined } from '@antdv-next/icons'
import { FloatButton } from 'antdv-next'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const PurePanel = (FloatButton as any)._InternalPanelDoNotUseOrYouWillBeFired

const locales = {
  cn: {
    root: '根元素，设置悬浮按钮的基础样式、形状尺寸、类型主题、固定定位、层级、阴影、间距等容器样式',
    content: '内容元素，设置按钮内文字内容的字体大小、颜色、对齐、换行等文本显示样式',
    icon: '图标元素，设置按钮内图标的尺寸、颜色、行高、对齐等图标显示样式',
  },
  en: {
    root: 'Root element with float button base styles, shape size, type theme, fixed positioning, z-index, shadow, spacing and other container styles',
    content: 'Content element with button text content font size, color, alignment, line wrap and other text display styles',
    icon: 'Icon element with button icon size, color, line height, alignment and other icon display styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root },
  { name: 'icon', desc: locale.value.icon },
  { name: 'content', desc: locale.value.content },
])
</script>

<template>
  <SemanticPreview
    component-name="FloatButton"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <PurePanel
        type="primary"
        shape="square"
        content="HELP"
        :classes="classes"
      >
        <template #icon>
          <QuestionCircleOutlined />
        </template>
      </PurePanel>
    </template>
  </SemanticPreview>
</template>
