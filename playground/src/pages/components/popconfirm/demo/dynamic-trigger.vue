<docs lang="zh-CN">
可以判断是否需要弹出。
</docs>

<docs lang="en-US">
Make it pop up under some conditions.
</docs>

<script setup lang="ts">
import { message } from 'antdv-next'
import { ref } from 'vue'

const [messageApi, ContextHolder] = message.useMessage()

const open = ref(false)
const condition = ref(true)

function confirm() {
  open.value = false
  messageApi.success('Next step.')
}

function cancel() {
  open.value = false
  messageApi.error('Click on cancel.')
}

function handleOpenChange(value: boolean) {
  if (!value) {
    open.value = value
    return
  }
  if (condition.value) {
    confirm()
  }
  else {
    open.value = value
  }
}
</script>

<template>
  <ContextHolder />
  <a-popconfirm
    title="Delete the task"
    description="Are you sure to delete this task?"
    :open="open"
    ok-text="Yes"
    cancel-text="No"
    @open-change="handleOpenChange"
    @confirm="confirm"
    @cancel="cancel"
  >
    <a-button danger>
      Delete a task
    </a-button>
  </a-popconfirm>
  <br>
  <br>
  Whether directly execute:
  <a-switch v-model:checked="condition" />
</template>
