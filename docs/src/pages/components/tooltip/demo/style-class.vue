<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Tooltip 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Tooltip by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { TooltipProps } from 'antdv-next'
import { theme } from 'antdv-next'

const { token } = theme.useToken()

const classes: TooltipProps['classes'] = {
  container: 'demo-tooltip-container',
}

const stylesObject: TooltipProps['styles'] = {
  container: {
    borderRadius: '12px',
    boxShadow: 'inset 0 0 8px #ccc',
  },
}

const stylesFn: TooltipProps['styles'] = (info) => {
  if (info?.props?.arrow === false) {
    return {
      container: {
        backgroundColor: 'rgba(53, 71, 125, 0.8)',
        padding: '12px',
        color: '#fff',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex gap="medium">
    <a-tooltip title="Object text" :classes="classes" :styles="stylesObject" :arrow="false">
      <a-button>Object Style</a-button>
    </a-tooltip>
    <a-tooltip title="Function text" :classes="classes" :styles="stylesFn" :arrow="false">
      <a-button type="primary">
        Function Style
      </a-button>
    </a-tooltip>
  </a-flex>
</template>

<style>
.demo-tooltip-container {
  padding: v-bind('`${token.paddingXS}px`');
  border: 1px dashed v-bind('token.colorBorder');
}
</style>
