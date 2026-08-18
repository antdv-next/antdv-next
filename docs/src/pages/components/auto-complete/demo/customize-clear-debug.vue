<docs lang="zh-CN">
自定义输入组件配合 `allowClear` 时的悬浮态 Debug。
</docs>

<docs lang="en-US">
Custom input with `allowClear` on hover debug.
</docs>

<script setup lang="ts">
const options = [{ value: 'Burnaby' }, { value: 'Seattle' }, { value: 'Los Angeles' }]
</script>

<template>
  <a-flex vertical :gap="24" style="width: 300px">
    <a-auto-complete allow-clear default-value="Burnaby" :options="options">
      <a-input />
    </a-auto-complete>
    <a-auto-complete allow-clear default-value="Burnaby" :options="options">
      <a-textarea />
    </a-auto-complete>
  </a-flex>
</template>
