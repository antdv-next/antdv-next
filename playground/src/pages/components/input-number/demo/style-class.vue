<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 InputNumber 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of the InputNumber by passing objects/functions through
</docs>

<script setup lang="ts">
import type { InputNumberProps } from 'antdv-next'

const shardStyle = {
  root: 'shard',
}
const styleObject: InputNumberProps['styles'] = {
  input: {
    fontSize: '14px',
  },
}
const styleFn: InputNumberProps['styles'] = ({ props }) => {
  if (props.size === 'large') {
    return {
      root: {
        backgroundColor: 'rgba(250,250,250, 0.5)',
        borderColor: '#722ed1',
      },
    } satisfies InputNumberProps['styles']
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-input-number :classes="shardStyle" :styles="styleObject" placeholder="Object" />
    <a-input-number :classes="shardStyle" :styles="styleFn" placeholder="Function" size="large" />
  </a-flex>
</template>

<style scoped>
.shard {
  border: 1px solid #1677ff;
  border-radius: 8px;
  width: 200px;
}
</style>
