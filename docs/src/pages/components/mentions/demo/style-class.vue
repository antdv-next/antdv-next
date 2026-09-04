<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 Mentions 的[语义化结构](#semantic-dom)样式，例如设置文本框可缩放。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of Mentions by passing objects/functions through `classes` and `styles`. For example, set the textarea to be resizable.
</docs>

<script setup lang="ts">
import type { MentionsProps } from 'antdv-next'

const options: MentionsProps['options'] = [
  { value: 'afc163', label: 'afc163' },
  { value: 'zombieJ', label: 'zombieJ' },
  { value: 'meet-student', label: 'meet-student' },
  { value: 'thinkasany', label: 'thinkasany' },
]

const classes: MentionsProps['classes'] = {
  root: 'mentions-demo-root',
}

const stylesObject: MentionsProps['styles'] = {
  textarea: {
    fontSize: '14px',
    resize: 'vertical',
    fontWeight: 200,
  },
}

const stylesFn: MentionsProps['styles'] = ({ props }) => {
  if (props.variant === 'filled') {
    return {
      root: {
        border: '1px solid #722ed1',
      },
      popup: {
        border: '1px solid #722ed1',
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="medium">
    <a-mentions
      :options="options"
      :classes="classes"
      :styles="stylesObject"
      placeholder="Object"
      :rows="2"
    />
    <a-mentions
      :options="options"
      :classes="classes"
      :styles="stylesFn"
      variant="filled"
      placeholder="Function"
    />
  </a-flex>
</template>

<style scoped>
:deep(.mentions-demo-root) {
  border: 1px solid #1677ff;
  border-radius: 8px;
  width: 300px;
}
</style>
