<docs lang="zh-CN">
自定义 icon。
</docs>

<docs lang="en-US">
Custom icon.
</docs>

<script lang="ts" setup>
import { SmileOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-result
    title="Great, we have done all the operations!"
  >
    <template #extra>
      <a-button type="primary">
        Next
      </a-button>
    </template>
    <template #icon>
      <SmileOutlined />
    </template>
  </a-result>
</template>
