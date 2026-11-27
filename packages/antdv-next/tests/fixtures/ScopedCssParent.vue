<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  component: Component
  componentProps?: Record<string, any>
}>()
</script>

<template>
  <component :is="component" v-bind="componentProps" class="scoped-target">
    <slot />
  </component>
</template>

<style scoped>
.scoped-target {
  width: 137px;
}
</style>
