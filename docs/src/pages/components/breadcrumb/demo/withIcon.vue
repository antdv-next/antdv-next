<docs lang="zh-CN">
图标放在文字前面。
</docs>

<docs lang="en-US">
The icon should be placed in front of the text.
</docs>

<script lang="ts" setup>
import type { BreadcrumbItemType } from 'antdv-next'
import { HomeOutlined, UserOutlined } from '@antdv-next/icons'

const items: BreadcrumbItemType[] = [
  {
    href: '',
  },
  {
    href: '',
  },
  {
    href: '',
  },
  {
    title: 'Application',
  },
]
</script>

<template>
  <a-breadcrumb :items="items">
    <template #titleRender="{ index }">
      <template v-if="index === 0">
        <HomeOutlined />
      </template>
      <template v-if="index === 1">
        <UserOutlined />
        <span>Application List</span>
      </template>
      <!-- Icons from third-party libraries (e.g. lucide) render as a bare `<svg>`
           rather than an `.anticon` wrapper. It stays centred with, and spaced
           from, the label. -->
      <template v-if="index === 2">
        <svg
          viewBox="0 0 24 24"
          width="1em"
          height="1em"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          aria-hidden="true"
        >
          <path d="M3 3v18h18" />
          <path d="M7 14l4-4 3 3 5-6" />
        </svg>
        <span>Dashboard</span>
      </template>
    </template>
  </a-breadcrumb>
</template>
