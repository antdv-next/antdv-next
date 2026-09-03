<docs lang="zh-CN">
通过 `classes` 和 `styles` 传入对象/函数可以自定义 DatePicker 的[语义化结构](#semantic-dom)样式。
</docs>

<docs lang="en-US">
You can customize the [semantic dom](#semantic-dom) style of DatePicker by passing objects/functions through `classes` and `styles`.
</docs>

<script setup lang="ts">
import type { DatePickerProps } from 'antdv-next'
import { theme } from 'antdv-next'

const { useToken } = theme
const { token } = useToken()

const customClasses = {
  root: 'custom-datepicker-root',
}

const stylesObject: DatePickerProps['styles'] = {
  input: { fontStyle: 'italic' },
  suffix: { opacity: 0.85 },
}

const stylesFn: DatePickerProps['styles'] = (info) => {
  if (info.props.size === 'large') {
    return {
      root: { borderColor: '#722ed1' },
      popup: {
        container: { border: '1px solid #722ed1', borderRadius: '8px' },
      },
    }
  }
  return {}
}
</script>

<template>
  <a-flex vertical gap="medium">
    <a-date-picker :classes="customClasses" :styles="stylesObject" placeholder="Object" />
    <a-date-picker :classes="customClasses" :styles="stylesFn" placeholder="Function" size="large" />
  </a-flex>
</template>

<style scoped>
.custom-datepicker-root {
  border: 1px solid v-bind('token.colorPrimary');
  width: 200px;
}
</style>
