<docs lang="zh-CN">
自定义渲染每个面板右上角的内容。
</docs>

<docs lang="en-US">
Render extra element in the top-right corner of each panel.
</docs>

<script setup lang="ts">
import type { CollapseProps } from 'antdv-next'
import { SettingOutlined } from '@antdv-next/icons'
import { h, ref } from 'vue'

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`

const expandIconPlacement = ref<CollapseProps['expandIconPlacement']>('start')

const placementOptions = [
  { label: 'start', value: 'start' },
  { label: 'end', value: 'end' },
]

function onChange(key: string[]) {
  console.log(key)
}

function genExtra() {
  return h(SettingOutlined, {
    onClick: (event: Event) => {
      event.stopPropagation()
    },
  })
}

const items = [
  {
    key: '1',
    label: 'This is panel header 1',
    content: h('div', text),
    extra: genExtra(),
  },
  {
    key: '2',
    label: 'This is panel header 2',
    content: h('div', text),
    extra: genExtra(),
  },
  {
    key: '3',
    label: 'This is panel header 3',
    content: h('div', text),
    extra: genExtra(),
  },
]
</script>

<template>
  <a-collapse
    :items="items"
    :default-active-key="['1']"
    :expand-icon-placement="expandIconPlacement"
    @change="onChange"
  />
  <br>
  <span>Expand Icon Placement: </span>
  <a-select v-model:value="expandIconPlacement" style="margin: 0 8px" :options="placementOptions" />
</template>
