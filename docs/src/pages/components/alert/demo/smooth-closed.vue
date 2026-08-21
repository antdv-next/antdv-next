<docs lang="zh-CN">
平滑、自然的卸载提示。
</docs>

<docs lang="en-US">
Smoothly unmount Alert upon close.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const visible = ref(true)

function handleAfterClose() {
  visible.value = false
}
</script>

<template>
  <a-alert
    v-if="visible"
    title="Alert Message Text"
    type="success"
    closable
    :after-close="handleAfterClose"
  />
  <p>click the close button to see the effect</p>
  <a-switch v-model:checked="visible" aria-label="Alert visibility" :disabled="visible" />
</template>
