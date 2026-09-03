<docs lang="zh-CN">
可以将星星替换为其他字符，比如字母，数字，字体图标甚至中文。
</docs>

<docs lang="en-US">
Replace the default star to other character like alphabet, digit, iconfont or even Chinese word.
</docs>

<script lang="ts" setup>
import { HeartOutlined } from '@antdv-next/icons'
import { h, ref } from 'vue'

const value1 = ref(0)
const value2 = ref(0)
const value3 = ref(0)
</script>

<template>
  <a-flex vertical gap="medium">
    <a-rate v-model:value="value1" :character="h(HeartOutlined)" allow-half />
    <a-rate v-model:value="value2" character="A" allow-half style="font-size: 36px" />
    <a-rate v-model:value="value3" character="好" allow-half />
  </a-flex>
</template>
