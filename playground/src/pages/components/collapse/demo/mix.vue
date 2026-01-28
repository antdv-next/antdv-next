<docs lang="zh-CN">
嵌套折叠面板。
</docs>

<docs lang="en-US">
`Collapse` is nested inside the `Collapse`.
</docs>

<script setup lang="ts">
import { Collapse } from 'antdv-next'
import { h } from 'vue'

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`

const itemsNest = [
  {
    key: '1',
    label: 'This is panel nest panel',
    content: h('p', text),
  },
]

const items = [
  {
    key: '1',
    label: 'This is panel header 1',
    content: h(Collapse, { defaultActiveKey: ['1'], items: itemsNest }),
  },
  {
    key: '2',
    label: 'This is panel header 2',
    content: h('p', text),
  },
  {
    key: '3',
    label: 'This is panel header 3',
    content: h('p', text),
  },
]

function onChange(key: string[]) {
  console.log(key)
}
</script>

<template>
  <a-collapse :items="items" @change="onChange" />
</template>
