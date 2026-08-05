<docs lang="zh-CN">
自定义容器也可以作为 `BorderBeam` 的宿主。由于流光层会被插入到子节点内部，并通过 `position: absolute` 贴合容器边缘，因此宿主元素需要提供定位上下文，通常设置 `position: relative` 即可。
</docs>

<docs lang="en-US">
A custom container can also host `BorderBeam`. The beam layer is inserted into the child node and positioned with `position: absolute` along the container edge, so the host element needs to provide a positioning context. In most cases, set `position: relative`.
</docs>

<script setup lang="ts">
import type { CSSProperties } from 'vue'

const panelStyle: CSSProperties = {
  position: 'relative',
  width: '420px',
  background: '#fff',
  border: '1px solid #f0f0f0',
  borderRadius: '8px',
}

const contentStyle: CSSProperties = {
  minHeight: '160px',
  padding: '24px',
  color: 'rgba(0, 0, 0, 0.88)',
  lineHeight: '1.5715',
}
</script>

<template>
  <a-border-beam>
    <div :style="panelStyle">
      <div :style="contentStyle">
        Review task status, deployment health, and recent automation activity in one custom
        container.
      </div>
    </div>
  </a-border-beam>
</template>
