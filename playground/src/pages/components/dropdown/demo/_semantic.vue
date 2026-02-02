<script setup lang="ts">
import { DeleteOutlined, DownOutlined, EditOutlined, SaveOutlined } from '@antdv-next/icons'
import { computed, h, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    root: 'dropdown 的根元素，设置定位、层级和容器样式',
    itemTitle: 'dropdown 选项的标题内容区域，设置布局和文字样式',
    item: 'dropdown 的单个选项元素，设置选项的交互状态和背景样式',
    itemContent: 'dropdown 选项的主要内容区域，设置内容布局和链接样式',
    itemIcon: 'dropdown 选项的图标区域，设置图标的尺寸和间距样式',
  },
  en: {
    root: 'Root element of dropdown, sets positioning, z-index and container styles',
    itemTitle: 'Title content area of dropdown option, sets layout and text styles',
    item: 'Individual dropdown option element, sets interaction states and background styles',
    itemContent: 'Main content area of dropdown option, sets content layout and link styles',
    itemIcon: 'Icon area of dropdown option, sets icon size and spacing styles',
  },
}

const locale = useSemanticLocale(locales)

const semantics = computed(() => [
  { name: 'root', desc: locale.value.root },
  { name: 'itemTitle', desc: locale.value.itemTitle },
  { name: 'item', desc: locale.value.item },
  { name: 'itemContent', desc: locale.value.itemContent },
  { name: 'itemIcon', desc: locale.value.itemIcon },
])

const divRef = ref<HTMLDivElement | null>(null)

const items: any[] = [
  {
    key: '1',
    type: 'group',
    label: 'Group title',
    children: [
      { key: '1-1', label: '1st menu item', icon: h(SaveOutlined) },
      { key: '1-2', label: '2nd menu item', icon: h(EditOutlined) },
    ],
  },
  {
    key: 'SubMenu',
    label: 'SubMenu',
    children: [
      {
        key: 'g1',
        label: 'Item 1',
        type: 'group',
        children: [
          { key: '1', label: 'Option 1' },
          { key: '2', label: 'Option 2' },
        ],
      },
    ],
  },
  { key: '3', type: 'divider' },
  { key: '4', label: 'Delete', icon: h(DeleteOutlined), danger: true },
]
</script>

<template>
  <SemanticPreview
    component-name="Dropdown"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <div ref="divRef" :style="{ height: '120px', position: 'absolute', top: '50px' }">
        <a-dropdown
          open
          :menu="{ items }"
          :styles="{ root: { width: '200px', zIndex: 1 } }"
          :get-popup-container="() => divRef!"
          :classes="classes"
        >
          <a @click.prevent>
            <a-space>
              Hover me
              <DownOutlined />
            </a-space>
          </a>
        </a-dropdown>
      </div>
    </template>
  </SemanticPreview>
</template>
