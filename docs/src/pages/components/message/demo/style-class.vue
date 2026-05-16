<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义消息的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of messages by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { message } from 'antdv-next'

const [messageApi, ContextHolder] = message.useMessage()

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
}

function stylesFn(info: { props: any }): Record<string, CSSProperties> {
  if (info.props.type === 'error') {
    return {
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
        fontWeight: 600,
      },
    }
  }
  return defaultStyles
}

function showObjectStyle() {
  messageApi.open({
    type: 'success',
    content: 'This is a message with object styles',
    styles: defaultStyles,
  })
}

function showFunctionStyle() {
  messageApi.open({
    type: 'error',
    content: 'This is a message with function styles',
    styles: stylesFn as any,
  })
}
</script>

<template>
  <ContextHolder />
  <a-space>
    <a-button @click="showObjectStyle">
      Object style
    </a-button>
    <a-button type="primary" @click="showFunctionStyle">
      Function style
    </a-button>
  </a-space>
</template>
