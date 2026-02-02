<docs lang="zh-CN">
使用 Steps 的 `status` 属性来指定当前步骤的状态。
</docs>

<docs lang="en-US">
By using `status` of `Steps`, you can specify the state for current step.
</docs>

<script lang="ts" setup>
const content = 'This is a content'
const items = [
  {
    title: 'Finished',
    content,
  },
  {
    title: 'In Process',
    content,
  },
  {
    title: 'Waiting',
    content,
  },
]
</script>

<template>
  <a-steps :current="1" status="error" :items="items" />
</template>
