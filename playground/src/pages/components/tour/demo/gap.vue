<docs lang="zh-CN">
使用 `gap` 参数来控制高亮区域的边距和圆角。
</docs>

<docs lang="en-US">
Using `gap` to control the radius of highlight area and the offset between highlight area and the element.
</docs>

<script setup lang="ts">
import type { TourStepItem } from 'antdv-next'
import { computed, ref, shallowRef } from 'vue'

const tourNodeRef = shallowRef()
const open = ref(false)

const radius = ref(8)
const offsetX = ref(2)
const offsetY = ref(2)
const offset = ref(2)
const offsetDirection = ref<'both' | 'individual'>('individual')

const steps: TourStepItem[] = [
  {
    title: 'Upload File',
    description: 'Put your files here.',
    target: tourNodeRef,
  },
]

const gap = computed(() => {
  const offsetValue = offsetDirection.value === 'both'
    ? offset.value
    : [offsetX.value, offsetY.value]
  return {
    offset: offsetValue,
    radius: radius.value,
  } as {
    offset: number | [number, number]
    radius: number
  }
})
</script>

<template>
  <div ref="tourNodeRef">
    <a-button type="primary" @click="open = true">
      Begin Tour
    </a-button>
    <a-space vertical style="display: flex; margin-top: 12px">
      <a-row>
        <a-col :span="6">
          <a-typography-text>Radius:</a-typography-text>
        </a-col>
        <a-col :span="12">
          <a-slider v-model:value="radius" />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <a-typography-text>Offset:</a-typography-text>
        </a-col>
        <a-col :span="12">
          <a-slider
            v-model:value="offset"
            :max="50"
            @change="offsetDirection = 'both'"
          />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <a-typography-text>Horizontal offset:</a-typography-text>
        </a-col>
        <a-col :span="12">
          <a-slider
            v-model:value="offsetX"
            :max="50"
            @change="offsetDirection = 'individual'"
          />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">
          <a-typography-text>Vertical offset:</a-typography-text>
        </a-col>
        <a-col :span="12">
          <a-slider
            v-model:value="offsetY"
            :max="50"
            @change="offsetDirection = 'individual'"
          />
        </a-col>
      </a-row>
    </a-space>
    <a-tour v-model:open="open" :steps="steps" :gap="gap" />
  </div>
</template>
