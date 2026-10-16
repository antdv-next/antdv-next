<docs lang="zh-CN">
适用于一些需要内嵌适用的场景。
</docs>

<docs lang="en-US">
Used for inline view case.
</docs>

<script setup lang="ts">
import type { CascaderEmits } from 'antdv-next'
import { ref } from 'vue'

interface Option {
  value: string | number
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

const disabled = ref(false)

const onChange: CascaderEmits['change'] = (value) => {
  console.log(value)
}

const onMultipleChange: CascaderEmits['change'] = (value) => {
  console.log(value)
}
</script>

<template>
  <a-flex vertical gap="small" align="flex-start">
    <a-switch
      v-model:checked="disabled"
      checked-children="Disabled"
      un-checked-children="Enabled"
      aria-label="disabled switch"
    />
    <a-cascader-panel :options="options" :disabled="disabled" @change="onChange" />
    <a-cascader-panel multiple :options="options" :disabled="disabled" @change="onMultipleChange" />
    <a-cascader-panel />
  </a-flex>
</template>
