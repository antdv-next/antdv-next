<script setup lang="ts">
import { JavaScriptOutlined } from '@antdv-next/icons'
import { version } from 'antdv-next'
</script>

<template>
  <main>
    <header class="header">
      antdv next version {{ version }}
      <JavaScriptOutlined />
    </header>
  </main>
</template>

<style scoped>
.header {
  text-align: center;
}
</style>
