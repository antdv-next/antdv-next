<script setup lang="ts">
import { AlertOutlined, BugOutlined, BulbOutlined } from '@antdv-next/icons'
import { FloatButton } from 'antdv-next'
import { computed, h } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const PurePanel = (FloatButton as any)._InternalPanelDoNotUseOrYouWillBeFired

const locales = {
  cn: {
    root: '根元素，设置悬浮按钮组的容器样式、固定定位、层级、内边距、间距、方向模式等组合布局样式',
    list: '列表元素，设置按钮组列表的Flex布局、圆角、阴影、动画过渡、垂直对齐等列表容器样式',
    item: '列表项元素，设置单个悬浮按钮的样式、尺寸、形状、类型、状态、图标内容等按钮基础样式',
    itemIcon: '列表项图标元素，设置悬浮按钮内图标的尺寸、颜色、对齐等图标显示样式',
    itemContent: '列表项内容元素，设置悬浮按钮内文字内容、徽标、描述等内容区域样式',
    trigger: '触发元素，设置菜单模式下触发按钮的样式、形状、图标、悬停态、展开收起状态等交互样式',
    triggerIcon: '触发图标元素，设置触发按钮内图标的样式、旋转动画、切换状态等图标交互样式',
    triggerContent: '触发内容元素，设置触发按钮内容区域的文字、标识、状态指示等内容样式',
  },
  en: {
    root: 'Root element with float button group container styles, fixed positioning, z-index, padding, gap, direction mode and other combined layout styles',
    list: 'List element with button group list flex layout, border radius, shadow, animation transition, vertical alignment and other list container styles',
    item: 'Item element with individual float button styles, size, shape, type, state, icon content and other button base styles',
    itemIcon: 'Item icon element with float button icon size, color, alignment and other icon display styles',
    itemContent: 'Item content element with float button text content, badge, description and other content area styles',
    trigger: 'Trigger element with menu mode trigger button styles, shape, icon, hover state, expand/collapse state and other interaction styles',
    triggerIcon: 'Trigger icon element with trigger button icon styles, rotation animation, toggle state and other icon interaction styles',
    triggerContent: 'Trigger content element with trigger button content area text, identifier, state indicator and other content styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root },
  { name: 'list', desc: locale.value.list },
  { name: 'item', desc: locale.value.item },
  { name: 'itemIcon', desc: locale.value.itemIcon },
  { name: 'itemContent', desc: locale.value.itemContent },
  { name: 'trigger', desc: locale.value.trigger },
  { name: 'triggerIcon', desc: locale.value.triggerIcon },
  { name: 'triggerContent', desc: locale.value.triggerContent },
])

const items = [
  {
    icon: h(AlertOutlined),
    content: 'warn',
  },
  {
    icon: h(BugOutlined),
    content: 'bug',
  },
  {
    icon: h(BulbOutlined),
    content: 'idea',
  },
]
</script>

<template>
  <SemanticPreview
    component-name="FloatButton"
    :semantics="semantics"
    :style="{ paddingTop: '100px' }"
  >
    <template #default="{ classes }">
      <PurePanel
        type="primary"
        shape="square"
        :items="items"
        trigger="hover"
        :open="true"
        content="back"
        :classes="classes"
      />
    </template>
  </SemanticPreview>
</template>
