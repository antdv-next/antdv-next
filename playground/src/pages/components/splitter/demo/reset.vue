<docs lang="zh-CN">
双击拖拽条 Splitter.Panel 重置为默认大小。
</docs>

<docs lang="en-US">
Double-click the dragger to reset the Splitter.Panel to its default size.
</docs>

<script setup lang="ts">
import { ref } from 'vue'

const defaultSizes = ['30%', '40%', '30%']
const sizes = ref<(number | string)[]>([...defaultSizes])

function handleResize(newSizes: number[]) {
  sizes.value = newSizes
}

function handleDoubleClick() {
  sizes.value = [...defaultSizes]
}
</script>

<template>
  <a-splitter
    style="height: 200px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1)"
    @resize="handleResize"
    @dragger-double-click="handleDoubleClick"
  >
    <a-splitter-panel :size="sizes[0]">
      <a-flex justify="center" align="center" style="height: 100%">
        <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
          Panel 1
        </a-typography-title>
      </a-flex>
    </a-splitter-panel>

    <a-splitter-panel :size="sizes[1]">
      <a-flex justify="center" align="center" style="height: 100%">
        <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
          Panel 2
        </a-typography-title>
      </a-flex>
    </a-splitter-panel>

    <a-splitter-panel :size="sizes[2]">
      <a-flex justify="center" align="center" style="height: 100%">
        <a-typography-title type="secondary" :level="5" style="white-space: nowrap">
          Panel 3
        </a-typography-title>
      </a-flex>
    </a-splitter-panel>
  </a-splitter>
</template>
