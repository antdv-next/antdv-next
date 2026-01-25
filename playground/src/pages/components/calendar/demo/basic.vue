<docs lang="zh-CN">
一个通用的日历面板，支持年/月切换。
</docs>

<docs lang="en-US">
A basic calendar component with Year/Month switch.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

const value = shallowRef()
</script>

<template>
  <a-calendar v-model:value="value" />
</template>
