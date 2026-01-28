<docs lang="zh-CN">
图标可以被自定义。
</docs>

<docs lang="en-US">
The icon can be customized to any VueNode.
</docs>

<script setup lang="ts">
import { SmileOutlined } from '@antdv-next/icons'
import { notification } from 'antdv-next'
import { h } from 'vue'

const [api, ContextHolder] = notification.useNotification()

function openNotification() {
  api.open({
    title: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    icon: h(SmileOutlined, { style: { color: '#108ee9' } }),
  })
}
</script>

<template>
  <ContextHolder />
  <a-button type="primary" @click="openNotification">
    Open the notification box
  </a-button>
</template>
