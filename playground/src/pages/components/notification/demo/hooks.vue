<docs lang="zh-CN">
通过 `notification.useNotification` 创建支持读取 context 的 `contextHolder`。请注意，我们推荐通过顶层注册的方式代替 `notification` 静态方法，因为静态方法无法消费上下文，因而 ConfigProvider 的数据也不会生效。
</docs>

<docs lang="en-US">
Use `notification.useNotification` to get `contextHolder` with context accessible issue. Please note that, we recommend to use top level registration instead of `notification` static method, because static method cannot consume context, and ConfigProvider data will not work.
</docs>

<script setup lang="ts">
import {
  RadiusBottomleftOutlined,
  RadiusBottomrightOutlined,
  RadiusUpleftOutlined,
  RadiusUprightOutlined,
} from '@antdv-next/icons'
import { notification } from 'antdv-next'
import { defineComponent, h, inject, provide, reactive } from 'vue'

const ContextKey = Symbol('notification-context')
const contextValue = reactive({ name: 'Antdv Next' })

provide(ContextKey, contextValue)

const ContextText = defineComponent(() => {
  const context = inject(ContextKey, { name: 'Default' }) as { name: string }
  return () => `Hello, ${context.name}!`
})

const [api, ContextHolder] = notification.useNotification()

// eslint-disable-next-line unused-imports/no-unused-vars
const placements = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'] as const

type NotificationPlacement = (typeof placements)[number]

function openNotification(placement: NotificationPlacement) {
  api.info({
    title: `Notification ${placement}`,
    description: h(ContextText),
    placement,
  })
}
</script>

<template>
  <ContextHolder />
  <a-space>
    <a-button type="primary" @click="openNotification('topLeft')">
      <template #icon>
        <RadiusUpleftOutlined />
      </template>
      topLeft
    </a-button>
    <a-button type="primary" @click="openNotification('topRight')">
      <template #icon>
        <RadiusUprightOutlined />
      </template>
      topRight
    </a-button>
  </a-space>
  <a-divider />
  <a-space>
    <a-button type="primary" @click="openNotification('bottomLeft')">
      <template #icon>
        <RadiusBottomleftOutlined />
      </template>
      bottomLeft
    </a-button>
    <a-button type="primary" @click="openNotification('bottomRight')">
      <template #icon>
        <RadiusBottomrightOutlined />
      </template>
      bottomRight
    </a-button>
  </a-space>
</template>
