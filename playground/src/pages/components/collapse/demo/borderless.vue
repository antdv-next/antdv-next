<docs lang="zh-CN">
一套没有边框的简洁样式。
</docs>

<docs lang="en-US">
A borderless style of Collapse.
</docs>

<script setup lang="ts">
import { h } from 'vue'

const text
  = 'A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.'

const items = [
  {
    key: '1',
    label: 'This is panel header 1',
    content: h('p', { style: { paddingInlineStart: '24px' } }, text),
  },
  {
    key: '2',
    label: 'This is panel header 2',
    content: h('p', { style: { paddingInlineStart: '24px' } }, text),
  },
  {
    key: '3',
    label: 'This is panel header 3',
    content: h('p', { style: { paddingInlineStart: '24px' } }, text),
  },
]
</script>

<template>
  <a-collapse :items="items" :bordered="false" :default-active-key="['1']" />
</template>
