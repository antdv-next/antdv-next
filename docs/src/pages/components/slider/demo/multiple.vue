<docs lang="zh-CN">
范围多个点组合。
</docs>

<docs lang="en-US">
Multiple handles combination.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const value = ref([0, 10, 20])

function getGradientColor(percentage: number) {
  const startColor = [135, 208, 104]
  const endColor = [255, 204, 199]

  const midColor = startColor.map((start, i) => {
    const end = endColor[i]!
    const delta = end - start
    return (start + delta * percentage).toFixed(0)
  })

  return `rgb(${midColor.join(',')})`
}
</script>

<template>
  <a-slider
    v-model:value="value"
    range
    :styles="{
      track: {
        background: 'transparent',
      },
      tracks: {
        background: `linear-gradient(to right, ${getGradientColor(value[0]! / 100)} 0%, ${getGradientColor(value[value.length - 1]! / 100)} 100%)`,
      },
    }"
  />
</template>
