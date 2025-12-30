<script setup lang="ts">
const value = 'https://www.antdv-next.com'
</script>

<template>
  <a-flex gap="middle" wrap>
    <a-qrcode :value="value" status="loading" />
    <a-qrcode :value="value" status="expired" @refresh="() => console.log('refresh')" />
    <a-qrcode :value="value" status="scanned" />
  </a-flex>
</template>
