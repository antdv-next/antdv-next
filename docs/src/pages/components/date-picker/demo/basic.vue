<docs lang="zh-CN">
最简单的用法，在浮层中可以选择或者输入日期。
</docs>

<docs lang="en-US">
Basic use case. Users can select or input a date in a panel.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

const date = shallowRef()
const week = shallowRef()
const month = shallowRef()
const year = shallowRef()
const quarter = shallowRef()
</script>

<template>
  <a-flex gap="small" justify="flex-start" align="flex-start" vertical>
    <a-date-picker v-model:value="date" />
    <a-date-picker v-model:value="week" picker="week" />
    <a-date-picker v-model:value="month" picker="month" />
    <a-date-picker v-model:value="quarter" picker="quarter" />
    <a-date-picker v-model:value="year" picker="year" />
  </a-flex>
</template>
