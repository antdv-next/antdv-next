<docs lang="zh-CN">
通过 `changeOnScroll` 与 `needConfirm` 使其滚动时改变数值。
</docs>

<docs lang="en-US">
Use `changeOnScroll` and `needConfirm` to change the value when scrolling.
</docs>

<script setup lang="ts">
import type { TimePickerEmits } from 'antdv-next'

const onChange: TimePickerEmits['change'] = (time, timeString) => {
  console.log(time, timeString)
}
</script>

<template>
  <a-time-picker change-on-scroll :need-confirm="false" @change="onChange" />
</template>
