<docs lang="zh-CN">
展示字数提示。
</docs>

<docs lang="en-US">
Show character counting.
</docs>

<script setup lang="ts">
function onChange(e: Event) {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement
  console.log('Change:', target.value)
}
</script>

<template>
  <a-flex vertical :gap="32">
    <a-input show-count :maxlength="20" @change="onChange" />
    <a-textarea show-count :maxlength="100" placeholder="can resize" @change="onChange" />
    <a-textarea
      show-count
      :max-length="100"
      placeholder="disable resize"
      style="height: 120px; resize: none;"
      @change="onChange"
    />
  </a-flex>
</template>
