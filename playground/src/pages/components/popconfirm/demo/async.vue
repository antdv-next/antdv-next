<docs lang="zh-CN">
点击确定后异步关闭气泡确认框，例如提交表单。
</docs>

<docs lang="en-US">
Asynchronously close a popconfirm when a the OK button is pressed. For example, you can use this pattern when you submit a form.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const open = ref(false)
const confirmLoading = ref(false)

function showPopconfirm() {
  open.value = true
}

function handleOk() {
  confirmLoading.value = true
  setTimeout(() => {
    open.value = false
    confirmLoading.value = false
  }, 2000)
}

function handleCancel() {
  console.log('Clicked cancel button')
  open.value = false
}
</script>

<template>
  <a-popconfirm
    title="Title"
    description="Open Popconfirm with async logic"
    :open="open"
    :ok-button-props="{ loading: confirmLoading }"
    @confirm="handleOk"
    @cancel="handleCancel"
  >
    <a-button type="primary" @click="showPopconfirm">
      Open Popconfirm with async logic
    </a-button>
  </a-popconfirm>
</template>
