<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Segmented 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Segmented by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { SegmentedProps } from 'antdv-next'
import { CloudOutlined, RocketOutlined, ThunderboltOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const classes: SegmentedProps['classes'] = {
  root: 'custom-segmented-root',
}
const styleFn: SegmentedProps['styles'] = (info) => {
  if (info.props.vertical) {
    return {
      root: {
        border: '1px solid #77BEF0',
        padding: '4px',
        width: '100px',
      },
      icon: {
        color: '#77BEF0',
      },
      item: {
        textAlign: 'start',
      },
    } satisfies SegmentedProps['styles']
  }
  return {}
}

const styles: SegmentedProps['styles'] = {
  root: {
    padding: '4px',
    width: '260px',
  },
}

const options: SegmentedProps['options'] = [
  {
    label: 'Boost',
    value: 'boost',
    icon: h(RocketOutlined),
  },
  {
    label: 'Stream',
    value: 'stream',
    icon: h(ThunderboltOutlined),
  },
  {
    label: 'Cloud',
    value: 'cloud',
    icon: h(CloudOutlined),
  },
]
const segmentedSharedProps: SegmentedProps = {
  options,
  classes,
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-segmented v-bind="segmentedSharedProps" :styles="styles" />
    <a-segmented v-bind="segmentedSharedProps" :styles="styleFn" vertical />
  </a-flex>
</template>

<style scoped>
.custom-segmented-root {
  padding: 2px;
}
</style>
