<docs lang="zh-CN">
时间相关控件校验与提交。
</docs>

<docs lang="en-US">
Time-related controls with validation and submit.
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { reactive } from 'vue'

const model = reactive({
  datePicker: null as any,
  dateTimePicker: null as any,
  monthPicker: null as any,
  rangePicker: undefined as [Dayjs, Dayjs] | undefined,
  rangeTimePicker: undefined as [Dayjs, Dayjs] | undefined,
  timePicker: null as any,
})

const itemRules = [{ type: 'object' as const, required: true, message: 'Please select time!' }]
const rangeRules = [{ type: 'array' as const, required: true, message: 'Please select time!' }]

function handleFinish(values: any) {
  const rangeValue = values.rangePicker || []
  const rangeTimeValue = values.rangeTimePicker || []
  const result = {
    ...values,
    datePicker: values.datePicker?.format('YYYY-MM-DD'),
    dateTimePicker: values.dateTimePicker?.format('YYYY-MM-DD HH:mm:ss'),
    monthPicker: values.monthPicker?.format('YYYY-MM'),
    rangePicker: rangeValue.map((v: any) => v.format('YYYY-MM-DD')),
    rangeTimePicker: rangeTimeValue.map((v: any) => v.format('YYYY-MM-DD HH:mm:ss')),
    timePicker: values.timePicker?.format('HH:mm:ss'),
  }
  console.log('Received values of form: ', result)
}
</script>

<template>
  <a-form
    name="time_related_controls"
    :model="model"
    :label-col="{ xs: { span: 24 }, sm: { span: 8 } }"
    :wrapper-col="{ xs: { span: 24 }, sm: { span: 16 } }"
    style="max-width: 600px"
    @finish="handleFinish"
  >
    <a-form-item name="datePicker" label="DatePicker" :rules="itemRules">
      <a-date-picker v-model:value="model.datePicker" style="width: 100%" />
    </a-form-item>
    <a-form-item name="dateTimePicker" label="DatePicker[showTime]" :rules="itemRules">
      <a-date-picker v-model:value="model.dateTimePicker" show-time format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
    </a-form-item>
    <a-form-item name="monthPicker" label="MonthPicker" :rules="itemRules">
      <a-date-picker v-model:value="model.monthPicker" picker="month" style="width: 100%" />
    </a-form-item>
    <a-form-item name="rangePicker" label="RangePicker" :rules="rangeRules">
      <a-range-picker v-model:value="model.rangePicker" style="width: 100%" />
    </a-form-item>
    <a-form-item name="rangeTimePicker" label="RangePicker[showTime]" :rules="rangeRules">
      <a-range-picker v-model:value="model.rangeTimePicker" show-time format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
    </a-form-item>
    <a-form-item name="timePicker" label="TimePicker" :rules="itemRules">
      <a-time-picker v-model:value="model.timePicker" style="width: 100%" />
    </a-form-item>
    <a-form-item :label="null">
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>
