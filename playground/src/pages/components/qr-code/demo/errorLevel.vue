<docs lang="zh-CN">
通过设置 errorLevel 调整不同的容错等级。
</docs>

<docs lang="en-US">
set Error Level.
</docs>

<script setup lang="ts">
import type { QRCodeProps } from 'antdv-next'
import { ref } from 'vue'

const level = ref<QRCodeProps['errorLevel']>('M')
</script>

<template>
  <a-qrcode style="margin-bottom: 16px;" :error-level="level" value="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
  <a-segmented v-model:value="level" :options="['L', 'M', 'Q', 'H']" />
</template>
