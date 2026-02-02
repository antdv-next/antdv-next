<script setup lang="ts">
import { DownOutlined, FrownFilled, FrownOutlined, MehOutlined, SmileOutlined } from '@antdv-next/icons'
import { computed, h } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: '根元素，设置树形控件的基础样式、布局和容器控制',
    item: '条目元素，设置树节点的基础样式、拖拽状态、角色属性、缩进、切换器、内容包装器等节点结构',
    itemTitle: '标题元素，设置树节点标题文字的显示样式和文本内容',
    itemIcon: '图标元素，设置树节点图标的样式、尺寸和状态显示',
  },
  en: {
    root: 'Root element with tree control base styles, layout and container control',
    item: 'Item element with tree node base styles, drag state, role attributes, indentation, switcher, content wrapper and other node structure',
    itemTitle: 'Title element with tree node title text display styles and text content',
    itemIcon: 'Icon element with tree node icon styles, size and state display',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root, version: '1.0.0' },
  { name: 'item', desc: locale.value.item, version: '1.0.0' },
  { name: 'itemIcon', desc: locale.value.itemIcon, version: '1.0.0' },
  { name: 'itemTitle', desc: locale.value.itemTitle, version: '1.0.0' },
])

const treeData = [
  {
    title: 'parent 1',
    key: '0-0',
    icon: h(SmileOutlined),
    children: [
      { title: 'leaf', key: '0-0-0', icon: h(MehOutlined) },
      { title: 'leaf', key: '0-0-1', icon: ({ selected }: { selected: boolean }) => selected ? h(FrownFilled) : h(FrownOutlined) },
    ],
  },
]
</script>

<template>
  <SemanticPreview
    component-name="Tree"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-tree
        show-icon
        default-expand-all
        :default-selected-keys="['0-0-0']"
        :tree-data="treeData"
        :classes="classes"
      >
        <template #switcherIcon>
          <DownOutlined />
        </template>
      </a-tree>
    </template>
  </SemanticPreview>
</template>
