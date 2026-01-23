<docs lang="zh-CN">
在输入框上添加前缀或后缀图标。
</docs>

<docs lang="en-US">
Add a prefix or suffix inside input.
</docs>

<script setup lang="ts">
import { UserOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-flex vertical gap="middle">
    <a-input-number prefix="￥" style="width: 100%;" />

    <a-space-compact block>
      <a-space-addon>
        <UserOutlined />
      </a-space-addon>
      <a-input-number prefix="￥" style="width: 100%;" />
    </a-space-compact>

    <a-input-number prefix="￥" disabled style="width: 100%;" />

    <a-input-number suffix="RMB" style="width: 100%;" />
  </a-flex>
</template>
