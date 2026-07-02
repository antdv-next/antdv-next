<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Switch 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Switch by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import { theme } from 'antdv-next'

const { token } = theme.useToken()

const classes = {
  root: 'custom-switch-root',
}

const stylesObject = {
  root: {
    backgroundColor: '#F5D2D2',
  },
}

function stylesFn(info: any) {
  if (info.props.size === 'medium') {
    return {
      root: {
        backgroundColor: '#BDE3C3',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-switch
      size="small"
      checked-children="on"
      un-checked-children="off"
      :classes="classes"
      :styles="stylesObject"
    />
    <a-switch :classes="classes" size="medium" :styles="stylesFn" />
  </a-flex>
</template>

<style scoped>
.custom-switch-root {
  width: 40px;
  background-color: v-bind('token.colorPrimary');
}
</style>
