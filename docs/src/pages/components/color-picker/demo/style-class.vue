<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象或函数可以自定义 ColorPicker 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of ColorPicker by passing objects or functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

const classes = { root: 'custom-color-picker' }

const color = shallowRef('#1677ff')
const colorLarge = shallowRef('#722ed1')

const stylesObject = {
  popup: {
    root: {
      border: '1px solid #fff',
    },
  },
}

function stylesFn(info: any) {
  if (info?.props?.size === 'large') {
    return {
      popup: {
        root: {
          border: '1px solid #722ed1',
        },
      },
    }
  }
  return {}
}
</script>

<template>
  <a-space size="medium" wrap>
    <a-color-picker
      v-model:value="color"
      :classes="classes"
      :styles="stylesObject"
      :arrow="false"
    />
    <a-color-picker
      v-model:value="colorLarge"
      size="large"
      :classes="classes"
      :styles="stylesFn"
      :arrow="false"
    />
  </a-space>
</template>

<style>
.custom-color-picker {
  border-radius: 8px;
}
</style>
