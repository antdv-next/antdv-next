<script setup lang="ts">
import { MinusOutlined, PlusOutlined } from '@antdv-next/icons'
import { shallowRef } from 'vue'

const size = shallowRef(160)
const MIN_SIZE = 48
const MAX_SIZE = 300
function increase() {
  const fn = (prevSize: number) => {
    const newSize = prevSize + 10
    if (newSize >= MAX_SIZE) {
      return MAX_SIZE
    }
    return newSize
  }
  size.value = fn(size.value)
}

function decline() {
  const fn = (prevSize: number) => {
    const newSize = prevSize - 10
    if (newSize <= MIN_SIZE) {
      return MIN_SIZE
    }
    return newSize
  }
  size.value = fn(size.value)
}
</script>

<template>
  <a-space-compact class="mb-16px">
    <a-button :disabled="size <= MIN_SIZE" @click="decline">
      <template #icon>
        <MinusOutlined />
      </template>
      Smaller
    </a-button>
    <a-button :disabled="size >= MAX_SIZE" @click="increase">
      <template #icon>
        <PlusOutlined />
      </template>
      Larger
    </a-button>
  </a-space-compact>
  <a-qrcode
    error-level="H"
    :size="size"
    :icon-size="size / 4"
    value="https://antdv-next.com/"
    icon="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
  />
</template>
