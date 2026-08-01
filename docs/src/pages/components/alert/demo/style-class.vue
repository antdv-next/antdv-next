<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Alert 的 [语义化结构](#semantic-dom) 样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Alert by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { AlertProps } from 'antdv-next'
import { theme } from 'antdv-next'

const { token } = theme.useToken()

const classes: AlertProps['classes'] = {
  root: 'demo-alert-root',
}

const stylesObject: AlertProps['styles'] = {
  icon: {
    fontSize: '18px',
  },
  section: {
    fontWeight: 500,
  },
}

const stylesFn: AlertProps['styles'] = (info) => {
  if (info?.props?.type === 'success') {
    return {
      root: {
        backgroundColor: 'rgba(82, 196, 26, 0.1)',
        borderColor: '#b7eb8f',
      },
      icon: {
        color: '#52c41a',
      },
    }
  }
  if (info?.props?.type === 'warning') {
    return {
      root: {
        backgroundColor: 'rgba(250, 173, 20, 0.1)',
        borderColor: '#ffe58f',
      },
      icon: {
        color: '#faad14',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="small">
    <a-alert
      title="Object styles"
      type="info"
      show-icon
      :classes="classes"
      :styles="stylesObject"
    >
      <template #action>
        <a-button size="small">
          Action
        </a-button>
      </template>
    </a-alert>
    <a-alert
      title="Function styles"
      type="success"
      show-icon
      :classes="classes"
      :styles="stylesFn"
    />
  </a-flex>
</template>

<style>
.demo-alert-root {
  border: 2px dashed v-bind('token.colorBorder');
  border-radius: v-bind('`${token.borderRadius}px`');
  padding: v-bind('`${token.paddingXS}px`');
}
</style>
