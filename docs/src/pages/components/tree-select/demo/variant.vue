<docs lang="zh-CN">
TreeSelect 形态变体，可选 `outlined` `filled` `borderless` `underlined` 四种形态。
</docs>

<docs lang="en-US">
Variants of TreeSelect, there are four variants: `outlined` `filled` `borderless` and `underlined`.
</docs>

<script setup lang="ts">
const style = {
  width: '100%',
  maxWidth: '100%',
}
</script>

<template>
  <a-flex vertical gap="medium">
    <a-tree-select :style="style" placeholder="Please select" variant="borderless" />
    <a-tree-select :style="style" placeholder="Please select" variant="filled" />
    <a-tree-select :style="style" placeholder="Please select" variant="outlined" />
    <a-tree-select :style="style" placeholder="Please select" variant="underlined" />
  </a-flex>
</template>
