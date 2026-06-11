<docs lang="zh-CN">
垂直的 Radio.Group，配合更多输入框选项。
</docs>

<docs lang="en-US">
Vertical Radio.Group, with more radios.
</docs>

<script setup lang="ts">
import type { RadioGroupProps } from 'antdv-next'
import { shallowRef } from 'vue'

const val = shallowRef(1)

const buttonOptions: RadioGroupProps['options'] = [
  { label: 'Apple', value: 'Apple', class: 'label-1' },
  { label: 'Pear', value: 'Pear', class: 'label-2' },
  { label: 'Orange', value: 'Orange', title: 'Orange', class: 'label-3' },
]
</script>

<template>
  <a-flex align="start" gap="large">
    <div style="flex: 1">
      <a-radio-group v-model:value="val" vertical>
        <a-radio :value="1">
          Option A
        </a-radio>
        <a-radio :value="2">
          Option B
        </a-radio>
        <a-radio :value="3">
          Option C
        </a-radio>
        <a-radio :value="4">
          More...
          <a-input v-if="val === 4" style="width: 100px; margin-left: 10px" />
        </a-radio>
      </a-radio-group>
    </div>
    <div style="flex: 1">
      <a-radio-group :options="buttonOptions" option-type="button" vertical />
    </div>
  </a-flex>
</template>
