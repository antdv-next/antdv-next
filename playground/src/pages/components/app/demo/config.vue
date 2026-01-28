<docs lang="zh-CN">
对 `message`、`notification` 进行配置。。
</docs>

<docs lang="en-US">
Config for `message`, `notification`.
</docs>

<script setup lang="ts">
import MyPage2 from './myPage2.vue'
</script>

<template>
  <a-app :message="{ maxCount: 1 }" :notification="{ placement: 'bottomLeft' }">
    <MyPage2 />
  </a-app>
</template>
