<docs lang="zh-CN">
对于裁剪容器或非规则圆角，可以通过 `outset` 控制流光层的外扩距离。设为 `0` 时，流光层完全贴合容器边界。
</docs>

<docs lang="en-US">
For clipped containers or non-uniform radii, the `outset` prop controls how far the beam sits outside the container edge. Set it to `0` to align the beam exactly with the container border.
</docs>

<template>
  <div :style="{ width: '360px' }">
    <a-border-beam :outset="0">
      <a-card
        title="Activity stream"
        :style="{ borderRadius: '20px 20px 0 0', overflow: 'hidden' }"
        :styles="{ body: { display: 'flex', flexDirection: 'column', gap: '16px' } }"
      >
        <a-typography-text type="secondary">
          Use a multi-value <code>border-radius</code> like <code>20px 20px 0 0</code> to keep the beam aligned with non-uniform corners.
        </a-typography-text>
        <a-flex align="center" justify="space-between">
          <a-typography-text strong>
            12 running jobs
          </a-typography-text>
          <a-button type="primary">
            View queue
          </a-button>
        </a-flex>
      </a-card>
    </a-border-beam>
  </div>
</template>
