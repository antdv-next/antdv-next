<docs lang="zh-CN">
自定义前缀 `prefix` 和后缀图标 `suffixIcon`。
</docs>

<docs lang="en-US">
Custom `prefix` and `suffixIcon`.
</docs>

<script setup lang="ts">
import { SmileOutlined } from '@antdv-next/icons'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import { h } from 'vue'

dayjs.extend(customParseFormat)

const defaultOpenValue = dayjs('00:00:00', 'HH:mm:ss')
const prefixIcon = h(SmileOutlined)

function onChange(time: any, timeString: string) {
  console.log(time, timeString)
}
</script>

<template>
  <a-space vertical :size="12">
    <a-time-picker
      :default-open-value="defaultOpenValue"
      @change="onChange"
    >
      <template #suffixIcon>
        <SmileOutlined />
      </template>
    </a-time-picker>
    <a-time-picker :prefix="prefixIcon" />
    <a-time-range-picker :prefix="prefixIcon" />
  </a-space>
</template>
