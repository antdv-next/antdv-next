<script setup lang="ts">
import { App } from 'antdv-next'

const { message, modal, notification } = App.useApp()

function showMessage() {
  message.success('Success!')
}

function showModal() {
  modal.warning({
    title: 'This is a warning message',
    content: 'some messages...some messages...',
  })
}

function showNotification() {
  notification.info({
    title: 'Notification topLeft',
    description: 'Hello, Antdv Next!!',
    placement: 'topLeft',
  })
}
</script>

<template>
  <a-space wrap>
    <a-button type="primary" @click="showMessage">
      Open message
    </a-button>
    <a-button type="primary" @click="showModal">
      Open modal
    </a-button>
    <a-button type="primary" @click="showNotification">
      Open notification
    </a-button>
  </a-space>
</template>
