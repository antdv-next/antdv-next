<docs lang="zh-CN">
可以设置有数字徽标的大小。
</docs>

<docs lang="en-US">
Set size of numeral Badge.
</docs>

<script setup lang="ts">
</script>

<template>
  <a-space size="middle">
    <a-badge size="medium" :count="5">
      <a-avatar shape="square" size="large" />
    </a-badge>
    <a-badge size="small" :count="5">
      <a-avatar shape="square" size="large" />
    </a-badge>
  </a-space>
</template>
