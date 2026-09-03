<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Spin 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Spin by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { SpinProps } from 'antdv-next'

const classes: SpinProps['classes'] = {
  root: 'demo-spin-root',
}

const stylesObject: SpinProps['styles'] = {
  indicator: {
    color: '#00d4ff',
  },
}

const stylesFn: SpinProps['styles'] = (info) => {
  if (info?.props?.size === 'small') {
    return {
      indicator: {
        color: '#722ed1',
      },
    }
  }
  return {}
}

const sharedProps: SpinProps = {
  spinning: true,
  percent: 0,
  classes,
}
</script>

<template>
  <a-flex align="center" gap="medium">
    <a-spin v-bind="sharedProps" :styles="stylesObject" />
    <a-spin v-bind="sharedProps" :styles="stylesFn" size="small" />
  </a-flex>
</template>

<style>
.demo-spin-root {
  padding: 8px;
}
</style>
