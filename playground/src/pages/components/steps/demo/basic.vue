<docs lang="zh-CN">
简单的步骤条，使用 `variant` 属性来设置不同的样式，使用 `size` 控制大小。
</docs>

<docs lang="en-US">
The most basic step bar. Use the `variant` property to set different styles and `size` to control the size.
</docs>

<script lang="ts" setup>
const content = 'This is a content.'
const items = [
  {
    title: 'Finished',
    content,
  },
  {
    title: 'In Progress',
    content,
    subTitle: 'Left 00:00:08',
  },
  {
    title: 'Waiting',
    content,
  },
]
</script>

<template>
  <a-flex vertical gap="large">
    <a-steps :current="1" :items="items" />
    <a-steps :current="1" :items="items" variant="outlined" />
    <a-steps :current="1" :items="items" size="small" />
    <a-steps :current="1" :items="items" size="small" variant="outlined" />
  </a-flex>
</template>
