<docs lang="zh-CN">
启用鼠标滚轮控制。
</docs>

<docs lang="en-US">
Control with mouse wheel.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

function onChange(value: number) {
  console.log('changed', value)
}
const value = ref(3)
</script>

<template>
  <a-input-number
    v-model:value="value" :min="1" :max="10" change-on-wheel @change="onChange"
  />
</template>
