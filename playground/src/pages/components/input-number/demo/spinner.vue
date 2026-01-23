<docs lang="zh-CN">
数字拨轮。
</docs>

<docs lang="en-US">
Digit spinner.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

function onChange(value: number | null) {
  console.log('changed', value)
}

const value1 = ref(3)
const value2 = ref(3)
</script>

<template>
  <a-flex vertical gap="middle">
    <a-input-number
      v-model:value="value1"
      mode="spinner"
      :min="1"
      :max="10"
      placeholder="Outlined"
      style="width: 150px;"
      @change="onChange"
    />
    <a-input-number
      v-model:value="value2"
      mode="spinner"
      variant="filled"
      :min="1"
      :max="10"
      placeholder="Filled"
      style="width: 150px;"
      @change="onChange"
    />
  </a-flex>
</template>
