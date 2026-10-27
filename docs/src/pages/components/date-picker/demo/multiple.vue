<docs lang="zh-CN">
多选，不支持 `showTime` 以及 `picker="time"`。
</docs>

<docs lang="en-US">
Multiple selections. Does not support `showTime` and `picker="time"`.
</docs>

<script setup lang="ts">
import type { DatePickerEmits } from 'antdv-next'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { shallowRef } from 'vue'

const defaultValue = [dayjs('2000-01-01'), dayjs('2000-01-03'), dayjs('2000-01-05')]
const smallValue = shallowRef([...defaultValue])
const middleValue = shallowRef([...defaultValue])
const largeValue = shallowRef([...defaultValue])

const handleChange: DatePickerEmits<Dayjs>['change'] = (date, dateString) => {
  console.log(date, dateString)
}
</script>

<template>
  <a-flex vertical gap="small">
    <a-date-picker
      v-model:value="smallValue"
      multiple
      size="small"
      max-tag-count="responsive"
      @change="handleChange"
    />
    <a-date-picker
      v-model:value="middleValue"
      multiple
      max-tag-count="responsive"
      @change="handleChange"
    />
    <a-date-picker
      v-model:value="largeValue"
      multiple
      size="large"
      max-tag-count="responsive"
      @change="handleChange"
    />
  </a-flex>
</template>
