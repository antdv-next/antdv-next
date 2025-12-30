<script setup lang="ts">
import { ref } from 'vue'

const text = ref('https://www.antdv-next.com')
</script>

<template>
  <a-space direction="vertical" align="center">
    <a-qrcode :value="text || '-'" />
    <input v-model="text" placeholder="-" maxlength="60">
  </a-space>
</template>
