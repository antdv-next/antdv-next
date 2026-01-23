<docs lang="zh-CN">
通过 `formatter` 格式化数字，以展示具有具体含义的数据，往往需要配合 `parser` 一起使用。
</docs>

<docs lang="en-US">
Display value within it's situation with `formatter`, and we usually use `parser` at the same time.
</docs>

<script setup lang="ts">
import type { InputNumberProps } from 'antdv-next'
import { ref } from 'vue'

function onChange(value: number | null) {
  console.log('changed', value)
}

const formatter: InputNumberProps['formatter'] = (value) => {
  const [start, end] = `${value}`.split('.') || []
  const v = `${start}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return `$ ${end ? `${v}.${end}` : `${v}`}`
}

function parser(value: string | undefined) {
  return value?.replace(/\$\s?|(,*)/g, '') as unknown as number
}

const percentFormatter: InputNumberProps['formatter'] = (value) => {
  return `${value}%`
}

function percentParser(value: string | undefined) {
  return value?.replace('%', '') as unknown as number
}
const value1 = ref(1000)
const value2 = ref(100)
</script>

<template>
  <a-space>
    <a-input-number
      v-model:value="value1"
      :formatter="formatter"
      :parser="parser"
      @change="onChange"
    />
    <a-input-number
      v-model:value="value2"
      :min="0"
      :max="100"
      :formatter="percentFormatter"
      :parser="percentParser"
      @change="onChange"
    />
  </a-space>
</template>
