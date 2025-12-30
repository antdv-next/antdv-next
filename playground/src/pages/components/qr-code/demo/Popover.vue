<script setup lang="ts">
  defineOptions({ name: 'Popover' })
</script>

<template>
  <a-popover>
    <template #content>
      <a-qrcode value="https://ant.design" :bordered="false" />
    </template>
    <a-button type="primary">Hover me</a-button>
  </a-popover>
</template>

<style scoped></style>
