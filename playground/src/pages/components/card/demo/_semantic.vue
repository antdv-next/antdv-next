<script setup lang="ts">
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@antdv-next/icons'
import { computed } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '卡片根元素，包含位置定位、背景色、边框、圆角、阴影、内边距等卡片容器的基础样式',
    header: '卡片头部区域，包含 flex 布局、最小高度、内边距、文字颜色、字体权重、字体大小、背景色、下边框、顶部圆角等样式',
    body: '卡片内容区域，包含内边距、字体大小等内容展示的基础样式',
    extra: '卡片右上角的操作区域，包含额外内容的文字颜色和布局样式',
    title: '卡片标题，包含行内块布局、flex 占比、文本省略等标题显示样式',
    actions: '卡片底部操作组，包含 flex 布局、列表样式重置、背景色、上边框、底部圆角等操作按钮容器样式',
    cover: '标题封面，包含封面图片的显示和布局样式',
  },
  en: {
    root: 'Card root element with positioning, background, border, border-radius, box-shadow, padding and other container styles',
    header: 'Card header area with flex layout, min-height, padding, text color, font-weight, font-size, background, bottom border and top border-radius',
    body: 'Card content area with padding, font-size and other content display styles',
    extra: 'Card extra operation area in top-right corner with text color and layout styles for additional content',
    title: 'Card title with inline-block display, flex-grow, text ellipsis and other title display styles',
    actions: 'Card bottom action group with flex layout, list-style reset, background, top border and bottom border-radius for action buttons container',
    cover: 'Title cover with styles for cover image display and layout',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'header', desc: locale.value.header, version: '1.0.0' },
  { name: 'title', desc: locale.value.title, version: '1.0.0' },
  { name: 'extra', desc: locale.value.extra, version: '1.0.0' },
  { name: 'cover', desc: locale.value.cover, version: '1.0.0' },
  { name: 'body', desc: locale.value.body, version: '1.0.0' },
  { name: 'actions', desc: locale.value.actions, version: '1.0.0' },
])
</script>

<template>
  <SemanticPreview
    component-name="Card"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div :style="{ position: 'absolute' }">
        <a-card
          title="Card title"
          extra="More"
          :style="{ width: '300px' }"
          :classes="classes"
        >
          <template #cover>
            <img
              draggable="false"
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            >
          </template>
          <template #actions>
            <SettingOutlined key="setting" />
            <EditOutlined key="edit" />
            <EllipsisOutlined key="ellipsis" />
          </template>
          <a-card-meta
            title="Card Meta title"
            description="This is the description"
          >
            <template #avatar>
              <a-avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
            </template>
          </a-card-meta>
        </a-card>
      </div>
    </template>
  </SemanticPreview>
</template>
