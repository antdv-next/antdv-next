<docs lang="zh-CN">
预设五种状态颜色，可以通过设置 `color` 为 `success`、 `processing`、`error`、`default`、`warning` 来代表不同的状态。
</docs>

<docs lang="en-US">
We preset five different colors, you can set color property such as `success`,`processing`,`error`,`default` and `warning` to indicate specific status.
</docs>

<script setup lang="ts">
  import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    ExclamationCircleOutlined,
    SyncOutlined,
  } from '@antdv-next/icons'

  const variants = ['filled', 'solid', 'outlined'] as const
  const presets = [
    { status: 'success', icon: CheckCircleOutlined },
    { status: 'processing', icon: SyncOutlined },
    { status: 'warning', icon: ExclamationCircleOutlined },
    { status: 'error', icon: CloseCircleOutlined },
    { status: 'default', icon: ClockCircleOutlined },
  ]
</script>

<template>
  <div v-for="variant in variants" :key="variant">
    <a-divider title-placement="start">
      {{ variant }}
    </a-divider>
    <a-flex gap="small" wrap align="center">
      <template v-for="preset in presets" :key="preset.status">
        <a-tag :variant="variant" :color="preset.status">
          <template #icon>
            <component :is="preset.icon" :spin="preset.icon === SyncOutlined" />
          </template>
          {{ preset.status }}
        </a-tag>
      </template>
    </a-flex>
  </div>
</template>

<style scoped></style>
