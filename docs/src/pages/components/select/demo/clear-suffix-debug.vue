<docs lang="zh-CN">
展示 `allowClear` 隐藏后缀内容时的边界场景。
</docs>

<docs lang="en-US">
Show edge cases when `allowClear` hides suffix content.
</docs>

<script setup lang="ts">
import { shallowRef } from 'vue'

const longLabel = 'A very very very very very very very long selected label'

const options = [
  { value: 'long', label: longLabel },
  { value: 'short', label: 'Short option' },
]

const selectStyle = { width: '280px' }

const value1 = shallowRef('long')
const value2 = shallowRef('long')

function handleSuffixClick() {
  console.log('suffix clicked')
}
</script>

<template>
  <a-flex vertical gap="medium">
    <a-flex vertical gap="small">
      <span>Interactive suffix</span>
      <a-select
        v-model:value="value1"
        allow-clear
        :options="options"
        :style="selectStyle"
      >
        <template #suffixIcon>
          <button
            type="button"
            :style="{
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              padding: '0 8px',
              color: 'rgba(0, 0, 0, 0.88)',
              background: '#fff',
              cursor: 'pointer',
            }"
            @mousedown.stop
            @click="handleSuffixClick"
          >
            Suffix
          </button>
        </template>
      </a-select>
    </a-flex>

    <a-flex vertical gap="small">
      <span>No suffix</span>
      <a-select
        v-model:value="value2"
        allow-clear
        :suffix-icon="null"
        :options="options"
        :style="selectStyle"
      />
    </a-flex>
  </a-flex>
</template>
