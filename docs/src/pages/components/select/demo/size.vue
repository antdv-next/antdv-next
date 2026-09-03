<docs lang="zh-CN">
三种大小的选择框，当 size 分别为 `large` 和 `small` 时，输入框高度为 `40px` 和 `24px` ，默认高度为 `32px`。
</docs>

<docs lang="en-US">
The height of the input field for the select defaults to 32px. If size is set to large, the height will be 40px, and if set to small, 24px.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

type SizeType = 'large' | 'medium' | 'small'

const options = Array.from({ length: 26 }, (_, i) => {
  const value = (i + 10).toString(36) + (i + 10)
  return { value, label: value }
})

const size = shallowRef<SizeType>('medium')
const value1 = shallowRef('a10')
const value2 = shallowRef(['a10', 'c12'])
const value3 = shallowRef(['a10', 'c12'])

function handleChange(val: string | string[]) {
  console.log(`Selected: ${val}`)
}
</script>

<template>
  <a-radio-group v-model:value="size">
    <a-radio-button value="large">
      Large
    </a-radio-button>
    <a-radio-button value="medium">
      Default
    </a-radio-button>
    <a-radio-button value="small">
      Small
    </a-radio-button>
  </a-radio-group>
  <br>
  <br>
  <a-space vertical style="width: 100%">
    <a-select
      v-model:value="value1"
      :size="size"
      style="width: 200px"
      :options="options"
      @change="handleChange"
    />
    <a-select
      v-model:value="value2"
      mode="multiple"
      :size="size"
      placeholder="Please select"
      style="width: 100%"
      :options="options"
      @change="handleChange"
    />
    <a-select
      v-model:value="value3"
      mode="tags"
      :size="size"
      placeholder="Please select"
      style="width: 100%"
      :options="options"
      @change="handleChange"
    />
  </a-space>
</template>
