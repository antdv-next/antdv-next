<docs lang="zh-CN">
自定义前缀 `prefix` 和后缀 `suffix`。
</docs>

<docs lang="en-US">
Custom `prefix` and `suffix`.
</docs>

<script setup lang="ts">
import { MehOutlined, SmileOutlined } from '@antdv-next/icons'
import { shallowRef } from 'vue'

const options = [
  { value: 'jack', label: 'Jack' },
  { value: 'lucy', label: 'Lucy' },
  { value: 'Yiminghe', label: 'yiminghe' },
  { value: 'disabled', label: 'Disabled', disabled: true },
]

const value1 = shallowRef('lucy')
const value2 = shallowRef('lucy')
const value3 = shallowRef('lucy')
const value4 = shallowRef(['lucy'])
const value5 = shallowRef(['lucy'])
const value6 = shallowRef(['lucy'])

function handleChange(val: string | string[]) {
  console.log(`selected ${val}`)
}
</script>

<template>
  <a-space wrap>
    <a-select
      v-model:value="value1"
      prefix="User"
      placeholder="Select User"
      style="width: 200px"
      :options="options"
      allow-clear
      show-search
      @change="handleChange"
    />
    <a-select
      v-model:value="value2"
      placeholder="Select"
      style="width: 120px"
      :options="options"
      @change="handleChange"
    >
      <template #suffix>
        <SmileOutlined />
      </template>
    </a-select>
    <a-select
      v-model:value="value3"
      placeholder="Select"
      style="width: 120px"
      disabled
      :options="[{ value: 'lucy', label: 'Lucy' }]"
    >
      <template #suffix>
        <MehOutlined />
      </template>
    </a-select>
    <br>
    <a-select
      v-model:value="value4"
      prefix="User"
      placeholder="Select"
      mode="multiple"
      style="width: 200px"
      :options="options"
      @change="handleChange"
    />
    <a-select
      v-model:value="value5"
      placeholder="Select"
      mode="multiple"
      style="width: 120px"
      :options="options"
      @change="handleChange"
    >
      <template #suffix>
        <SmileOutlined />
      </template>
    </a-select>
    <a-select
      v-model:value="value6"
      placeholder="Select"
      mode="multiple"
      style="width: 120px"
      disabled
      :options="[{ value: 'lucy', label: 'Lucy' }]"
    >
      <template #suffix>
        <MehOutlined />
      </template>
    </a-select>
  </a-space>
</template>
