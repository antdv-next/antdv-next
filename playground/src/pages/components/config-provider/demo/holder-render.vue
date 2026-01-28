<docs lang="zh-CN">
使用 `holderRender` 给 `message` 、`modal` 、`notification` 静态方法设置 `Provider`
</docs>

<docs lang="en-US">
Use `holderRender` to set the `Provider` for the static methods `message`,`modal`,`notification`.
</docs>

<script setup lang="ts">
import { StyleProvider } from '@antdv-next/cssinjs'
import { ExclamationCircleFilled } from '@antdv-next/icons'
import { App, ConfigProvider, message, Modal, notification } from 'antdv-next'
import { h, onBeforeUnmount, onMounted } from 'vue'

function holderRender(children: any) {
  return h(
    StyleProvider,
    { hashPriority: 'high' },
    () => h(
      ConfigProvider,
      { componentSize: 'small' },
      {
        default: () => h(App, { message: { maxCount: 1 }, notification: { maxCount: 1 } }, () => children),
      },
    ),
  )
}

onMounted(() => {
  ;(ConfigProvider as any).config({ holderRender })
})

onBeforeUnmount(() => {
  ;(ConfigProvider as any).config({ holderRender: undefined })
})

function showMessage() {
  message.info('This is a normal message')
}

function showNotification() {
  notification.open({
    title: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
  })
}

function showModal() {
  Modal.confirm({
    title: 'Do you want to delete these items?',
    icon: h(ExclamationCircleFilled),
    content: 'Some descriptions',
  })
}
</script>

<template>
  <a-space>
    <a-button type="primary" @click="showMessage">
      message
    </a-button>
    <a-button type="primary" @click="showNotification">
      notification
    </a-button>
    <a-button type="primary" @click="showModal">
      Modal
    </a-button>
  </a-space>
</template>
