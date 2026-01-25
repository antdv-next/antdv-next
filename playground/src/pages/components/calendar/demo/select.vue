
<docs lang="zh-CN">
一个通用的日历面板，支持年/月切换。
</docs>

<docs lang="en-US">
A basic calendar component with Year/Month switch.
</docs>

<script setup lang="ts">
  import type { Dayjs } from 'dayjs';
  import dayjs from 'dayjs'
  import { ref } from 'vue'

  const date = ref('2017-01-25')
  const selectedValue = ref(dayjs('2017-01-25'))
  function onSelect(value: Dayjs) {
    selectedValue.value = value
  }
</script>

<template>
  <a-alert :title="`You selected date: ${selectedValue?.format('YYYY-MM-DD')}`" />
  <a-calendar
    v-model="date"
    @select="onSelect"
  />
</template>
