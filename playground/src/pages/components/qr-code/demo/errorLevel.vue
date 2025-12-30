<script setup lang="ts">
  import type { QRCodeProps } from 'antdv-next'
  import { ref } from 'vue'

  const level = ref<QRCodeProps['errorLevel']>('M')
</script>

<template>
  <a-qrcode style="margin-bottom: 16px;" :error-level="level" value="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
  <a-segmented :options="['L', 'M', 'Q', 'H']" v-model:value="level" />
</template>

<style scoped></style>
