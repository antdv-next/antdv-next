<docs lang="zh-CN">
使用 `status` 为 Transfer 添加状态，可选 `error` 或者 `warning`。
</docs>

<docs lang="en-US">
Add status to Transfer with `status`, which could be `error` or `warning`.
</docs>

<script setup lang="ts">
const emptyData: any[] = []
</script>

<template>
  <a-flex vertical gap="medium">
    <a-transfer :data-source="emptyData" status="error" />
    <a-transfer :data-source="emptyData" status="warning" show-search />
  </a-flex>
</template>
