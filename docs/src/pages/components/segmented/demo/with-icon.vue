<docs lang="zh-CN">
给 Segmented Item 设置 Icon。
</docs>

<docs lang="en-US">
Set icon for Segmented Item.
</docs>

<script setup lang="ts">
import { AppstoreOutlined, BarsOutlined } from '@antdv-next/icons'
import { h } from 'vue'

// Icons from third-party libraries (e.g. lucide) render as a bare `<svg>`
// rather than an `.anticon` wrapper. It stays vertically centred with the label.
function CalendarIcon() {
  return h(
    'svg',
    {
      'viewBox': '0 0 24 24',
      'width': '1em',
      'height': '1em',
      'fill': 'none',
      'stroke': 'currentColor',
      'stroke-width': 2,
      'aria-hidden': 'true',
    },
    [
      h('rect', { x: 3, y: 4, width: 18, height: 18, rx: 2 }),
      h('path', { d: 'M16 2v4M8 2v4M3 10h18' }),
    ],
  )
}

const options = [
  { label: 'List', value: 'List', icon: h(BarsOutlined) },
  { label: 'Kanban', value: 'Kanban', icon: h(AppstoreOutlined) },
  { label: 'Calendar', value: 'Calendar', icon: h(CalendarIcon) },
]

const options2 = [
  { label: 'List', value: 'List' },
  { label: 'Kanban', value: 'Kanban' },
]
</script>

<template>
  <a-segmented :options="options" />
  <br>
  <br>
  <a-segmented :options="options2">
    <template #iconRender="{ value }">
      <template v-if="value === 'List'">
        <BarsOutlined />
      </template>
      <template v-else-if="value === 'Kanban'">
        <AppstoreOutlined />
      </template>
    </template>
  </a-segmented>
</template>
