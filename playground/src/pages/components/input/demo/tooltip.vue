<docs lang="zh-CN">
结合 [Tooltip](/components/tooltip-cn) 组件，实现一个数值输入框，方便内容超长时的全量展现。
</docs>

<docs lang="en-US">
You can use the Input in conjunction with [Tooltip](/components/tooltip) component to create a Numeric Input, which can provide a good experience for extra-long content display.
</docs>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const value = ref('')
const inputValue = ref('')

function formatNumber(val: number) {
  return new Intl.NumberFormat().format(val)
}

watch(inputValue, (newVal) => {
  const reg = /^-?\d*(\.\d*)?$/
  if (reg.test(newVal) || newVal === '' || newVal === '-') {
    value.value = newVal
  }
  else {
    // 恢复为有效值
    inputValue.value = value.value
  }
})

function handleBlur() {
  let valueTemp = value.value
  if (value.value.charAt(value.value.length - 1) === '.' || value.value === '-') {
    valueTemp = value.value.slice(0, -1)
  }
  value.value = valueTemp.replace(/0*(\d+)/, '$1')
  inputValue.value = value.value
}

const title = computed(() => {
  if (value.value) {
    return value.value !== '-' ? formatNumber(Number(value.value)) : '-'
  }
  return 'Input a number'
})
</script>

<template>
  <a-tooltip :trigger="['focus']" :title="title" placement="topLeft" root-class="numeric-input">
    <a-input
      v-model:value="inputValue"
      style="width: 120px;"
      placeholder="Input a number"
      :maxlength="16"
      @blur="handleBlur"
    />
  </a-tooltip>
</template>
