<docs lang="zh-CN">
可以扩展 `controls` 属性用以设置自定义图标。
</docs>

<docs lang="en-US">
When you need to use a custom `Icon`, you can set the `Icon` component as the property value of `upIcon` and `downIcon`.
</docs>

<script setup lang="ts">
import { ArrowDownOutlined, ArrowUpOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-input-number>
    <template #upIcon>
      <ArrowUpOutlined />
    </template>
    <template #downIcon>
      <ArrowDownOutlined />
    </template>
  </a-input-number>
</template>
