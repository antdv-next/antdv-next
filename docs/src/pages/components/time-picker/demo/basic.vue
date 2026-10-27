<docs lang="zh-CN">
点击 TimePicker，然后可以在浮层中选择或者输入某一时间。
</docs>

<docs lang="en-US">
Click `TimePicker`, and then we could select or input a time in panel.
</docs>

<script setup lang="ts">
import type { TimePickerEmits } from 'antdv-next'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { shallowRef } from 'vue'

dayjs.extend(customParseFormat)

const value = shallowRef()

const onChange: TimePickerEmits['change'] = (time, timeString) => {
  console.log(time, timeString)
}
</script>

<template>
  <a-time-picker
    v-model:value="value"
    @change="onChange"
  />
</template>
