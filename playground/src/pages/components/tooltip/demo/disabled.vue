<docs lang="zh-CN">
通过设置 `:title="null"` 或者 `title=""` 可以禁用 Tooltip。
</docs>

<docs lang="en-US">
The Tooltip can be disabled by setting `:title="null"` or `title=""`.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const disabled = ref(true)

function toggleDisabled() {
  disabled.value = !disabled.value
}
</script>

<template>
  <a-tooltip :title="disabled ? null : 'prompt text'">
    <a-button @click="toggleDisabled">
      {{ disabled ? 'Enable' : 'Disable' }}
    </a-button>
  </a-tooltip>
</template>
