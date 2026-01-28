<docs lang="zh-CN">
我们添加了多种预设色彩的徽标样式，用作不同场景使用。如果预设值不能满足你的需求，可以设置为具体的色值。
</docs>

<docs lang="en-US">
We preset a series of colorful Badge styles for use in different situations. You can also set it to a hex color string for custom color.
</docs>

<script setup lang="ts">
const colors = [
  'pink',
  'red',
  'yellow',
  'orange',
  'cyan',
  'green',
  'blue',
  'purple',
  'geekblue',
  'magenta',
  'volcano',
  'gold',
  'lime',
]
</script>

<template>
  <a-divider orientation="left">
    Presets
  </a-divider>
  <a-space vertical>
    <a-badge v-for="color in colors" :key="color" :color="color" :text="color" />
  </a-space>
  <a-divider orientation="left">
    Custom
  </a-divider>
  <a-space vertical>
    <a-badge color="#f50" text="#f50" />
    <a-badge color="rgb(45, 183, 245)" text="rgb(45, 183, 245)" />
    <a-badge color="hsl(102, 53%, 61%)" text="hsl(102, 53%, 61%)" />
    <a-badge color="hwb(205 6% 9%)" text="hwb(205 6% 9%)" />
  </a-space>
</template>
