<docs lang="zh-CN">
堆叠配置，默认关闭。超过阈值后的消息会被自动收起，可以通过 `threshold` 设置触发堆叠的数量。折叠状态下仅展示最新的消息。
</docs>

<docs lang="en-US">
Stack configuration, disabled by default. Messages will be stacked when the amount is over `threshold`. Only the latest message is shown in the collapsed stack.
</docs>

<script setup lang="ts">
import { message } from 'antdv-next'
import { computed, ref } from 'vue'

const enabled = ref(true)
const threshold = ref(3)
const indexRef = ref(0)

const stackConfig = computed(() => ({
  stack: enabled.value
    ? {
        threshold: threshold.value,
      }
    : false,
}))

const [messageApi, ContextHolder] = message.useMessage(stackConfig)

function openMessage() {
  indexRef.value += 1
  const isOdd = indexRef.value % 2 === 1

  messageApi.open({
    type: 'info',
    content: isOdd
      ? `Message ${indexRef.value}: This is a stacked message.`
      : `Message ${indexRef.value}: This is a slightly longer stacked message.`,
    duration: 0,
  })
}
</script>

<template>
  <ContextHolder />
  <a-space size="large">
    <a-space :style="{ width: '100%' }">
      <span>Enabled:</span>
      <a-switch
        v-model:checked="enabled"
        aria-label="Enable message stack"
      />
    </a-space>
    <a-space :style="{ width: '100%' }">
      <span>Threshold:</span>
      <a-input-number
        v-model:value="threshold"
        aria-label="Stack threshold"
        :disabled="!enabled"
        :step="1"
        :min="1"
        :max="10"
      />
    </a-space>
  </a-space>
  <a-divider />
  <a-space>
    <a-button type="primary" @click="openMessage">
      <span v-text="'Open the message box'" />
    </a-button>
    <a-button @click="messageApi.destroy()">
      <span v-text="'Destroy all'" />
    </a-button>
  </a-space>
</template>
