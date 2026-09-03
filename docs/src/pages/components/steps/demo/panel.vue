<docs lang="zh-CN">
面板类型的步骤条。
</docs>

<docs lang="en-US">
Panel style steps.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const current = ref(0)

const items = [
  {
    title: 'Step 1',
    subTitle: '00:00',
    content: 'This is a content.',
  },
  {
    title: 'Step 2',
    content: 'This is a content.',
    status: 'error' as const,
  },
  {
    title: 'Step 3',
    content: 'This is a content.',
  },
]

function handleChange(value: number) {
  console.log('onChange:', value)
  current.value = value
}
</script>

<template>
  <a-flex vertical gap="medium">
    <a-steps
      v-model:current="current"
      type="panel"
      :items="items"
      @change="handleChange"
    />
    <a-steps
      v-model:current="current"
      type="panel"
      size="small"
      variant="outlined"
      :items="items"
      @change="handleChange"
    />
  </a-flex>
</template>
