<docs lang="zh-CN">
提供可复制的交互能力。
</docs>

<docs lang="en-US">
Makes Typography copyable with the click of a button.
</docs>

<script setup lang="ts">
import { SmileFilled, SmileOutlined } from '@antdv-next/icons'
import { h } from 'vue'

const customCopyConfig = {
  icon: [h(SmileOutlined), h(SmileFilled)],
  tooltips: ['click here', 'you clicked!!'],
}

const asyncCopyConfig = {
  text: async (): Promise<string> =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve('Request text')
      }, 500)
    }),
}
</script>

<template>
  <a-typography-paragraph copyable>
    This is a copyable text.
  </a-typography-paragraph>
  <a-typography-paragraph :copyable="{ text: 'Hello, Antdv Next!' }">
    Replace copy text.
  </a-typography-paragraph>
  <a-typography-paragraph :copyable="customCopyConfig">
    Custom Copy icon and replace tooltips text.
  </a-typography-paragraph>
  <a-typography-paragraph :copyable="{ tooltips: false }">
    Hide Copy tooltips.
  </a-typography-paragraph>
  <a-typography-paragraph :copyable="asyncCopyConfig">
    Request copy text.
  </a-typography-paragraph>
  <a-typography-text :copyable="{ text: 'text to be copied' }" />
</template>
