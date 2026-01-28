<docs lang="zh-CN">
使用 `open` 属性控制浮层显示。
</docs>

<docs lang="en-US">
Use `open` prop to control the display of the card.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)

function hide() {
  open.value = false
}
</script>

<template>
  <a-popover v-model:open="open" title="Title" trigger="click">
    <template #content>
      <a href="" @click.prevent="hide">Close</a>
    </template>
    <a-button type="primary">
      Click me
    </a-button>
  </a-popover>
</template>
