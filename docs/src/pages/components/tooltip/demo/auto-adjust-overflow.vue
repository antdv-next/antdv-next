<docs lang="zh-CN">
气泡框不可见时自动调整位置。
</docs>

<docs lang="en-US">
Adjust placement automatically when tooltip is invisible.
</docs>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const containerRef1 = ref<HTMLDivElement | null>(null)
const containerRef2 = ref<HTMLDivElement | null>(null)

const getPopupContainer = (trigger: HTMLElement) => trigger.parentElement as HTMLElement

onMounted(() => {
  if (containerRef1.value) {
    containerRef1.value.scrollLeft = containerRef1.value.clientWidth * 0.5
  }
  if (containerRef2.value) {
    containerRef2.value.scrollLeft = containerRef2.value.clientWidth * 0.5
  }
})
</script>

<template>
  <a-flex vertical gap="small">
    <a-typography-title :level="5">
      With `getPopupContainer`
    </a-typography-title>
    <div ref="containerRef1" class="tooltip-overflow-container">
      <div class="tooltip-overflow-inner">
        <a-tooltip placement="left" title="Prompt Text" :get-popup-container="getPopupContainer">
          <a-button>Adjust automatically</a-button>
        </a-tooltip>
        <a-tooltip
          placement="left"
          title="Prompt Text"
          :get-popup-container="getPopupContainer"
          :auto-adjust-overflow="false"
        >
          <a-button>Ignore</a-button>
        </a-tooltip>
      </div>
    </div>
    <a-typography-title :level="5">
      Without `getPopupContainer`
    </a-typography-title>
    <div ref="containerRef2" class="tooltip-overflow-container">
      <div class="tooltip-overflow-inner">
        <a-tooltip placement="left" title="Prompt Text">
          <a-button>Adjust automatically</a-button>
        </a-tooltip>
        <a-tooltip placement="left" title="Prompt Text" :auto-adjust-overflow="false">
          <a-button>Ignore</a-button>
        </a-tooltip>
      </div>
    </div>
  </a-flex>
</template>

<style scoped>
.tooltip-overflow-container {
  overflow: auto;
  position: relative;
  padding: 24px;
  border: 1px solid #e9e9e9;
}

.tooltip-overflow-inner {
  width: 200%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 16px;
}
</style>
