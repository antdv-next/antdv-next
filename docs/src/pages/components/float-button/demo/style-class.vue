<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 FloatButton 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of FloatButton by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { FloatButtonProps } from 'antdv-next'
import { QuestionCircleOutlined } from '@antdv-next/icons'
import { theme } from 'antdv-next'

const { token } = theme.useToken()

const classes: FloatButtonProps['classes'] = {
  root: 'demo-float-button-root',
  content: 'demo-float-button-content',
}

const stylesObject: FloatButtonProps['styles'] = {
  root: {
    boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
  },
}

const stylesFn: FloatButtonProps['styles'] = (info) => {
  if (info?.props?.type === 'primary') {
    return {
      root: {
        backgroundColor: '#171717',
      },
      content: {
        color: '#fff',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-float-button-group shape="circle" style="inset-inline-end: 94px;">
    <a-float-button
      type="primary"
      :classes="classes"
      :styles="stylesFn"
    >
      <template #tooltip>
        <div>custom style class</div>
      </template>
    </a-float-button>
    <a-float-button
      type="default"
      :classes="classes"
      :styles="stylesObject"
    >
      <template #icon>
        <QuestionCircleOutlined />
      </template>
    </a-float-button>
  </a-float-button-group>
</template>

<style>
.demo-float-button-root {
  border: 1px solid v-bind('token.colorBorder');
  border-radius: v-bind('`${token.borderRadius}px`');
  padding: v-bind('`${token.paddingXS}px`') v-bind('`${token.padding}px`');
  height: auto;
}

.demo-float-button-content {
  color: v-bind('token.colorText');
}
</style>
