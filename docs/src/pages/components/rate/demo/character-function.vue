<docs lang="zh-CN">
可以使用 `(RateProps) => VueNode` 的方式自定义每一个字符。
</docs>

<docs lang="en-US">
Can customize each character using `(RateProps) => VueNode`.
</docs>

<script lang="ts" setup>
import { FrownOutlined, MehOutlined, SmileOutlined } from '@antdv-next/icons'
import { h, ref } from 'vue'

const customIcons: Record<number, any> = {
  1: h(FrownOutlined),
  2: h(FrownOutlined),
  3: h(MehOutlined),
  4: h(SmileOutlined),
  5: h(SmileOutlined),
}
const value = ref(2)
const value2 = ref(3)
</script>

<template>
  <a-flex gap="middle" vertical>
    <a-rate v-model:value="value" :character="({ index = 0 }) => index + 1" />
    <a-rate v-model:value="value2" :character="({ index = 0 }) => customIcons[index + 1]" />
  </a-flex>
</template>
