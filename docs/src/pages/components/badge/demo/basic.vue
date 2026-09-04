<docs lang="zh-CN">
简单的徽章展示，当 `count` 为 `0` 时，默认不显示，但是可以使用 `showZero` 修改为显示。
</docs>

<docs lang="en-US">
Simplest Usage. Badge will be hidden when `count` is `0`, but we can use `showZero` to show it.
</docs>

<script setup lang="ts">
import { ClockCircleOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-space size="medium">
    <a-badge :count="5">
      <a-avatar shape="square" size="large" />
    </a-badge>
    <a-badge :count="0" show-zero>
      <a-avatar shape="square" size="large" />
    </a-badge>
    <a-badge>
      <template #count>
        <ClockCircleOutlined style="color: #f5222d" />
      </template>
      <a-avatar shape="square" size="large" />
    </a-badge>
  </a-space>
</template>
