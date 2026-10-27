<script setup lang="ts">
import { ConfigProvider } from 'antdv-next'

const { componentSize, componentDisabled } = ConfigProvider.useConfig()
</script>

<template>
  <a-form-item label="componentSize value">
    <a-input :value="componentSize" />
  </a-form-item>
  <a-form-item label="componentDisabled value">
    <a-input :value="String(componentDisabled)" :disabled="componentDisabled" />
  </a-form-item>
</template>
