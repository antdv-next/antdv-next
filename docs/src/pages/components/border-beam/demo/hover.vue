<docs lang="zh-CN">
默认隐藏边框流光，在鼠标 hover 到容器上时显示。
</docs>

<docs lang="en-US">
Hide the border beam by default, and reveal it when hovering over the container.
</docs>

<script setup lang="ts">
import { theme } from 'antdv-next'

const { token } = theme.useToken()
</script>

<template>
  <a-border-beam>
    <a-card class="hover-card" title="Hover over the card">
      The border beam appears when the pointer moves over this card.
    </a-card>
  </a-border-beam>
</template>

<style scoped>
.hover-card {
  width: 360px;
}

.hover-card :deep(.ant-border-beam) {
  opacity: 0;
  transition: opacity v-bind('token.motionDurationMid');
}

.hover-card :deep(.ant-border-beam)::before {
  animation-play-state: paused;
}

.hover-card:hover :deep(.ant-border-beam) {
  opacity: 1;
}

.hover-card:hover :deep(.ant-border-beam)::before {
  animation-play-state: running;
}
</style>
