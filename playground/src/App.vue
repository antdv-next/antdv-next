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
    <a-popover trigger="click">
      <template #content>
        <div>
          <a-input-search />
          <p>Content</p>
          <p>Content</p>
        </div>
      </template>
      <a-input readonly />
    </a-popover>
  </a-modal>
  <a-popover trigger="click">
    <template #content>
      <div>
        <a-input-search />
        <p>Content</p>
        <p>Content</p>
      </div>
    </template>
    <a-input readonly />
  </a-popover>
</template>
