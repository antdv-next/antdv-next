<docs lang="zh-CN">
用于配置一些固定组合。
</docs>

<docs lang="en-US">
Using pre & post tabs example.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value1 = ref(100)
</script>

<template>
  <a-space vertical>
    <a-input-number v-model:value="value1" addon-before="+" addon-after="$" />
  </a-space>
</template>
