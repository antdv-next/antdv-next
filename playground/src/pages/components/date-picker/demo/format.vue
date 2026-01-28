<docs lang="zh-CN">
使用 `format` 属性，可以自定义日期显示格式。当 `format` 为数组时，选择器输入框可以输入数组中任意一个有效格式。
</docs>

<docs lang="en-US">
We can set the date format by `format`. When `format` is an array, the input box can be entered in any of the valid formats of the array.
</docs>

<script setup lang="ts">
import type { DatePickerProps } from 'antdv-next'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { shallowRef } from 'vue'

const dateFormat = 'YYYY/MM/DD'
const weekFormat = 'MM/DD'
const monthFormat = 'YYYY/MM'

/** Manually entering any of the following formats will perform date parsing */
const dateFormatList = ['DD/MM/YYYY', 'DD/MM/YY', 'DD-MM-YYYY', 'DD-MM-YY']

dayjs.extend(customParseFormat)

const customFormat: DatePickerProps['format'] = value =>
  `custom format: ${value.format(dateFormat)}`

const customWeekStartEndFormat: DatePickerProps['format'] = value =>
  `${dayjs(value).startOf('week').format(weekFormat)} ~ ${dayjs(value)
    .endOf('week')
    .format(weekFormat)}`

const basicValue = shallowRef(dayjs('2015/01/01', dateFormat))
const listValue = shallowRef(dayjs('01/01/2015', dateFormatList[0]))
const monthValue = shallowRef(dayjs('2015/01', monthFormat))
const weekValue = shallowRef(dayjs())
const rangeValue = shallowRef([
  dayjs('2015/01/01', dateFormat),
  dayjs('2015/01/01', dateFormat),
])
const customValue = shallowRef(dayjs('2015/01/01', dateFormat))
</script>

<template>
  <a-space vertical :size="12">
    <a-date-picker v-model:value="basicValue" :format="dateFormat" />
    <a-date-picker v-model:value="listValue" :format="dateFormatList" />
    <a-date-picker
      v-model:value="monthValue"
      picker="month"
      :format="monthFormat"
    />
    <a-date-picker v-model:value="weekValue" picker="week" :format="customWeekStartEndFormat" />
    <a-range-picker
      v-model:value="rangeValue"
      :format="dateFormat"
    />
    <a-date-picker v-model:value="customValue" :format="customFormat" />
  </a-space>
</template>
