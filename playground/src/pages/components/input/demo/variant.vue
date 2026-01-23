<docs lang="zh-CN">
Input 形态变体，可选 `outlined` `filled` `borderless` `underlined` 四种形态。
</docs>

<docs lang="en-US">
Variants of Input, there are four variants: `outlined` `filled` `borderless` and `underlined`.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref()
</script>

<template>
  <a-flex vertical :gap="12">
    <a-input v-model:value="value" placeholder="Outlined" />
    <a-input v-model:value="value" placeholder="Filled" variant="filled" />
    <a-input v-model:value="value" placeholder="Borderless" variant="borderless" />
    <a-input v-model:value="value" placeholder="Underlined" variant="underlined" />
    <a-input-search v-model:value="value" placeholder="Filled" variant="filled" />
  </a-flex>
</template>
