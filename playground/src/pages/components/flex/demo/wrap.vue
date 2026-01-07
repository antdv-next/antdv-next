<docs lang="zh-CN">自动换行。</docs>

<docs lang="en-US">Auto wrap line.</docs>

<template>
  <a-flex wrap="wrap" gap="small">
    <a-button v-for="item in new Array(24)" :key="item" type="primary">Button</a-button>
  </a-flex>
</template>
