<docs lang="zh-CN">
布局变化后，通过 `ref` 调用 `forceAlign` 手动重新对齐。
</docs>

<docs lang="en-US">
Call `forceAlign` through `ref` to realign after the layout changes.
</docs>

<script setup lang="ts">
import type { TooltipRef } from 'antdv-next'
import { nextTick, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'

const loaded = shallowRef(false)
const tooltipRef = shallowRef<TooltipRef>()

let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  timer = setTimeout(() => {
    loaded.value = true
  }, 2000)
})

onBeforeUnmount(() => {
  clearTimeout(timer)
})

watch(loaded, async (value) => {
  if (value) {
    await nextTick()
    tooltipRef.value?.forceAlign()
  }
})
</script>

<template>
  <div :style="{ minHeight: '160px', paddingTop: '16px' }">
    <div v-if="loaded" :style="{ height: '80px', marginBottom: '16px' }">
      Async content loaded.
    </div>
    <a-tooltip ref="tooltipRef" title="Tooltip stays aligned" open placement="top">
      <a-button>Trigger</a-button>
    </a-tooltip>
  </div>
</template>
