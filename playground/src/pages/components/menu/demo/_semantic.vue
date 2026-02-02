<script setup lang="ts">
import { MailOutlined } from '@antdv-next/icons'
import { computed, h, ref } from 'vue'
import { SemanticPreview } from '@/components/semantic'
import { useSemanticLocale } from '@/composables/use-locale'

const locales = {
  cn: {
    'root': '根元素，包含菜单容器的基础样式和布局',
    'item': '条目元素，包含相对定位、块级显示、外边距、空白符处理、光标样式、过渡动画等菜单项的基础交互样式',
    'itemContent': '条目内容元素，包含菜单项内容的布局和排版样式',
    'itemIcon': '图标元素，包含最小宽度、字体大小、过渡动画、图标重置样式，以及与文本的间距控制',
    'itemTitle': '菜单标题元素(horizontal 模式不生效)，包含标题文字的样式和布局',
    'list': '菜单列表元素(horizontal 模式不生效)，包含菜单列表的布局和容器样式',
    'popup': '弹出菜单(inline 模式不生效)，包含弹出层的定位、层级、背景等样式',
    'subMenu.itemTitle': '子菜单标题元素，包含子菜单标题的样式和交互效果',
    'subMenu.list': '子菜单列表元素，包含子菜单列表的布局和容器样式',
    'subMenu.item': '子菜单单项元素，包含子菜单项的样式和交互效果',
    'subMenu.itemIcon': '子菜单条目图标元素，包含子菜单图标的尺寸和样式',
    'subMenu.itemContent': '子菜单条目内容元素，包含子菜单内容的布局和排版',
  },
  en: {
    'root': 'Root element with basic menu container styles and layout',
    'item': 'Item element with relative positioning, block display, margins, whitespace handling, cursor styles, transitions and other basic interactive styles for menu items',
    'itemContent': 'Item content element with layout and typography styles for menu item content',
    'itemIcon': 'Icon element with min-width, font-size, transitions, icon reset styles, and spacing control with text',
    'itemTitle': 'Item title element (no effect in horizontal mode) with title text styles and layout',
    'list': 'Menu list element (no effect in horizontal mode) with menu list layout and container styles',
    'popup': 'Popup menu element (no effect in inline mode) with popup layer positioning, z-index, background and other styles',
    'subMenu.itemTitle': 'Submenu title element with submenu title styles and interactive effects',
    'subMenu.list': 'Submenu list element with submenu list layout and container styles',
    'subMenu.item': 'Submenu item element with submenu item styles and interactive effects',
    'subMenu.itemIcon': 'Submenu item icon element with submenu icon size and styles',
    'subMenu.itemContent': 'Submenu item content element with submenu content layout and typography',
  },
}

const locale = useSemanticLocale(locales)

const mode = ref<'horizontal' | 'vertical' | 'inline'>('horizontal')
const current = ref('mail')
const divRef = ref<HTMLDivElement | null>(null)

const semantics = computed(() => {
  const baseLocale = [
    { name: 'root', desc: locale.value.root },
    { name: 'item', desc: locale.value.item },
    { name: 'itemIcon', desc: locale.value.itemIcon },
    { name: 'itemContent', desc: locale.value.itemContent },
  ]
  const subMenuLocale = [
    { name: 'subMenu.itemTitle', desc: locale.value['subMenu.itemTitle'] },
    { name: 'subMenu.list', desc: locale.value['subMenu.list'] },
    { name: 'subMenu.item', desc: locale.value['subMenu.item'] },
    { name: 'subMenu.itemIcon', desc: locale.value['subMenu.itemIcon'] },
    { name: 'subMenu.itemContent', desc: locale.value['subMenu.itemContent'] },
  ]
  const groupLocale = [
    { name: 'itemTitle', desc: locale.value.itemTitle },
    { name: 'list', desc: locale.value.list },
  ]

  const additionalPopupLocale = mode.value !== 'inline' ? [{ name: 'popup', desc: locale.value.popup }] : []
  const additionalGroupLocale = mode.value !== 'horizontal' ? groupLocale : []

  return [...baseLocale, ...additionalGroupLocale, ...additionalPopupLocale, ...subMenuLocale]
})

const items = [
  { label: 'Navigation One', key: 'mail', icon: h(MailOutlined) },
  {
    key: 'SubMenu',
    label: 'Navigation One',
    icon: h(MailOutlined),
    children: [
      {
        key: 'g1',
        label: 'Item 1',
        type: 'group',
        children: [
          { key: '1', label: 'Option 1', icon: h(MailOutlined) },
          { key: '2', label: 'Option 2' },
        ],
      },
    ],
  },
]

const groupItem = [
  {
    key: 'grp',
    label: 'Group',
    type: 'group',
    children: [
      { key: '13', label: 'Option 13' },
      { key: '14', label: 'Option 14' },
    ],
  },
]

const itemList = computed(() => {
  return mode.value === 'horizontal' ? items : [...items, ...groupItem]
})

function onClick(e: { key: string }) {
  current.value = e.key
}
</script>

<template>
  <SemanticPreview
    component-name="Menu"
    :semantics="semantics"
  >
    <template #default="{ classes }">
      <a-flex ref="divRef" vertical gap="middle" align="center">
        <a-segmented
          :options="['horizontal', 'vertical', 'inline']"
          :value="mode"
          @change="(val: 'horizontal' | 'vertical' | 'inline') => mode = val"
        />
        <div :style="{ height: '360px' }">
          <a-menu
            :selected-keys="[current]"
            :mode="mode"
            :items="itemList"
            :styles="{
              root: { width: mode === 'horizontal' ? '310px' : '230px' },
              popup: { root: { zIndex: 1 } },
            }"
            :open-keys="['SubMenu']"
            :get-popup-container="() => divRef!"
            :classes="classes"
            @click="onClick"
          />
        </div>
      </a-flex>
    </template>
  </SemanticPreview>
</template>
