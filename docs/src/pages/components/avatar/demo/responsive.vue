<docs lang="zh-CN">
头像大小可以根据屏幕大小自动调整。
</docs>

<docs lang="en-US">
Avatar size can be automatically adjusted based on the screen size.
</docs>

<script setup lang="ts">
import { AntDesignOutlined } from '@antdv-next/icons'
</script>

<template>
  <a-avatar
    :size="{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }"
  >
    <template #icon>
      <AntDesignOutlined />
    </template>
  </a-avatar>
</template>
