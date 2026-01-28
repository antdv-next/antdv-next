<docs lang="zh-CN">
自动换行。
</docs>

<docs lang="en-US">
Auto wrap.
</docs>

<template>
  <a-space :size="[8, 16]" wrap>
    <a-button v-for="item in 20" :key="item">
      Button
    </a-button>
  </a-space>
</template>
