<docs lang="zh-CN">
传入 `okButtonProps` 和 `cancelButtonProps` 可分别自定义确定按钮和取消按钮的 props。
</docs>

<docs lang="en-US">
Passing `okButtonProps` and `cancelButtonProps` will customize the OK button and cancel button props.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
function showModal() {
  open.value = true
}

function handleOk(e: MouseEvent | KeyboardEvent) {
  console.log(e)
  open.value = false
}

function handleCancel(e: MouseEvent | KeyboardEvent) {
  console.log(e)
  open.value = false
}
</script>

<template>
  <a-button type="primary" @click="showModal">
    Open Modal with customized button props
  </a-button>
  <a-modal
    v-model:open="open"
    title="Basic Modal"
    :ok-button-props="{ disabled: true }"
    :cancel-button-props="{ disabled: true }"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>
</template>
