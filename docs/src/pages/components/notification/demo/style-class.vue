<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义通知的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Notification by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { notification } from 'antdv-next'

const [api, ContextHolder] = notification.useNotification()

const defaultStyles: Record<string, CSSProperties> = {
  root: {
    backgroundColor: '#f6ffed',
    border: '2px solid #95de64',
    borderRadius: '16px',
    boxShadow: '4px 4px 0 #d9f7be',
  },
  icon: {
    color: '#237804',
  },
  title: {
    color: '#237804',
    fontWeight: 600,
  },
  description: {
    color: '#3f6600',
  },
}

function styleFn(info: { props: any }): Record<string, CSSProperties> {
  if (info.props.type === 'error') {
    return {
      ...defaultStyles,
      root: {
        ...defaultStyles.root,
        backgroundColor: '#fff2f0',
        borderColor: '#ffccc7',
        boxShadow: '4px 4px 0 #ffccc7',
      },
      icon: {
        color: '#cf1322',
      },
      title: {
        color: '#cf1322',
      },
      description: {
        color: '#5c0011',
      },
    }
  }
  return defaultStyles
}

const sharedProps = {
  title: 'Notification Title',
  description: 'This is a notification description.',
  duration: false as const,
}

function openDefault() {
  api.info({
    ...sharedProps,
    styles: defaultStyles,
  })
}

function openError() {
  api.error({
    ...sharedProps,
    type: 'error',
    styles: styleFn as any,
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
