<script setup lang="ts">
import { computed, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const mode = ref<'single' | 'multiple'>('single')

const locales = {
  cn: {
    'root': '根元素，设置树选择器的基础样式、边框、圆角容器样式',
    'prefix': '前缀元素，设置前缀内容的布局和样式',
    'placeholder': '占位符元素，包含占位符文本的字体样式和颜色',
    'input': '输入框元素，设置文本输入、搜索、选择值显示等输入框的核心交互样式',
    'suffix': '后缀元素，设置后缀内容、清除按钮、下拉箭头等后缀区域的样式',
    'popup.root': '弹出菜单元素，设置下拉树形选择面板的定位、层级、背景、边框、阴影等弹层样式',
    'popup.item': '弹出菜单条目元素，设置树节点选项的样式、悬停态、选中态等交互状态',
    'popup.itemTitle': '弹出菜单标题元素，设置树节点标题文字的显示样式',
    'content': '多选容器，包含已选项的布局、间距、换行相关样式',
    'item': '多选项元素，包含边框、背景、内边距、外边距样式',
    'itemContent': '多选项内容区域，包含文字的省略样式',
    'itemRemove': '多选项移除按钮，包含字体相关样式',
  },
  en: {
    'root': 'Root element with tree selector base styles, border, border radius container styles',
    'prefix': 'Prefix element with prefix content layout and styles',
    'placeholder': 'Placeholder element with font styles and colors for placeholder text',
    'input': 'Input element with text input, search, selected value display and other input core interaction styles',
    'suffix': 'Suffix element with suffix content, clear button, dropdown arrow and other suffix area styles',
    'popup.root': 'Popup element with dropdown tree selection panel positioning, z-index, background, border, shadow and other popup layer styles',
    'popup.item': 'Popup item element with tree node option styles, hover state, selected state and other interaction states',
    'popup.itemTitle': 'Popup title element with tree node title text display styles',
    'content': 'Multiple selection container with layout, spacing, and wrapping styles for selected items',
    'item': 'Multiple selection item element with border, background, padding, and margin styles',
    'itemContent': 'Multiple selection item content area with text ellipsis styles',
    'itemRemove': 'Multiple selection item remove button with font-related styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => {
  const base = [
    { name: 'root', desc: locale.value.root },
    { name: 'prefix', desc: locale.value.prefix },
    { name: 'placeholder', desc: locale.value.placeholder },
  ]

  if (mode.value === 'multiple') {
    base.push(
      ...[
        { name: 'content', desc: locale.value.content },
        { name: 'item', desc: locale.value.item },
        { name: 'itemContent', desc: locale.value.itemContent },
        { name: 'itemRemove', desc: locale.value.itemRemove },
      ],
    )
  }

  base.push(
    ...[
      { name: 'input', desc: locale.value.input },
      { name: 'suffix', desc: locale.value.suffix },
      { name: 'popup.root', desc: locale.value['popup.root'] },
      { name: 'popup.item', desc: locale.value['popup.item'] },
      { name: 'popup.itemTitle', desc: locale.value['popup.itemTitle'] },
    ],
  )

  return base
})

const treeValue = ref<string[]>([])
console.log(treeValue)
function handleResetValue(newMode: string | number) {
  if (newMode === 'multiple') {
    treeValue.value = ['aojunhao123']
  }
  else {
    treeValue.value = []
  }
}

const divRef = ref<HTMLDivElement | null>(null)

const treeData = [
  {
    value: 'contributors',
    title: 'contributors',
    children: [
      { value: 'aojunhao123', title: 'aojunhao123' },
      { value: 'thinkasany', title: 'thinkasany' },
      { value: 'meet-student', title: 'meet-student' },
    ],
  },
]
</script>

<template>
  <SemanticPreview
    component-name="TreeSelect"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ position: 'absolute', height: '200px' }">
        <div :style="{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }">
          <a-segmented v-model:value="mode" :options="['single', 'multiple']" @change="handleResetValue" />
        </div>

        <a-tree-select
          v-model:value="treeValue"
          prefix="prefix"
          :style="{ width: '300px' }"
          :tree-data="treeData"
          tree-default-expand-all
          :multiple="mode === 'multiple'"
          show-search
          max-tag-count="responsive"
          placeholder="Please select"
          allow-clear
          open
          :get-popup-container="() => divRef!"
          :classes="classes"
        />
      </div>
    </template>
  </SemanticPreview>
</template>
