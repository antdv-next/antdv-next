<docs lang="zh-CN">
将自定义 class 传给 `TimePicker` 弹框。
</docs>

<docs lang="en-US">
Passing custom class to `TimePicker` popup.
</docs>

<script setup lang="ts">
import type { TimePickerEmits } from 'antdv-next'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

const defaultOpenValue = dayjs('00:00:00', 'HH:mm:ss')

const onChange: TimePickerEmits['change'] = (time, timeString) => {
  console.log(time, timeString)
}
</script>

<template>
  <a-time-picker
    :default-open-value="defaultOpenValue"
    :classes="{ popup: { root: 'myCustomClassName' } }"
    @change="onChange"
  />
</template>
