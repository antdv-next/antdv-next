<docs lang="zh-CN">
和 [数字输入框](/components/input-number) 组件保持同步。
</docs>

<docs lang="en-US">
Synchronize with [InputNumber](/components/input-number) component.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const inputValue = ref<number>(1)
const inputValueDecimal = ref<number>(0)
</script>

<template>
  <a-space style="width: 100%" vertical>
    <a-row>
      <a-col :span="12">
        <a-slider
          v-model:value="inputValue"
          :min="1"
          :max="20"
        />
      </a-col>
      <a-col :span="4">
        <a-input-number
          v-model:value="inputValue"
          :min="1"
          :max="20"
          style="margin: 0 16px"
        />
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="12">
        <a-slider
          v-model:value="inputValueDecimal"
          :min="0"
          :max="1"
          :step="0.01"
        />
      </a-col>
      <a-col :span="4">
        <a-input-number
          v-model:value="inputValueDecimal"
          :min="0"
          :max="1"
          style="margin: 0 16px"
          :step="0.01"
        />
      </a-col>
    </a-row>
  </a-space>
</template>
