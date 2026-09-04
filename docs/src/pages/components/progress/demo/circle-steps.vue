<docs lang="zh-CN">
步骤进度圈，支持颜色分段展示，默认间隔为 2px。
</docs>

<docs lang="en-US">
A circular progress bar that supports steps and color segments, default gap is 2px.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const stepsCount = ref(5)
const stepsGap = ref(7)
</script>

<template>
  <div>
    <a-typography-title :level="5">
      Custom count:
    </a-typography-title>
    <a-slider v-model:value="stepsCount" :min="2" :max="10" />
    <a-typography-title :level="5">
      Custom gap:
    </a-typography-title>
    <a-slider v-model:value="stepsGap" :step="4" :min="0" :max="40" />
    <a-flex wrap gap="medium" style="margin-top: 16px">
      <a-progress
        type="dashboard"
        :steps="8"
        :percent="50"
        rail-color="rgba(0, 0, 0, 0.06)"
        :stroke-width="20"
      />
      <a-progress
        type="circle"
        :percent="100"
        :steps="{ count: stepsCount, gap: stepsGap }"
        rail-color="rgba(0, 0, 0, 0.06)"
        :stroke-width="20"
      />
    </a-flex>
  </div>
</template>
