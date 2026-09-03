<docs lang="zh-CN">
嵌套独立 `Spin` 的调试示例：包裹型 `Spin` 的内容里再放独立 `Spin`，内层不应被外层的居中定位样式影响。
</docs>

<docs lang="en-US">
Debug example for standalone Spin components nested inside a wrapping Spin. The inner
ones should not pick up the outer overlay's absolute centering styles.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const loading = ref(true)
const dataSource = ['Apple', 'Banana']
</script>

<template>
  <a-flex gap="medium" vertical>
    <a-spin :spinning="loading">
      <a-flex vertical gap="small" :style="{ padding: '16px', border: '1px solid #d9d9d9' }">
        <a-flex v-for="item in dataSource" :key="item" align="center" justify="space-between">
          <span>{{ item }}</span>
          <a-spin size="small" />
        </a-flex>
      </a-flex>
    </a-spin>
    <a-flex align="center" gap="small">
      <span>Outer loading state:</span>
      <a-switch v-model:checked="loading" />
    </a-flex>
  </a-flex>
</template>
