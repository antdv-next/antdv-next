<docs lang="zh-CN">
聚焦额外配置属性。
</docs>

<docs lang="en-US">
Focus with additional option.
</docs>

<script setup lang="ts">
  import { ref, useTemplateRef } from 'vue'

  const value = ref(999)
  const inputRef = useTemplateRef('input')
  function handleFocus(options: unknown) {
    inputRef.value?.focus(options)
  }
</script>

<template>
  <a-space vertical style="width: 100%;">
    <a-space wrap>
      <a-button @click="() => handleFocus({ cursor: 'start' })">Focus at first</a-button>
      <a-button @click="() => handleFocus({ cursor: 'end' })">Focus at last</a-button>
      <a-button @click="() => handleFocus({ cursor: 'all' })">Focus to select all</a-button>
      <a-button @click="() => handleFocus({ preventScroll: true })">Focus prevent scroll</a-button>
    </a-space>
    <a-input-number v-model:value="value" ref="input" style="width: 100%;" />
  </a-space>
</template>
