<docs lang="zh-CN">
点击按钮切换可用状态。
</docs>

<docs lang="en-US">
Click the button to toggle between available and disabled states.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const disabled = ref(true)

function toggle() {
  disabled.value = !disabled.value
}
const value = ref(3)
</script>

<template>
  <div>
    <a-input-number v-model:value="value" :min="1" :max="10" :disabled="disabled" />
    <div style="margin-top: 20px;">
      <a-button type="primary" @click="toggle">
        Toggle disabled
      </a-button>
    </div>
  </div>
</template>
