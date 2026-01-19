<docs lang="zh-CN">
我们添加了多种预设色彩的标签样式，用作不同场景使用。如果预设值不能满足你的需求，可以设置为具体的色值。
</docs>

<docs lang="en-US">
We preset a series of colorful tag styles for use in different situations. You can also set it to a hex color string for custom color.
</docs>

<script setup lang="ts">
  const variants = ['filled', 'solid', 'outlined'] as const;
  const presets = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
  ];
  const customs = ['#f50', '#2db7f5', '#87d068', '#108ee9'];
</script>

<template>
  <div v-for="variant in variants" :key="variant">
    <a-divider title-placement="start">Presets {{ variant }}</a-divider>
    <a-flex gap="small" align="center" wrap>
      <template v-for="color in presets" :key="color">
        <a-tag :variant="variant" :color="color">{{ color }}</a-tag>
      </template>
    </a-flex>
  </div>
  <div v-for="variant in variants" :key="variant">
    <a-divider title-placement="start">Custom {{ variant }}</a-divider>
    <a-flex gap="small" align="center" wrap>
      <template v-for="color in customs" :key="color">
        <a-tag :variant="variant" :color="color">{{ color }}</a-tag>
      </template>
    </a-flex>
  </div>
</template>
