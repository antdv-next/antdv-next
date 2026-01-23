<docs lang="zh-CN">
数字输入框。
</docs>

<docs lang="en-US">
Numeric-only input box.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(3)
</script>

<template>
  <a-input-number v-model:value="value" :min="1" :max="10" />
</template>
