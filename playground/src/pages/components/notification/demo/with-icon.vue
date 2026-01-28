<docs lang="zh-CN">
通知提醒框左侧有图标。
</docs>

<docs lang="en-US">
A notification box with a icon at the left side.
</docs>

<script setup lang="ts">
import { notification } from 'antdv-next'

const [api, ContextHolder] = notification.useNotification()

type NotificationType = 'success' | 'info' | 'warning' | 'error'

function openNotificationWithIcon(type: NotificationType) {
  api[type]({
    title: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
  })
}
</script>

<template>
  <ContextHolder />
  <a-flex gap="8" wrap="wrap">
    <a-button color="green" variant="outlined" @click="openNotificationWithIcon('success')">
      Success
    </a-button>
    <a-button color="blue" variant="outlined" @click="openNotificationWithIcon('info')">
      Info
    </a-button>
    <a-button color="yellow" variant="outlined" @click="openNotificationWithIcon('warning')">
      Warning
    </a-button>
    <a-button color="red" variant="outlined" @click="openNotificationWithIcon('error')">
      Error
    </a-button>
  </a-flex>
</template>
