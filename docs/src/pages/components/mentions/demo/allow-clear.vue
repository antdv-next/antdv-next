<docs lang="zh-CN">
自定义清除按钮。

清除按钮的 `tabIndex` 为 `-1` 时，不参与 Tab 键导航。
</docs>

<docs lang="en-US">
Customize clear button.

A clear button with `tabIndex: -1` is excluded from Tab navigation.
</docs>

<script setup lang="ts">
import { CloseSquareFilled } from '@antdv-next/icons'
import { h, ref } from 'vue'

const value = ref('hello world')
const customAllowClear = {
  clearIcon: h(CloseSquareFilled),
}
</script>

<template>
  <a-flex vertical gap="medium">
    <a-mentions v-model:value="value" allow-clear />
    <a-mentions v-model:value="value" :allow-clear="customAllowClear" />
    <a-mentions v-model:value="value" allow-clear :rows="3" />
    <a-mentions v-model:value="value" :allow-clear="{ tabIndex: -1 }" />
  </a-flex>
</template>
