<docs lang="zh-CN">
禁用自定义输入组件 Debug。
</docs>

<docs lang="en-US">
Disabled custom input debug.
</docs>

<script setup lang="ts">
</script>

<template>
  <a-flex :gap="12" wrap>
    <a-input disabled placeholder="Regular Input" />
    <a-auto-complete disabled>
      <a-textarea disabled />
    </a-auto-complete>
    <a-select disabled :options="[]" />
  </a-flex>
</template>
