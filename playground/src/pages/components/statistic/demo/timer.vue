<docs lang="zh-CN">
计时器组件。
</docs>

<docs lang="en-US">
Timer component.
</docs>

<script setup lang="ts">
const deadline = Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 30 // Dayjs is also OK
const before = Date.now() - 1000 * 60 * 60 * 24 * 2 + 1000 * 30
const tenSecondsLater = Date.now() + 10 * 1000

function onFinish() {
  console.log('finished!')
}
function onChange(val?: number) {
  if (typeof val === 'number' && 4.95 * 1000 < val && val < 5 * 1000) {
    console.log('changed!')
  }
}
</script>

<template>
  <a-row :gutter="16">
    <a-col :span="12">
      <a-statistic-timer type="countdown" :value="deadline" @finish="onFinish" />
    </a-col>
    <a-col :span="12">
      <a-statistic-timer type="countdown" title="Million Seconds" :value="deadline" format="HH:mm:ss:SSS" />
    </a-col>
    <a-col :span="12">
      <a-statistic-timer
        type="countdown" title="Countdown" :value="tenSecondsLater"
        @change="onChange"
      />
    </a-col>
    <a-col :span="12">
      <a-statistic-timer type="countup" title="Countup" :value="before" @change="onChange" />
    </a-col>
    <a-col :span="24" style="margin-top: 32px">
      <a-statistic-timer
        type="countdown"
        title="Day Level (Countdown)"
        :value="deadline"
        format="D 天 H 时 m 分 s 秒"
      />
    </a-col>
    <a-col :span="24" style="margin-top: 32px">
      <a-statistic-timer
        type="countup"
        title="Day Level (Countup)"
        :value="before"
        format="D 天 H 时 m 分 s 秒"
      />
    </a-col>
  </a-row>
</template>
