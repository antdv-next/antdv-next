<docs lang="zh-CN">
使用 `loadData` 实现动态加载选项。

> 注意：`loadData` 与 `showSearch` 无法一起使用。
</docs>

<docs lang="en-US">
Load options lazily with `loadData`.

> Note: `loadData` cannot work with `showSearch`.
</docs>

<script setup lang="ts">
import type { CascaderEmits } from 'antdv-next'
import { ref } from 'vue'

interface Option {
  value?: string | number | null
  label: string
  children?: Option[]
  isLeaf?: boolean
}

const optionLists: Option[] = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    isLeaf: false,
  },
  {
    value: 'jiangsu',
    label: 'Jiangsu',
    isLeaf: false,
  },
]

const options = ref<Option[]>(optionLists)

const onChange: CascaderEmits['change'] = (value, selectedOptions) => {
  console.log(value, selectedOptions)
}

function loadData(selectedOptions: Option[]) {
  const targetOption = selectedOptions[selectedOptions.length - 1]!

  setTimeout(() => {
    targetOption.children = [
      {
        label: `${targetOption.label} Dynamic 1`,
        value: 'dynamic1',
      },
      {
        label: `${targetOption.label} Dynamic 2`,
        value: 'dynamic2',
      },
    ]
    options.value = [...options.value]
  }, 1000)
}
</script>

<template>
  <a-cascader
    :options="options"
    :load-data="loadData"
    change-on-select
    @change="onChange"
  />
</template>
