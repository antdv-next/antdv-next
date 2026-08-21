<docs lang="zh-CN">
有图标的标签。
</docs>

<docs lang="en-US">
The Tab with Icon.
</docs>

<script setup lang="ts">
import type { TabsProps } from 'antdv-next'
import { AndroidOutlined, AppleOutlined } from '@antdv-next/icons'
import { h } from 'vue'

// Icons from third-party libraries (e.g. lucide) render as a bare `<svg>`
// rather than an `.anticon` wrapper. It stays vertically centred with the label.
function HeartIcon() {
  return h(
    'svg',
    {
      'viewBox': '0 0 24 24',
      'width': '1em',
      'height': '1em',
      'fill': 'currentColor',
      'aria-hidden': 'true',
    },
    [
      h('path', {
        d: 'M12 20.7l-1.4-1.3C5.4 14.8 2 11.7 2 8a5 5 0 0 1 10-1.7A5 5 0 0 1 22 8c0 3.7-3.4 6.8-8.6 11.4L12 20.7z',
      }),
    ],
  )
}

const icons = [AppleOutlined, AndroidOutlined, HeartIcon]

const items: TabsProps['items'] = icons.map((Icon, i) => {
  const id = String(i + 1)
  return {
    key: id,
    label: `Tab ${id}`,
    content: `Tab ${id}`,
    icon: () => h(Icon),
  }
})
</script>

<template>
  <a-tabs default-active-key="2" :items="items" />
</template>
