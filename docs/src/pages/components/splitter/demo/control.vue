<docs lang="zh-CN">
通过 `size` 和 `onResize` 控制面板大小。
</docs>

<docs lang="en-US">
Control panel size with `size` and `onResize`.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const sizes = ref<(number | string)[]>(['50%', '50%'])
const enabled = ref(true)

function handleResize(newSizes: number[]) {
  sizes.value = newSizes
}

function handleReset() {
  sizes.value = ['50%', '50%']
}
</script>

<template>
  <a-flex vertical gap="medium">
    <a-splitter
      style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)"
      @resize="handleResize"
    >
      <a-splitter-panel :size="sizes[0]" :resizable="enabled">
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            First
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
      <a-splitter-panel :size="sizes[1]">
        <a-flex justify="center" align="center" style="height: 100%">
          <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
            Second
          </a-typography-title>
        </a-flex>
      </a-splitter-panel>
    </a-splitter>
    <a-flex gap="medium" justify="space-between">
      <a-switch
        v-model:checked="enabled"
        checked-children="Enabled"
        un-checked-children="Disabled"
      />
      <a-button @click="handleReset">
        Reset
      </a-button>
    </a-flex>
  </a-flex>
</template>
