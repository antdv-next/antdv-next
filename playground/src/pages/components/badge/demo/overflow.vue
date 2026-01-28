<docs lang="zh-CN">
超过 `overflowCount` 的会显示为 `${overflowCount}+`，默认的 `overflowCount` 为 `99`。
</docs>

<docs lang="en-US">
`${overflowCount}+` is displayed when count is larger than `overflowCount`. The default value of `overflowCount` is `99`.
</docs>

<script setup lang="ts">
</script>

<template>
  <a-space size="large">
    <a-badge :count="99">
      <a-avatar shape="square" size="large" />
    </a-badge>
    <a-badge :count="100">
      <a-avatar shape="square" size="large" />
    </a-badge>
    <a-badge :count="99" :overflow-count="10">
      <a-avatar shape="square" size="large" />
    </a-badge>
    <a-badge :count="1000" :overflow-count="999">
      <a-avatar shape="square" size="large" />
    </a-badge>
  </a-space>
</template>
