<docs lang="zh-CN">
通过 `size` 控制流光可见段的尺寸，默认值为 `100px`，数字类型按像素处理。
</docs>

<docs lang="en-US">
Use `size` to control the size of the visible beam segment. The default is `100px`, and numbers are treated as pixels.
</docs>

<script setup lang="ts">
const sizes: Array<{
  name: string
  size?: number | string
  bodyMinHeight: number
  description: string
  spanFull?: boolean
}> = [
  {
    name: 'Default',
    bodyMinHeight: 112,
    description: 'Uses the default 100px visible beam segment.',
  },
  {
    name: 'Compact',
    size: 56,
    bodyMinHeight: 112,
    description: 'Keeps the highlight shorter for dense card groups.',
  },
  {
    name: 'Extended',
    size: 160,
    bodyMinHeight: 192,
    description: 'Creates a longer highlight for wider feature panels.',
    spanFull: true,
  },
]
</script>

<template>
  <div :style="{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '32px', maxWidth: '960px' }">
    <template v-for="size in sizes" :key="size.name">
      <div :style="{ gridColumn: size.spanFull ? '1 / -1' : undefined }">
        <a-border-beam :size="size.size">
          <a-card
            :title="size.name"
            :style="{ minHeight: `${size.bodyMinHeight}px` }"
            :styles="{ body: { minHeight: size.bodyMinHeight, display: 'flex', alignItems: 'center' } }"
          >
            <template #extra>
              <a-tag variant="filled">
                {{ size.size ?? 100 }}px
              </a-tag>
            </template>
            <a-typography-text type="secondary">
              {{ size.description }}
            </a-typography-text>
          </a-card>
        </a-border-beam>
      </div>
    </template>
  </div>
</template>
