<docs lang="zh-CN">
`block` 属性将使 Radio.Group 撑满父容器。
</docs>

<docs lang="en-US">
The `block` property will make a Radio.Group fit to its parent width.
</docs>

<script setup lang="ts">
import type { CheckboxOptionType } from 'antdv-next'
import { shallowRef } from 'vue'

const options: CheckboxOptionType[] = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Pear', value: 'Pear' },
  { label: 'Orange', value: 'Orange' },
]
const value = shallowRef('Apple')
</script>

<template>
  <a-flex vertical gap="medium">
    <a-radio-group v-model:value="value" block :options="options" />
    <a-radio-group
      v-model:value="value"
      block
      :options="options"
      option-type="button"
      button-style="solid"
    />
    <a-radio-group
      v-model:value="value"
      block
      :options="options"
      option-type="button"
    />
  </a-flex>
</template>
