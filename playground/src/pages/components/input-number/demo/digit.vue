<docs lang="zh-CN">
通过 `stringMode` 开启高精度小数支持，`onChange` 事件将返回 string 类型。对于旧版浏览器，你需要 BigInt polyfill。
</docs>

<docs lang="en-US">
Use `stringMode` to support high precision decimals support. `onChange` will return string value instead. You need polyfill of BigInt if browser not support.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

function onChange(value: string) {
  console.log('changed', value)
}
const value = ref(1)
</script>

<template>
  <a-input-number
    v-model:value="value"
    style="width: 200px;"
    min="0"
    max="10"
    step="0.00000000000001"
    string-mode
    @change="onChange"
  />
</template>
