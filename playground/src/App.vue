<script setup lang="ts">
import { useCopyCode } from '@/components/code-demo/copy-code'
import BaseConfig from './layouts/base/index.vue'

useCopyCode()
</script>

<template>
  <BaseConfig>
    <router-view />
  </BaseConfig>
</template>

<style>
#app {
  width: 100%;
  height: 100%;
}
</style>
