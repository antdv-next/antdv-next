<docs lang="zh-CN">
通过 `TimePicker.RangePicker` 使用时间范围选择器。
</docs>

<docs lang="en-US">
Use time range picker with `TimePicker.RangePicker`.
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

const format = 'HH:mm:ss'
const defaultValue: [Dayjs, Dayjs] = [dayjs('12:08:23', 'HH:mm:ss'), dayjs('12:08:23', 'HH:mm:ss')]
</script>

<template>
  <a-time-range-picker :default-value="defaultValue" :format="format" />
</template>
