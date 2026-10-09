<docs lang="zh-CN">
当 Slider 的值发生改变时，会触发 `onChange` 事件，并把改变后的值作为参数传入。在 `mouseup` 或者 `keyup` 时，会触发 `onChangeComplete` 事件，并把当前值作为参数传入。
</docs>

<docs lang="en-US">
The `onChange` callback function will fire when the user changes the slider's value. The `onChangeComplete` callback function will fire when `mouseup` or `keyup` fired.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref(30)
const valueRange = ref([20, 50])

function onChange(val: number | number[]) {
  console.log('onChange: ', val)
}

function onChangeComplete(val: number | number[]) {
  console.log('onChangeComplete: ', val)
}
</script>

<template>
  <a-slider v-model:value="value" @change="onChange" @change-complete="onChangeComplete" />
  <a-slider
    v-model:value="valueRange"
    range
    :step="10"
    @change="onChange"
    @change-complete="onChangeComplete"
  />
</template>
