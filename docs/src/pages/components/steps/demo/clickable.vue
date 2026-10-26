<docs lang="zh-CN">
绑定 `v-model:current` 后，Steps 变为可点击状态。
</docs>

<docs lang="en-US">
Binding `v-model:current` makes Steps clickable.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const content = 'This is a content.'

const items = [
  {
    title: 'Step 1',
    content,
  },
  {
    title: 'Step 2',
    content,
  },
  {
    title: 'Step 3',
    content,
  },
]
const current = ref(0)
</script>

<template>
  <a-steps v-model:current="current" :items="items" />
  <a-divider />
  <a-steps v-model:current="current" :items="items" orientation="vertical" />
</template>
