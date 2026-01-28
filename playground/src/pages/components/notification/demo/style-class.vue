<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义通知的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Notification by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import { notification } from 'antdv-next'

const [api, ContextHolder] = notification.useNotification()

const classes = {
  root: 'custom-notification-root',
}

function styleFn(info: any) {
  if (info.props.type === 'error') {
    return {
      root: {
        backgroundColor: 'rgba(255, 200, 200, 0.3)',
      },
    }
  }
  return {}
}

function openDefault() {
  api.info({
    title: 'Notification Title',
    description: 'This is a notification description.',
    duration: false,
    classes,
    styles: {
      root: {
        borderRadius: '8px',
      },
    },
  })
}

function openError() {
  api.error({
    title: 'Notification Title',
    description: 'This is a notification description.',
    duration: false,
    classes,
    styles: styleFn,
  })
}
</script>

<template>
  <ContextHolder />
  <a-space>
    <a-button type="primary" @click="openDefault">
      Default Notification
    </a-button>
    <a-button @click="openError">
      Error Notification
    </a-button>
  </a-space>
</template>

<style>
.custom-notification-root {
  border: 2px dashed #ccc;
}
</style>
