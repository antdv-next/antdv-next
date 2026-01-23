<docs lang="zh-CN">
基本使用。
</docs>

<docs lang="en-US">
Basic usage example.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <a-input v-model:value="value" placeholder="Basic usage" />
</template>
