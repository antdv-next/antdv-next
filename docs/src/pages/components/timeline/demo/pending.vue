<docs lang="zh-CN">
节点支持 `loading` 属性表示加载，`reverse` 属性用于控制节点排序。
</docs>

<docs lang="en-US">
Node supports `loading` to indicate loading, and `reverse` property to control the order of nodes.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const reverse = ref(false)

function handleClick() {
  reverse.value = !reverse.value
}

const items = [
  {
    content: 'Create a services site 2015-09-01',
  },
  {
    content: 'Solve initial network problems 2015-09-01',
  },
  {
    content: 'Technical testing 2015-09-01',
  },
  {
    loading: true,
    content: 'Recording...',
  },
]
</script>

<template>
  <a-flex vertical gap="medium" align="flex-start">
    <a-timeline :reverse="reverse" :items="items" />
    <a-button type="primary" @click="handleClick">
      Toggle Reverse
    </a-button>
  </a-flex>
</template>
