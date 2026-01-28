<docs lang="zh-CN">
自定义各个面板的背景色、圆角、边距和图标。
</docs>

<docs lang="en-US">
Customize the background, border, margin styles and icon for each panel.
</docs>

<script setup lang="ts">
import type { CollapseProps } from 'antdv-next'
import type { CSSProperties } from 'vue'
import { CaretRightOutlined } from '@antdv-next/icons'
import { theme } from 'antdv-next'
import { computed, h } from 'vue'

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`

const { token } = theme.useToken()

const panelStyle = computed<CSSProperties>(() => ({
  marginBottom: '24px',
  background: token.colorFillAlter,
  borderRadius: token.borderRadiusLG,
  border: 'none',
}))

const items = computed(() => [
  {
    key: '1',
    label: 'This is panel header 1',
    content: h('p', text),
    style: panelStyle.value,
  },
  {
    key: '2',
    label: 'This is panel header 2',
    content: h('p', text),
    style: panelStyle.value,
  },
  {
    key: '3',
    label: 'This is panel header 3',
    content: h('p', text),
    style: panelStyle.value,
  },
])

const expandIcon: CollapseProps['expandIcon'] = (panelProps) => {
  return h(CaretRightOutlined, { rotate: panelProps.isActive ? 90 : 0 })
}
</script>

<template>
  <a-collapse
    :items="items"
    :bordered="false"
    :default-active-key="['1']"
    :expand-icon="expandIcon"
    :style="{ background: token.colorBgContainer }"
  />
</template>
