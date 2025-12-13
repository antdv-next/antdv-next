<docs lang="zh-CN">
基础弹框。
</docs>

<docs lang="en-US">
Basic modal.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

const open = shallowRef(false)

function handleOk() {
  open.value = false
}
</script>

<template>
  <a-flex gap="small">
    <a-button type="primary" @click="open = true">
      Open Modal
    </a-button>
  </a-flex>
  <a-modal
    v-model:open="open"
    title="Basic Modal"
    :closable="{ 'aria-label': 'Custom Close Button' }"
    @ok="handleOk"
  >
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </a-modal>
</template>
