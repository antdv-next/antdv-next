<docs lang="zh-CN">
最简单的用法，支持确认标题和描述。
</docs>

<docs lang="en-US">
The basic example supports the title and description props of confirmation.
</docs>

<script setup lang="ts">
import { message } from 'antdv-next'

const [messageApi, ContextHolder] = message.useMessage()

function confirm(e?: MouseEvent) {
  console.log(e)
  messageApi.success('Click on Yes')
}

function cancel(e?: MouseEvent) {
  console.log(e)
  messageApi.error('Click on No')
}
</script>

<template>
  <ContextHolder />
  <a-popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    ok-text="Yes"
    cancel-text="No"
    @confirm="confirm"
    @cancel="cancel"
  >
    <a-button danger>
      Delete
    </a-button>
  </a-popconfirm>
</template>
