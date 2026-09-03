<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Menu 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Menu by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { MenuItemType, MenuProps } from 'antdv-next'
import { useCssModule } from 'vue'

const moduleStyles = useCssModule()

const items: MenuItemType[] = [
  {
    key: 'SubMenu',
    label: 'Navigation One',
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
  { key: 'mail', label: 'Navigation Two' },
]

const classes: MenuProps['classes'] = {
  root: moduleStyles.root,
  item: moduleStyles.item,
}

const styles: MenuProps['styles'] = {
  root: { border: '1px solid #f0f0f0', padding: '8px', borderRadius: '4px' },
  item: { color: '#1677ff' },
  subMenu: { list: { color: '#fa541c' } },
}

const stylesFn: MenuProps['styles'] = (info) => {
  const hasSub = info.props.items?.[0]
  return {
    root: {
      backgroundColor: hasSub ? 'rgba(240,249,255, 0.6)' : '#fff',
    },
  }
}
</script>

<template>
  <a-flex vertical gap="medium">
    <a-menu :classes="classes" :items="items" :styles="styles" />
    <a-menu mode="inline" :classes="classes" :items="items" :styles="stylesFn" />
  </a-flex>
</template>

<style module>
.root {
  border: 1px solid #f0f0f0;
  max-width: 600px;
  padding: 8px;
  border-radius: 4px;
}

.item {
  color: #1677ff;
}
</style>
