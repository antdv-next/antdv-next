<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Popover 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Popover by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { PopoverProps } from 'antdv-next'
import { theme } from 'antdv-next'

const { token } = theme.useToken()

const classes: PopoverProps['classes'] = {
  container: 'demo-popover-container',
}

const stylesObject: PopoverProps['styles'] = {
  container: {
    backgroundColor: '#eee',
    boxShadow: 'inset 5px 5px 3px #fff, inset -5px -5px 3px #ddd, 0 0 3px rgba(0,0,0,0.2)',
  },
  title: {
    color: '#262626',
  },
  content: {
    color: '#262626',
  },
}

const stylesFn: PopoverProps['styles'] = (info) => {
  if (info?.props?.arrow === false) {
    return {
      container: {
        backgroundColor: 'rgba(53, 71, 125, 0.8)',
        padding: '12px',
        borderRadius: '4px',
      },
      title: {
        color: '#fff',
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
  <a-flex gap="medium">
    <a-popover
      content="Object text"
      :classes="classes"
      :styles="stylesObject"
      :arrow="false"
    >
      <a-button>Object Style</a-button>
    </a-popover>
    <a-popover
      content="Function text"
      :classes="classes"
      :styles="stylesFn"
      :arrow="false"
    >
      <a-button type="primary">
        Function Style
      </a-button>
    </a-popover>
  </a-flex>
</template>

<style>
.demo-popover-container {
  padding: v-bind('`${token.paddingXS}px`');
  border: 1px dashed v-bind('token.colorBorder');
}
</style>
