<docs lang="zh-CN">
通过 `allowClear` 显示清除按钮，可配合 `clearIcon` 插槽自定义图标，清除时触发 `clear` 事件。
</docs>

<docs lang="en-US">
Show a clear button with `allowClear`, customize the icon via the `clearIcon` slot, and listen to the `clear` event.
</docs>

<script setup lang="ts">
import { CloseCircleFilled } from '@antdv-next/icons'
import { ref } from 'vue'

const value = ref<number | null>(3)
const custom = ref<number | null>(10)

function onClear() {
  console.log('cleared')
}
</script>

<template>
  <a-flex vertical gap="middle">
    <a-input-number v-model:value="value" allow-clear style="width: 100%;" @clear="onClear" />
    <a-input-number v-model:value="custom" allow-clear suffix="RMB" style="width: 100%;">
      <template #clearIcon>
        <CloseCircleFilled />
      </template>
    </a-input-number>
  </a-flex>
</template>
