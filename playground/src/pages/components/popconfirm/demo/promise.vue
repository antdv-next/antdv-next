<docs lang="zh-CN">
点击确定后异步关闭 Popconfirm，例如提交表单。
</docs>

<docs lang="en-US">
Asynchronously close a popconfirm when the OK button is pressed. For example, you can use this pattern when you submit a form.
</docs>

<script setup lang="ts">
function confirm() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(null), 3000)
  })
}

function handleOpenChange() {
  console.log('open change')
}
</script>

<template>
  <a-popconfirm
    title="Title"
    description="Open Popconfirm with Promise"
    @confirm="confirm"
    @open-change="handleOpenChange"
  >
    <a-button type="primary">
      Open Popconfirm with Promise
    </a-button>
  </a-popconfirm>
</template>
