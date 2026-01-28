<docs lang="zh-CN">
通过 `collapsible` 属性，可以设置面板的可折叠触发区域。
</docs>

<docs lang="en-US">
Specify the trigger area of collapsible by `collapsible`.
</docs>

<script setup lang="ts">
import { h } from 'vue'

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`

const headerItems = [
  {
    key: '1',
    label: 'This panel can be collapsed by clicking text or icon',
    content: h('p', text),
  },
]

const iconItems = [
  {
    key: '1',
    label: 'This panel can only be collapsed by clicking icon',
    content: h('p', text),
  },
]

const disabledItems = [
  {
    key: '1',
    label: 'This panel can\'t be collapsed',
    content: h('p', text),
  },
]
</script>

<template>
  <a-space direction="vertical" size="large" style="width: 100%">
    <a-collapse
      collapsible="header"
      :default-active-key="['1']"
      :items="headerItems"
    />
    <a-collapse
      collapsible="icon"
      :default-active-key="['1']"
      :items="iconItems"
    />
    <a-collapse
      collapsible="disabled"
      :items="disabledItems"
    />
  </a-space>
</template>
