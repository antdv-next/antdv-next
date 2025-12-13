<docs lang="zh-CN">
通过 `Modal.useModal` 在组合式场景下灵活创建确认对话框。
</docs>

<docs lang="en-US">
Use `Modal.useModal` to create confirmation dialogs imperatively in setup.
</docs>

<script setup lang="ts">
import { useModal } from 'antdv-next'

const [modal, contextHolder] = useModal()

function showConfirm() {
  modal.confirm({
    title: 'Do you want to continue?',
    content: 'Click OK to proceed, Cancel to dismiss.',
  })
}
</script>

<template>
  <a-space>
    <a-button type="primary" @click="showConfirm">
      Open Confirm Modal
    </a-button>
  </a-space>
  <contextHolder />
</template>
