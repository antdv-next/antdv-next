<docs lang="zh-CN">
自定义前缀 `prefix` 和后缀 `suffix`。
</docs>

<docs lang="en-US">
Custom `prefix` and `suffix`.
</docs>

<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import { SmileOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const smileIcon = h(SmileOutlined)

function handleChange(date: Dayjs | (Dayjs | null)[] | null, dateString: string | string[] | null) {
  console.log(date, dateString)
}
</script>

<template>
  <a-space vertical :size="12">
    <a-date-picker :suffix="smileIcon" @change="handleChange" />
    <a-date-picker :suffix="smileIcon" picker="month" @change="handleChange" />
    <a-range-picker :suffix="smileIcon" @change="handleChange" />
    <a-date-picker :suffix="smileIcon" picker="week" @change="handleChange" />
    <a-date-picker suffix="ab" @change="handleChange" />
    <a-date-picker suffix="ab" picker="month" @change="handleChange" />
    <a-range-picker suffix="ab" @change="handleChange" />
    <a-date-picker suffix="ab" picker="week" @change="handleChange" />
    <a-date-picker :prefix="smileIcon" picker="week" @change="handleChange" />
    <a-date-picker prefix="Event Period" picker="week" @change="handleChange" />
    <a-range-picker :prefix="smileIcon" picker="week" @change="handleChange" />
    <a-range-picker prefix="Event Period" picker="week" @change="handleChange" />
  </a-space>
</template>
