<docs lang="zh-CN">
展示进度，当设置 `percent="auto"` 时会预估一个永远不会停止的进度条。
</docs>

<docs lang="en-US">
Show the progress. When `percent="auto"` is set, an indeterminate progress will be displayed.
</docs>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'

const auto = ref(false)
const percent = ref(-50)
let timerRef: ReturnType<typeof setTimeout> | null = null

const mergedPercent = computed(() => auto.value ? 'auto' : percent.value)

function updatePercent() {
  timerRef = setTimeout(() => {
    const prev = percent.value
    const nextPercent = prev + 5
    percent.value = nextPercent > 150 ? -50 : nextPercent
  }, 100)
}

watch(percent, (_n, _o, onCleanup) => {
  updatePercent()

  onCleanup(() => {
    if (timerRef) {
      clearTimeout(timerRef)
      timerRef = null
    }
  })
}, {
  immediate: true,
})

watch(auto, () => {
  percent.value = -50
})

onUnmounted(() => {
  if (timerRef) {
    clearTimeout(timerRef)
    timerRef = null
  }
})
</script>

<template>
  <a-flex align="center" gap="medium">
    <a-switch
      v-model:checked="auto"
      checked-children="Auto"
      un-checked-children="Auto"
    />
    <a-spin :percent="mergedPercent" size="small" />
    <a-spin :percent="mergedPercent" />
    <a-spin :percent="mergedPercent" size="large" />
  </a-flex>
</template>
