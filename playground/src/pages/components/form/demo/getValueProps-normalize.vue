<docs lang="zh-CN">
使用计算属性进行值转换。
</docs>

<docs lang="en-US">
Transform values with computed getters/setters.
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { computed, reactive } from 'vue'

const dateTimestamp = dayjs('2024-01-01').valueOf()

const model = reactive({
  date: String(dateTimestamp),
})

const dateValue = computed<Dayjs | null>({
  get: () => (model.date ? dayjs(Number(model.date)) : null),
  set: (val) => {
    model.date = val ? String(val.valueOf()) : ''
  },
})

function handleFinish(values: any) {
  console.log('Success:', values)
}
</script>

<template>
  <a-form
    name="getValueProps"
    :model="model"
    :label-col="{ span: 8 }"
    :wrapper-col="{ span: 16 }"
    style="max-width: 600px"
    @finish="handleFinish"
  >
    <a-form-item label="Date" name="date" :rules="[{ required: true }]">
      <a-date-picker v-model:value="dateValue" style="width: 100%" />
    </a-form-item>

    <a-form-item :label="null">
      <a-button type="primary" html-type="submit">
        Submit
      </a-button>
    </a-form-item>
  </a-form>
</template>
