<script setup lang="ts">
import { SmileOutlined } from '@antdv-next/icons'
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    'root': '根元素，包含相对定位、行内flex布局、内边距、边框圆角、过渡动画等时间选择器容器的基础样式',
    'prefix': '前缀元素，包含flex布局、右外边距等前缀内容的布局样式',
    'input': '输入框元素，包含相对定位、宽度、颜色、字体、行高、过渡动画等输入框的核心交互样式',
    'suffix': '后缀元素，包含flex布局、颜色、行高、指针事件、过渡动画等后缀内容的样式',
    'popup': '弹出框元素',
    'popup.container': '容器元素，设置背景色、内边距、圆角、阴影、边框和内容展示样式',
    'popup.content': '弹出框内容元素，包含时间列表的宽度、边框、单元格等内容展示样式',
    'popup.item': '弹出框单项元素，包含时间单元格的尺寸、背景色、边框圆角、悬停态、选中态等交互样式',
    'popup.footer': '弹出框底部元素，包含确认取消按钮等底部操作区域的布局样式',
  },
  en: {
    'root': 'Root element with relative positioning, inline-flex layout, padding, border-radius, transition animations and other basic styles for time picker container',
    'prefix': 'Prefix element with flex layout and margin styles for prefix content layout',
    'input': 'Input element with relative positioning, width, color, font, line-height, transition animations and other core interactive styles for input field',
    'suffix': 'Suffix element with flex layout, color, line-height, pointer events, transition animations and other styles for suffix content',
    'popup': 'Popup element',
    'popup.container': 'Container element, set background color, padding, border radius, shadow, border and content display styles',
    'popup.content': 'Popup content element with width, border, cell and other content display styles for time list',
    'popup.item': 'Popup item element with size, background, border-radius, hover state, selected state and other interactive styles for time cells',
    'popup.footer': 'Popup footer element with layout styles for bottom operation area including confirm/cancel buttons',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root },
  { name: 'prefix', desc: locale.value.prefix },
  { name: 'input', desc: locale.value.input },
  { name: 'suffix', desc: locale.value.suffix },
  { name: 'popup.root', desc: locale.value.popup },
  { name: 'popup.container', desc: locale.value['popup.container'] },
  { name: 'popup.content', desc: locale.value['popup.content'] },
  { name: 'popup.item', desc: locale.value['popup.item'] },
  { name: 'popup.footer', desc: locale.value['popup.footer'] },
])

const type = ref<'Single' | 'Multiple'>('Single')
const divRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <SemanticPreview
    :component-name="type === 'Single' ? 'TimePicker' : 'TimePicker.RangePicker'"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-flex ref="divRef" vertical :style="{ alignSelf: 'flex-start' }" gap="middle" align="center">
        <a-segmented
          :options="['Single', 'Multiple']"
          :value="type"
          @change="(val: 'Single' | 'Multiple') => type = val"
        />
        <a-time-picker
          v-if="type === 'Single'"
          :z-index="1"
          open
          :get-popup-container="() => divRef!"
          need-confirm
          :classes="classes"
        >
          <template #prefix>
            <SmileOutlined />
          </template>
        </a-time-picker>
        <a-time-range-picker
          v-else
          :z-index="1"
          open
          :get-popup-container="() => divRef!"
          need-confirm
          :classes="classes"
        >
          <template #prefix>
            <SmileOutlined />
          </template>
        </a-time-range-picker>
      </a-flex>
    </template>
  </SemanticPreview>
</template>
