<script setup lang="ts">
import { App } from 'antdv-next'

const { message, notification } = App.useApp()

function showMessage() {
  message.success('Success!')
}

function showNotification() {
  notification.info({
    title: 'Notification',
    description: 'Hello, Antdv Next!!',
  })
}
</script>

<template>
  <a-space wrap>
    <a-button type="primary" @click="showMessage">
      Message for only one
    </a-button>
    <a-button type="primary" @click="showNotification">
      Notification for bottomLeft
    </a-button>
  </a-space>
</template>
