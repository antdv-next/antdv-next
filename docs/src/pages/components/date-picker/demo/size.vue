<docs lang="zh-CN">
三种大小的输入框，若不设置，则为 `medium`。
</docs>

<docs lang="en-US">
The input box comes in three sizes: small, medium and large. The `medium` size will be used if `size` is omitted.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

type SizeType = 'large' | 'medium' | 'small'

const size = shallowRef<SizeType>('medium')
</script>

<template>
  <a-space vertical :size="12">
    <a-radio-group v-model:value="size">
      <a-radio-button value="large">
        Large
      </a-radio-button>
      <a-radio-button value="medium">
        medium
      </a-radio-button>
      <a-radio-button value="small">
        Small
      </a-radio-button>
    </a-radio-group>
    <a-date-picker :size="size" />
    <a-date-picker :size="size" picker="month" />
    <a-range-picker :size="size" />
    <a-date-picker :size="size" picker="week" />
  </a-space>
</template>
