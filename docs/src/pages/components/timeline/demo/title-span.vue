<docs lang="zh-CN">
使用 `titleSpan` 设置标题占比空间。
</docs>

<docs lang="en-US">
Use `titleSpan` to set the title span space.
</docs>

<script lang="ts" setup>
const items = [
  { title: '05:10', content: 'Create a services' },
  { title: '09:03', content: 'Solve initial network problems' },
  { content: 'Technical testing' },
  { title: '11:28', content: 'Network problems being solved' },
]
</script>

<template>
  <a-flex vertical gap="medium">
    <a-typography-title :level="5" :style="{ margin: 0 }">
      titleSpan = 100px
    </a-typography-title>
    <a-timeline :items="items" title-span="100px" />
    <a-typography-title :level="5" :style="{ margin: 0 }">
      titleSpan = 25%
    </a-typography-title>
    <a-timeline :items="items" title-span="25%" />
    <a-typography-title :level="5" :style="{ margin: 0 }">
      titleSpan = 18, mode = end
    </a-typography-title>
    <a-timeline :items="items" :title-span="18" mode="end" />
  </a-flex>
</template>
