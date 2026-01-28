<docs lang="zh-CN">
用于表示状态的小圆点。
</docs>

<docs lang="en-US">
Standalone badge with status.
</docs>

<script setup lang="ts">
</script>

<template>
  <a-space>
    <a-badge status="success" />
    <a-badge status="error" />
    <a-badge status="default" />
    <a-badge status="processing" />
    <a-badge status="warning" />
  </a-space>
  <br>
  <a-space vertical>
    <a-badge status="success" text="Success" />
    <a-badge status="error" text="Error" />
    <a-badge status="default" text="Default" />
    <a-badge status="processing" text="Processing" />
    <a-badge status="warning" text="Warning" />
  </a-space>
</template>
