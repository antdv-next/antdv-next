<docs lang="zh-CN">
这种交互允许只选中父级选项。
</docs>

<docs lang="en-US">
Allows the selection of only parent options.
</docs>

<script setup lang="ts">
import type { CascaderEmits } from 'antdv-next'
import { shallowRef } from 'vue'

interface Option {
  value: string
  label: string
  children?: Option[]
}

const options: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      {
        value: 'hangzhou',
        label: 'Hangzhou',
        children: [
          {
            value: 'xihu',
            label: 'West Lake',
          },
        ],
      },
    ],
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [
      {
        value: 'nanjing',
        label: 'Nanjing',
        children: [
          {
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
          },
        ],
      },
    ],
  },
]

const onChange: CascaderEmits['change'] = (value) => {
  console.log(value)
}
const value = shallowRef()
</script>

<template>
  <a-cascader v-model:value="value" :options="options" change-on-select @change="onChange" />
</template>
