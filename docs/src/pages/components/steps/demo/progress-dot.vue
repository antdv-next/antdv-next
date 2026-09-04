<docs lang="zh-CN">
包含步骤点的进度条。
</docs>

<docs lang="en-US">
Steps with progress dot style.
</docs>

<script setup lang="ts">
const items = [
  {
    title: 'Finished',
    content: 'This is a content.',
  },
  {
    title: 'In Progress',
    content: 'This is a content.',
  },
  {
    title: 'Waiting',
    content: 'This is a content.',
  },
]
</script>

<template>
  <a-flex vertical gap="medium">
    <a-steps
      type="dot"
      :current="1"
      :items="items"
    />
    <a-steps
      type="dot"
      :current="1"
      :items="items"
      variant="outlined"
    />
    <a-divider />
    <a-flex gap="medium">
      <a-steps
        type="dot"
        orientation="vertical"
        :current="1"
        :style="{ flex: 'auto' }"
        :items="items"
      />
      <a-steps
        type="dot"
        orientation="vertical"
        :current="1"
        :style="{ flex: 'auto' }"
        :items="items"
        variant="outlined"
      />
    </a-flex>
  </a-flex>
</template>
